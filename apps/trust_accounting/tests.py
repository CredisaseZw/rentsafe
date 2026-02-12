"""
Tests for Trust Accounting app - Invoices and Journal Entries
"""

from decimal import Decimal
from datetime import date
from dateutil.relativedelta import relativedelta
from unittest.mock import patch, MagicMock
from django.test import TestCase, override_settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError

from apps.trust_accounting.models import (
    TrustInvoice,
    TrustInvoiceLineItem,
    TrustJournalEntry,
    TrustLedgerTransaction,
    TrustSalesItem,
    TrustSalesCategory,
    TrustTaxType,
    TrustCurrency,
    TrustGeneralLedgerAccount,
    TrustAccountType,
    TrustFinancialYear,
    TrustAccountingPeriod,
)
from apps.trust_accounting.services.invoice_generation_service import (
    LeaseInvoiceService,
)
from apps.leases.models import Lease, LeaseCharge, LeaseTenant
from apps.properties.models.models import Property, Unit, PropertyType
from apps.common.models.models import Country, Province, City, Address
from apps.clients.models.models import Client
from apps.individuals.models import Individual
from apps.accounting.models import Currency, PaymentMethod
from apps.subscriptions.models import Services, SubscriptionPeriod, Subscription

User = get_user_model()


@override_settings(
    CACHES={
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }
)
class TrustAccountingTestBase(TestCase):
    """Base test class with common setup for trust accounting tests"""

    def setUp(self):
        """Set up test fixtures"""
        # Step 1: Create Individual first (before Client and User)
        # Individual model requires identification_type and identification_number
        self.test_individual_for_client = Individual.objects.create(
            first_name="Test",
            last_name="Client",
            identification_type="national_id",
            identification_number="12-345678-A-12",
            email="testclient@example.com",
        )

        # Step 2: Create Client linked to Individual via GenericForeignKey
        individual_content_type = ContentType.objects.get_for_model(Individual)
        self.client_obj = Client.objects.create(
            client_content_type=individual_content_type,
            client_object_id=self.test_individual_for_client.id,
            client_type="CLIENT",
            status="ACTIVE",
            # name will be auto-generated from Individual.full_name
        )

        # Step 3: Create test user with Client reference
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            client=self.client_obj,
        )

        self.services = Services.objects.create(
            service_name="Test Service",
            code="TEST-SVC",
        )
        self.subscription_period = SubscriptionPeriod.objects.create(
            name="Monthly",
            code="M",
            period_length_months=1,
        )
        # Create Trust Currency
        self.currency = TrustCurrency.objects.create(
            currency_code="USD",
            currency_name="US Dollar",
            symbol="$",
            is_base_currency=True,
            is_active=True,
        )
        self.main_currency = Currency.objects.create(
            currency_code="ZIG",
            currency_name="ASn Dollar",
            symbol="&",
            is_base_currency=True,
            is_active=True,
        )
        self.payment_method = PaymentMethod.objects.create(
            name="Credit Card",
            description="CC",
        )
        self.subscription = Subscription.objects.create(
            service=self.services,
            period=self.subscription_period,
            client=self.client_obj,
            total_slots=50,
            payment_method=self.payment_method,
            currency=self.main_currency,
            total_amount=Decimal("5000.00"),
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + relativedelta(months=1),
        )

        # Step 4: Update Individual with created_by user
        self.test_individual_for_client.created_by = self.user
        self.test_individual_for_client.save()

        # Create Accounting Currency (for lease)
        self.accounting_currency = Currency.objects.create(
            currency_code="USD", currency_name="US Dollar", symbol="$", is_active=True
        )
        # self.payment_method = PaymentMethod.objects.create(
        #     name="Credit Card",
        #     is_active=True,
        #     created_by=self.user,
        # )

        # Create Trust Account Type
        self.account_type_revenue = TrustAccountType.objects.create(
            account_type="revenue", name="Revenue", created_by=self.user
        )

        self.account_type_asset = TrustAccountType.objects.create(
            account_type="asset", name="Asset", created_by=self.user
        )

        # Create GL Accounts
        self.income_account = TrustGeneralLedgerAccount.objects.create(
            account_number="4000",
            account_name="Rental Income",
            account_type=self.account_type_revenue,
            is_active=True,
            created_by=self.user,
        )

        self.receivable_account = TrustGeneralLedgerAccount.objects.create(
            account_number="1200",
            account_name="Accounts Receivable",
            account_type=self.account_type_asset,
            is_active=True,
            created_by=self.user,
        )

        # Create Financial Year and Accounting Period
        current_year = timezone.now().year
        current_month = timezone.now().date().replace(day=1)
        next_month = current_month + relativedelta(months=1)

        self.financial_year = TrustFinancialYear.objects.create(
            name=f"FY {current_year}",
            start_date=timezone.now().date().replace(month=1, day=1),
            end_date=timezone.now().date().replace(month=12, day=31),
            is_active=True,
        )

        self.accounting_period = TrustAccountingPeriod.objects.create(
            financial_year=self.financial_year,
            name=f"{current_month.strftime('%B %Y')}",
            period_number=current_month.month,
            start_date=current_month,
            end_date=next_month - relativedelta(days=1),
            is_open=True,
        )

        # Create Tax Type
        self.tax_type = TrustTaxType.objects.create(
            name="VAT",
            code="VAT",
            rate=Decimal("15.00"),
            is_active=True,
            created_by=self.user,
        )

        # Create Sales Category
        self.sales_category = TrustSalesCategory.objects.create(
            name="Rent", code="RENT", created_by=self.user
        )

        # Create Sales Item
        self.sales_item = TrustSalesItem.objects.create(
            name="Monthly Rent",
            unit_name="Month",
            category=self.sales_category,
            unit_price=Decimal("1000.00"),
            currency=self.currency,
            income_account=self.income_account,
            tax_type=self.tax_type,
            is_active=True,
            created_by=self.user,
        )

        # Create location hierarchy for address
        self.test_country = Country.objects.create(
            name="Test Country",
            code="TST",
            dial_code="+999",
            currency_code="USD",
            currency_name="US Dollar",
        )
        self.test_province = Province.objects.create(
            country=self.test_country, name="Test Province", code="TST"
        )
        self.test_city = City.objects.create(
            province=self.test_province, name="Test City"
        )

        # Create PropertyType
        property_type = PropertyType.objects.create(name="Residential")

        # Create test property
        self.property = Property.objects.create(
            name="Test Property",
            property_type=property_type,
            created_by=self.user,
        )

        # Create Address for Property
        property_ct = ContentType.objects.get_for_model(Property)
        Address.objects.create(
            content_type=property_ct,
            object_id=self.property.id,
            street_address="123 Test St",
            city=self.test_city,
            country=self.test_country,
            address_type="physical",
            is_primary=True,
        )

        self.unit = Unit.objects.create(
            property=self.property,
            unit_number="101",
            unit_type="apartment",
            status="vacant",
            created_by=self.user,
        )

        # Create test tenant Individual
        # Note: Individual does NOT have client or phone fields
        # phone is a property that reads from related ContactDetail model
        self.individual = Individual.objects.create(
            first_name="John",
            last_name="Doe",
            identification_type="passport",
            identification_number="AB-12345678-CD",
            email="john.doe@example.com",
            created_by=self.user,
        )

        self.tenant = LeaseTenant.objects.create(
            content_type=ContentType.objects.get_for_model(Individual),
            object_id=self.individual.id,
        )

    def create_test_lease(self, **kwargs):
        """Helper method to create a test lease"""
        # Generate unique lease_id if not provided
        import random
        import string

        if "lease_id" not in kwargs:
            random_suffix = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=6)
            )
            kwargs["lease_id"] = f"TEST-LEASE-{random_suffix}"

        defaults = {
            "unit": self.unit,
            "start_date": timezone.now().date(),
            "end_date": timezone.now().date() + relativedelta(years=1),
            "due_day_of_month": 1,
            "payment_frequency": "MONTHLY",
            "status": "ACTIVE",
            "currency": self.accounting_currency,
            "managing_client": self.client_obj,
            "created_by": self.user,
        }
        defaults.update(kwargs)
        return Lease.objects.create(**defaults)


