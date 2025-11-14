from datetime import date
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models import F, Sum, Q
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from decimal import Decimal, ROUND_HALF_UP
from django.utils.timezone import now
from apps.accounting.utils.helpers import (
    generate_invoice_document_number,
)
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch
from apps.common.models.base_models import BaseModel, BaseModelWithUser

User = get_user_model()

# Create your models here.


class AccountSector(BaseModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Account Sector"
        verbose_name_plural = "Account Sectors"
        ordering = ["code"]


class Currency(BaseModel):
    currency_code = models.CharField(max_length=3, unique=True)
    currency_name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.currency_code

    class Meta:
        app_label = "accounting"
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")


class SalesItem(BaseModelWithUser):
    category = models.ForeignKey(
        "SalesCategory", on_delete=models.CASCADE, related_name="items"
    )
    item_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    unit_price_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="items_currency",
        null=True,
        blank=True,
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_name = models.CharField(max_length=255, blank=True, null=True)
    tax_configuration = models.ForeignKey(
        "VATSetting", on_delete=models.CASCADE, related_name="items"
    )
    sales_account = models.ForeignKey(
        "GeneralLedgerAccount", on_delete=models.CASCADE, related_name="items"
    )

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Sales Item")
        verbose_name_plural = _("Sales Items")

    def save(self, *args, **kwargs):
        if not self.item_id:
            last_item = SalesItem.objects.order_by("-id").first()
            if not last_item or not last_item.item_id.startswith("ITEM"):
                self.item_id = "ITEM0001"
            else:
                try:
                    last_number = int(last_item.item_id.replace("ITEM", ""))
                except ValueError:
                    last_number = 0
                while SalesItem.objects.filter(
                    item_id=f"ITEM{last_number + 1:04d}"
                ).exists():
                    last_number += 1
                self.item_id = f"ITEM{last_number + 1:04d}"
        super().save(*args, **kwargs)

    @property
    def price_including_vat(self):
        """Calculate unit price including VAT for the line item."""
        price_incl_vat = self.price + (
            self.tax_configuration.rate / Decimal("100.00") * self.price
        )
        return price_incl_vat


class SalesCategory(BaseModelWithUser):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = "accounting"
        verbose_name = _("Sales Category")
        verbose_name_plural = _("Sales Categories")


class VATSetting(BaseModelWithUser):
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=255)
    vat_applicable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.rate}% - {self.description}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("VAT Setting")
        verbose_name_plural = _("VAT Settings")


class TransactionType(BaseModel):
    transaction_type = models.CharField(max_length=30, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.transaction_type

    class Meta:
        app_label = "accounting"
        verbose_name = _("Transaction Type")
        verbose_name_plural = _("Transaction Types")


class CashbookEntry(BaseModelWithUser):
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.ForeignKey(
        TransactionType, on_delete=models.CASCADE, blank=True, null=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Cashbook Entry")
        verbose_name_plural = _("Cashbook Entries")


class GeneralLedgerAccount(BaseModelWithUser):
    account_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=10, unique=True, blank=True)
    account_sector = models.ForeignKey(
        AccountSector, on_delete=models.PROTECT, related_name="sector", default=None
    )
    is_secondary_currency = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.account_name} - {self.account_number}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("General Ledger Account")
        verbose_name_plural = _("General Ledger Accounts")


class JournalEntry(BaseModel):
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    def __str__(self):
        return f"Journal Entry {self.id} - {self.date}"


class LedgerTransaction(BaseModelWithUser):
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return (
            f"{self.account.account_name} - Debit: {self.debit} Credit: {self.credit}"
        )


