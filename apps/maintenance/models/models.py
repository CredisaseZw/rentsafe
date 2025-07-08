from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from common.models.base_models import BaseModel


# Create your models here.
class MaintenanceRequest(BaseModel):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('emergency', 'Emergency'),
    )
    
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    lease = models.ForeignKey('leases.Lease', on_delete=models.CASCADE)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='requested_maintenance')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_maintenance')
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    requested_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    photos = GenericRelation('common.Document')

class MaintenanceSchedule(BaseModel):
    FREQUENCY_CHOICES = (
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('biannual', 'Biannual'),
        ('annual', 'Annual'),
    )
    
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    last_performed = models.DateTimeField(null=True, blank=True)
    next_due = models.DateTimeField()
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)