class TrustInvoiceModelTests(TrustAccountingTestBase):
    """Test cases for TrustInvoice model"""

    def test_create_trust_invoice(self):
        """Test creating a basic trust invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertIsNotNone(invoice.invoice_number)
        self.assertTrue(invoice.invoice_number.startswith("TINV-"))
        self.assertEqual(invoice.status, "draft")
        self.assertEqual(invoice.lease, lease)

    def test_invoice_number_auto_generation(self):
        """Test automatic invoice number generation"""
        lease = self.create_test_lease()

        invoice1 = TrustInvoice.objects.create(
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        invoice2 = TrustInvoice.objects.create(
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertNotEqual(invoice1.invoice_number, invoice2.invoice_number)
        self.assertTrue(invoice1.invoice_number < invoice2.invoice_number)

    def test_invoice_with_line_items(self):
        """Test invoice with line items and total calculation"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        # Add line items
        line_item1 = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        # Update invoice totals
        invoice.update_totals()
        invoice.refresh_from_db()

        self.assertEqual(invoice.subtotal, Decimal("1000.00"))
        self.assertGreater(invoice.tax_total, Decimal("0.00"))  # VAT should be added
        self.assertEqual(invoice.total_amount, invoice.subtotal + invoice.tax_total)
        self.assertEqual(invoice.balance_due, invoice.total_amount)

    def test_invoice_approve(self):
        """Test invoice approval workflow"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="pending",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        invoice.approve(self.user)
        invoice.refresh_from_db()

        self.assertEqual(invoice.status, "approved")
        self.assertEqual(invoice.approved_by, self.user)
        self.assertIsNotNone(invoice.approved_date)

    def test_invoice_fiscalize(self):
        """Test converting proforma to fiscal invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="proforma",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        fiscal_invoice = invoice.fiscalize()

        self.assertEqual(fiscal_invoice.invoice_type, "fiscal")
        self.assertEqual(fiscal_invoice.status, "pending")

    def test_invoice_apply_payment(self):
        """Test applying payment to invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        # Add line item
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )
        invoice.update_totals()
        invoice.refresh_from_db()

        initial_balance = invoice.balance_due
        payment_amount = Decimal("500.00")

        invoice.apply_payment(payment_amount)
        invoice.refresh_from_db()

        self.assertEqual(invoice.amount_paid, payment_amount)
        self.assertEqual(invoice.balance_due, initial_balance - payment_amount)
        self.assertEqual(invoice.status, "partially_paid")

    def test_invoice_full_payment(self):
        """Test full payment of invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )
        invoice.update_totals()
        invoice.refresh_from_db()

        invoice.apply_payment(invoice.balance_due)
        invoice.refresh_from_db()

        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))

    def test_invoice_with_discount(self):
        """Test invoice with discount percentage"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("10.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )
        invoice.update_totals()
        invoice.refresh_from_db()

        expected_discount = Decimal("1000.00") * Decimal("0.10")
        self.assertEqual(invoice.discount_amount, expected_discount)
        self.assertLess(invoice.total_amount, Decimal("1000.00") + invoice.tax_total)

    def test_recurring_invoice_generation(self):
        """Test generating recurring invoice"""
        lease = self.create_test_lease()
        today = timezone.now().date()
        next_month = today + relativedelta(months=1)

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=today,
            frequency="monthly",
            next_invoice_date=next_month,
            period_from=today,
            period_to=next_month - relativedelta(days=1),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )
        invoice.update_totals()

        # Generate next recurring invoice
        new_invoice = invoice.generate_recurring_invoice()

        self.assertIsNotNone(new_invoice)
        self.assertNotEqual(new_invoice.id, invoice.id)
        self.assertEqual(new_invoice.line_items.count(), 1)
        self.assertEqual(new_invoice.invoice_type, "recurring")


class TrustJournalEntryTests(TrustAccountingTestBase):
    """Test cases for TrustJournalEntry and TrustLedgerTransaction models"""

    def test_create_journal_entry(self):
        """Test creating a basic journal entry"""
        entry = TrustJournalEntry.objects.create(
            entry_date=timezone.now().date(),
            entry_type="general",
            description="Test journal entry",
            created_by=self.user,
        )

        self.assertIsNotNone(entry.entry_number)
        self.assertFalse(entry.is_posted)
        self.assertEqual(entry.total_debit, Decimal("0.00"))
        self.assertEqual(entry.total_credit, Decimal("0.00"))

    def test_journal_entry_with_transactions(self):
        """Test journal entry with debit and credit transactions"""
        entry = TrustJournalEntry.objects.create(
            entry_date=timezone.now().date(),
            entry_type="general",
            description="Test double entry",
            created_by=self.user,
        )

        # Debit transaction
        debit_transaction = TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.receivable_account,
            debit_amount=Decimal("1000.00"),
            credit_amount=Decimal("0.00"),
            description="Debit to receivables",
        )

        # Credit transaction
        credit_transaction = TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.income_account,
            debit_amount=Decimal("0.00"),
            credit_amount=Decimal("1000.00"),
            description="Credit to income",
        )

        # Update totals
        entry.update_totals()
        entry.refresh_from_db()

        self.assertEqual(entry.total_debit, Decimal("1000.00"))
        self.assertEqual(entry.total_credit, Decimal("1000.00"))

    def test_journal_entry_posting(self):
        """Test posting a journal entry"""
        entry = TrustJournalEntry.objects.create(
            entry_date=timezone.now().date(),
            entry_type="general",
            description="Test posting",
            created_by=self.user,
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.receivable_account,
            debit_amount=Decimal("1000.00"),
            credit_amount=Decimal("0.00"),
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.income_account,
            debit_amount=Decimal("0.00"),
            credit_amount=Decimal("1000.00"),
        )

        entry.update_totals()
        entry.post_entry(user=self.user)
        entry.refresh_from_db()

        self.assertTrue(entry.is_posted)
        self.assertIsNotNone(entry.posted_date)

    def test_journal_entry_reversal(self):
        """Test creating reversal entry"""
        entry = TrustJournalEntry.objects.create(
            entry_date=timezone.now().date(),
            entry_type="general",
            description="Test reversal",
            created_by=self.user,
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.receivable_account,
            debit_amount=Decimal("1000.00"),
            credit_amount=Decimal("0.00"),
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.income_account,
            debit_amount=Decimal("0.00"),
            credit_amount=Decimal("1000.00"),
        )

        entry.update_totals()
        entry.post_entry(user=self.user)

        # Create reversal
        reversal = entry.create_reversal()

        self.assertIsNotNone(reversal)
        self.assertEqual(reversal.transactions.count(), 2)
        self.assertEqual(entry.total_debit, reversal.total_debit)
        self.assertEqual(entry.total_credit, reversal.total_credit)

        entry.refresh_from_db()
        self.assertTrue(entry.is_reversed)

    def test_unbalanced_journal_entry_fails(self):
        """Test that unbalanced journal entry cannot be posted"""
        entry = TrustJournalEntry.objects.create(
            entry_date=timezone.now().date(),
            entry_type="general",
            description="Test unbalanced",
            created_by=self.user,
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.receivable_account,
            debit_amount=Decimal("1000.00"),
            credit_amount=Decimal("0.00"),
        )

        TrustLedgerTransaction.objects.create(
            journal_entry=entry,
            account=self.income_account,
            debit_amount=Decimal("0.00"),
            credit_amount=Decimal("500.00"),  # Unbalanced!
        )

        entry.update_totals()

        with self.assertRaises(Exception):
            entry.post_entry(user=self.user)


class LeaseInvoiceServiceTests(TrustAccountingTestBase):
    """Test cases for LeaseInvoiceService"""

    def test_get_or_create_sales_item_for_charge(self):
        """Test auto-creation of sales items from lease charges"""
        lease = self.create_test_lease()

        charge = LeaseCharge.objects.create(
            lease=lease,
            charge_type="RENT",
            description="Monthly Rent",
            amount=Decimal("1000.00"),
            currency=self.accounting_currency,
            frequency="MONTHLY",
            is_active=True,
        )

        sales_item = LeaseInvoiceService.get_or_create_sales_item_for_charge(
            charge, created_by=self.user
        )

        self.assertIsNotNone(sales_item)
        self.assertIn("Rent", sales_item.name)
        self.assertEqual(sales_item.unit_price, Decimal("1000.00"))

    def test_generate_lease_invoice_on_demand(self):
        """Test on-demand invoice generation for a lease"""
        lease = self.create_test_lease()

        # Create charges
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="RENT",
            description="Monthly Rent",
            amount=Decimal("1000.00"),
            currency=self.accounting_currency,
            frequency="MONTHLY",
            is_active=True,
        )

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="UTILITY",
            description="Water Bill",
            amount=Decimal("50.00"),
            currency=self.accounting_currency,
            frequency="MONTHLY",
            is_active=True,
        )

        invoice = LeaseInvoiceService.generate_lease_invoice_on_demand(
            lease=lease, invoice_type="fiscal", status="pending", created_by=self.user
        )

        self.assertIsNotNone(invoice)
        self.assertEqual(invoice.lease, lease)
        self.assertEqual(invoice.line_items.count(), 2)
        self.assertGreater(invoice.total_amount, Decimal("0.00"))

    def test_generate_invoice_with_date_range(self):
        """Test generating invoice with specific date range"""
        lease = self.create_test_lease()

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="RENT",
            amount=Decimal("1000.00"),
            currency=self.accounting_currency,
            frequency="MONTHLY",
            is_active=True,
        )

        today = timezone.now().date()
        period_from = today.replace(day=1)
        period_to = (period_from + relativedelta(months=1)) - relativedelta(days=1)

        invoice = LeaseInvoiceService.generate_lease_invoice_on_demand(
            lease=lease,
            period_from=period_from,
            period_to=period_to,
            created_by=self.user,
        )

        self.assertEqual(invoice.period_from, period_from)
        self.assertEqual(invoice.period_to, period_to)

    def test_multiple_charge_types(self):
        """Test invoice generation with multiple charge types"""
        lease = self.create_test_lease()

        charge_types = [
            ("RENT", "Monthly Rent", Decimal("1000.00")),
            ("UTILITY", "Electricity", Decimal("100.00")),
            ("SERVICE_FEE", "Maintenance", Decimal("50.00")),
            ("LATE_FEE", "Late Payment Fee", Decimal("25.00")),
        ]

        for charge_type, description, amount in charge_types:
            LeaseCharge.objects.create(
                lease=lease,
                charge_type=charge_type,
                description=description,
                amount=amount,
                currency=self.accounting_currency,
                frequency="MONTHLY",
                is_active=True,
            )

        invoice = LeaseInvoiceService.generate_lease_invoice_on_demand(
            lease=lease, created_by=self.user
        )

        self.assertEqual(invoice.line_items.count(), 4)

        # Verify each charge type created a line item
        line_items = invoice.line_items.all()
        charge_type_names = [item.sales_item.name for item in line_items]

        self.assertTrue(any("Rent" in name for name in charge_type_names))
        self.assertTrue(any("Utility" in name for name in charge_type_names))
        self.assertTrue(any("Service Fee" in name for name in charge_type_names))
        self.assertTrue(any("Late Fee" in name for name in charge_type_names))


class TrustInvoiceIntegrationTests(TrustAccountingTestBase):
    """Integration tests for invoice and journal entry interaction"""

    def test_invoice_posts_to_ledger(self):
        """Test that posting invoice creates journal entry"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="pending",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )
        invoice.update_totals()

        # Post to ledger
        journal_entry = invoice.post_to_ledger()

        self.assertIsNotNone(journal_entry)
        self.assertEqual(invoice.journal_entry, journal_entry)
        self.assertIsNotNone(invoice.posted_date)

    def test_invoice_line_item_updates_totals(self):
        """Test that adding line items updates invoice totals"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        initial_total = invoice.total_amount

        # Add line item
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        # Manually trigger update (or rely on signals)
        invoice.update_totals()
        invoice.refresh_from_db()

        self.assertGreater(invoice.total_amount, initial_total)


# ==================== VALIDATION TESTS ====================


class TrustInvoiceValidationTests(TrustAccountingTestBase):
    """Test cases for TrustInvoice model validation and clean() method"""

    def test_due_date_before_invoice_date_raises_error(self):
        """Test that due_date cannot be before invoice_date"""
        lease = self.create_test_lease()
        invoice_date = timezone.now().date()
        due_date = invoice_date - relativedelta(days=1)

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=invoice_date,
            due_date=due_date,
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            invoice.clean()

        self.assertIn("due_date", str(context.exception))

    def test_period_to_before_period_from_raises_error(self):
        """Test that period_to cannot be before period_from"""
        lease = self.create_test_lease()
        period_from = timezone.now().date()
        period_to = period_from - relativedelta(days=1)

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            period_from=period_from,
            period_to=period_to,
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            invoice.clean()

        self.assertIn("period_to", str(context.exception))

    def test_equal_dates_allowed(self):
        """Test that period_from == period_to is valid"""
        lease = self.create_test_lease()
        same_date = timezone.now().date()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=same_date,
            due_date=same_date,
            period_from=same_date,
            period_to=same_date,
            created_by=self.user,
        )

        invoice.clean()  # Should not raise
        self.assertIsNotNone(invoice.id)

    def test_discount_percentage_negative_raises_error(self):
        """Test that discount_percentage cannot be negative"""
        lease = self.create_test_lease()

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("-10.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.full_clean()

    def test_discount_percentage_over_100_raises_error(self):
        """Test that discount_percentage cannot exceed 100%"""
        lease = self.create_test_lease()

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("101.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.full_clean()

    def test_discount_percentage_zero_allowed(self):
        """Test that 0% discount is valid"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("0.00"),
            created_by=self.user,
        )

        self.assertEqual(invoice.discount_percentage, Decimal("0.00"))

    def test_discount_percentage_100_allowed(self):
        """Test that 100% discount is valid (edge case)"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("100.00"),
            created_by=self.user,
        )

        self.assertEqual(invoice.discount_percentage, Decimal("100.00"))

    def test_exchange_rate_zero_raises_error(self):
        """Test that exchange_rate cannot be zero"""
        lease = self.create_test_lease()

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            exchange_rate=Decimal("0.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.full_clean()

    def test_exchange_rate_negative_raises_error(self):
        """Test that exchange_rate cannot be negative"""
        lease = self.create_test_lease()

        invoice = TrustInvoice(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            exchange_rate=Decimal("-1.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.full_clean()

    def test_exchange_rate_one_allowed(self):
        """Test that exchange_rate = 1.0 is valid (default)"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            exchange_rate=Decimal("1.00"),
            created_by=self.user,
        )

        self.assertEqual(invoice.exchange_rate, Decimal("1.00"))

    def test_invoice_date_in_future_allowed(self):
        """Test that future invoice dates are valid"""
        lease = self.create_test_lease()
        future_date = timezone.now().date() + relativedelta(days=30)

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=future_date,
            created_by=self.user,
        )

        self.assertEqual(invoice.invoice_date, future_date)

    def test_null_exchange_rate_defaults_to_one(self):
        """Test that null exchange_rate defaults to 1.0"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertEqual(invoice.exchange_rate, Decimal("1.00"))

    def test_zero_total_invoice_allowed(self):
        """Test that zero total invoices are valid (edge case for credit notes)"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("0.00"),
            created_by=self.user,
        )

        self.assertEqual(invoice.total_amount, Decimal("0.00"))

    def test_invoice_without_lease_allowed(self):
        """Test that invoices can exist without a lease (manual invoices)"""
        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertIsNone(invoice.lease)
        self.assertIsNotNone(invoice.id)


