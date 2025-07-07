from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation
from common.models.models import Address, Document, Note
from common.models.base_models import BaseModel

class Company(BaseModel):
    LEGAL_STATUS_CHOICES = (
        ('private', 'Private Limited'),
        ('public', 'Public Limited'),
        ('government', 'Government'),
        ('ngo', 'NGO'),
        ('other', 'Other'),
    )
    
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    registration_name = models.CharField(max_length=255)
    trading_name = models.CharField(max_length=255, blank=True, null=True)
    legal_status = models.CharField(max_length=20, choices=LEGAL_STATUS_CHOICES)
    date_of_incorporation = models.DateField(blank=True, null=True)
    vat_number = models.CharField(max_length=50, blank=True, null=True)
    tin_number = models.CharField(max_length=50, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    is_client = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)    
    # Relationships
    addresses = GenericRelation(Address)
    documents = GenericRelation(Document)
    notes = GenericRelation(Note)
    
    class Meta:
        verbose_name = _('company')
        verbose_name_plural = _('companies')
        ordering = ['registration_name']
    
    def __str__(self):
        return self.trading_name or self.registration_name
    @property
    def full_name(self):
        return self.trading_name or self.registration_name
    def auto_create_hq_branch(self):
        """
        Automatically create a headquarters branch if it doesn't exist.
        This method can be called after saving the company instance.
        """
        if not self.branches.filter(branch_name__icontains='Headquarters').exists():
            headquarters_branch = CompanyBranch.objects.create(
                company=self,
                branch_name=f'{self.full_name} - Headquarters',
                address=self.addresses.first() if self.addresses.exists() else None,
            )
            return headquarters_branch
        return None

class CompanyBranch(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='branches')
    branch_name = models.CharField(max_length=255)
    address = models.ForeignKey('common.Address', on_delete=models.CASCADE, related_name='company_branches')

    class Meta:
        verbose_name = _('company branch')
        verbose_name_plural = _('company branches')
    
    def __str__(self):
        return f"{self.branch_name} - {self.company.registration_name}"

class BranchContact(models.Model):
    CONTACT_TYPES = (
        ('primary', 'Primary Contact'),
        ('finance', 'Finance Contact'),
        ('technical', 'Technical Contact'),
        ('other', 'Other'),
    )

    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE, related_name='contacts')
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPES)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    email = models.EmailField()
    mobile_phone = models.CharField(max_length=20)
    landline_phone = models.CharField(max_length=20, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('company contact')
        verbose_name_plural = _('company contacts')
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_contact_type_display()})"
    def get_contact_type_display(self):
        return dict(self.CONTACT_TYPES).get(self.contact_type, 'Unknown')