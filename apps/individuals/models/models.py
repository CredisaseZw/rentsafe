from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models.models import Address, Document, Note
from django.contrib.contenttypes.fields import GenericRelation
from apps.common.models.base_models import BaseModel


class Individual(BaseModel):
    IDENTIFICATION_TYPES = (
        ('national_id', 'National ID'),
        ('passport', 'Passport'),
        ('alien_id', 'Alien ID'),
        ('service_id', 'Service ID'),
    )
    
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    identification_type = models.CharField(max_length=20, choices=IDENTIFICATION_TYPES)
    identification_number = models.CharField(max_length=50, unique=True)
    email = models.EmailField(blank=True, null=True)
    mobile_phone = models.CharField(max_length=20)
    landline_phone = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)    
    # Relationships
    addresses = GenericRelation(Address)
    documents = GenericRelation(Document)
    notes = GenericRelation(Note)
    
    class Meta:
        app_label = 'individuals'
        db_table = 'individual'
        verbose_name = _('individual')
        verbose_name_plural = _('individuals')
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.identification_number})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class EmploymentDetail(BaseModel):
    MARITAL_STATUS_CHOICES = (
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    )
    
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE, related_name='employment_details')
    employer_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, blank=True, null=True)
    class Meta:
        app_label = 'individuals'
        db_table = 'employment_detail'
        verbose_name = _('employment detail')
        verbose_name_plural = _('employment details')
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.job_title} at {self.employer_name}"

class NextOfKin(BaseModel):
    RELATIONSHIP_CHOICES = (
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('child', 'Child'),
        ('sibling', 'Sibling'),
        ('other', 'Other'),
    )
    
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE, related_name='next_of_kin')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    mobile_phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    physical_address = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'individuals'
        db_table = 'next_of_kin'
        verbose_name = _('next of kin')
        verbose_name_plural = _('next of kin')
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_relationship_display()})"
    def get_relationship_display(self):
        return dict(self.RELATIONSHIP_CHOICES).get(self.relationship, 'Unknown')