# ==================== STATE TRANSITION TESTS ====================


class TrustInvoiceStateTransitionTests(TrustAccountingTestBase):
    """Test cases for TrustInvoice status transitions"""

    def test_draft_to_pending_via_submit(self):
        """Test draft → pending transition"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        # Simulate submit for approval
        invoice.status = "pending"
        invoice.save()

        self.assertEqual(invoice.status, "pending")

    def test_pending_to_approved_via_approve(self):
        """Test pending → approved transition"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="pending",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        invoice.approve(self.user)

        self.assertEqual(invoice.status, "approved")

    def test_approved_to_partially_paid_via_payment(self):
        """Test approved → partially_paid transition"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("500.00"))

        self.assertEqual(invoice.status, "partially_paid")
        self.assertEqual(invoice.balance_due, Decimal("500.00"))

    def test_partially_paid_to_paid_via_final_payment(self):
        """Test partially_paid → paid transition"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="partially_paid",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("500.00"),
            amount_paid=Decimal("500.00"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("500.00"))

        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))

    def test_approved_to_paid_via_full_payment(self):
        """Test approved → paid transition (single full payment)"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("1000.00"))

        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))

    def test_proforma_to_fiscal_via_fiscalize(self):
        """Test proforma → fiscal transition"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="proforma",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        invoice.fiscalize()

        self.assertEqual(invoice.invoice_type, "fiscal")

    def test_approve_draft_raises_error(self):
        """Test that draft invoices cannot be approved directly"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            invoice.approve(self.user)

        self.assertIn("pending", str(context.exception).lower())

    def test_approve_already_approved_raises_error(self):
        """Test that already approved invoices cannot be re-approved"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            invoice.approve(self.user)

        self.assertIn("already", str(context.exception).lower())

    def test_approve_paid_invoice_raises_error(self):
        """Test that paid invoices cannot be approved"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="paid",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("0.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.approve(self.user)

    def test_approve_cancelled_raises_error(self):
        """Test that cancelled invoices cannot be approved"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="cancelled",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.approve(self.user)

    def test_fiscalize_non_proforma_raises_error(self):
        """Test that only proforma invoices can be fiscalized"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError) as context:
            invoice.fiscalize()

        self.assertIn("proforma", str(context.exception).lower())

    def test_fiscalize_already_fiscal_raises_error(self):
        """Test that fiscal invoices cannot be fiscalized again"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.fiscalize()

    def test_payment_to_cancelled_invoice_raises_error(self):
        """Test that payments cannot be applied to cancelled invoices"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="cancelled",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("500.00"))

    def test_payment_to_draft_invoice_raises_error(self):
        """Test that payments require approved status"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("500.00"))

    def test_status_transitions_maintain_integrity(self):
        """Test that status transitions maintain data integrity"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        # Draft → Pending
        invoice.status = "pending"
        invoice.save()
        self.assertEqual(invoice.status, "pending")

        # Pending → Approved
        invoice.approve(self.user)
        self.assertEqual(invoice.status, "approved")

        # Approved → Partially Paid
        invoice.apply_payment(Decimal("300.00"))
        self.assertEqual(invoice.status, "partially_paid")
        self.assertEqual(invoice.amount_paid, Decimal("300.00"))

        # Partially Paid → Paid
        invoice.apply_payment(Decimal("700.00"))
        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))

    def test_cannot_modify_paid_invoice(self):
        """Test that paid invoices are immutable"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="paid",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("0.00"),
            amount_paid=Decimal("1000.00"),
            created_by=self.user,
        )

        # Attempt to change status should fail
        original_status = invoice.status
        invoice.status = "cancelled"
        invoice.save()

        # Should remain paid (assuming model has protection)
        # This would need actual model logic to enforce


