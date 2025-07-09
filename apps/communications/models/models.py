from django.db import models
from django.db.models import Q

# Create your models here.
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from common.models.base_models import BaseModel
from django.contrib.auth import get_user_model
from django.utils import timezone
from common.models.models import Note
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
    
    class Meta:
        verbose_name = _('reminder')
        verbose_name_plural = _('reminders')
        ordering = ['due_date']
    
    def __str__(self):
        return f"{self.get_reminder_type_display()} for {self.content_object} due {self.due_date}"

def get_default_otp_expire_time():
    return timezone.now() + timezone.timedelta(minutes=5)

class OTP(BaseModel):
    REQUESTED_USER_TYPE_CHOICES = (
        ("INDIVIDUAL", _("Individual")),
        ("COMPANY", _("Company")),
    )
    
    otp_code = models.CharField(_("OTP Code"), max_length=6)
    
    OTP_TYPE_CHOICES = (
        ('VERIFICATION', _('Account Verification')),
        ('PASSWORD_RESET', _('Password Reset')),
        ('LOGIN', _('Login')),
        ('TRANSACTION', _('Transaction Confirmation')),
        ('OTHER', _('Other')),
    )
    otp_type = models.CharField(_("OTP Type"), max_length=20, choices=OTP_TYPE_CHOICES)
    requested_entity_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                        limit_choices_to=Q(app_label='individuals', model='individual') |
                                        Q(app_label='companies', model='companybranch'),
                                        related_name='otps_for_entity_type',
                                        help_text=_("The type of entity for whom the OTP is requested."))
    requested_entity_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the entity (Individual or Company) for whom the OTP is requested.")
    )
    requested_entity = GenericForeignKey('requested_entity_content_type', 'requested_entity_object_id')
    
    requested_user_type = models.CharField(
        _("Requested User Type"), max_length=100, choices=REQUESTED_USER_TYPE_CHOICES, default="INDIVIDUAL"
    )
    expire_at = models.DateTimeField(_("Expiry Time"), default=get_default_otp_expire_time)
    
    is_used = models.BooleanField(_("Is Used"), default=False)
    
    class Meta(BaseModel.Meta):
        verbose_name = _("OTP")
        verbose_name_plural = _("OTPs")
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP {self.otp_code} for {self.requested_entity} ({self.otp_type})"


class DebtorIntelligenceNote(BaseModel):
    client_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                limit_choices_to=Q(app_label='individuals', model='individual') |
                Q(app_label='companies', model='companybranch'),
                related_name='debtor_intelligence_notes_as_client',
                help_text=_("The type of entity this note is about (debtor)."))
    client_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the client entity (Individual or Company) this note is about.")
    )
    client_object = GenericForeignKey('client_content_type', 'client_object_id')

    notes = GenericRelation(Note)
    class Meta(BaseModel.Meta):
        verbose_name = _("Debtor Intelligence Note")
        verbose_name_plural = _("Debtor Intelligence Notes")
        ordering = ['-created_at']

    def __str__(self):
        return f"Note for {self.client_object} by {self.user.username if self.user else 'System'}"


class CommunicationHistoryReminder(BaseModel):
    client_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
            limit_choices_to=Q(app_label='individuals', model='individual') |
            Q(app_label='companies', model='companybranch'),
            related_name='reminders_as_client',
            help_text=_("The type of entity this reminder is about."))
    client_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the client entity (Individual or Company) this reminder is about.")
    )
    client_object = GenericForeignKey('client_content_type', 'client_object_id')
    
    message = models.TextField(_("Message"), help_text=_("The content of the reminder message."))

    channel_path = models.CharField(_("Channel Path"), max_length=255, 
                                help_text=_("The channel path for the reminder."),
                                choices=[
                                    ('is_sms', 'SMS'),
                                    ('is_email', 'Email'),
                                    ('note','Note')
                                ],
                                default='is_sms'
                                )

    action_date = models.DateField(_("Action Date"), null=True, default=None,
                    help_text=_("The date the reminder action is scheduled for."))
    message_sent = models.BooleanField(_("Message Sent"), default=False,
                    help_text=_("Indicates if the reminder message has been sent."))

    origin = models.CharField(max_length=130,choices=[('tenant_comms_history','Tenant'),('creditor_comms_history','Creditor Comms History')],default='tenant_comms_history')

    class Meta(BaseModel.Meta):
        verbose_name = _("Communication History Reminder")
        verbose_name_plural = _("Communication History Reminders")
        ordering = ['-created_at', 'action_date']

    def __str__(self):
        return f"Reminder for {self.client_object} on {self.action_date}"


class CommsHistMessage(BaseModel):
    client_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                    limit_choices_to=Q(app_label='individuals', model='individual') |
                    Q(app_label='companies', model='companybranch'),
                    related_name='messages_as_client',
                    help_text=_("The type of entity this message is to/from."))
    client_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the client entity (Individual or Company) this message is to/from.")
    )
    client_object = GenericForeignKey('client_content_type', 'client_object_id')
    
    message = models.TextField(_("Message Content"))
    origin = models.CharField(max_length=130,choices=[('tenant_comms_history','Tenant Comms History'),('creditor_comms_history','Creditor Comms History')],default='tenant_comms_history')
    channel_path = models.CharField(_("Channel Path"), max_length=50, 
                                help_text=_("The channel path for the reminder."),
                                choices=[
                                    ('is_sms', 'SMS'),
                                    ('is_email', 'Email'),
                                    ('note','Note')
                                ],default='is_sms'
                                )
    

    class Meta(BaseModel.Meta):
        verbose_name = _("Communication Message")
        verbose_name_plural = _("Communication Messages")
        ordering = ['-created_at']

    def __str__(self):
        return f"Message for {self.client_object} at {self.created_at}"