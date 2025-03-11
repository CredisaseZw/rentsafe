from django.db import models
from authentication.models import CustomUser
from datetime import datetime
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Create your models here.

class ProductService(models.Model):
    company = models.CharField(max_length=255)  
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    vat_applicable = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    
    
    
class Item(models.Model):
    company = models.CharField(max_length=255)  
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
    company = models.CharField(max_length=255)  
    name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class SalesAccount(models.Model):
    company = models.CharField(max_length=255)  
    account_name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.account_name

class CashSale(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  
    company = models.CharField(max_length=255)  
    sale_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Cash Sale {self.id} - {self.user.user_id}"

class VATSetting(models.Model):
    company = models.CharField(max_length=255)  # Company Relation
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
    company = models.CharField(max_length=255)  # Company Relation
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

class GeneralLedgerAccount(models.Model):
    ACCOUNT_TYPES = (
        ("asset", "Asset"),
        ("liability", "Liability"),
        ("equity", "Equity"),
        ("revenue", "Revenue"),
        ("expense", "Expense"),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  
    company = models.CharField(max_length=255)  # Company Relation
    name = models.CharField(max_length=255, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.name} - {self.account_type}"

class JournalEntry(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  # User Relation
    company = models.CharField(max_length=255)  # Company Relation
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Journal Entry {self.id} - {self.date}"

class LedgerTransaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)  # User Relation
    company = models.CharField(max_length=255)  # Company Relation
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    account = models.ForeignKey(GeneralLedgerAccount, on_delete=models.CASCADE)
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.account.name} - Debit: {self.debit} Credit: {self.credit}"