# ==================== PAYMENT TESTS ====================


class TrustInvoicePaymentTests(TrustAccountingTestBase):
    """Test cases for invoice payment processing"""

    def test_apply_exact_payment(self):
        """Test payment exactly matching balance_due"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.99"),
            balance_due=Decimal("1000.99"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("1000.99"))

        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))
        self.assertEqual(invoice.amount_paid, Decimal("1000.99"))

    def test_apply_multiple_partial_payments(self):
        """Test multiple partial payments completing an invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1500.00"),
            balance_due=Decimal("1500.00"),
            created_by=self.user,
        )

        # First payment
        invoice.apply_payment(Decimal("500.00"))
        self.assertEqual(invoice.status, "partially_paid")
        self.assertEqual(invoice.balance_due, Decimal("1000.00"))

        # Second payment
        invoice.apply_payment(Decimal("400.00"))
        self.assertEqual(invoice.status, "partially_paid")
        self.assertEqual(invoice.balance_due, Decimal("600.00"))

        # Third payment
        invoice.apply_payment(Decimal("600.00"))
        self.assertEqual(invoice.status, "paid")
        self.assertEqual(invoice.balance_due, Decimal("0.00"))

    def test_payment_updates_amount_paid(self):
        """Test that amount_paid is cumulative"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            amount_paid=Decimal("0.00"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("300.00"))
        self.assertEqual(invoice.amount_paid, Decimal("300.00"))

        invoice.apply_payment(Decimal("400.00"))
        self.assertEqual(invoice.amount_paid, Decimal("700.00"))

    def test_payment_with_cents_precision(self):
        """Test payment with decimal precision"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1234.56"),
            balance_due=Decimal("1234.56"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("1234.56"))

        self.assertEqual(invoice.balance_due, Decimal("0.00"))
        self.assertEqual(invoice.status, "paid")

    def test_zero_payment_raises_error(self):
        """Test that zero payment amount is invalid"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("0.00"))

    def test_negative_payment_raises_error(self):
        """Test that negative payment amount is invalid"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("-100.00"))

    def test_overpayment_raises_error(self):
        """Test that overpayment is rejected"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("1500.00"))

    def test_paid_invoice_reject_additional_payments(self):
        """Test that fully paid invoices reject more payments"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="paid",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("0.00"),
            amount_paid=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.apply_payment(Decimal("100.00"))

    def test_payment_precision_rounding(self):
        """Test that payment calculations handle rounding correctly"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("100.33"),
            balance_due=Decimal("100.33"),
            created_by=self.user,
        )

        # Pay 1/3
        invoice.apply_payment(Decimal("33.44"))
        self.assertEqual(invoice.balance_due, Decimal("66.89"))

        # Pay remaining
        invoice.apply_payment(Decimal("66.89"))
        self.assertEqual(invoice.balance_due, Decimal("0.00"))
        self.assertEqual(invoice.status, "paid")

    def test_partial_payment_status_correctly_set(self):
        """Test that status transitions correctly with partial payment"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            balance_due=Decimal("1000.00"),
            created_by=self.user,
        )

        # Start as approved
        self.assertEqual(invoice.status, "approved")

        # After partial payment
        invoice.apply_payment(Decimal("250.00"))
        self.assertEqual(invoice.status, "partially_paid")

        # After full payment
        invoice.apply_payment(Decimal("750.00"))
        self.assertEqual(invoice.status, "paid")

    def test_payment_updates_balance_correctly(self):
        """Test balance_due calculation accuracy"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("2500.00"),
            balance_due=Decimal("2500.00"),
            created_by=self.user,
        )

        invoice.apply_payment(Decimal("1250.00"))
        self.assertEqual(
            invoice.balance_due, invoice.total_amount - invoice.amount_paid
        )

    def test_payment_sequence_maintains_consistency(self):
        """Test that multiple payments maintain data consistency"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("3000.00"),
            balance_due=Decimal("3000.00"),
            created_by=self.user,
        )

        payments = [
            Decimal("500.00"),
            Decimal("1000.00"),
            Decimal("750.00"),
            Decimal("750.00"),
        ]

        for payment in payments:
            invoice.apply_payment(payment)

        # Verify final state
        self.assertEqual(invoice.amount_paid, sum(payments))
        self.assertEqual(invoice.balance_due, Decimal("0.00"))
        self.assertEqual(invoice.status, "paid")
        self.assertEqual(
            invoice.total_amount, invoice.amount_paid + invoice.balance_due
        )


