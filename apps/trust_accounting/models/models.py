"""
Trust Accounting Models for RentSafe

Key Principles:
- Separation of Trust Money from Business Money (fiduciary duty)
- Complete audit trail for all trust transactions
- Mandatory reconciliation requirements
- Interest management for trust funds
- Proper beneficiary tracking
"""

from decimal import Decimal, ROUND_HALF_UP
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import localdate
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from apps.common.models.base_models import BaseModel, BaseModelWithUser
from apps.accounting.models.models import (
    AccountSubType,
    AccountType,
    Currency,
    GeneralLedgerAccount,
    JournalEntry,
)
from apps.leases.models.landlord import Landlord
from apps.leases.models.models import LeaseTenant
from apps.properties.models.models import Property

User = get_user_model()


# ==================== TRUST LEDGERS (Per-Beneficiary Tracking) ====================


class TrustGeneralLedger(BaseModelWithUser):
    """
    General Ledger Account for Trust Accounting.

    This is the master ledger account that tracks all trust transactions
    at a high level, providing summary balances and audit trails.
    Similar to GeneralLedgerAccount but specifically for trust accounting.
    """

    ENTRY_TYPE_CHOICES = [
        ("receipt", _("Receipt")),
        ("disbursement", _("Disbursement")),
        ("transfer", _("Transfer")),
        ("interest", _("Interest")),
        ("adjustment", _("Adjustment")),
        ("opening_balance", _("Opening Balance")),
    ]

    # Account identification
    account_number = models.CharField(
        max_length=20,
        unique=True,
        help_text=_("Unique code for the trust GL account"),
    )
    account_name = models.CharField(max_length=255)
    account_type = models.ForeignKey(
        AccountType,
        on_delete=models.PROTECT,
        related_name="trust_gl_accounts",
        blank=True,
        null=True,
    )
    account_subtype = models.ForeignKey(
        AccountSubType,
        on_delete=models.PROTECT,
        related_name="trust_gl_sub_accounts",
        null=True,
        blank=True,
    )
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_contra_account = models.BooleanField(default=False)
    is_system_account = models.BooleanField(default=False)
    requires_cost_center = models.BooleanField(default=False)
    # Currency

    # Notes
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Trust General Ledger")
        verbose_name_plural = _("Trust General Ledger")
        ordering = ["account_number", "account_name"]
        indexes = [
            models.Index(fields=["account_number"]),
            models.Index(fields=["account_name"]),
        ]

    def __str__(self):
        return f"{self.account_number} - {self.account_name} - {self.account_type.account_type}"


# ==================== PROPERTY EXPENSE ACCOUNTS ====================


class PropertyExpense(BaseModelWithUser):
    """
    Property Expense Accounts linked to Trust Accounting.

    This model tracks expenses related to properties held in trust,
    ensuring proper allocation and reconciliation of costs.
    """

    expense = models.CharField(
        max_length=255,
        help_text=_("Name of the property-related expense"),
    )
    expense_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        related_name="property_expenses",
        limit_choices_to={"account_type__account_type": "expense"},
        help_text=_("GL account for property-related expenses"),
    )

    class Meta:
        """Class meta for PropertyExpenses"""

        verbose_name = _("Property Expense Account")
        verbose_name_plural = _("Property Expense Accounts")
        ordering = ["expense"]

    def __str__(self):
        return f"{self.expense} - {self.expense_account.account_name}"


# ==================== TRUST INVOICES ====================


