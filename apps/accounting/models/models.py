from datetime import date
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models import F, Sum, Q, CheckConstraint
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from decimal import Decimal, ROUND_HALF_UP
from django.utils.timezone import now, localdate
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models.base_models import BaseModel, BaseModelWithUser
import uuid

User = get_user_model()

# ==================== CORE ACCOUNTING MODELS ====================


class FinancialYear(BaseModel):
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
        related_name="closed_financial_years",
    )

    class Meta:
        verbose_name = _("Financial Year")
        verbose_name_plural = _("Financial Years")
        ordering = ["-start_date"]
        constraints = [
            CheckConstraint(
                check=Q(end_date__gt=F("start_date")), name="end_date_after_start_date"
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")

        # Check for overlapping financial years
        overlapping = FinancialYear.objects.filter(
            Q(start_date__lte=self.end_date) & Q(end_date__gte=self.start_date)
        ).exclude(pk=self.pk)

        if overlapping.exists():
            raise ValidationError("Financial years cannot overlap")

    @property
    def is_current(self):
        today = timezone.now().date()
        return self.start_date <= today <= self.end_date and self.is_active


class AccountingPeriod(BaseModel):
    """Monthly accounting periods within a financial year"""

    financial_year = models.ForeignKey(
        FinancialYear, on_delete=models.CASCADE, related_name="periods"
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
        related_name="closed_periods",
    )

    class Meta:
        verbose_name = _("Accounting Period")
        verbose_name_plural = _("Accounting Periods")
        ordering = ["financial_year", "period_number"]
        unique_together = ["financial_year", "period_number"]
        constraints = [
            CheckConstraint(
                check=Q(end_date__gt=F("start_date")),
                name="period_end_date_after_start_date",
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


class AccountType(BaseModelWithUser):
    """Standard accounting account types (Assets, Liabilities, Equity, Revenue, Expenses)"""

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
        verbose_name = _("Account Type")
        verbose_name_plural = _("Account Types")
        ordering = ["account_type", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_account_type_display()})"


class AccountSubType(BaseModelWithUser):
    """More specific account categorization"""

    account_type = models.ForeignKey(
        AccountType, on_delete=models.CASCADE, related_name="subtypes"
    )
    name = models.CharField(max_length=100)
    code_prefix = models.CharField(max_length=10)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Account Subtype")
        verbose_name_plural = _("Account Subtypes")
        ordering = ["account_type", "code_prefix"]

    def __str__(self):
        return f"{self.name} ({self.code_prefix})"


class GeneralLedgerAccount(BaseModelWithUser):
    """Chart of Accounts - Main ledger accounts"""

    ACCOUNT_CLASS_CHOICES = [
        ("balance_sheet", _("Balance Sheet")),
        ("income_statement", _("Income Statement")),
    ]

    account_number = models.CharField(max_length=10)
    account_name = models.CharField(max_length=255)
    account_type = models.ForeignKey(
        "AccountType",
        on_delete=models.PROTECT,
        related_name="gl_accounts",
        blank=True,
        null=True,
    )
    account_subtype = models.ForeignKey(
        AccountSubType,
        on_delete=models.PROTECT,
        related_name="accounts",
        null=True,
        blank=True,
    )
    parent_account = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="sub_accounts",
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
        verbose_name = _("General Ledger Account")
        verbose_name_plural = _("General Ledger Accounts")
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
        if include_children and self.sub_accounts.exists():
            for sub_account in self.sub_accounts.filter(is_active=True):
                net_balance += sub_account.get_balance(
                    as_of_date, include_children=True
                )

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


class CostCenter(BaseModel):
    """Cost centers for departmental accounting"""

    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    parent_center = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="sub_centers",
    )
    is_active = models.BooleanField(default=True)
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_cost_centers",
    )

    class Meta:
        verbose_name = _("Cost Center")
        verbose_name_plural = _("Cost Centers")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class JournalEntry(BaseModelWithUser):
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
        AccountingPeriod,
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
        related_name="reviewed_entries",
    )
    reviewed_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_entries",
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
                JournalEntry.objects.filter(entry_date__year=self.entry_date.year)
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
                period = AccountingPeriod.objects.get(
                    start_date__lte=self.entry_date,
                    end_date__gte=self.entry_date,
                    is_open=True,
                )
                self.accounting_period = period
            except AccountingPeriod.DoesNotExist:
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
            reversal_entry = JournalEntry.objects.create(
                entry_date=reversal_date,
                entry_type="reversing",
                accounting_period=self.accounting_period,
                description=reversal_description,
                reference=f"REV-{self.entry_number}",
                created_by=self.created_by,
            )

            # Create reversed transactions
            for original_transaction in self.transactions.all():
                LedgerTransaction.objects.create(
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


class LedgerTransaction(BaseModel):
    """Individual transactions within a journal entry"""

    journal_entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="transactions",
    )
    account = models.ForeignKey(
        GeneralLedgerAccount, on_delete=models.PROTECT, related_name="transactions"
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
    cost_center = models.ForeignKey(
        CostCenter,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="transactions",
    )
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
        verbose_name = _("Ledger Transaction")
        verbose_name_plural = _("Ledger Transactions")
        ordering = ["journal_entry__entry_date", "id"]
        indexes = [
            models.Index(fields=["account", "journal_entry"]),
            models.Index(fields=["content_type", "object_id"]),
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


# ==================== SUBSIDIARY LEDGERS ====================


class Customer(BaseModelWithUser):
    """Customer master data for accounts receivable"""

    customer_code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    is_individual = models.BooleanField(default=True)
    individual = models.ForeignKey(
        "individuals.Individual", on_delete=models.SET_NULL, null=True, blank=True
    )
    company = models.ForeignKey(
        "companies.CompanyBranch", on_delete=models.SET_NULL, null=True, blank=True
    )

    # Accounting fields
    accounts_receivable_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={
            "account_type__account_type": "asset",
            "account_number__startswith": "11",
        },
        related_name="customer_accounts",
        blank=True,
        null=True,
    )
    credit_limit = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    payment_terms = models.PositiveIntegerField(
        default=30, help_text="Number of days for payment"
    )

    # Status
    is_active = models.BooleanField(default=True)
    on_hold = models.BooleanField(default=False)
    hold_reason = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Customer")
        verbose_name_plural = _("Customers")
        ordering = ["customer_code"]
        indexes = [
            models.Index(fields=["customer_code"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.customer_code} - {self.display_name}"

    @property
    def current_balance(self):
        """Calculate current accounts receivable balance"""
        return self.accounts_receivable_account.get_balance()

    @property
    def available_credit(self):
        """Calculate available credit"""
        return self.credit_limit - self.current_balance

    def save(self, *args, **kwargs):
        if not self.customer_code:
            last_customer = Customer.objects.order_by("-id").first()
            last_number = int(last_customer.customer_code[3:]) if last_customer else 0
            self.customer_code = f"CUS{last_number + 1:06d}"

        if not self.display_name:
            if self.is_individual and self.individual:
                self.display_name = self.individual.full_name
            elif not self.is_individual and self.company:
                self.display_name = self.company.full_name

        super().save(*args, **kwargs)


class Vendor(BaseModelWithUser):
    """Vendor master data for accounts payable"""

    vendor_code = models.CharField(max_length=20, unique=True)
    display_name = models.CharField(max_length=255)
    company = models.ForeignKey(
        "companies.CompanyBranch", on_delete=models.SET_NULL, null=True, blank=True
    )

    # Accounting fields
    accounts_payable_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={
            "account_type__account_type": "liability",
            "account_number__startswith": "21",
        },
        related_name="vendor_accounts",
    )
    payment_terms = models.PositiveIntegerField(
        default=30, help_text="Number of days for payment"
    )

    # Status
    is_active = models.BooleanField(default=True)
    on_hold = models.BooleanField(default=False)
    hold_reason = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Vendor")
        verbose_name_plural = _("Vendors")
        ordering = ["vendor_code"]

    def __str__(self):
        return f"{self.vendor_code} - {self.display_name}"

    @property
    def current_balance(self):
        """Calculate current accounts payable balance"""
        return self.accounts_payable_account.get_balance()


# ==================== TAX CONFIGURATION ====================


class TaxType(BaseModelWithUser):
    """Different types of taxes (VAT, Sales Tax, etc.)"""

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
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "liability"},
        related_name="tax_payable_types",
        blank=True,
        null=True,
    )
    receivable_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "asset"},
        related_name="tax_receivable_types",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _("Tax Type")
        verbose_name_plural = _("Tax Types")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.rate}%"