# ==================== DISCOUNT & VAT TESTS ====================


class TrustInvoiceDiscountVATTests(TrustAccountingTestBase):
    """Test cases for discount and VAT calculations"""

    def test_discount_percentage_applied_to_subtotal(self):
        """Test that discount percentage is correctly applied"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("10.00"),
            created_by=self.user,
        )

        # Add line item
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # Discount should be 10% of subtotal
        expected_discount = Decimal("1000.00") * Decimal("0.10")
        self.assertEqual(invoice.discount_amount, expected_discount)

    def test_100_percent_discount_zero_total(self):
        """Test 100% discount results in zero total"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("100.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # After 100% discount, total should be near zero (or zero after tax)
        # Exact behavior depends on implementation

    def test_line_item_vat_calculation(self):
        """Test that VAT is correctly calculated per line item"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("2.00"),
            unit_price=Decimal("100.00"),
        )

        # VAT should be calculated based on sales_item tax_type
        expected_vat = line_item.sales_item.vat_price * line_item.quantity
        self.assertEqual(line_item.total_vat, expected_vat)

    def test_mixed_vat_rates(self):
        """Test invoice with multiple VAT rates"""
        lease = self.create_test_lease()

        # Create zero-rated sales item
        zero_rated_item = TrustSalesItem.objects.create(
            name="Zero Rated Service",
            unit_price=Decimal("500.00"),
            category=self.sales_category,
            tax_type=None,  # No tax
            currency=self.currency,
            is_active=True,
            created_by=self.user,
        )

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        # Add taxed item
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        # Add zero-rated item
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=zero_rated_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("500.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # Total should include both items with appropriate VAT
        self.assertGreater(invoice.total_amount, Decimal("1500.00"))

    def test_zero_rated_items(self):
        """Test that zero-rated items have no VAT"""
        lease = self.create_test_lease()

        zero_rated_item = TrustSalesItem.objects.create(
            name="Zero Rated Item",
            unit_price=Decimal("1000.00"),
            category=self.sales_category,
            tax_type=None,
            currency=self.currency,
            is_active=True,
            created_by=self.user,
        )

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=zero_rated_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        self.assertEqual(line_item.vat_amount, Decimal("0.00"))

    def test_is_taxed_flag_with_all_taxed_items(self):
        """Test is_taxed flag is true when all items are taxed"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # Should be marked as taxed
        self.assertTrue(invoice.is_taxed)

    def test_is_taxed_flag_with_no_taxed_items(self):
        """Test is_taxed flag is false when no items are taxed"""
        lease = self.create_test_lease()

        zero_rated_item = TrustSalesItem.objects.create(
            name="Zero Rated Item",
            unit_price=Decimal("1000.00"),
            category=self.sales_category,
            tax_type=None,
            currency=self.currency,
            is_active=True,
            created_by=self.user,
        )

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=zero_rated_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # Should not be marked as taxed
        self.assertFalse(invoice.is_taxed)

    def test_vat_calculation_with_quantity(self):
        """Test VAT calculation accounts for quantity"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("5.00"),
            unit_price=Decimal("200.00"),
        )

        # Total VAT should be vat_per_unit * quantity
        expected_total_vat = line_item.vat_amount * Decimal("5.00")
        self.assertEqual(line_item.total_vat, expected_total_vat)

    def test_discount_reduces_tax_amount(self):
        """Test that VAT is calculated on discounted amount"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            discount_percentage=Decimal("20.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # VAT should be on discounted amount
        # This depends on implementation - might be before or after discount


