from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from apps.common.models.base_models import BaseModel
from apps.properties.models import Property

class Landlord(BaseModel):
    landlord_name = models.CharField(max_length=255)
    landlord_type = models.CharField(max_length=100, choices=[
        ('individual', 'Individual'),
        ('company', 'Company'),
    ])
    landlord_id = models.CharField(max_length=100, blank=True, null=True)
    properties = models.ManyToManyField(Property, related_name='landlords')
    class Meta:
        app_label = 'leases'
        db_table = 'landlord'
        verbose_name = 'Landlord'
        verbose_name_plural = 'Landlords'
        ordering = ['-date_created']
    def __str__(self):
        return f"Landlord: {self.landlord_name}" if self.landlord_name else None
