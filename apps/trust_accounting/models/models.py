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
from django.db.models import Sum
from django.db.models import F, Sum, Q, CheckConstraint
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.utils.timezone import now, localdate
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from apps.common.models.base_models import BaseModel, BaseModelWithUser
from apps.leases.models.landlord import Landlord
from apps.leases.models.models import LeaseTenant
from apps.properties.models.models import Property

User = get_user_model()


# ==================== ACCOUNTING PERIODS ====================


class TrustFinancialYear(BaseModel):
    """Represents a financial year for accounting periods"""

    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    closed_at = models.DateTimeField(null=True, blank=True)
    closed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trust_closed_financial_years",
    )

    class Meta:
        verbose_name = _("Financial Year")
        verbose_name_plural = _("Financial Years")
        ordering = ["-start_date"]
        constraints = [
            CheckConstraint(
                check=Q(end_date__gt=F("start_date")),
                name="trust_end_date_after_start_date",
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")

        # Check for overlapping financial years
        overlapping = TrustFinancialYear.objects.filter(
            Q(start_date__lte=self.end_date) & Q(end_date__gte=self.start_date)
        ).exclude(pk=self.pk)

        if overlapping.exists():
            raise ValidationError("Financial years cannot overlap")

    @property
    def is_current(self):
        today = timezone.now().date()
        return self.start_date <= today <= self.end_date and self.is_active


class TrustAccountingPeriod(BaseModel):
    """Monthly accounting periods within a financial year"""

    financial_year = models.ForeignKey(
        TrustFinancialYear, on_delete=models.CASCADE, related_name="periods"
    )
    name = models.CharField(max_length=50)
    period_number = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(13)]
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_open = models.BooleanField(default=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    closed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trust_closed_periods",
    )

    class Meta:
        verbose_name = _("Accounting Period")
        verbose_name_plural = _("Accounting Periods")
        ordering = ["financial_year", "period_number"]
        unique_together = ["financial_year", "period_number"]
        constraints = [
            CheckConstraint(
                check=Q(end_date__gt=F("start_date")),
                name="trust_period_end_date_after_start_date",
            )
        ]

    def __str__(self):
        return f"{self.financial_year.name} - {self.name}"

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("Period end date must be after start date")

        if (
            not self.financial_year.start_date
            <= self.start_date
            <= self.financial_year.end_date
        ):
            raise ValidationError("Period must be within financial year dates")

        if (
            not self.financial_year.start_date
            <= self.end_date
            <= self.financial_year.end_date
        ):
            raise ValidationError("Period must be within financial year dates")

    @property
    def is_current(self):
        today = timezone.now().date()
        return self.start_date <= today <= self.end_date and self.is_open


# =================== CURRENCY AND EXCHANGE RATES ====================


class TrustCurrency(BaseModel):
    """Currency master data for Trust Accounting"""

    currency_code = models.CharField(max_length=3, unique=True)
    currency_name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_base_currency = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Trust Currency")
        verbose_name_plural = _("Trust Currencies")
        ordering = ["currency_code"]

    def __str__(self):
        return f"{self.currency_code} - {self.currency_name}"

    def clean(self):
        if self.is_base_currency:
            # Ensure only one base currency
            existing_base = TrustCurrency.objects.filter(is_base_currency=True).exclude(
                pk=self.pk
            )
            if existing_base.exists():
                raise ValidationError("There can only be one base currency")

    def save(self, *args, **kwargs):
        if self.is_base_currency:
            # Set all other currencies to not base
            TrustCurrency.objects.filter(is_base_currency=True).exclude(
                pk=self.pk
            ).update(is_base_currency=False)
        super().save(*args, **kwargs)


class TrustExchangeRate(BaseModelWithUser):
    """Currency exchange rates for Trust Accounting"""

    base_currency = models.ForeignKey(
        TrustCurrency, on_delete=models.CASCADE, related_name="trust_base_rates"
    )
    target_currency = models.ForeignKey(
        TrustCurrency, on_delete=models.CASCADE, related_name="trust_target_rates"
    )
    rate = models.DecimalField(max_digits=10, decimal_places=6)
    effective_date = models.DateField(default=localdate)
    source = models.CharField(max_length=255, default="Currency Settings")
    is_active = models.BooleanField(default=True)

    class Meta:
        """Class meta information for TrustExchangeRate model"""

        verbose_name = _("Trust Exchange Rate")
        verbose_name_plural = _("Trust Exchange Rates")
        ordering = ["-effective_date", "base_currency", "target_currency"]

    def __str__(self):
        return f"{self.base_currency.currency_code}/{self.target_currency.currency_code}: {self.rate}"


# ====================  ACCOUNT TYPES AND SUBTYPES ====================
class TrustAccountType(BaseModelWithUser):
    """Standard accounting account types for Trust Accounting (Assets, Liabilities, Equity, Revenue, Expenses)"""

    TYPE_CHOICES = [
        ("asset", _("Asset")),
        ("liability", _("Liability")),
        ("equity", _("Equity")),
        ("revenue", _("Revenue")),
        ("expense", _("Expense")),
        ("contra_asset", _("Contra Asset")),
        ("contra_liability", _("Contra Liability")),
        ("contra_equity", _("Contra Equity")),
        ("other", _("Other")),
    ]
    code = models.CharField(max_length=20, null=True)
    name = models.CharField(max_length=100)
    account_type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, default="other"
    )
    normal_balance = models.CharField(
        max_length=10,
        choices=[("debit", "Debit"), ("credit", "Credit")],
        blank=True,
        null=True,
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Trust Account Type")
        verbose_name_plural = _("Trust Account Types")
        ordering = ["account_type", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_account_type_display()})"

    def get_account_type_display(self):
        return self.account_type