# ==================== BUSINESS TRANSACTION MODELS ====================


class Invoice(BaseModelWithUser):
    """Sales Invoice model"""

    INVOICE_TYPES = [
        ("fiscal", _("Fiscal Invoice")),
        ("proforma", _("Proforma Invoice")),
        ("recurring", _("Recurring Invoice")),
    ]

    STATUS_CHOICES = [
        ("draft", _("Draft")),
        ("pending", _("Pending")),
        ("paid", _("Paid")),
        ("partially_paid", _("Partially Paid")),
        ("overdue", _("Overdue")),
        ("cancelled", _("Cancelled")),
        ("written_off", _("Written Off")),
    ]

    # Core fields
    invoice_type = models.CharField(
        max_length=20, choices=INVOICE_TYPES, default="fiscal"
    )
    invoice_number = models.CharField(
        max_length=20, unique=True, editable=False, blank=True, null=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name="invoices",
    )

    # Dates
    invoice_date = models.DateField(default=now)
    due_date = models.DateField(null=True, blank=True)
    posted_date = models.DateTimeField(null=True, blank=True)

    # Financial details
    currency = models.ForeignKey("Currency", on_delete=models.PROTECT)
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
        related_name="invoice",
    )

    # Additional fields
    terms = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")
        ordering = ["-invoice_date", "-invoice_number"]
        indexes = [
            models.Index(fields=["invoice_number"]),
            models.Index(fields=["customer", "invoice_date"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer.display_name}"

    def clean(self):
        if self.due_date and self.invoice_date and self.due_date < self.invoice_date:
            raise ValidationError("Due date cannot be before invoice date")

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            today = timezone.now().date()
            year = today.year
            last_invoice = (
                Invoice.objects.filter(invoice_date__year=year).order_by("-id").first()
            )

            if last_invoice and last_invoice.invoice_number:
                try:
                    last_number = int(last_invoice.invoice_number.split("-")[-1])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.invoice_number = f"INV-{year}-{new_number:06d}"

        # Calculate due date if not set
        if not self.due_date and self.invoice_date and self.customer:
            self.due_date = self.invoice_date + relativedelta(
                days=self.customer.payment_terms
            )

        # Update balance due
        self.balance_due = self.total_amount - self.amount_paid

        super().save(*args, **kwargs)

    def update_totals(self):
        """Update invoice totals from line items"""
        line_items = self.line_items.all()

        self.subtotal = sum(item.line_total for item in line_items)

        # Apply discount
        if self.discount_percentage:
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

    def post_to_ledger(self):
        """Create journal entry for the invoice"""
        if self.journal_entry:
            raise ValidationError("Invoice already posted to ledger")

        if self.status != "pending":
            raise ValidationError("Only pending invoices can be posted")

        with transaction.atomic():
            # Create journal entry
            journal_entry = JournalEntry.objects.create(
                entry_date=self.invoice_date,
                entry_type="sales",
                description=f"Invoice {self.invoice_number} - {self.customer.display_name}",
                reference=self.invoice_number,
                created_by=self.created_by,
            )

            # Accounts Receivable - Debit
            LedgerTransaction.objects.create(
                journal_entry=journal_entry,
                account=self.customer.accounts_receivable_account,
                debit_amount=self.total_amount,
                description=f"Invoice {self.invoice_number}",
                source_transaction=self,
            )

            # Sales Revenue - Credit (from line items)
            for line_item in self.line_items.all():
                LedgerTransaction.objects.create(
                    journal_entry=journal_entry,
                    account=line_item.sales_item.income_account,
                    credit_amount=line_item.line_total,
                    description=line_item.sales_item.name,
                    tax_rate=line_item.tax_rate,
                    tax_amount=line_item.tax_amount,
                    source_transaction=line_item,
                )

            # Tax Payable - Credit
            if self.tax_total > 0:
                # This would need to be more sophisticated for multiple tax types
                default_tax_type = TaxType.objects.filter(is_active=True).first()
                if default_tax_type:
                    LedgerTransaction.objects.create(
                        journal_entry=journal_entry,
                        account=default_tax_type.payable_account,
                        credit_amount=self.tax_total,
                        description=f"Tax for Invoice {self.invoice_number}",
                        source_transaction=self,
                    )

            journal_entry.update_totals()
            journal_entry.post_entry()

            self.journal_entry = journal_entry
            self.posted_date = timezone.now()
            self.save()

        return journal_entry

    @property
    def is_overdue(self):
        if self.status in ["paid", "cancelled"]:
            return False
        return self.due_date < timezone.now().date() and self.balance_due > 0

    def apply_payment(self, amount, payment_date=None):
        """Apply payment to invoice"""
        if amount <= 0:
            raise ValidationError("Payment amount must be positive")

        if amount > self.balance_due:
            raise ValidationError("Payment amount exceeds balance due")

        with transaction.atomic():
            self.amount_paid += amount
            self.balance_due = self.total_amount - self.amount_paid

            if self.balance_due == 0:
                self.status = "paid"
            elif self.amount_paid > 0:
                self.status = "partially_paid"

            self.save()

            # Create payment record
            payment = Payment.objects.create(
                invoice=self,
                payment_date=payment_date or timezone.now().date(),
                amount=amount,
                created_by=self.created_by,
            )

            # Post payment to ledger
            payment.post_to_ledger()

        return payment


class InvoiceLineItem(BaseModel):
    """Line items for invoices"""

    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name="line_items"
    )
    sales_item = models.ForeignKey("SalesItem", on_delete=models.PROTECT)
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    unit_price = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal("0.00")
    )
    tax_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Invoice Line Item")
        verbose_name_plural = _("Invoice Line Items")
        ordering = ["id"]

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.sales_item.name}"

    @property
    def line_total(self):
        return (self.quantity * self.unit_price).quantize(Decimal("0.01"))

    @property
    def line_total_with_tax(self):
        return self.line_total + self.tax_amount

    def save(self, *args, **kwargs):
        # Calculate tax amount
        if self.tax_rate:
            self.tax_amount = (
                self.line_total * self.tax_rate / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        super().save(*args, **kwargs)

        # Update invoice totals
        self.invoice.update_totals()


class Payment(BaseModelWithUser):
    """Payment received from customers"""

    PAYMENT_METHODS = [
        ("cash", _("Cash")),
        ("check", _("Check")),
        ("bank_transfer", _("Bank Transfer")),
        ("credit_card", _("Credit Card")),
        ("debit_card", _("Debit Card")),
        ("mobile_money", _("Mobile Money")),
    ]

    payment_number = models.CharField(
        max_length=20, unique=True, editable=False, blank=True, null=True
    )
    invoice = models.ForeignKey(
        Invoice, on_delete=models.PROTECT, related_name="payments"
    )
    payment_date = models.DateField(default=now)
    amount = models.DecimalField(
        max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )
    payment_method = models.ForeignKey(
        "PaymentMethod", on_delete=models.PROTECT, null=True, blank=True
    )
    reference = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # GL Links
    journal_entry = models.OneToOneField(
        JournalEntry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payment",
    )
    cash_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={
            "account_type__account_type": "asset",
            "account_number__startswith": "10",
        },
        blank=True,
        null=True,
        related_name="payments_received",
    )

    class Meta:
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")
        ordering = ["-payment_date", "-id"]

    def __str__(self):
        return f"Payment {self.payment_number} - {self.amount}"

    def save(self, *args, **kwargs):
        if not self.payment_number:
            today = timezone.now().date()
            year = today.year
            last_payment = (
                Payment.objects.filter(payment_date__year=year).order_by("-id").first()
            )

            if last_payment and last_payment.payment_number:
                try:
                    last_number = int(last_payment.payment_number.split("-")[-1])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.payment_number = f"PMT-{year}-{new_number:06d}"

        super().save(*args, **kwargs)

    def post_to_ledger(self):
        """Create journal entry for payment"""
        if self.journal_entry:
            raise ValidationError("Payment already posted to ledger")

        with transaction.atomic():
            journal_entry = self.post_ledger_helper()
        return journal_entry

    # TODO Rename this here and in `post_to_ledger`
    def post_ledger_helper(self):
        result = JournalEntry.objects.create(
            entry_date=self.payment_date,
            entry_type="cash_receipts",
            description=f"Payment {self.payment_number} for Invoice {self.invoice.invoice_number}",
            reference=self.payment_number,
            created_by=self.created_by,
        )

        # Bank/Cash Account - Debit
        LedgerTransaction.objects.create(
            journal_entry=result,
            account=self.cash_account,
            debit_amount=self.amount,
            description=f"Payment {self.payment_number}",
            source_transaction=self,
        )

        # Accounts Receivable - Credit
        LedgerTransaction.objects.create(
            journal_entry=result,
            account=self.invoice.customer.accounts_receivable_account,
            credit_amount=self.amount,
            description=f"Payment for Invoice {self.invoice.invoice_number}",
            source_transaction=self,
        )

        result.update_totals()
        result.post_entry()

        self.journal_entry = result
        self.save()

        return result


