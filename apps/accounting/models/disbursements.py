#accounting/models/disbursement.py
from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from apps.common.models.base_models import  BaseModelWithUser
from apps.accounting.models.models import Currency, PaymentMethod
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company

User = get_user_model()
class Disbursement(BaseModelWithUser):
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
    payee = models.ForeignKey(
        'clients.Client',
        on_delete=models.PROTECT,
        related_name='disbursements'
    )

    landlord = models.ForeignKey(
        'leases.Landlord',
        on_delete=models.PROTECT,
        related_name='disbursements',
        null=True,
        blank=True
    )
    
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, related_name='disbursements')
    reference = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(default=now)
    
    def __str__(self):
        payee_name = ""
        if self.landlord:
            payee_name = str(self.landlord)
        elif self.payee:
            payee_name = self.payee.get_linked_entity.full_name if hasattr(self.payee, 'get_linked_entity') else str(self.payee)
        return f"Disbursement to {payee_name} - {self.amount} {self.currency.currency_code}"
    
    @property
    def disbursement_type(self):
        if self.landlord:
            return 'landlord'
        elif isinstance(self.payee, Individual):
            return 'individual'
        elif isinstance(self.payee, Company):
            return 'company'
        return 'unknown'