class TrustAccountSubType(BaseModelWithUser):
    """More specific account categorization for Trust Accounting"""

    account_type = models.ForeignKey(
        TrustAccountType, on_delete=models.CASCADE, related_name="trust_subtypes"
    )
    name = models.CharField(max_length=100)
    code_prefix = models.CharField(max_length=10)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Trust Account Subtype")
        verbose_name_plural = _("Trust Account Subtypes")
        ordering = ["account_type", "code_prefix"]

    def __str__(self):
        return f"{self.name} ({self.code_prefix})"


# ==================== ACCOUNTING GENERAL LEDGERS ====================


class TrustGeneralLedgerAccount(BaseModelWithUser):
    """Chart of Accounts - Main ledger accounts for Trust Accounting"""

    ACCOUNT_CLASS_CHOICES = [
        ("balance_sheet", _("Balance Sheet")),
        ("income_statement", _("Income Statement")),
    ]

    account_number = models.CharField(max_length=10)
    account_name = models.CharField(max_length=255)
    account_type = models.ForeignKey(
        "TrustAccountType",
        on_delete=models.PROTECT,
        related_name="trust_gl_accounts",
        blank=True,
        null=True,
    )
    account_subtype = models.ForeignKey(
        TrustAccountSubType,
        on_delete=models.PROTECT,
        related_name="trust_accounts",
        null=True,
        blank=True,
    )
    parent_account = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="trust_sub_accounts",
    )
    account_class = models.CharField(
        max_length=20, choices=ACCOUNT_CLASS_CHOICES, default="balance_sheet"
    )
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_contra_account = models.BooleanField(default=False)
    is_system_account = models.BooleanField(default=False)
    requires_cost_center = models.BooleanField(default=False)
    requires_tax = models.BooleanField(default=False)

    # Balance tracking
    opening_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    opening_balance_date = models.DateField(default=now)
    current_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    balance_last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Trust General Ledger Account")
        verbose_name_plural = _("Trust General Ledger Accounts")
        ordering = ["account_number"]
        indexes = [
            models.Index(fields=["account_number"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"

    def clean(self):
        if self.parent_account and self.parent_account == self:
            raise ValidationError("Account cannot be its own parent")

        if self.parent_account and not self.parent_account.is_active:
            raise ValidationError("Parent account must be active")

        # Validate account number format
        if not self.account_number.isdigit():
            raise ValidationError("Account number must contain only digits")

    def save(self, *args, **kwargs):
        # Determine account class based on account type
        if self.account_type.account_type in [
            "asset",
            "liability",
            "equity",
            "contra_asset",
            "contra_liability",
            "contra_equity",
        ]:
            self.account_class = "balance_sheet"
        else:
            self.account_class = "income_statement"

        super().save(*args, **kwargs)

    def get_balance(self, as_of_date=None, include_children=True):
        """
        Calculate current balance for the account
        """
        if not as_of_date:
            as_of_date = timezone.now().date()

        # Base query for transactions
        transactions = LedgerTransaction.objects.filter(
            account=self,
            journal_entry__entry_date__lte=as_of_date,
            journal_entry__is_posted=True,
        )

        # Calculate net amount based on normal balance
        if self.account_type.normal_balance == "debit":
            debit_total = transactions.aggregate(total=Sum("debit_amount"))[
                "total"
            ] or Decimal("0.00")
            credit_total = transactions.aggregate(total=Sum("credit_amount"))[
                "total"
            ] or Decimal("0.00")
            net_balance = debit_total - credit_total
        else:
            debit_total = transactions.aggregate(total=Sum("debit_amount"))[
                "total"
            ] or Decimal("0.00")
            credit_total = transactions.aggregate(total=Sum("credit_amount"))[
                "total"
            ] or Decimal("0.00")
            net_balance = credit_total - debit_total

        # Add opening balance
        net_balance += self.opening_balance

        # Include sub-accounts if requested
        # if include_children and self.sub_accounts.exists():
        #     for sub_account in self.sub_accounts.filter(is_active=True):
        #         net_balance += sub_account.get_balance(
        #             as_of_date, include_children=True
        #         )

        return net_balance

    def update_balance(self):
        """Update the current balance field"""
        self.current_balance = self.get_balance()
        self.save(update_fields=["current_balance", "balance_last_updated"])

    @property
    def full_account_name(self):
        if self.parent_account:
            return f"{self.parent_account.account_name} › {self.account_name}"
        return self.account_name

    @property
    def is_debit_balance(self):
        return self.account_type.normal_balance == "debit"

    @property
    def is_credit_balance(self):
        return self.account_type.normal_balance == "credit"


# ==================== TRUST LEDGERS ====================


class TrustGeneralLedger(BaseModelWithUser):
    """
    General Ledger Account for Trust Accounting.

    This is the master ledger account that tracks all trust transactions
    at a high level, providing summary balances and audit trails.
    Similar to TrustGeneralLedgerAccount but specifically for trust accounting.
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
        TrustAccountType,
        on_delete=models.PROTECT,
        related_name="trust_gl_ledger_accounts",
        blank=True,
        null=True,
    )
    account_subtype = models.ForeignKey(
        TrustAccountSubType,
        on_delete=models.PROTECT,
        related_name="trust_gl_ledger_sub_accounts",
        null=True,
        blank=True,
    )
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_contra_account = models.BooleanField(default=False)
    is_system_account = models.BooleanField(default=False)
    requires_cost_center = models.BooleanField(default=False)

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


# ==================== TAX CONFIGURATION ====================


class TrustTaxType(BaseModelWithUser):
    """Different types of taxes for Trust Accounting (VAT, Sales Tax, etc.)"""

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("100.00")),
        ],
        blank=True,
        null=True,
    )
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    # GL Accounts
    payable_account = models.ForeignKey(
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "liability"},
        related_name="trust_tax_payable_types",
        blank=True,
        null=True,
    )
    receivable_account = models.ForeignKey(
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "asset"},
        related_name="trust_tax_receivable_types",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _("Trust Tax Type")
        verbose_name_plural = _("Trust Tax Types")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.rate}%"


# ==================== PROPERTY EXPENSE ACCOUNTS ====================


class TrustPropertyExpense(BaseModelWithUser):
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
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        related_name="trust_property_expenses",
        limit_choices_to={"account_type__account_type": "expense"},
        help_text=_("GL account for property-related expenses"),
    )

    class Meta:
        """Class meta for TrustPropertyExpenses"""

        verbose_name = _("Trust Property Expense Account")
        verbose_name_plural = _("Trust Property Expense Accounts")
        ordering = ["expense"]

    def __str__(self):
        return f"{self.expense} - {self.expense_account.account_name}"


# ==================== PRODUCT/SERVICE CATALOG ====================


class TrustSalesCategory(BaseModelWithUser):
    """Categories for sales items in Trust Accounting"""

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    parent_category = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="trust_subcategories",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        """Class meta data"""

        verbose_name = _("Trust Sales Category")
        verbose_name_plural = _("Trust Sales Categories")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class TrustSalesItem(BaseModelWithUser):
    """Products or services for sale in Trust Accounting"""

    item_code = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        TrustSalesCategory, on_delete=models.PROTECT, related_name="trust_items"
    )

    # Pricing
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.ForeignKey("TrustCurrency", on_delete=models.PROTECT, default=1)
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    # Accounting
    income_account = models.ForeignKey(
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "revenue"},
        blank=True,
        null=True,
        related_name="trust_sales_items",
    )
    cost_of_sales_account = models.ForeignKey(
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "expense"},
        related_name="trust_cost_sales_items",
        null=True,
        blank=True,
    )
    inventory_account = models.ForeignKey(
        TrustGeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "asset"},
        related_name="trust_inventory_items",
        null=True,
        blank=True,
    )

    # Tax
    tax_type = models.ForeignKey(
        TrustTaxType, on_delete=models.PROTECT, null=True, blank=True
    )

    # Inventory tracking
    track_inventory = models.BooleanField(default=False)
    current_stock = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    minimum_stock = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )

    # Status
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Trust Sales Item")
        verbose_name_plural = _("Trust Sales Items")
        ordering = ["item_code"]
        indexes = [
            models.Index(fields=["item_code"]),
            models.Index(fields=["category"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.item_code} - {self.name}"

    @property
    def price_including_tax(self):
        if self.tax_type and self.tax_type.rate is not None:
            price = self.unit_price * (1 + self.tax_type.rate / Decimal("100.00"))
            return price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
        return self.unit_price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

    @property
    def vat_price(self):
        if self.tax_type and self.tax_type.rate is not None:
            tax_amount = (
                self.unit_price * self.tax_type.rate / Decimal("100.00")
            ).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
            return tax_amount
        return Decimal("0.00")

    def save(self, *args, **kwargs):
        if not self.item_code:
            last_item = (
                TrustSalesItem.objects.filter(created_by__client=self.created_by.client)
                .order_by("-id")
                .first()
            )
            if last_item and last_item.item_code.startswith("ITEM"):
                try:
                    last_number = int(last_item.item_code[4:])
                    new_number = last_number + 1
                except ValueError:
                    new_number = 1
            else:
                new_number = 1
            self.item_code = f"ITEM{new_number:06d}"

        super().save(*args, **kwargs)


# ==================== JOURNAL ENTRIES AND TRANSACTIONS ====================


class TrustJournalEntry(BaseModelWithUser):
    """Main journal entry model following double-entry accounting"""

    ENTRY_TYPES = [
        ("general", _("General Journal")),
        ("sales", _("Sales Journal")),
        ("purchase", _("Purchase Journal")),
        ("cash_receipts", _("Cash Receipts Journal")),
        ("cash_disbursements", _("Cash Disbursements Journal")),
        ("adjusting", _("Adjusting Entry")),
        ("closing", _("Closing Entry")),
        ("reversing", _("Reversing Entry")),
    ]

    entry_number = models.CharField(
        max_length=20, unique=True, editable=False, blank=True, null=True
    )
    entry_date = models.DateField(default=now)
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPES, default="general")
    accounting_period = models.ForeignKey(
        TrustAccountingPeriod,
        on_delete=models.PROTECT,
        related_name="journal_entries",
        blank=True,
        null=True,
    )
    description = models.TextField()
    reference = models.CharField(max_length=255, blank=True, null=True)
    source_document = models.CharField(max_length=255, blank=True, null=True)

    # Status fields
    is_posted = models.BooleanField(default=False)
    posted_date = models.DateTimeField(null=True, blank=True)
    is_reversed = models.BooleanField(default=False)
    reversal_entry = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reversed_entries",
    )

    # Totals
    total_debit = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    total_credit = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )

    # Audit fields
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trust_reviewed_entries",
    )
    reviewed_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="trust_approved_entries",
    )
    approved_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Journal Entry")
        verbose_name_plural = _("Journal Entries")
        ordering = ["-entry_date", "-id"]
        indexes = [
            models.Index(fields=["entry_date"]),
            models.Index(fields=["entry_type"]),
            models.Index(fields=["is_posted"]),
        ]

    def __str__(self):
        return f"JE{self.entry_number} - {self.entry_date}"

    def clean(self):
        if self.entry_date:
            # Validate entry date is within accounting period
            if not (
                self.accounting_period.start_date
                <= self.entry_date
                <= self.accounting_period.end_date
            ):
                raise ValidationError("Entry date must be within the accounting period")

            # Validate accounting period is open
            if not self.accounting_period.is_open:
                raise ValidationError(
                    "Cannot add entries to a closed accounting period"
                )

    def save(self, *args, **kwargs):
        if not self.entry_number:
            # Generate sequential entry number
            last_entry = (
                TrustJournalEntry.objects.filter(entry_date__year=self.entry_date.year)
                .order_by("-id")
                .first()
            )

            if last_entry and last_entry.entry_number:
                try:
                    last_number = int(last_entry.entry_number[2:])  # Remove 'JE' prefix
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.entry_number = f"JE{new_number:06d}"

        # Auto-set accounting period based on entry date
        if self.entry_date and not self.accounting_period_id:
            try:
                period = TrustAccountingPeriod.objects.get(
                    start_date__lte=self.entry_date,
                    end_date__gte=self.entry_date,
                    is_open=True,
                )
                self.accounting_period = period
            except TrustAccountingPeriod.DoesNotExist:
                raise ValidationError(
                    "No open accounting period found for the entry date"
                )

        # Set posted date when marking as posted
        if self.is_posted and not self.posted_date:
            self.posted_date = timezone.now()

        super().save(*args, **kwargs)

    def update_totals(self):
        """Update debit and credit totals"""
        aggregates = self.transactions.aggregate(
            total_debit=Sum("debit_amount"), total_credit=Sum("credit_amount")
        )
        self.total_debit = aggregates["total_debit"] or Decimal("0.00")
        self.total_credit = aggregates["total_credit"] or Decimal("0.00")
        self.save(update_fields=["total_debit", "total_credit"])

    def post_entry(self, user=None):
        """Post the journal entry"""
        if self.is_posted:
            raise ValidationError("Journal entry is already posted")

        # Validate double-entry principle
        if self.total_debit != self.total_credit:
            raise ValidationError("Debits must equal credits for posting")

        if self.transactions.count() < 2:
            raise ValidationError("Journal entry must have at least two transactions")

        with transaction.atomic():
            self.is_posted = True
            self.posted_date = timezone.now()
            if user:
                self.approved_by = user
                self.approved_date = timezone.now()
            self.save()

            # Update account balances
            for ledger_transaction in self.transactions.all():
                ledger_transaction.account.update_balance()

    def create_reversal(self, reversal_date=None, description=None):
        """Create a reversing entry"""
        if not self.is_posted:
            raise ValidationError("Can only reverse posted entries")

        if self.is_reversed:
            raise ValidationError("Entry has already been reversed")

        reversal_date = reversal_date or timezone.now().date()
        reversal_description = description or f"Reversal of {self.entry_number}"

        with transaction.atomic():
            reversal_entry = TrustJournalEntry.objects.create(
                entry_date=reversal_date,
                entry_type="reversing",
                accounting_period=self.accounting_period,
                description=reversal_description,
                reference=f"REV-{self.entry_number}",
                created_by=self.created_by,
            )

            # Create reversed transactions
            for original_transaction in self.transactions.all():
                TrustLedgerTransaction.objects.create(
                    journal_entry=reversal_entry,
                    account=original_transaction.account,
                    debit_amount=original_transaction.credit_amount,  # Swap debits and credits
                    credit_amount=original_transaction.debit_amount,
                    description=f"Reversal: {original_transaction.description}",
                    cost_center=original_transaction.cost_center,
                    reference=original_transaction.reference,
                )

            reversal_entry.update_totals()
            reversal_entry.post_entry()

            # Mark original as reversed
            self.is_reversed = True
            self.reversal_entry = reversal_entry
            self.save()

        return reversal_entry


class TrustLedgerTransaction(BaseModel):
    """Individual transactions within a journal entry"""

    journal_entry = models.ForeignKey(
        TrustJournalEntry,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="transactions",
    )
    account = models.ForeignKey(
        TrustGeneralLedgerAccount, on_delete=models.PROTECT, related_name="transactions"
    )
    debit_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    credit_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    description = models.TextField(blank=True, null=True)

    reference = models.CharField(max_length=255, blank=True, null=True)
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

    # For tracking specific business transactions
    content_type = models.ForeignKey(
        ContentType, on_delete=models.SET_NULL, null=True, blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    source_transaction = GenericForeignKey("content_type", "object_id")

    class Meta:
        verbose_name = _("Trust Ledger Transaction")
        verbose_name_plural = _("Trust Ledger Transactions")
        ordering = ["journal_entry__entry_date", "id"]
        indexes = [
            models.Index(fields=["account", "journal_entry"]),
        ]

    def __str__(self):
        return f"{self.account.account_number} - D: {self.debit_amount} C: {self.credit_amount}"

    def clean(self):
        # Validate either debit or credit, but not both
        if self.debit_amount and self.credit_amount:
            raise ValidationError(
                "Transaction cannot have both debit and credit amounts"
            )

        if not self.debit_amount and not self.credit_amount:
            raise ValidationError("Transaction must have either debit or credit amount")

        # Validate account is active
        if not self.account.is_active:
            raise ValidationError("Cannot post to inactive account")

        # Validate cost center if required
        if self.account.requires_cost_center and not self.cost_center:
            raise ValidationError("Cost center is required for this account")

    def save(self, *args, **kwargs):
        # Auto-calculate tax amount if tax rate is provided
        if self.tax_rate and (self.debit_amount or self.credit_amount):
            base_amount = self.debit_amount or self.credit_amount
            self.tax_amount = (
                base_amount * self.tax_rate / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        super().save(*args, **kwargs)


# ==================== TRUST INVOICES ====================


class InvoiceType(BaseModelWithUser):
    """
    Types of Trust Invoices.

    This model defines various types of trust-related invoices
    that can be issued to beneficiaries (landlords, property owners).
    """

    code = models.CharField(
        max_length=20,
        unique=True,
        help_text=_("Unique code for the invoice type"),
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        """Class meta for InvoiceType"""

        verbose_name = _("Invoice Type")
        verbose_name_plural = _("Invoice Types")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class TrustInvoice(BaseModelWithUser):
    """
    Used for:
    - Management fees
    - Commission charges
    - Expense recoveries
    - Other trust-related charges
    """

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
    invoice_type = models.ForeignKey(
        InvoiceType,
        on_delete=models.PROTECT,
        related_name="trust_invoices",
        help_text=_("Type of the trust invoice"),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    # Beneficiary (Landlord/Property Owner)
    landlord = models.ForeignKey(
        Landlord,
        on_delete=models.PROTECT,
        related_name="trust_invoices",
        help_text=_("The landlord or beneficiary being invoiced"),
        null=True,
        blank=True,
    )
    tenant = models.ForeignKey(
        LeaseTenant,
        on_delete=models.PROTECT,
        related_name="trust_invoices",
        help_text=_("The tenant associated with this invoice"),
        null=True,
        blank=True,
    )

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
        TrustCurrency, on_delete=models.PROTECT, related_name="trust_invoices"
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
        TrustJournalEntry,
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
        if self.tenant:
            return f"Trust Invoice {self.invoice_number} - {self.tenant.display_name}"
        elif self.landlord:
            return f"Trust Invoice {self.invoice_number} - {self.landlord}"
        return f"Trust Invoice {self.invoice_number}"

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

        self.subtotal = sum(item.total_price for item in line_items)

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
        self.tax_total = sum(item.vat_amount for item in line_items)

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
        # :TODO Create A new Model for Trust Journal Entries
        with transaction.atomic():
            # Create journal entry
            journal_entry = TrustJournalEntry.objects.create(
                entry_date=self.invoice_date,
                entry_type="sales",
                description=f"Trust Invoice {self.invoice_number} - {self.tenant.display_name}",
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
    sales_item = models.ForeignKey(TrustSalesItem, on_delete=models.PROTECT)
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
        unique_together = ("invoice", "sales_item")
        verbose_name = "Trust Invoice Line Item"
        verbose_name_plural = "Trust Invoice Line Items"

    def save(self, *args, **kwargs):
        # Calculate total_price if not provided or if recalculated
        unit_price = self.unit_price or self.sales_item.unit_price

        if self.sales_item.tax_type and self.sales_item.tax_type.is_active:
            try:
                vat_rate = self.sales_item.tax_type.rate / Decimal("100.00")
            except Exception:
                vat_rate = Decimal("0.00")
        else:
            vat_rate = Decimal("0.00")

        vat_amount = vat_rate.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

        if self.quantity is not None:
            calculated_total_price = self.quantity * (
                unit_price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
                + vat_amount
            )
            self.total_price = calculated_total_price.quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
        self.unit_price = unit_price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
        self.vat_amount = vat_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_reference()} - {self.sales_item.name} (Qty: {self.quantity})"

    def invoice_reference(self):
        """Get invoice reference number"""
        return self.invoice.invoice_number

    @property
    def total_vat(self):
        """Calculate total VAT for the line item."""
        return self.vat_amount * self.quantity

    @property
    def total_price_excluding_vat(self):
        """Calculate total price excluding VAT for the line item."""
        return self.unit_price * self.quantity

    @property
    def total_including_vat(self):
        """Calculate total price including VAT for the line item."""
        return (self.unit_price + self.vat_amount) * self.quantity