# ==================== PRODUCT/SERVICE CATALOG ====================


class SalesCategory(BaseModelWithUser):
    """Categories for sales items"""

    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    parent_category = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subcategories",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Sales Category")
        verbose_name_plural = _("Sales Categories")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class SalesItem(BaseModelWithUser):
    """Products or services for sale"""

    item_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        SalesCategory, on_delete=models.PROTECT, related_name="items"
    )

    # Pricing
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.ForeignKey("Currency", on_delete=models.PROTECT, default=1)
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    # Accounting
    income_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "revenue"},
        blank=True,
        null=True,
        related_name="sales_items",
    )
    cost_of_sales_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "expense"},
        related_name="cost_sales_items",
        null=True,
        blank=True,
    )
    inventory_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "asset"},
        related_name="inventory_items",
        null=True,
        blank=True,
    )

    # Tax
    tax_type = models.ForeignKey(
        TaxType, on_delete=models.PROTECT, null=True, blank=True
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
        verbose_name = _("Sales Item")
        verbose_name_plural = _("Sales Items")
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
        if self.tax_type:
            return self.unit_price * (1 + self.tax_type.rate / Decimal("100.00"))
        return self.unit_price

    def save(self, *args, **kwargs):
        if not self.item_code:
            last_item = SalesItem.objects.order_by("-id").first()
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


# ==================== CASH MANAGEMENT ====================


class BankAccount(BaseModelWithUser):
    """Bank accounts for cash management"""

    account_number = models.CharField(max_length=50, unique=True)
    account_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    branch_name = models.CharField(max_length=255, blank=True, null=True)
    currency = models.ForeignKey("Currency", on_delete=models.PROTECT)

    # GL Integration
    gl_account = models.OneToOneField(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={
            "account_type__account_type": "asset",
            "account_number__startswith": "10",
        },
        related_name="bank_account",
    )

    # Status
    is_active = models.BooleanField(default=True)
    opening_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    opening_balance_date = models.DateField(default=now)

    class Meta:
        verbose_name = _("Bank Account")
        verbose_name_plural = _("Bank Accounts")
        ordering = ["bank_name", "account_number"]

    def __str__(self):
        return f"{self.bank_name} - {self.account_number}"

    @property
    def current_balance(self):
        return self.gl_account.get_balance()


class CashReceipt(BaseModelWithUser):
    """Cash receipts for cash sales and other income"""

    receipt_number = models.CharField(max_length=20, unique=True, editable=False)
    receipt_date = models.DateField(default=now)
    received_from = models.CharField(max_length=255)
    amount = models.DecimalField(
        max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))]
    )
    payment_method = models.CharField(
        max_length=20, choices=Payment.PAYMENT_METHODS, default="cash"
    )
    bank_account = models.ForeignKey(
        BankAccount, on_delete=models.PROTECT, null=True, blank=True
    )
    income_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "revenue"},
    )
    description = models.TextField(blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)

    # GL Link
    journal_entry = models.OneToOneField(
        JournalEntry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cash_receipt",
    )

    class Meta:
        verbose_name = _("Cash Receipt")
        verbose_name_plural = _("Cash Receipts")
        ordering = ["-receipt_date", "-id"]

    def __str__(self):
        return f"Receipt {self.receipt_number} - {self.amount}"

    def post_to_ledger(self):
        """Post cash receipt to general ledger"""
        if self.journal_entry:
            raise ValidationError("Receipt already posted to ledger")

        with transaction.atomic():
            journal_entry = self.post_to_ledger_helper()
        return journal_entry

    def post_to_ledger_helper(self):
        result = JournalEntry.objects.create(
            entry_date=self.receipt_date,
            entry_type="cash_receipts",
            description=f"Cash receipt {self.receipt_number} from {self.received_from}",
            reference=self.receipt_number,
            created_by=self.created_by,
        )

        # Bank/Cash Account - Debit
        cash_account = (
            self.bank_account.gl_account if self.bank_account else self.income_account
        )
        LedgerTransaction.objects.create(
            journal_entry=result,
            account=cash_account,
            debit_amount=self.amount,
            description=f"Receipt {self.receipt_number}",
            source_transaction=self,
        )

        # Income Account - Credit
        LedgerTransaction.objects.create(
            journal_entry=result,
            account=self.income_account,
            credit_amount=self.amount,
            description=f"Income from {self.received_from}",
            source_transaction=self,
        )

        result.update_totals()
        result.post_entry()

        self.journal_entry = result
        self.save()

        return result