class TrustInvoice(BaseModelWithUser):
    """
    Used for:
    - Management fees
    - Commission charges
    - Expense recoveries
    - Other trust-related charges
    """

    INVOICE_TYPES = [
        ("management_fee", _("Management Fee Invoice")),
        ("commission", _("Commission Invoice")),
        ("expense_recovery", _("Expense Recovery Invoice")),
        ("maintenance", _("Maintenance Invoice")),
        ("other", _("Other Invoice")),
    ]

    STATUS_CHOICES = [
        ("draft", _("Draft")),
        ("pending", _("Pending")),
        ("approved", _("Approved")),
        ("paid", _("Paid")),
        ("partially_paid", _("Partially Paid")),
        ("overdue", _("Overdue")),
        ("cancelled", _("Cancelled")),
        ("written_off", _("Written Off")),
    ]

    # Core fields
    invoice_number = models.CharField(
        max_length=30, unique=True, editable=False, blank=True
    )
    invoice_type = models.CharField(
        max_length=30, choices=INVOICE_TYPES, default="management_fee"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    # Beneficiary (Landlord/Property Owner)
    landlord = models.ForeignKey(
        Landlord,
        on_delete=models.PROTECT,
        related_name="trust_invoices",
        help_text=_("The landlord or beneficiary being invoiced"),
    )
    tenant = models.ForeignKey(
        LeaseTenant,
        on_delete=models.PROTECT,
        related_name="trust_invoices",
        help_text=_("The tenant associated with this invoice"),
    )

    # Trust Bank Account for payment
    # trust_bank_account = models.ForeignKey(
    #     TrustBankAccount,
    #     on_delete=models.PROTECT,
    #     related_name="trust_invoices",
    #     null=True,
    #     blank=True,
    # )

    # Property reference (optional)
    property_reference = models.ForeignKey(
        Property,
        on_delete=models.PROTECT,
        help_text=_("Property or lease reference for this invoice"),
    )

    # Dates
    invoice_date = models.DateField(default=localdate)
    due_date = models.DateField(null=True, blank=True)
    posted_date = models.DateTimeField(null=True, blank=True)

    # Billing period
    period_from = models.DateField(
        null=True, blank=True, help_text=_("Start of billing period")
    )
    period_to = models.DateField(
        null=True, blank=True, help_text=_("End of billing period")
    )

    # Financial details
    currency = models.ForeignKey(
        Currency, on_delete=models.PROTECT, related_name="trust_invoices"
    )
    exchange_rate = models.DecimalField(
        max_digits=10, decimal_places=6, default=Decimal("1.00")
    )
    discount_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("100.00")),
        ],
    )

    # Totals
    subtotal = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    tax_total = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    total_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    amount_paid = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    balance_due = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )

    # Journal entry link
    journal_entry = models.OneToOneField(
        JournalEntry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trust_invoice",
    )

    # Trust transaction link (for payment deduction)
    # trust_transaction = models.ForeignKey(
    #     TrustTransaction,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="trust_invoices",
    #     help_text=_("Trust transaction for invoice payment/deduction"),
    # )

    # Additional fields
    terms = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)

    # Approval workflow
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_trust_invoices",
    )
    approved_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Trust Invoice")
        verbose_name_plural = _("Trust Invoices")
        ordering = ["-invoice_date", "-invoice_number"]
        indexes = [
            models.Index(fields=["invoice_number"]),
            models.Index(fields=["tenant", "invoice_date"]),
            models.Index(fields=["status"]),
            models.Index(fields=["invoice_type"]),
        ]

    def __str__(self):
        return f"Trust Invoice {self.invoice_number} - {self.tenant.display_name}"

    def clean(self):
        if self.due_date and self.invoice_date and self.due_date < self.invoice_date:
            raise ValidationError(_("Due date cannot be before invoice date"))
        if self.period_from and self.period_to and self.period_from > self.period_to:
            raise ValidationError(_("Period from cannot be after period to"))

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            today = self.invoice_date or localdate()
            year = today.year

            last_invoice = (
                TrustInvoice.objects.filter(invoice_number__startswith=f"TINV-{year}")
                .order_by("-id")
                .first()
            )

            if last_invoice:
                try:
                    last_number = int(last_invoice.invoice_number.split("-")[-1])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.invoice_number = f"TINV-{year}-{new_number:06d}"

        # Calculate due date if not set (default 30 days)
        if not self.due_date and self.invoice_date:
            from dateutil.relativedelta import relativedelta

            self.due_date = self.invoice_date + relativedelta(days=30)

        # Update balance due
        self.balance_due = self.total_amount - self.amount_paid

        super().save(*args, **kwargs)

    def update_totals(self):
        """Update invoice totals from line items"""
        line_items = self.line_items.all()

        self.subtotal = sum(item.line_total for item in line_items)

        # Apply discount
        if self.discount_percentage > 0:
            discount_amount = (
                self.subtotal * self.discount_percentage / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            self.discount_amount = discount_amount
        else:
            self.discount_amount = self.discount_amount or Decimal("0.00")

        discounted_subtotal = self.subtotal - self.discount_amount

        # Calculate tax
        self.tax_total = sum(item.tax_amount for item in line_items)

        self.total_amount = discounted_subtotal + self.tax_total
        self.balance_due = self.total_amount - self.amount_paid

        self.save(
            update_fields=[
                "subtotal",
                "discount_amount",
                "tax_total",
                "total_amount",
                "balance_due",
            ]
        )

    def approve(self, user):
        """Approve the invoice"""
        if self.status != "pending":
            raise ValidationError(_("Only pending invoices can be approved"))

        self.status = "approved"
        self.approved_by = user
        self.approved_date = timezone.now()
        self.save()

    def post_to_ledger(self):
        """Create journal entry for the invoice"""
        if self.journal_entry:
            raise ValidationError(_("Invoice already posted to ledger"))

        if self.status not in ["pending", "approved"]:
            raise ValidationError(_("Only pending or approved invoices can be posted"))

        with transaction.atomic():
            # Create journal entry
            journal_entry = JournalEntry.objects.create(
                entry_date=self.invoice_date,
                entry_type="sales",
                description=f"Trust Invoice {self.invoice_number} - {self.beneficiary.display_name}",
                reference=self.invoice_number,
                created_by=self.created_by,
            )

            # Debit: Accounts Receivable / Beneficiary account
            # Credit: Income accounts (from line items)

            # For trust invoices, typically deduct from beneficiary's trust balance
            # This would need proper GL account configuration

            journal_entry.update_totals()

            self.journal_entry = journal_entry
            self.posted_date = timezone.now()
            self.save()

        return journal_entry

    @property
    def is_overdue(self):
        """Check if invoice is overdue"""
        if self.status in ["paid", "cancelled", "written_off"]:
            return False
        return (
            self.due_date
            and self.due_date < localdate()
            and self.balance_due > Decimal("0.00")
        )

    def apply_payment(self, amount, payment_date=None):
        """Apply payment to invoice"""
        if amount <= Decimal("0.00"):
            raise ValidationError(_("Payment amount must be positive"))

        if amount > self.balance_due:
            raise ValidationError(_("Payment amount exceeds balance due"))

        with transaction.atomic():
            self.amount_paid += amount
            self.balance_due = self.total_amount - self.amount_paid

            if self.balance_due == Decimal("0.00"):
                self.status = "paid"
            elif self.amount_paid > Decimal("0.00"):
                self.status = "partially_paid"

            self.save()

        return self.balance_due


class TrustInvoiceLineItem(BaseModel):
    """Line items for trust invoices"""

    invoice = models.ForeignKey(
        TrustInvoice, on_delete=models.CASCADE, related_name="line_items"
    )

    # Account for this line item
    trust_gl_account = models.ForeignKey(
        TrustGeneralLedger,
        on_delete=models.PROTECT,
        related_name="invoice_line_items",
        help_text=_("Trust GL account for this charge"),
    )

    # Description
    description = models.CharField(max_length=500)

    # Quantity and pricing
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    line_total = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )

    # Tax
    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("100.00")),
        ],
    )
    tax_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )

    # Property/Lease reference for this line item
    property_reference = models.CharField(max_length=255, blank=True, null=True)

    # Period for this charge
    period_from = models.DateField(null=True, blank=True)
    period_to = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = _("Trust Invoice Line Item")
        verbose_name_plural = _("Trust Invoice Line Items")
        ordering = ["id"]

    def __str__(self):
        return f"{self.description} - {self.line_total}"

    def save(self, *args, **kwargs):
        # Calculate line total
        self.line_total = (self.quantity * self.unit_price).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        # Calculate tax
        if self.tax_rate > 0:
            self.tax_amount = (
                self.line_total * self.tax_rate / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            self.tax_amount = Decimal("0.00")

        super().save(*args, **kwargs)

        # Update invoice totals
        if self.invoice_id:
            self.invoice.update_totals()
