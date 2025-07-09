# legal/models/contracts.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from common.models.base_models import BaseModel
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Contract(BaseModel):
    CONTRACT_TYPES = (
        ('lease', 'Lease Agreement'),
        ('service', 'Service Agreement'),
        ('nda', 'Non-Disclosure Agreement'),
        ('employment', 'Employment Contract'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
    )
    
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES)
    title = models.CharField(max_length=255)
    reference_number = models.CharField(max_length=50, unique=True)
    content = models.TextField()
    effective_date = models.DateField()
    expiration_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Parties to the contract
    party_a_content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT, related_name='party_a_contracts')
    party_a_object_id = models.PositiveIntegerField(null=True, blank=True)
    party_a = GenericForeignKey('party_a_content_type', 'party_a_object_id')
    
    party_b_content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT, related_name='party_b_contracts')
    party_b_object_id = models.PositiveIntegerField(null=True, blank=True)
    party_b = GenericForeignKey('party_b_content_type', 'party_b_object_id')
    
    class Meta:
        app_label = 'legal'
        db_table = 'contract'
        verbose_name = _('contract')
        verbose_name_plural = _('contracts')
        ordering = ['-effective_date']
    
    def __str__(self):
        return f"{self.get_contract_type_display()} - {self.reference_number}"
    def get_contract_type_display(self):
        return dict(self.CONTRACT_TYPES).get(self.contract_type, 'Unknown Contract Type')

class ContractAmendment(BaseModel):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='amendments')
    amendment_date = models.DateField()
    description = models.TextField()
    changes = models.TextField() 
    
    class Meta:
        app_label = 'legal'
        db_table = 'contract_amendment'
        verbose_name = _('contract amendment')
        verbose_name_plural = _('contract amendments')
        ordering = ['-amendment_date']
    
    def __str__(self):
        return f"Amendment to {self.contract} on {self.amendment_date}"