class Customer(BaseModel):
    """Customer model to represent both individuals and companies."""

    is_individual = models.BooleanField(default=True)
    individual = models.ForeignKey(
        Individual, on_delete=models.SET_NULL, null=True, blank=True
    )
    company = models.ForeignKey(
        CompanyBranch, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        if self.is_individual and self.individual:
            return f"{self.individual.full_name}"
        elif not self.is_individual and self.company:
            return f"{self.company.full_name}"
        return f"{self.id} {self.is_individual}"

    @property
    def get_full_name(self):
        if self.is_individual and self.individual:
            return self.individual.full_name
        elif not self.is_individual and self.company:
            return self.company.full_name
        return "N/A"


class Invoice(BaseModelWithUser):
    INVOICE_TYPE_CHOICES = [
        ("fiscal", "Fiscal"),
        ("proforma", "Proforma"),
        ("recurring", "Recurring"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("partially_paid", "Partially Paid"),
        ("cancelled", "Cancelled"),
    ]

    FREQUENCY_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    # Core Fields
    invoice_type = models.CharField(
        max_length=20, choices=INVOICE_TYPE_CHOICES, default="fiscal"
    )
    document_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        default=generate_invoice_document_number,
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    lease = models.ForeignKey(
        "leases.Lease",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="invoices",
    )
    reference_number = models.CharField(max_length=20, blank=True, null=True)

    # Customer Relationship
    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
    )

    # Financial Details
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )

    # Recurring Fields
    is_recurring = models.BooleanField(default=False)
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default="monthly",
        blank=True,
        null=True,
    )
    next_invoice_date = models.DateField(null=True, blank=True)
    original_invoice = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="child_invoices",
    )
    total_inclusive = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    is_invoiced = models.BooleanField(default=False)
    # Timestamps
    due_date = models.DateField(null=True, blank=True)
    sale_date = models.DateTimeField(default=now)
    line_items = GenericRelation("TransactionLineItem", related_query_name="invoices")

    @property
    def total_excluding_vat(self):
        # Sum of (quantity * unit_price) for all line items
        total = self.line_items.aggregate(
            sum_excl_vat=Sum(F("quantity") * F("unit_price"))
        )["sum_excl_vat"] or Decimal("0.00")
        return (total - self.discount).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

    @property
    def vat_total(self):
        total = self.line_items.aggregate(sum_vat=Sum("vat_amount"))[
            "sum_vat"
        ] or Decimal("0.00")
        return total.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

    def _calculate_total_inclusive(self):
        # Your existing calculation logic
        from decimal import Decimal

        total_excl_vat = Decimal("0.00")
        vat_total = Decimal("0.00")

        # Calculate manually
        for line_item in self.line_items.all():
            line_total = line_item.quantity * line_item.unit_price
            total_excl_vat += line_total
            vat_total += line_item.vat_amount or Decimal("0.00")

        total_excl_vat = (total_excl_vat - self.discount).quantize(Decimal("0.00"))
        return (total_excl_vat + vat_total).quantize(Decimal("0.00"))

    def update_totals(self):
        """
        Updates the total_inclusive field based on current line items.
        """
        self.total_inclusive = self._calculate_total_inclusive()
        self.save(update_fields=["total_inclusive"])

    @property
    def total_inclusive_property(self):
        return self.total_inclusive

    def convert_to_fiscal(self):
        if self.invoice_type == "proforma":
            self.invoice_type = "fiscal"
            self.status = "pending"
            self.save()
            return self
        raise ValidationError("Only proforma invoices can be converted to fiscal.")

    def save(self, *args, **kwargs):
        if not self.pk and not self.document_number:
            self.document_number = generate_invoice_document_number()
        if not self.total_inclusive:
            self.total_inclusive = self._calculate_total_inclusive()
        self.full_clean()
        super().save(*args, **kwargs)

    def convert_recurring_to_fiscal(self, validated_data=None):
        """
        Convert a recurring invoice template to a fiscal invoice.
        Users can modify line items before conversion.
        """
        if self.invoice_type != "recurring":
            raise ValidationError(
                "Only recurring invoice templates can be converted to fiscal."
            )

        if self.is_invoiced:
            raise ValidationError("This recurring invoice has already been converted.")

        with transaction.atomic():
            # Create fiscal invoice
            fiscal_invoice = Invoice.objects.create(
                invoice_type="fiscal",
                status="pending",
                lease=self.lease,
                currency=self.currency,
                customer=self.customer,
                sale_date=timezone.now().date(),
                discount=self.discount,
                is_invoiced=True,
                created_by=self.created_by,
                reference_number=self.reference_number,
            )

            # Copy line items, allowing modifications if provided
            if validated_data and "items" in validated_data:
                # Use modified line items from request
                self._create_modified_line_items(
                    fiscal_invoice, validated_data["items"]
                )
            else:
                # Use original line items
                self._copy_line_items(fiscal_invoice)

            # Update totals
            fiscal_invoice.update_totals()

            # Update recurring template's next invoice date
            if self.frequency:
                self.next_invoice_date = self._next_recurrence_date()
                self.save(update_fields=["next_invoice_date"])

            return fiscal_invoice

    def _copy_line_items(self, target_invoice):
        """Copy line items from recurring template to fiscal invoice"""
        for line_item in self.line_items.all():
            TransactionLineItem.objects.create(
                content_type=ContentType.objects.get_for_model(Invoice),
                object_id=target_invoice.id,
                sales_item=line_item.sales_item,
                quantity=line_item.quantity,
                unit_price=line_item.unit_price,
                vat_amount=line_item.vat_amount,
                total_price=line_item.total_price,
            )

    def _create_modified_line_items(self, target_invoice, items_data):
        """Create modified line items based on user input"""
        for item_data in items_data:
            TransactionLineItem.objects.create(
                content_type=ContentType.objects.get_for_model(Invoice),
                object_id=target_invoice.id,
                sales_item=item_data["sales_item"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                vat_amount=item_data.get("vat_amount", Decimal("0.00")),
                total_price=item_data.get("total_price", Decimal("0.00")),
            )

    def can_generate_fiscal(self):
        """Check if this recurring invoice can be converted to fiscal"""
        return (
            self.invoice_type == "recurring"
            and not self.is_invoiced
            and self.status == "draft"
        )

    def _next_recurrence_date(self):
        if not self.next_invoice_date:
            return None

        if self.frequency == "monthly":
            return self.next_invoice_date + relativedelta(months=+1)
        if self.frequency == "quarterly":
            return self.next_invoice_date + relativedelta(months=+3)
        if self.frequency == "yearly":
            return self.next_invoice_date + relativedelta(years=+1)
        return None

    def __str__(self):
        return (
            f"{self.invoice_type.title()} {self.document_number} - {self.customer_id}"
        )


class CashSale(BaseModelWithUser):
    # core fieldds
    document_number = models.IntegerField(unique=True, blank=True, null=True)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)
    sale_date = models.DateTimeField(auto_now_add=True)

    # customer details
    is_individual = models.BooleanField(default=True)
    individual = models.ForeignKey(
        Individual, on_delete=models.SET_NULL, null=True, blank=True
    )
    company = models.ForeignKey(
        CompanyBranch, on_delete=models.SET_NULL, null=True, blank=True
    )

    # Items details
    quantity = models.IntegerField(default=1)
    line_items = GenericRelation("TransactionLineItem", related_query_name="cashsales")

    # Financial details
    total_excluding_vat = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    vat_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    invoice_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    # Payment details
    payment_type = models.ForeignKey(
        "PaymentMethod", on_delete=models.PROTECT, default=None
    )
    cashbook = models.ForeignKey(
        "CashBook",
        on_delete=models.PROTECT,
        related_name="cashsales_cashbook",
        default=None,
    )
    details = models.TextField(blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)
    amount_received = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    def __str__(self):
        user_display = self.created_by.username if self.created_by else "N/A"
        return f"Cash Sale {self.id} - User: {user_display}"

    def save(self, *args, **kwargs):
        if self.document_number is None:
            last_sale = CashSale.objects.order_by("-document_number").first()
            self.document_number = 0 if not last_sale else last_sale.document_number + 1

        self.total_excluding_vat = self.total_excluding_vat.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        self.invoice_total = self.invoice_total.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        self.vat_total = self.vat_total.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        super().save(*args, **kwargs)

    class Meta:
        app_label = "accounting"
        verbose_name = _("Cash Sale")
        verbose_name_plural = _("Cash Sales")


