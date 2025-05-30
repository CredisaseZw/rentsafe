from authentication.models import CustomUser
from datetime import datetime
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now, timedelta
from dateutil.relativedelta import relativedelta
import uuid
from django.db import models,transaction
from django.core.exceptions import ValidationError
from rentsafe.models import Individual, Company, Lease
from decimal import Decimal, ROUND_HALF_UP
from django.db.models import F
# Create your models here.

class BaseModel(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True , blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        abstract = True

class AccountSector(BaseModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class SalesAccount(BaseModel):
    """Stores different sales accounts and links them to sectors."""
    account_name = models.CharField(max_length=255, unique=True)
    account_number = models.CharField(max_length=15, default="")  # Numeric Account Code
    account_sector = models.ForeignKey(AccountSector, on_delete=models.CASCADE, related_name="accounts")

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"

class Currency(BaseModel):
    currency_code = models.CharField(max_length=3, unique=True)
    currency_name = models.CharField(max_length=50)

    def __str__(self):
        return self.currency_code
  
class SalesItem(BaseModel):
      
    category = models.ForeignKey('SalesCategory', on_delete=models.CASCADE, related_name='items')
    item_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    unit_price_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='items_currency',null= True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_name = models.CharField(max_length=255, blank=True, null=True)
    tax_configuration = models.ForeignKey('VATSetting', on_delete=models.CASCADE, related_name='items')
    sales_account = models.ForeignKey('SalesAccount', on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class SalesCategory(BaseModel):
      
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=255, blank=True, null=True) 

    def __str__(self):
        return self.name

class CashSale(BaseModel):
    sale_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    def __str__(self):
        return f"Cash Sale {self.id} - {self.user.user_id}"

class VATSetting(BaseModel):
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=255)
    vat_applicable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.rate}% - {self.description}"

class TransactionType(BaseModel):
    transaction_type = models.CharField(max_length=30, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return F"{self.transaction_type}"

class CashbookEntry(BaseModel):
    date = models.DateField(default=now)
    payment_reference = models.CharField(max_length=255, unique=True, blank=True)
    type = models.ForeignKey('CashBookEntryType', on_delete=models.PROTECT, related_name='entries')
    total_including_vat = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    vat = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    matching_invoice = models.ForeignKey('Invoice', on_delete=models.SET_NULL, related_name='cashbook_entries', null=True)
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    
    def save(self, *args, **kwargs):
        if not self.payment_reference:
            # Generate a unique payment reference number
            # Use a transaction to ensure atomicity and prevent race conditions
            with transaction.atomic():
                last_entry = (CashbookEntry.objects.select_for_update().order_by('-payment_reference').first())
                if last_entry:
                    next_ref = int(last_entry.payment_reference) + 1
                else:
                    next_ref = 1
                self.payment_reference = f"{next_ref:06d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

class CashBookEntryType(BaseModel):
    type = models.CharField(max_length=50, choices=[
        ("GL", "General Ledger"),
        ("CR", "Creditor")
    ])
    account = models.IntegerField()
    details = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.type} - {self.account}"
    
class GeneralLedgerAccount(BaseModel):
    account_name = models.CharField(max_length=255, unique=True, blank=True)
    account_number = models.CharField(max_length=10, unique=True, blank=True)
    account_sector =   models.ForeignKey(AccountSector, on_delete=models.PROTECT, related_name='sector', default=None)

    def __str__(self):
        return f"{self.account_name} - {self.account_number}"

class JournalEntry(BaseModel):
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    def __str__(self):
        return f"Journal Entry {self.id} - {self.date}"

class LedgerTransaction(BaseModel):
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    def __str__(self):
        return f"{self.account.account_name} - Debit: {self.debit} Credit: {self.credit}"

