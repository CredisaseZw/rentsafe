from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericRelation
from apps.common.models.base_models import BaseModel, BaseModelWithUser
from apps.common.models.models import Address, Document, Note
import random
import string

class PropertyType(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'properties'
        verbose_name = _('property type')
        verbose_name_plural = _('property types')
    
    def __str__(self):
        return self.name

class Property(BaseModelWithUser):
    PROPERTY_STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
        ('sold', 'Sold'),
    )
    managing_client = models.ForeignKey('clients.Client', on_delete=models.SET_NULL, related_name='properties', null=True, blank=True)
    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    name = models.CharField(max_length=255, null=True, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True,null = True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=PROPERTY_STATUS_CHOICES, default='active')
    year_built = models.PositiveIntegerField(blank=True, null=True)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="In square meters", default=0)
    is_furnished = models.BooleanField(default=False)
    total_number_of_units = models.PositiveIntegerField(default=0, help_text="Total number of units in the property")
    features = models.JSONField(blank=True, null=True, help_text="Additional features of the property")
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
        string_ =f"{self.name}" if self.name else f"{self.get_address()}"
        return string_

    def generate_unique_slug(self):
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        return slugify(self.name) if self.name else slugify(random_string)
    
    def get_address(self):
        return self.addresses.first() if self.addresses.exists() else "No Address"
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.generate_unique_slug()
        super().save(*args, **kwargs)


class Unit(BaseModelWithUser):
    UNIT_STATUS_CHOICES = (
        ('vacant', 'Vacant'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Under Maintenance'),
    )
    UNIT_TYPE_CHOICES = (
        ('apartment', _('Apartment')),
        ('house', _('House')),
        ('office', _('Office')),
        ('retail', _('Retail Space')),
        ('warehouse', _('Warehouse')),
        ('other', _('Other')),
    )
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='units')
    unit_number = models.CharField(max_length=50,default=0)
    unit_type = models.CharField(max_length=100,choices=UNIT_TYPE_CHOICES,default='other')
    number_of_rooms = models.PositiveIntegerField(help_text="Number of rooms in the unit",default=0)
    status = models.CharField(max_length=20, choices=UNIT_STATUS_CHOICES, default='vacant')
    features = models.JSONField(blank=True, null=True, help_text="Additional features of the unit")
    
    class Meta:
        app_label = 'properties'
        verbose_name = _('unit')
        verbose_name_plural = _('units')
        unique_together = ('property', 'unit_number')
    
    def __str__(self):
        return f"{self.property.name} - Unit {self.unit_number}"