# ==================== SUPPORTING MODELS ====================


class Currency(BaseModel):
    """Currency master data"""

    currency_code = models.CharField(max_length=3, unique=True)
    currency_name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_base_currency = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")
        ordering = ["currency_code"]

    def __str__(self):
        return f"{self.currency_code} - {self.currency_name}"

    def clean(self):
        if self.is_base_currency:
            # Ensure only one base currency
            existing_base = Currency.objects.filter(is_base_currency=True).exclude(
                pk=self.pk
            )
            if existing_base.exists():
                raise ValidationError("There can only be one base currency")

    def save(self, *args, **kwargs):
        if self.is_base_currency:
            # Set all other currencies to not base
            Currency.objects.filter(is_base_currency=True).exclude(pk=self.pk).update(
                is_base_currency=False
            )
        super().save(*args, **kwargs)


class ExchangeRate(BaseModelWithUser):
    """Currency exchange rates"""

    base_currency = models.ForeignKey(
        Currency, on_delete=models.CASCADE, related_name="base_rates"
    )
    target_currency = models.ForeignKey(
        Currency, on_delete=models.CASCADE, related_name="target_rates"
    )
    rate = models.DecimalField(max_digits=10, decimal_places=6)
    effective_date = models.DateField(default=localdate)
    source = models.CharField(max_length=255, default="Currency Settings")
    is_active = models.BooleanField(default=True)

    class Meta:
        """Class meta information for ExchangeRate model"""

        verbose_name = _("Exchange Rate")
        verbose_name_plural = _("Exchange Rates")
        ordering = ["-effective_date", "base_currency", "target_currency"]

    def __str__(self):
        return f"{self.base_currency.currency_code}/{self.target_currency.currency_code}: {self.rate}"