class Invoice(BaseModel):
    INVOICE_TYPE_CHOICES = [
        ("fiscal", "Fiscal"),
        ("proforma", "Proforma"),
        ("recurring", "Recurring"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    FREQUENCY_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    # Core Fields
    invoice_type = models.CharField(max_length=20, choices=INVOICE_TYPE_CHOICES, default="fiscal")
    document_number = models.CharField(max_length=20, unique=True, editable=False)
    is_individual = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, null=True, blank=True)
    reference_number = models.CharField(max_length=20, blank=True, null=True)
    # Customer Relationship
    individual = models.ForeignKey(Individual, on_delete=models.SET_NULL, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Financial Details
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_excluding_vat = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    vat_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_inclusive = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Recurring Fields
    is_recurring = models.BooleanField(default=False)
    frequency = models.CharField(max_length=20,choices=FREQUENCY_CHOICES,default="monthly")
    next_invoice_date = models.DateField(null=True, blank=True)
    original_invoice = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,related_name='child_invoices')

    # Timestamps
    sale_date = models.DateTimeField(default=now)

    def convert_to_fiscal(self):
        """Convert proforma to fiscal invoice"""
        if self.invoice_type == "proforma":
            self.invoice_type = "fiscal"
            self.status = "pending"
            self.save()
            return self
        raise ValidationError("Only proforma invoices can be converted")
    def save(self, *args, **kwargs):
        if not self.document_number:
            with transaction.atomic():
                # Lock the latest invoice to prevent race conditions
                if last_invoice:= Invoice.objects.select_for_update().order_by('-document_number').first():
        
                    try:
                        last_num = int(last_invoice.document_number)
                        new_num = last_num + 1
                    except ValueError:
                        # Handle existing invalid document numbers
                        new_num = 0
                else:
                    new_num = 0  # Start from 000000
                self.document_number = f"{new_num:06d}"
            
        # Round all monetary values before saving
        self.total_excluding_vat = self.total_excluding_vat.quantize(
            Decimal('0.00'), rounding=ROUND_HALF_UP
        )
        self.vat_total = self.vat_total.quantize(
            Decimal('0.00'), rounding=ROUND_HALF_UP
        )
        self.total_inclusive = self.total_inclusive.quantize(
            Decimal('0.00'), rounding=ROUND_HALF_UP
        )

        self.full_clean()
        super().save(*args, **kwargs)


    def generate_recurring_invoice(self):
        """Create next invoice in recurring series"""
        if self.invoice_type != "recurring":
            raise ValidationError("Only recurring invoices can generate children")

        return Invoice.objects.create(
            invoice_type="fiscal",
            is_individual=self.is_individual,
            individual=self.individual,
            company=self.company,
            currency=self.currency,
            user=self.user,
            original_invoice=self,
            next_invoice_date=self._next_recurrence_date(),
            frequency=self.frequency,
            total_excluding_vat=self.total_excluding_vat,
            vat_total=self.vat_total,
            total_inclusive=self.total_inclusive,
            is_recurring=True,
        )
        

    def _next_recurrence_date(self):
        if self.frequency == "monthly":
            return self.next_invoice_date + relativedelta(months=+1)
        if self.frequency == "quarterly":
            return self.next_invoice_date + relativedelta(months=+3)
        if self.frequency == "yearly":
            return self.next_invoice_date + relativedelta(years=+1)
        return None

class InvoiceItem(BaseModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    sales_item = models.ForeignKey(SalesItem, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_price = (self.quantity * self.unit_price) + self.vat_amount
        super().save(*args, **kwargs)

class PaymentMethod(BaseModel):
    payment_method_name = models.CharField(max_length=255, unique=True)
    payment_method_code = models.CharField(max_length=15, unique=True)
    
    def __str__(self):
        return self.payment_method_name
    
class Payment(BaseModel):
    """Stores payments made against invoices."""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    payment_date = models.DateTimeField(default=now)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE, related_name="payments")
    reference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Payment {self.invoice.document_number} - {self.amount}"

class CurrencyRate(BaseModel):
    current_rate = models.FloatField(max_length=255, default=0)
    base_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='base_currency',null= True, blank=True)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='target_currency',null= True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.user} Latest Rate {self.current_rate}"

class CashBook(BaseModel):
    cashbook_id = models.CharField(max_length=255, unique=True)
    cashbook_name = models.CharField(max_length=255)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='cashbook_currency', null= True, blank=True)
    requisition_status = models.BooleanField(default=False)
    account_type = models.CharField(max_length=50)
    bank_account_number = models.CharField(max_length=30, blank=True)
    branch_name = models.CharField(max_length=255, blank=True)
    general_ledger_account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE, related_name='general_ledger_account')

    def __str__(self):
        return f"{self.cashbook_name} - {self.general_ledger_account.account_name}"