"""Services for generating invoices related to leases."""

from decimal import Decimal
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.db import transaction
from apps.trust_accounting.models import (
    TrustInvoice,
    TrustInvoiceLineItem,
    TrustSalesItem,
    TrustSalesCategory,
    TrustTaxType,
    TrustGeneralLedgerAccount,
    TrustCurrency,
)
from apps.leases.models import Lease, LeaseCharge
from apps.leases.utils.helpers import get_opening_balance_oldest_date


class LeaseInvoiceService:
    """Service class for generating invoices related to leases."""

    @staticmethod
    def get_or_create_sales_item_for_charge(charge: LeaseCharge, created_by=None):
        """
        Get or create a TrustSalesItem for a given LeaseCharge.
        Maps charge types to appropriate sales categories and tax settings.
        """
        # Map charge types to descriptive names
        charge_type_map = {
            "RENT": "Rent",
            "UTILITY": "Utility",
            "SERVICE_FEE": "Service Fee",
            "LATE_FEE": "Late Fee",
            "DEPOSIT": "Deposit",
            "DISCOUNT": "Discount",
            "OTHER": "Other Charge",
        }

        charge_display_name = charge_type_map.get(charge.charge_type, "Lease Charge")

        # Get or create appropriate sales category
        category_name = charge_display_name
        sales_category, _ = TrustSalesCategory.objects.get_or_create(
            name=category_name,
            defaults={
                "code": charge.charge_type,
                "description": f"Category for {charge_display_name} charges",
                "created_by": created_by,
            },
        )

        tax_type, _ = TrustTaxType.objects.get_or_create(
            code="ZR",
            defaults={
                "name": "Zero Rate",
                "rate": Decimal("0.00") if charge.vat_inclusive else Decimal("0.00"),
                "is_active": True,
                "created_by": created_by,
            },
        )

        # Get default income account (should be configured properly in production) :TODO
        income_account = TrustGeneralLedgerAccount.objects.get(
            account_number="T10001", is_active=True
        )

        try:
            trust_currency = TrustCurrency.objects.get(
                currency_code=charge.currency.currency_code
            )
        except TrustCurrency.DoesNotExist:
            trust_currency = TrustCurrency.objects.create(
                currency_code=charge.currency.currency_code,
                currency_name=charge.currency.currency_name,
                symbol=charge.currency.symbol,
                is_active=True,
            )

        item_name = f"{charge_display_name}"
        if charge.description:
            item_name = f"{charge_display_name} - {charge.description[:100]}"

        sales_item, created = TrustSalesItem.objects.get_or_create(
            name=item_name[:255],
            category=sales_category,
            defaults={
                "unit_name": "Unit",
                "unit_price": charge.amount,
                "currency": trust_currency,
                "income_account": income_account,
                "tax_type": tax_type if charge.vat_inclusive else None,
                "track_inventory": False,
                "is_active": True,
                "created_by": created_by,
            },
        )

        # Update price if item exists but price has changed
        if not created and sales_item.unit_price != charge.amount:
            sales_item.unit_price = charge.amount
            sales_item.save(update_fields=["unit_price"])

        return sales_item

    @staticmethod
    def _shift_opening_balances(lease):
        """
        Shifts the opening balances back one month if the grace period has passed.
        """
        if not hasattr(lease, "opening_balance"):
            return

        opening_balance = lease.opening_balance
        today = timezone.now().date()
        if (
            hasattr(lease, "grace_period_days")
            and today.day > lease.grace_period_days
            and opening_balance.current_month_balance > 0
        ):
            opening_balance.three_months_plus_balance += (
                opening_balance.three_months_back_balance
            )
            opening_balance.three_months_back_balance = (
                opening_balance.two_months_back_balance
            )
            opening_balance.two_months_back_balance = (
                opening_balance.one_month_back_balance
            )
            opening_balance.one_month_back_balance = (
                opening_balance.current_month_balance
            )
            opening_balance.current_month_balance = Decimal("0.00")
            opening_balance.save()

    @staticmethod
    def generate_monthly_invoices():
        """
        Generate invoices for all active leases on the 25th of each month
        Fixed rent (is_rent_variable=False): invoice_type='fiscal', status='pending', is_invoiced=True
        Variable rent (is_rent_variable=True): invoice_type='recurring', status='draft', is_invoiced=False
        """
        today = timezone.now().date()

        # Only run on the 25th of each month
        if today.day != 25:
            return []

        active_leases = Lease.objects.filter(status="ACTIVE")
        created_invoices = []

        for lease in active_leases:
            try:
                with transaction.atomic():
                    primary_tenant = lease.get_primary_tenant()
                    tenant_object = primary_tenant if primary_tenant else None

                    try:
                        trust_currency = TrustCurrency.objects.get(
                            currency_code=lease.currency.currency_code
                        )
                    except TrustCurrency.DoesNotExist:
                        trust_currency = TrustCurrency.objects.create(
                            currency_code=lease.currency.currency_code,
                            currency_name=lease.currency.currency_name,
                            symbol=getattr(lease.currency, "symbol", "$"),
                            is_active=True,
                        )

                    if lease.is_rent_variable:
                        invoice_type = "recurring"
                        status = "draft"
                        is_invoiced = False
                    else:
                        invoice_type = "fiscal"
                        status = "pending"
                        is_invoiced = True

                    period_from = today.replace(day=1)
                    if today.month == 12:
                        period_to = today.replace(
                            year=today.year + 1, month=1, day=1
                        ) - relativedelta(days=1)
                    else:
                        period_to = today.replace(
                            month=today.month + 1, day=1
                        ) - relativedelta(days=1)

                    invoice = TrustInvoice.objects.create(
                        invoice_type=invoice_type,
                        status=status,
                        lease=lease,
                        landlord=lease.landlord,
                        tenant=tenant_object,
                        currency=trust_currency,
                        invoice_date=today,
                        due_date=today + relativedelta(days=30),
                        period_from=period_from,
                        period_to=period_to,
                        is_invoiced=is_invoiced,
                        created_by=lease.created_by,
                    )

                    for charge in lease.charges.filter(
                        is_active=True, effective_date__lte=today
                    ):
                        if charge.end_date and charge.end_date < today:
                            continue

                        sales_item = (
                            LeaseInvoiceService.get_or_create_sales_item_for_charge(
                                charge, created_by=lease.created_by
                            )
                        )

                        TrustInvoiceLineItem.objects.create(
                            invoice=invoice,
                            sales_item=sales_item,
                            quantity=Decimal("1.00"),
                            unit_price=charge.amount,
                        )

                    invoice.update_totals()
                    created_invoices.append(invoice)

                    print(
                        f"Created {invoice_type} invoice {invoice.invoice_number} for lease {lease.lease_id} (Rent variable: {lease.is_rent_variable})"
                    )

            except Exception as e:
                print(f"Error generating invoice for lease {lease.lease_id}: {str(e)}")
                import traceback

                traceback.print_exc()
                continue

        print(f"Successfully generated {len(created_invoices)} invoices")
        return created_invoices

    @staticmethod
    def generate_initial_invoice_for_opening_balance(lease):
        """
        Generates invoices for each aged balance in the lease's opening balance.
        If the outstanding balance is zero or less, a single paid invoice is created.
        """
        if not hasattr(lease, "opening_balance"):
            return []

        LeaseInvoiceService._shift_opening_balances(lease)
        opening_balance = lease.opening_balance
        created_invoices = []

        with transaction.atomic():
            primary_tenant = lease.get_primary_tenant()
            tenant_object = primary_tenant if primary_tenant else None

            try:
                trust_currency = TrustCurrency.objects.get(
                    currency_code=lease.currency.currency_code
                )
            except TrustCurrency.DoesNotExist:
                trust_currency = TrustCurrency.objects.create(
                    currency_code=lease.currency.currency_code,
                    currency_name=lease.currency.currency_name,
                    symbol=getattr(lease.currency, "symbol", "$"),
                    is_active=True,
                )

            sales_category, _ = TrustSalesCategory.objects.get_or_create(
                name="Opening Balances",
                defaults={
                    "code": "OPENBAL",
                    "description": "Opening balance charges",
                    "created_by": lease.created_by,
                },
            )

            # Get default income account
            income_account = TrustGeneralLedgerAccount.objects.filter(
                account_name="Rental Income", is_active=True
            ).first()

            # Create sales item for opening balance
            sales_item, _ = TrustSalesItem.objects.get_or_create(
                name="Opening Balance",
                category=sales_category,
                defaults={
                    "unit_name": "Balance",
                    "unit_price": Decimal("0.00"),
                    "currency": trust_currency,
                    "income_account": income_account,
                    "tax_type": None,
                    "track_inventory": False,
                    "is_active": True,
                    "created_by": lease.created_by,
                },
            )

            if opening_balance.outstanding_balance <= Decimal("0.00"):
                # Create a single paid invoice for the non-positive outstanding balance
                oldest_date = get_opening_balance_oldest_date(lease)

                invoice = TrustInvoice.objects.create(
                    invoice_type="fiscal",
                    status="paid",
                    lease=lease,
                    landlord=lease.landlord,
                    tenant=tenant_object,
                    currency=trust_currency,
                    invoice_date=oldest_date,
                    due_date=oldest_date,
                    is_invoiced=True,
                    created_by=lease.created_by,
                )

                TrustInvoiceLineItem.objects.create(
                    invoice=invoice,
                    sales_item=sales_item,
                    quantity=Decimal("1.00"),
                    unit_price=opening_balance.outstanding_balance,
                )

                invoice.update_totals()
                created_invoices.append(invoice)
            else:
                balance_fields = [
                    ("three_months_plus_balance", 4),
                    ("three_months_back_balance", 3),
                    ("two_months_back_balance", 2),
                    ("one_month_back_balance", 1),
                    ("current_month_balance", 0),
                ]

                # Determine the base date for invoice dates
                today = timezone.now().date()
                if today.day < 25:
                    base_date = today - relativedelta(months=1)
                    base_date = base_date.replace(day=25)
                else:
                    base_date = today

                for field_name, months_ago in balance_fields:
                    balance_amount = getattr(opening_balance, field_name)

                    if balance_amount > Decimal("0.00"):
                        invoice_date = base_date - relativedelta(months=months_ago)

                        # Create the invoice
                        invoice = TrustInvoice.objects.create(
                            invoice_type="fiscal",
                            status="pending",
                            lease=lease,
                            landlord=lease.landlord,
                            tenant=tenant_object,
                            currency=trust_currency,
                            invoice_date=invoice_date,
                            due_date=invoice_date + relativedelta(days=30),
                            is_invoiced=True,
                            created_by=lease.created_by,
                        )

                        # Create a single line item for this specific balance
                        TrustInvoiceLineItem.objects.create(
                            invoice=invoice,
                            sales_item=sales_item,
                            quantity=Decimal("1.00"),
                            unit_price=balance_amount,
                        )

                        # Update the invoice totals
                        invoice.update_totals()
                        created_invoices.append(invoice)

        return created_invoices

    @staticmethod
    def generate_lease_invoice_on_demand(
        lease,
        invoice_type="fiscal",
        status="pending",
        period_from=None,
        period_to=None,
        created_by=None,
    ):
        """
        Generate a trust invoice for a specific lease on demand.

        Args:
            lease: Lease object
            invoice_type: 'fiscal', 'proforma', or 'recurring'
            status: 'draft', 'pending', 'approved', etc.
            period_from: Start date of billing period (optional)
            period_to: End date of billing period (optional)
            created_by: User creating the invoice

        Returns:
            TrustInvoice object
        """
        today = timezone.now().date()

        with transaction.atomic():
            # Get primary tenant
            primary_tenant = lease.get_primary_tenant()
            tenant_object = primary_tenant if primary_tenant else None

            # Map lease currency to trust currency
            try:
                trust_currency = TrustCurrency.objects.get(
                    currency_code=lease.currency.currency_code
                )
            except TrustCurrency.DoesNotExist:
                trust_currency = TrustCurrency.objects.create(
                    currency_code=lease.currency.currency_code,
                    currency_name=lease.currency.currency_name,
                    symbol=getattr(lease.currency, "symbol", "$"),
                    is_active=True,
                )

            # Set default period if not provided
            if not period_from:
                period_from = today.replace(day=1)
            if not period_to:
                if today.month == 12:
                    period_to = today.replace(
                        year=today.year + 1, month=1, day=1
                    ) - relativedelta(days=1)
                else:
                    period_to = today.replace(
                        month=today.month + 1, day=1
                    ) - relativedelta(days=1)

            # Create trust invoice
            invoice = TrustInvoice.objects.create(
                invoice_type=invoice_type,
                status=status,
                lease=lease,
                landlord=lease.landlord,
                tenant=tenant_object,
                currency=trust_currency,
                invoice_date=today,
                due_date=today + relativedelta(days=30),
                period_from=period_from,
                period_to=period_to,
                created_by=created_by or lease.created_by,
            )

            # Add line items for each active charge
            for charge in lease.charges.filter(
                is_active=True, effective_date__lte=period_to
            ):
                # Skip charges that ended before the period starts
                if charge.end_date and charge.end_date < period_from:
                    continue

                # Use utility function to get or create sales item
                sales_item = LeaseInvoiceService.get_or_create_sales_item_for_charge(
                    charge, created_by=created_by or lease.created_by
                )

                # Create line item
                TrustInvoiceLineItem.objects.create(
                    invoice=invoice,
                    sales_item=sales_item,
                    quantity=Decimal("1.00"),
                    unit_price=charge.amount,
                )

            # Update invoice totals
            invoice.update_totals()

            return invoice