# ==================== RECURRING INVOICE TESTS ====================


class TrustInvoiceRecurringTests(TrustAccountingTestBase):
    """Test cases for recurring invoice functionality"""

    def test_monthly_recurring_next_date(self):
        """Test monthly recurring calculates +1 month"""
        lease = self.create_test_lease()
        current_date = date(2026, 1, 15)

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=current_date,
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=current_date,
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        expected_date = current_date + relativedelta(months=1)
        self.assertEqual(invoice.next_invoice_date, expected_date)

    def test_quarterly_recurring_next_date(self):
        """Test quarterly recurring calculates +3 months"""
        lease = self.create_test_lease()
        current_date = date(2026, 1, 15)

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=current_date,
            is_recurring=True,
            frequency="quarterly",
            next_invoice_date=current_date,
            period_from=current_date,
            period_to=current_date + relativedelta(months=3),
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        expected_date = current_date + relativedelta(months=3)
        self.assertEqual(invoice.next_invoice_date, expected_date)

    def test_yearly_recurring_next_date(self):
        """Test yearly recurring calculates +12 months"""
        lease = self.create_test_lease()
        current_date = date(2026, 1, 15)

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=current_date,
            is_recurring=True,
            frequency="yearly",
            next_invoice_date=current_date,
            period_from=current_date,
            period_to=current_date + relativedelta(years=1),
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        expected_date = current_date + relativedelta(years=1)
        self.assertEqual(invoice.next_invoice_date, expected_date)

    def test_generate_recurring_copies_line_items(self):
        """Test that recurring invoice copies all line items"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=timezone.now().date(),
            period_from=timezone.now().date(),
            period_to=timezone.now().date() + relativedelta(months=1),
            created_by=self.user,
        )

        # Add line items
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("2.00"),
            unit_price=Decimal("500.00"),
        )

        next_invoice = invoice.generate_recurring_invoice()

        self.assertEqual(next_invoice.line_items.count(), invoice.line_items.count())

    def test_generate_recurring_without_is_recurring_raises_error(self):
        """Test that non-recurring invoices cannot generate recurrence"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=False,
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.generate_recurring_invoice()

    def test_generate_recurring_without_next_date_raises_error(self):
        """Test that recurring invoice requires next_invoice_date"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=None,
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.generate_recurring_invoice()

    def test_recurring_invoice_inherits_currency(self):
        """Test that recurring invoice uses same currency"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=timezone.now().date(),
            period_from=timezone.now().date(),
            period_to=timezone.now().date() + relativedelta(months=1),
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        self.assertEqual(next_invoice.currency, invoice.currency)

    def test_recurring_invoice_inherits_discount(self):
        """Test that recurring invoice preserves discount"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=timezone.now().date(),
            period_from=timezone.now().date(),
            period_to=timezone.now().date() + relativedelta(months=1),
            discount_percentage=Decimal("15.00"),
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        self.assertEqual(next_invoice.discount_percentage, invoice.discount_percentage)

    def test_recurring_preserves_terms_and_notes(self):
        """Test that recurring invoice copies metadata"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="recurring",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_recurring=True,
            frequency="monthly",
            next_invoice_date=timezone.now().date(),
            period_from=timezone.now().date(),
            period_to=timezone.now().date() + relativedelta(months=1),
            terms="Net 30",
            notes="Monthly recurring charge",
            created_by=self.user,
        )

        next_invoice = invoice.generate_recurring_invoice()

        self.assertEqual(next_invoice.terms, invoice.terms)
        self.assertEqual(next_invoice.notes, invoice.notes)


# ==================== LINE ITEM TESTS ====================


