
# legal/models/disputes.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models.base_models import BaseModel
class LegalDispute(BaseModel):
    DISPUTE_TYPES = (
        ('tenant', 'Tenant Dispute'),
        ('contract', 'Contract Dispute'),
        ('property', 'Property Dispute'),
        ('payment', 'Payment Dispute'),
    )
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('investigation', 'Under Investigation'),
        ('negotiation', 'In Negotiation'),
        ('litigation', 'In Litigation'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    dispute_type = models.CharField(max_length=20, choices=DISPUTE_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    opened_date = models.DateField(auto_now_add=True)
    closed_date = models.DateField(null=True, blank=True)
    lease = models.ForeignKey('leases.Lease', on_delete=models.SET_NULL, null=True, blank=True)
    contract = models.ForeignKey('legal.Contract', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        app_label = 'legal'
        db_table = 'legal_dispute'
        verbose_name = _('legal dispute')
        verbose_name_plural = _('legal disputes')
        ordering = ['-opened_date']
    
    def __str__(self):
        return f"{self.get_dispute_type_display()} - {self.title}"
    @property
    def is_active(self):
        return self.status not in ['resolved', 'closed']
    @property
    def is_resolved(self):
        return self.status == 'resolved'
    @property
    def is_closed(self):
        return self.status == 'closed'
    def get_dispute_type_display(self):
        return dict(self.DISPUTE_TYPES).get(self.dispute_type, 'Unknown Dispute Type')
    