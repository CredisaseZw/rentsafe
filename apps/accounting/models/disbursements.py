from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
from common.models.base_models import BaseModel
from accounting.models.models import Currency, PaymentMethod
from django.contrib.auth import get_user_model
from individuals.models.models import Individual
from companies.models.models import Company

User = get_user_model()

class Disbursement(BaseModel):
    PAYMENT_METHODS = (
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('cheque', 'Cheque'),
        ('mobile_money', 'Mobile Money'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('processed', 'Processed'),
        ('rejected', 'Rejected'),
    )
    
    payee_content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT)
    payee_object_id = models.PositiveIntegerField(null=True, blank=True)
    payee = GenericForeignKey('payee_content_type', 'payee_object_id')
    
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, related_name='disbursements')
    reference = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField()
    notes = GenericRelation('common.Note', related_query_name='disbursements')
    
    def __str__(self):
        payee_name = self.payee.full_name if hasattr(self.payee, 'full_name') else str(self.payee)
        return f"Disbursement to {payee_name} - {self.amount} {self.currency.currency_code}"
    
    @property
    def disbursement_type(self):
        if isinstance(self.payee, Individual):
            return 'individual'
        elif isinstance(self.payee, Company):
            return 'company'
        return 'unknown'