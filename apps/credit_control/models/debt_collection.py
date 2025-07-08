from django.db import models
from django.conf import settings
from common.models.base_models import BaseModel

class DebtCase(BaseModel):
    CASE_STATUS_CHOICES = (
        ('open', 'Open'),
        ('payment_plan', 'Payment Plan'),
        ('legal', 'Legal Action'),
        ('closed', 'Closed'),
    )
    lease = models.ForeignKey('leases.Lease', on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=CASE_STATUS_CHOICES)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2)
    current_balance = models.DecimalField(max_digits=12, decimal_places=2)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

class PaymentPlan(BaseModel):
    debt_case = models.ForeignKey(DebtCase, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    installment_amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=20) 
    status = models.CharField(max_length=20)

class CommunicationLog(BaseModel):
    COMMUNICATION_TYPES = (
        ('phone', 'Phone Call'),
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('letter', 'Letter'),
        ('meeting', 'In-Person Meeting'),
    )
    
    debt_case = models.ForeignKey(DebtCase, on_delete=models.CASCADE)
    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPES)
    summary = models.TextField()
    details = models.TextField()
    follow_up_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)