class CreditNote(BaseModelWithUser):
    credit_date = models.DateField(default=date.today)
    document_number = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    description = models.TextField(blank=True, null=True)
    line_items = GenericRelation(
        "TransactionLineItem", related_query_name="creditnotes"
    )
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )

    def __str__(self):
        customer_name_str = ""
        if self.customer.is_individual:
            customer_name_str = self.customer.individual.full_name
        else:
            customer_name_str = self.customer.company.full_name
        return f"Credit Note {self.document_number} for {customer_name_str}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Credit Note")
        verbose_name_plural = _("Credit Notes")


class TransactionLineItem(BaseModel):
    """Generic model for line items in transactions like invoices, credit notes, etc."""

    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    parent_document = GenericForeignKey("content_type", "object_id")
    sales_item = models.ForeignKey("SalesItem", on_delete=models.PROTECT)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    unit_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    vat_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    total_price = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    class Meta:
        unique_together = ("content_type", "object_id", "sales_item")
        verbose_name = "Transaction Line Item"
        verbose_name_plural = "Transaction Line Items"

    def save(self, *args, **kwargs):
        # Calculate total_price if not provided or if recalculated
        unit_price = self.unit_price if self.unit_price else self.sales_item.price

        if (
            self.sales_item.tax_configuration
            and self.sales_item.tax_configuration.vat_applicable
        ):
            vat_rate = self.sales_item.tax_configuration.rate / Decimal("100.00")
        else:
            vat_rate = Decimal("0.00")

        vat_amount = (unit_price * vat_rate).quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )

        if self.quantity is not None:
            calculated_total_price = self.quantity * (unit_price + vat_amount)
            self.total_price = calculated_total_price.quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
        self.unit_price = unit_price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
        self.vat_amount = vat_amount
        super().save(*args, **kwargs)

    def __str__(self):
        parent_type_name = self.content_type.model.replace("_", " ").title()
        parent_display_id = getattr(
            self.parent_document, "document_number", str(self.object_id)
        )
        return f"{parent_type_name} {parent_display_id} - {self.sales_item.name} (Qty: {self.quantity})"

    @property
    def total_vat(self):
        """Calculate total VAT for the line item."""
        total_vat = self.vat_amount * self.quantity
        return total_vat

    @property
    def total_price_excluding_vat(self):
        """Calculate total price excluding VAT for the line item."""
        total_excl_vat = self.unit_price * self.quantity
        return total_excl_vat

    @property
    def total_including_vat(self):
        """Calculate total price including VAT for the line item."""
        total_incl_vat = (self.unit_price + self.vat_amount) * self.quantity
        return total_incl_vat


