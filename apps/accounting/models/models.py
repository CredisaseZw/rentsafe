from django.db import models
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
    generate_credit_note_document_number,
)
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company
from apps.common.models.base_models import BaseModel, BaseModelWithUser

User = get_user_model()

# Create your models here.


class AccountSector(BaseModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class SalesAccount(BaseModel):
    """Stores different sales accounts and links them to sectors."""

    account_name = models.CharField(max_length=255, unique=True)
    account_number = models.CharField(max_length=15, default="")
    account_sector = models.ForeignKey(
        AccountSector, on_delete=models.CASCADE, related_name="accounts"
    )

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"


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
        "SalesAccount", on_delete=models.CASCADE, related_name="items"
    )

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Sales Item")
        verbose_name_plural = _("Sales Items")


class SalesCategory(BaseModel):
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
    description = models.CharField(max_length=255, unique=True)
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


class GeneralLedgerAccount(BaseModel):
    account_name = models.CharField(max_length=255, unique=True, blank=True)
    account_number = models.CharField(max_length=10, unique=True, blank=True)
    account_sector = models.ForeignKey(
        AccountSector, on_delete=models.PROTECT, related_name="sector", default=None
    )

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

    class Meta:
        app_label = "accounting"
        verbose_name = _("Ledger Transaction")
        verbose_name_plural = _("Ledger Transactions")


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
        "leases.LeaseTenant",
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

    def generate_recurring_invoice(self):
        if self.invoice_type != "recurring":
            raise ValidationError(
                "This method can only be called on an invoice with type 'recurring' (template)."
            )
        if not self.next_invoice_date:
            raise ValidationError(
                "next_invoice_date must be set for recurring invoice templates."
            )

        new_invoice_date = self._next_recurrence_date()
        if not new_invoice_date:
            raise ValidationError(
                f"Invalid frequency '{self.frequency}' for recurring invoice."
            )

        new_invoice = Invoice.objects.create(
            invoice_type="fiscal",
            customer=self.customer,
            currency=self.currency,
            created_by=self.created_by,
            sale_date=new_invoice_date,
            status="pending",
            discount=self.discount,
            is_recurring=True,
            original_invoice=self,
        )

        for line_item_template in self.line_items.all():
            TransactionLineItem.objects.create(
                parent_document=new_invoice,
                sales_item=line_item_template.sales_item,
                created_by=new_invoice.created_by,
                quantity=line_item_template.quantity,
                unit_price=line_item_template.unit_price,
                vat_amount=line_item_template.vat_amount,
                total_price=line_item_template.total_price,
            )
        self.next_invoice_date = new_invoice_date
        self.save()

        return new_invoice

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
        customer_id_str = self.lease.get_tenant_names() or "No Customer"
        return f"{self.invoice_type.title()} {self.document_number} - {customer_id_str}"


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
        Company, on_delete=models.SET_NULL, null=True, blank=True
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
    credit_date = models.DateField(default=now)
    document_number = models.CharField(
        max_length=20, unique=True, default=generate_credit_note_document_number
    )
    is_individual = models.BooleanField(default=True)
    individual = models.ForeignKey(
        Individual, on_delete=models.SET_NULL, null=True, blank=True
    )
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, null=True, blank=True
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    description = models.TextField(blank=True, null=True)
    line_items = GenericRelation(
        "TransactionLineItem", related_query_name="creditnotes"
    )

    def save(self, *args, **kwargs):
        # Ensure document_number is generated only once if not set already
        if not self.pk and not self.document_number:
            self.document_number = generate_credit_note_document_number()

        # Ensure that only one of individual or company is set
        if self.individual and self.company:
            raise ValidationError(
                "A credit note cannot be linked to both an individual and a company."
            )
        elif self.individual:
            self.is_individual = True
        elif self.company:
            self.is_individual = False
        self.total_amount = self.total_amount.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        customer_id_str = ""
        if self.is_individual and self.individual:
            customer_id_str = (
                f"Individual: {self.individual.firstname} {self.individual.surname}"
            )
        elif not self.is_individual and self.company:
            customer_id_str = f"Company: {self.company.registration_name}"
        else:
            customer_id_str = "N/A"  # Changed to N/A for consistency
        return f"Credit Note {self.document_number} for {customer_id_str}"

    class Meta:
        app_label = "accounting"
        verbose_name = _("Credit Note")
        verbose_name_plural = _("Credit Notes")


# The old InvoiceItem is now TransactionLineItem
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
        if (
            self.quantity is not None
            and self.unit_price is not None
            and self.vat_amount is not None
        ):
            calculated_total_price = (self.quantity * self.unit_price) + self.vat_amount
            self.total_price = calculated_total_price.quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
        super().save(*args, **kwargs)

    def __str__(self):
        parent_type_name = self.content_type.model.replace("_", " ").title()
        parent_display_id = getattr(
            self.parent_document, "document_number", str(self.object_id)
        )
        return f"{parent_type_name} {parent_display_id} - {self.sales_item.name} (Qty: {self.quantity})"


class PaymentMethod(BaseModel):
    payment_method_name = models.CharField(max_length=255)
    currency = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        app_label = "accounting"
        verbose_name = _("payment method")
        verbose_name_plural = _("payment methods")

    def __str__(self):
        return self.payment_method_name

    class Meta:
        app_label = "accounting"
        verbose_name = _("Payment Method")
        verbose_name_plural = _("Payment Methods")


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

    class Meta:
        app_label = "accounting"
        verbose_name = _("Cash Book")
        verbose_name_plural = _("Cash Books")
