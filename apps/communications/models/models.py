from django.db import models

# Create your models here.
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from common.models.base_models import BaseModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Communication(BaseModel):
    COMMUNICATION_TYPES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('phone', 'Phone Call'),
        ('letter', 'Letter'),
        ('meeting', 'In-Person Meeting'),
        ('whatsapp', 'WhatsApp'),
    )

    DIRECTION_CHOICES = (
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
        ('phone', 'Phone Call'),
        ('letter', 'Letter'),
        ('meeting', 'In-Person Meeting'),
        ('whatsapp', 'WhatsApp'),
    )
    
    DIRECTION_CHOICES = (
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
    )
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPES)
    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)
    subject = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    sent_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_communications')
    sent_to = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    related_lease = models.ForeignKey('leases.Lease', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = _('communication')
        verbose_name_plural = _('communications')
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.get_communication_type_display()} - {self.subject or 'No Subject'}"

class CommunicationAttachment(BaseModel):
    communication = models.ForeignKey(Communication, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='communication_attachments/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = _('communication attachment')
        verbose_name_plural = _('communication attachments')
    
    def __str__(self):
        return self.file_name

class Reminder(BaseModel):
    REMINDER_TYPES = (
        ('payment', 'Payment Reminder'),
        ('inspection', 'Inspection Reminder'),
        ('renewal', 'Lease Renewal Reminder'),
        ('other', 'Other'),
    )
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    due_date = models.DateTimeField()
    message = models.TextField()
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reminders')
    
    class Meta:
        verbose_name = _('reminder')
        verbose_name_plural = _('reminders')
        ordering = ['due_date']
    
    def __str__(self):
        return f"{self.get_reminder_type_display()} for {self.content_object} due {self.due_date}"