class PaymentMethod(BaseModel):
    payment_method_name = models.CharField(max_length=255)
    currency = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        app_label = "accounting"
        verbose_name = _("payment method")
        verbose_name_plural = _("payment methods")

    def __str__(self):
        return self.payment_method_name


class Payment(BaseModelWithUser):
    """Stores payments made against invoices."""

    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name="payments"
    )
    payment_date = models.DateTimeField(default=now)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    balance = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    cashbook = models.ForeignKey(
        "accounting.CashBook",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="payments",
    )
    method = models.ForeignKey(
        PaymentMethod, on_delete=models.CASCADE, related_name="payments"
    )
    reference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Payment {self.invoice.document_number} - {self.amount}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")


class CurrencyRate(BaseModelWithUser):
    current_rate = models.FloatField(default=0)
    base_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="base_currency",
        null=True,
        blank=True,
    )
    currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="target_currency",
        null=True,
        blank=True,
    )
    # updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        user_display = self.created_by.username if self.created_by else "N/A"
        return f"User {user_display} Latest Rate {self.current_rate}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Currency Rate")
        verbose_name_plural = _("Currency Rates")
        ordering = ["-date_created"]


class CashBook(BaseModelWithUser):
    cashbook_id = models.CharField(max_length=255, unique=True)
    cashbook_name = models.CharField(max_length=255)
    currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="cashbook_currency",
        null=True,
        blank=True,
    )
    requisition_status = models.BooleanField(default=False)
    account_type = models.CharField(
        max_length=50
    )  # e.g., 'Bank Account', 'Cash Drawer'
    bank_account_number = models.CharField(max_length=30, blank=True)
    branch_name = models.CharField(max_length=255, blank=True)
    general_ledger_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.CASCADE,
        related_name="general_ledger_account",
    )

    def __str__(self):
        return f"{self.cashbook_name} - {self.general_ledger_account.account_name}"

    def save(self, *args, **kwargs):
        if not self.cashbook_id:
            last_cashbook = CashBook.objects.order_by("-id").first()
            if not last_cashbook or not last_cashbook.cashbook_id.startswith("CB"):
                self.cashbook_id = "CB0001"
            else:
                try:
                    last_number = int(last_cashbook.cashbook_id.replace("CB", ""))
                except ValueError:
                    last_number = 0
                self.cashbook_id = f"CB{last_number + 1:04d}"
        super().save(*args, **kwargs)

    class Meta:
        app_label = "accounting"
        verbose_name = _("Cash Book")
        verbose_name_plural = _("Cash Books")