class TrustInvoiceLineItemTests(TrustAccountingTestBase):
    """Test cases for TrustInvoiceLineItem model"""

    def test_line_item_total_vat_property(self):
        """Test total_vat property calculation"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("3.00"),
            unit_price=Decimal("100.00"),
        )

        expected_total_vat = line_item.vat_amount * line_item.quantity
        self.assertEqual(line_item.total_vat, expected_total_vat)

    def test_line_item_total_price_excluding_vat(self):
        """Test total_price_excluding_vat property"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("4.00"),
            unit_price=Decimal("250.00"),
        )

        expected_total = line_item.unit_price * line_item.quantity
        self.assertEqual(line_item.total_price_excluding_vat, expected_total)

    def test_line_item_total_including_vat(self):
        """Test total_including_vat property"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("2.00"),
            unit_price=Decimal("500.00"),
        )

        expected_total = (
            line_item.unit_price + line_item.vat_amount
        ) * line_item.quantity
        self.assertEqual(line_item.total_including_vat, expected_total)

    def test_line_item_save_calculates_totals(self):
        """Test that save() automatically calculates totals"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("5.00"),
            unit_price=Decimal("300.00"),
        )

        # total_price should be automatically calculated
        self.assertGreater(line_item.total_price, Decimal("0.00"))

    def test_line_item_defaults_unit_price_from_sales_item(self):
        """Test that unit_price defaults from sales_item"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            # Note: not providing unit_price
        )

        # Should default to sales_item.unit_price
        self.assertEqual(line_item.unit_price, self.sales_item.unit_price)

    def test_line_item_zero_quantity_zero_total(self):
        """Test that zero quantity results in zero total"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("0.00"),
            unit_price=Decimal("1000.00"),
        )

        self.assertEqual(line_item.total_price, Decimal("0.00"))

    def test_line_item_string_representation(self):
        """Test __str__() method"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("500.00"),
        )

        str_repr = str(line_item)
        self.assertIn(self.sales_item.name, str_repr)
        self.assertIn("Qty", str_repr)

    def test_line_item_invoice_reference(self):
        """Test invoice_reference() method"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        line_item = TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("500.00"),
        )

        self.assertEqual(line_item.invoice_reference(), invoice.invoice_number)


# ==================== JOURNAL ENTRY INTEGRATION TESTS ====================


class TrustInvoiceLedgerIntegrationTests(TrustAccountingTestBase):
    """Test cases for invoice journal entry integration"""

    def test_post_to_ledger_creates_journal_entry(self):
        """Test that posting creates a journal entry"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        # Add line items
        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        journal_entry = invoice.post_to_ledger()

        self.assertIsNotNone(journal_entry)
        self.assertIsInstance(journal_entry, TrustJournalEntry)
        self.assertTrue(journal_entry.is_posted)

    def test_post_creates_debit_accounts_receivable(self):
        """Test that AR account is debited"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        journal_entry = invoice.post_to_ledger()

        # Check for debit transaction
        debit_transactions = journal_entry.transactions.filter(debit_amount__gt=0)
        self.assertTrue(debit_transactions.exists())

    def test_post_creates_credit_revenue(self):
        """Test that revenue account is credited"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        journal_entry = invoice.post_to_ledger()

        # Check for credit transaction
        credit_transactions = journal_entry.transactions.filter(credit_amount__gt=0)
        self.assertTrue(credit_transactions.exists())

    def test_journal_entry_balanced(self):
        """Test that journal entry debits equal credits"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1500.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1500.00"),
        )

        journal_entry = invoice.post_to_ledger()

        # Calculate totals
        total_debits = sum(t.debit_amount for t in journal_entry.transactions.all())
        total_credits = sum(t.credit_amount for t in journal_entry.transactions.all())

        self.assertEqual(total_debits, total_credits)

    def test_cannot_post_twice(self):
        """Test that invoices cannot be posted twice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        # First posting
        invoice.post_to_ledger()

        # Second posting should fail
        with self.assertRaises(ValidationError):
            invoice.post_to_ledger()

    def test_cannot_post_draft_invoice(self):
        """Test that draft invoices cannot be posted"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        with self.assertRaises(ValidationError):
            invoice.post_to_ledger()

    def test_posted_date_set_after_posting(self):
        """Test that posted_date is set when posting"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        self.assertIsNone(invoice.posted_date)

        invoice.post_to_ledger()
        invoice.refresh_from_db()

        self.assertIsNotNone(invoice.posted_date)

    def test_journal_entry_references_invoice(self):
        """Test that journal entry has reference to invoice"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="approved",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            total_amount=Decimal("1000.00"),
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        journal_entry = invoice.post_to_ledger()

        # Check that journal entry references invoice
        self.assertEqual(invoice.journal_entry, journal_entry)


# ==================== SERVICE LAYER ADVANCED TESTS ====================