# ==================== FINANCIAL REPORTS ====================


class TrialBalance(BaseModel):
    """Trial balance snapshot"""

    period = models.ForeignKey(
        AccountingPeriod, on_delete=models.CASCADE, related_name="trial_balances"
    )
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = _("Trial Balance")
        verbose_name_plural = _("Trial Balances")
        ordering = ["-period__end_date", "-generated_at"]

    def __str__(self):
        return f"Trial Balance - {self.period.name}"


class TrialBalanceItem(BaseModel):
    """Individual account balances in trial balance"""

    trial_balance = models.ForeignKey(
        TrialBalance, on_delete=models.CASCADE, related_name="items"
    )
    account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE)
    debit_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )
    credit_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0.00")
    )

    class Meta:
        verbose_name = _("Trial Balance Item")
        verbose_name_plural = _("Trial Balance Items")
        unique_together = ["trial_balance", "account"]


class BalanceSheet(BaseModel):
    """Balance sheet snapshot"""

    as_of_date = models.DateField()
    period = models.ForeignKey(
        AccountingPeriod, on_delete=models.CASCADE, related_name="balance_sheets"
    )
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = _("Balance Sheet")
        verbose_name_plural = _("Balance Sheets")
        ordering = ["-as_of_date"]


class PaymentMethod(BaseModel):
    """Payment methods for disbursements and payments"""

    name = models.CharField(max_length=100, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Payment Method")
        verbose_name_plural = _("Payment Methods")
        ordering = ["name"]

    def __str__(self):
        return self.name


class IncomeStatement(BaseModel):
    """Income statement for a period"""

    period = models.ForeignKey(
        AccountingPeriod, on_delete=models.CASCADE, related_name="income_statements"
    )
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = _("Income Statement")
        verbose_name_plural = _("Income Statements")
        ordering = ["-period__end_date"]


# models.py - Add these to your existing models
class CashSale(BaseModelWithUser):
    """
    Simplified cash sales for quick point-of-sale transactions
    """

    receipt_number = models.CharField(max_length=20, unique=True, editable=False)
    sale_date = models.DateTimeField(default=now)
    customer_display_name = models.CharField(max_length=255)

    # Customer reference (optional - for registered customers)
    customer = models.ForeignKey(
        "Customer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cash_sales",
    )

    # Financial details
    currency = models.ForeignKey("Currency", on_delete=models.PROTECT, default=1)
    subtotal = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
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
    tax_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    # Payment details
    payment_method = models.CharField(
        max_length=20, choices=Payment.PAYMENT_METHODS, default="cash"
    )
    amount_tendered = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    change_given = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    # GL Integration
    cash_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={
            "account_type__account_type": "asset",
            "account_number__startswith": "10",
        },
        related_name="cash_sales",
    )
    sales_account = models.ForeignKey(
        GeneralLedgerAccount,
        on_delete=models.PROTECT,
        limit_choices_to={"account_type__account_type": "revenue"},
        related_name="cash_sales_revenue",
    )
    journal_entry = models.OneToOneField(
        JournalEntry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cash_sale",
    )

    # Status
    is_posted = models.BooleanField(default=False)
    posted_date = models.DateTimeField(null=True, blank=True)

    # Additional info
    notes = models.TextField(blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = _("Cash Sale")
        verbose_name_plural = _("Cash Sales")
        ordering = ["-sale_date", "-id"]
        indexes = [
            models.Index(fields=["receipt_number"]),
            models.Index(fields=["sale_date"]),
            models.Index(fields=["customer"]),
        ]

    def __str__(self):
        return f"Cash Sale {self.receipt_number} - {self.customer_display_name}"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            # Generate receipt number: CS-YYYY-XXXXXX
            today = timezone.now().date()
            year = today.year
            last_sale = (
                CashSale.objects.filter(sale_date__year=year).order_by("-id").first()
            )

            if last_sale and last_sale.receipt_number:
                try:
                    last_number = int(last_sale.receipt_number.split("-")[-1])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.receipt_number = f"CS-{year}-{new_number:06d}"

        # Calculate change given
        if self.amount_tendered and self.total_amount:
            self.change_given = self.amount_tendered - self.total_amount
            if self.change_given < 0:
                self.change_given = Decimal("0.00")

        super().save(*args, **kwargs)

    def update_totals(self):
        """Update sale totals from line items"""
        line_items = self.line_items.all()

        # Calculate subtotal
        self.subtotal = sum(item.line_total for item in line_items)

        # Apply discount
        if self.discount_percentage:
            discount_amount = (
                self.subtotal * self.discount_percentage / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            self.discount_amount = discount_amount
        else:
            self.discount_amount = self.discount_amount or Decimal("0.00")

        discounted_subtotal = self.subtotal - self.discount_amount

        # Calculate tax total
        self.tax_total = sum(item.tax_amount for item in line_items)

        self.total_amount = discounted_subtotal + self.tax_total

        # Update change given
        if self.amount_tendered:
            self.change_given = self.amount_tendered - self.total_amount
            if self.change_given < 0:
                self.change_given = Decimal("0.00")

        self.save(
            update_fields=[
                "subtotal",
                "discount_amount",
                "tax_total",
                "total_amount",
                "change_given",
            ]
        )

    def post_to_ledger(self):
        """Create journal entry for cash sale"""
        if self.journal_entry:
            raise ValidationError("Cash sale already posted to ledger")

        with transaction.atomic():
            journal_entry = JournalEntry.objects.create(
                entry_date=self.sale_date.date(),
                entry_type="cash_receipts",
                description=f"Cash sale {self.receipt_number} - {self.customer_display_name}",
                reference=self.receipt_number,
                created_by=self.created_by,
            )

            # Cash Account - Debit
            LedgerTransaction.objects.create(
                journal_entry=journal_entry,
                account=self.cash_account,
                debit_amount=self.total_amount,
                description=f"Cash sale {self.receipt_number}",
                source_transaction=self,
            )

            # Sales Revenue - Credit (from line items)
            for line_item in self.line_items.all():
                LedgerTransaction.objects.create(
                    journal_entry=journal_entry,
                    account=self.sales_account,
                    credit_amount=line_item.line_total,
                    description=line_item.sales_item.name,
                    tax_rate=line_item.tax_rate,
                    tax_amount=line_item.tax_amount,
                    source_transaction=line_item,
                )

            # Tax Payable - Credit
            if self.tax_total > 0:
                default_tax_type = TaxType.objects.filter(is_active=True).first()
                if default_tax_type:
                    LedgerTransaction.objects.create(
                        journal_entry=journal_entry,
                        account=default_tax_type.payable_account,
                        credit_amount=self.tax_total,
                        description=f"Tax for cash sale {self.receipt_number}",
                        source_transaction=self,
                    )

            journal_entry.update_totals()
            journal_entry.post_entry()

            self.journal_entry = journal_entry
            self.is_posted = True
            self.posted_date = timezone.now()
            self.save()

        return journal_entry

    @property
    def is_fully_paid(self):
        return self.amount_tendered >= self.total_amount

    @property
    def balance_due(self):
        if self.amount_tendered >= self.total_amount:
            return Decimal("0.00")
        return self.total_amount - self.amount_tendered


class CashSaleLineItem(BaseModel):
    """Line items for cash sales"""

    cash_sale = models.ForeignKey(
        CashSale, on_delete=models.CASCADE, related_name="line_items"
    )
    sales_item = models.ForeignKey(
        "SalesItem", on_delete=models.PROTECT, related_name="cash_sale_line_items"
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    unit_price = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal("0.00")
    )
    tax_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _("Cash Sale Line Item")
        verbose_name_plural = _("Cash Sale Line Items")
        ordering = ["id"]

    def __str__(self):
        return f"{self.cash_sale.receipt_number} - {self.sales_item.name}"

    @property
    def line_total(self):
        return (self.quantity * self.unit_price).quantize(Decimal("0.01"))

    @property
    def line_total_with_tax(self):
        return self.line_total + self.tax_amount

    def save(self, *args, **kwargs):
        # Use sales item price if unit price not provided
        if not self.unit_price:
            self.unit_price = self.sales_item.unit_price

        # Use sales item tax rate if not provided
        if not self.tax_rate and self.sales_item.tax_type:
            self.tax_rate = self.sales_item.tax_type.rate

        # Calculate tax amount
        if self.tax_rate:
            self.tax_amount = (
                self.line_total * self.tax_rate / Decimal("100.00")
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        super().save(*args, **kwargs)

        # Update cash sale totals
        self.cash_sale.update_totals()
