from django.db import models
from authentication.models import CustomUser
from datetime import datetime
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now, timedelta
import uuid
# Create your models here.

class ProductService(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    vat_applicable = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AccountSector(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,default=1)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class SalesAccount(models.Model):
    """Stores different sales accounts and links them to sectors."""
    account_name = models.CharField(max_length=255, unique=True)
      # User Company Relation
    account_number = models.CharField(max_length=15, default="")  # Numeric Account Code
    account_sector = models.ForeignKey(AccountSector, on_delete=models.CASCADE, related_name="accounts")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"
    
class Item(models.Model):
      
    category = models.ForeignKey('SalesCategory', on_delete=models.CASCADE, related_name='items')
    item_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    unit_price_currency = models.CharField(max_length=10, choices=[('USD', 'USD'), ('ZIG', 'ZIG')])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_name = models.CharField(max_length=255, blank=True, null=True)
    tax_configuration = models.ForeignKey('VATSetting', on_delete=models.CASCADE, related_name='items')
    sales_account = models.ForeignKey('SalesAccount', on_delete=models.CASCADE, related_name='items')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class SalesCategory(models.Model):
      
    name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    code = models.CharField(max_length=255, blank=True, null=True) 
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CashSale(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  
      
    sale_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Cash Sale {self.id} - {self.user.user_id}"

class VATSetting(models.Model):
      # User Company Relation
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.rate}% - {self.description}"

class CashbookEntry(models.Model):
    TRANSACTION_TYPES = (
        ("payment", "Payment"),
        ("receipt", "Receipt"),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  
      # User Company Relation
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

class GeneralLedgerAccount(models.Model):
 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  
      # User Company Relation
    account_name = models.ForeignKey(SalesAccount, on_delete=models.CASCADE, related_name='account')
    account_sector =   models.ForeignKey(AccountSector, on_delete=models.CASCADE, related_name='sector')
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.account_name} - {self.account_name}"

class JournalEntry(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  # User Relation
      # User Company Relation
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Journal Entry {self.id} - {self.date}"

class LedgerTransaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  # User Relation
      # User Company Relation
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.account.account_name} - Debit: {self.debit} Credit: {self.credit}"


class Invoice(models.Model):
    """Stores invoice details."""
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("draft", "Draft"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]
    
    document_number = models.CharField(max_length=10, unique=True)
    customer_id = models.CharField(max_length=255)  
     # User Company Relation
    is_individual = models.BooleanField(default=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Creator of the invoice
    sale_date = models.DateTimeField(default=now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    total_excluding_vat = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    vat_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    total_inclusive = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"Invoice {self.document_number} - {self.customer_id} ({self.is_individual})"

class InvoiceItem(models.Model):
    """Stores products or services added to an invoice."""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey('ProductService', on_delete=models.CASCADE) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Creator of the invoice
      # User Company Relation
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.invoice.document_number} - {self.product.name}"

class Payment(models.Model):
    """Stores payments made against invoices."""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Processed by
    payment_date = models.DateTimeField(default=now)
      # User Company Relation
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(
        max_length=50,
        choices=[("cash", "Cash"), ("bank_transfer", "Bank Transfer"), ("swipe", "Swipe")],
    )
    reference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Payment {self.invoice.document_number} - {self.amount}"
    
class RecurringInvoice(models.Model):
    """Stores details of recurring invoices."""
    FREQUENCY_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]
    
    customer_id = models.CharField(max_length=255)  # Stores Customer ID
    is_individual = models.BooleanField(default=True)
      #User Company Relation
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Created by
    start_date = models.DateField(null=True,blank=True)
    next_invoice_date = models.DateField(null=True,blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="monthly")
    is_active = models.BooleanField(default=False)

    def generate_next_invoice(self):
        """Creates a new invoice when the recurrence is due."""
        if self.frequency == "monthly":
            self.next_invoice_date += timedelta(days=30)
        elif self.frequency == "quarterly":
            self.next_invoice_date += timedelta(days=90)
        elif self.frequency == "yearly":
            self.next_invoice_date += timedelta(days=365)

        self.save()
        return Invoice.objects.create(
            document_number=f"INV-{uuid.uuid4().hex[:6].upper()}",
            customer_id=self.customer_id,
            customer_type=self.is_individual,
            user=self.user,
            sale_date=now(),
            status="draft",
            total_excluding_vat=0,  
            vat_total=0,  
            total_inclusive=0
        )

    def __str__(self):
        is_company_or_individual = "Company" if not self.is_individual else "Individual"
        return f"Recurring Invoice for {is_company_or_individual} - {self.customer_id} every {self.frequency}"

class ProformaInvoice(models.Model):
    """Stores a draft invoice before conversion into a final invoice."""
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name="proforma_invoice")
    created_at = models.DateTimeField(auto_now_add=True)

    def convert_to_invoice(self):
        """Converts a proforma invoice into a finalized invoice."""
        self.invoice.status = "pending"
        self.invoice.save()
        return self.invoice

    def __str__(self):
        return f"Proforma {self.invoice.document_number}"

class CurrencyRate(models.Model):
    CURRENCY_CHOICES = [
        ("USD", "US Dollar"),
        ("ZIG", "Zimbabwen Dollar"),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    current_rate = models.FloatField(max_length=255, default=0)
    base_currency = models.CharField(max_length=255,default="USD")
    currency = models.CharField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.user} Latest Rate {self.current_rate}"

