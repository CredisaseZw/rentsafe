from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation
from apps.common.models.base_models import BaseModel
from apps.common.models.models import Address, Document, Note

class PropertyType(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'properties'
        verbose_name = _('property type')
        verbose_name_plural = _('property types')
    
    def __str__(self):
        return self.name

class Property(BaseModel):
    PROPERTY_STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
        ('sold', 'Sold'),
    )
    
    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=PROPERTY_STATUS_CHOICES, default='active')
    year_built = models.PositiveIntegerField(blank=True, null=True)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="In square meters")
    is_furnished = models.BooleanField(default=False)
    # Relationships
    addresses = GenericRelation(Address)
    documents = GenericRelation(Document, related_query_name='property_document', null=True, blank=True,
                            help_text=_("Documents associated with the property."))
    notes = GenericRelation(Note, related_query_name='property_note', null=True, blank=True,
                            help_text=_("Notes associated with the property."))

    class Meta:
        app_label = 'properties'
        verbose_name = _('property')
        verbose_name_plural = _('properties')
    
    def __str__(self):
        return self.name

class Unit(BaseModel):
    UNIT_STATUS_CHOICES = (
        ('vacant', 'Vacant'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Under Maintenance'),
    )
    UNIT_TYPE_CHOICES = (
        ('APARTMENT', _('Apartment')),
        ('HOUSE', _('House')),
        ('OFFICE', _('Office')),
        ('RETAIL', _('Retail Space')),
        ('WAREHOUSE', _('Warehouse')),
        ('OTHER', _('Other')),
    )
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='units')
    unit_number = models.CharField(max_length=50,default=0)
    unit_type = models.CharField(max_length=100,choices=UNIT_TYPE_CHOICES,default='OTHER')
    floor_number = models.PositiveIntegerField(help_text="Floor number where the unit is located",default=0)
    bedrooms = models.PositiveIntegerField(help_text="Number of bedrooms in the unit",default=0)
    bathrooms = models.PositiveIntegerField(help_text="Number of bathrooms in the unit",default=0)
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="In square meters",null=True,blank=True)
    status = models.CharField(max_length=20, choices=UNIT_STATUS_CHOICES, default='vacant')
    monthly_rent = models.DecimalField(max_digits=12, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=12, decimal_places=2,default=0)
    features = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'properties'
        verbose_name = _('unit')
        verbose_name_plural = _('units')
        unique_together = ('property', 'unit_number')
    
    def __str__(self):
        return f"{self.property.name} - Unit {self.unit_number}"