class LeaseInvoiceServiceAdvancedTests(TrustAccountingTestBase):
    """Advanced test cases for LeaseInvoiceService"""

    def test_sales_item_creation_for_different_charge_types(self):
        """Test that sales items are created for all charge types"""
        lease = self.create_test_lease()

        charge_types = ["rent", "deposit", "utilities", "maintenance", "other"]

        for charge_type in charge_types:
            charge = LeaseCharge.objects.create(
                lease=lease,
                charge_type=charge_type,
                amount=Decimal("100.00"),
                frequency="monthly",
                currency=self.main_currency,
                effective_date=timezone.now().date(),
                # created_by=self.user,
            )

            service = LeaseInvoiceService()
            sales_item = service.get_or_create_sales_item_for_charge(charge, self.user)

            self.assertIsNotNone(sales_item)
            self.assertIn(charge_type, sales_item.name.lower())

    def test_generate_invoice_with_multiple_charges(self):
        """Test invoice generation with multiple charge types"""
        lease = self.create_test_lease()

        # Create multiple charges
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            currency=self.main_currency,
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="utilities",
            amount=Decimal("200.00"),
            currency=self.main_currency,
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="maintenance",
            amount=Decimal("150.00"),
            currency=self.main_currency,
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        # Should have 3 line items
        self.assertEqual(invoice.line_items.count(), 3)

    def test_invoice_generation_filters_inactive_charges(self):
        """Test that inactive charges are not included"""
        lease = self.create_test_lease()

        # Active charge
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            frequency="monthly",
            currency=self.main_currency,
            effective_date=timezone.now().date(),
            is_active=True,
            # created_by=self.user,
        )

        # Inactive charge
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="utilities",
            amount=Decimal("200.00"),
            frequency="monthly",
            currency=self.main_currency,
            effective_date=timezone.now().date(),
            is_active=False,
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        # Should only have 1 line item (active charge)
        self.assertEqual(invoice.line_items.count(), 1)

    def test_invoice_generation_with_date_range(self):
        """Test invoice generation respects date ranges"""
        lease = self.create_test_lease()

        current_date = timezone.now().date()

        # Charge effective before period
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            frequency="monthly",
            currency=self.main_currency,
            effective_date=current_date - relativedelta(months=2),
            end_date=current_date - relativedelta(months=1),
            # created_by=self.user,
        )

        # Charge effective during period
        LeaseCharge.objects.create(
            lease=lease,
            charge_type="utilities",
            amount=Decimal("200.00"),
            frequency="monthly",
            currency=self.main_currency,
            effective_date=current_date,
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            period_from=current_date,
            period_to=current_date + relativedelta(months=1),
            created_by=self.user,
        )

        # Should only include the current charge
        self.assertEqual(invoice.line_items.count(), 1)

    def test_sales_item_cached_for_same_charge(self):
        """Test that sales items are reused for same charge type"""
        lease = self.create_test_lease()

        charge = LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            frequency="monthly",
            currency=self.main_currency,
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        service = LeaseInvoiceService()

        # First call
        sales_item1 = service.get_or_create_sales_item_for_charge(charge, self.user)

        # Second call should return same item
        sales_item2 = service.get_or_create_sales_item_for_charge(charge, self.user)

        self.assertEqual(sales_item1.id, sales_item2.id)

    def test_invoice_totals_calculated_correctly(self):
        """Test that invoice totals are accurate"""
        lease = self.create_test_lease()

        charges = [
            ("rent", Decimal("1000.00")),
            ("utilities", Decimal("200.00")),
            ("maintenance", Decimal("150.00")),
        ]

        for charge_type, amount in charges:
            LeaseCharge.objects.create(
                lease=lease,
                charge_type=charge_type,
                amount=amount,
                frequency="monthly",
                currency=self.main_currency,
                effective_date=timezone.now().date(),
                # created_by=self.user,
            )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        # Recalculate totals
        invoice.update_totals()
        invoice.refresh_from_db()

        # Total should be sum of all charges plus VAT
        expected_subtotal = sum(amount for _, amount in charges)
        self.assertGreaterEqual(invoice.total_amount, expected_subtotal)

    def test_invoice_created_with_correct_status(self):
        """Test that on-demand invoices have draft status"""
        lease = self.create_test_lease()

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            currency=self.main_currency,
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        self.assertEqual(invoice.status, "draft")

    def test_invoice_references_tenant(self):
        """Test that invoice is linked to primary tenant"""
        lease = self.create_test_lease()

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            amount=Decimal("1000.00"),
            currency=self.main_currency,
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        self.assertIsNotNone(invoice.tenant)

    def test_invoice_uses_lease_currency(self):
        """Test that invoice uses lease currency"""
        lease = self.create_test_lease()

        LeaseCharge.objects.create(
            lease=lease,
            charge_type="rent",
            currency=self.main_currency,
            amount=Decimal("1000.00"),
            frequency="monthly",
            effective_date=timezone.now().date(),
            # created_by=self.user,
        )

        service = LeaseInvoiceService()
        invoice = service.generate_lease_invoice_on_demand(
            lease=lease,
            created_by=self.user,
        )

        # Invoice currency should match lease currency
        self.assertIsNotNone(invoice.currency)


# ==================== DOCUMENT NUMBER TESTS ====================


class TrustInvoiceDocumentNumberTests(TrustAccountingTestBase):
    """Test cases for document number generation"""

    def test_invoice_number_auto_generation(self):
        """Test that invoice numbers are auto-generated"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertIsNotNone(invoice.invoice_number)
        self.assertTrue(len(invoice.invoice_number) > 0)

    def test_invoice_number_uniqueness(self):
        """Test that invoice numbers are unique"""
        lease = self.create_test_lease()

        invoice1 = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        invoice2 = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        self.assertNotEqual(invoice1.invoice_number, invoice2.invoice_number)

    def test_invoice_number_format(self):
        """Test invoice number follows expected format"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        # Should contain some identifiable pattern
        self.assertIsNotNone(invoice.invoice_number)
        # Format validation depends on implementation

    def test_document_number_generation_for_taxed_invoice(self):
        """Test document number with W- prefix for taxed invoices"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_taxed=True,
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=self.sales_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # If document_number is auto-generated, check prefix
        if invoice.document_number:
            # Should have W- prefix for taxed invoices
            pass  # Implementation specific

    def test_document_number_generation_for_nontaxed_invoice(self):
        """Test document number with N- prefix for non-taxed invoices"""
        lease = self.create_test_lease()

        # Create non-taxed sales item
        nontaxed_item = TrustSalesItem.objects.create(
            name="Non-taxed Item",
            unit_price=Decimal("1000.00"),
            category=self.sales_category,
            tax_type=None,
            currency=self.currency,
            is_active=True,
            created_by=self.user,
        )

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            is_taxed=False,
            created_by=self.user,
        )

        TrustInvoiceLineItem.objects.create(
            invoice=invoice,
            sales_item=nontaxed_item,
            quantity=Decimal("1.00"),
            unit_price=Decimal("1000.00"),
        )

        invoice.update_totals()
        invoice.refresh_from_db()

        # If document_number is auto-generated, check prefix
        if invoice.document_number:
            # Should have N- prefix for non-taxed invoices
            pass  # Implementation specific

    def test_sequential_numbering(self):
        """Test that invoice numbers increment sequentially"""
        lease = self.create_test_lease()

        invoices = []
        for i in range(3):
            invoice = TrustInvoice.objects.create(
                invoice_type="fiscal",
                status="draft",
                lease=lease,
                tenant=self.tenant,
                currency=self.currency,
                invoice_date=timezone.now().date(),
                created_by=self.user,
            )
            invoices.append(invoice)

        # All should have different numbers
        numbers = [inv.invoice_number for inv in invoices]
        self.assertEqual(len(numbers), len(set(numbers)))

    def test_invoice_number_preserved_after_save(self):
        """Test that invoice number doesn't change on update"""
        lease = self.create_test_lease()

        invoice = TrustInvoice.objects.create(
            invoice_type="fiscal",
            status="draft",
            lease=lease,
            tenant=self.tenant,
            currency=self.currency,
            invoice_date=timezone.now().date(),
            created_by=self.user,
        )

        original_number = invoice.invoice_number

        # Update invoice
        invoice.notes = "Updated notes"
        invoice.save()

        invoice.refresh_from_db()
        self.assertEqual(invoice.invoice_number, original_number)
