from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.utils.translation import gettext_lazy as _
from apps.common.models.base_models import BaseModel
from apps.accounting.models.models import Currency
from django.utils import timezone

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
    
    class Meta(BaseModel.Meta):
        app_label = 'maintenance'
        verbose_name = _("Maintenance Request")
        verbose_name_plural = _("Maintenance Requests")
        ordering = ['-requested_date']

class WorkSchedule(BaseModel):
    
    lease = models.ForeignKey('leases.Lease', on_delete=models.SET_NULL, null=True, blank=True,
                            related_name='work_schedules',
                            help_text=_("The lease associated with this work schedule, if property is leased."))
    
    title = models.CharField(_("Title"), max_length=255, blank=True, null=True,
                            help_text=_("A brief title for the work schedule."))
    details = models.TextField(_("Details"), blank=True, null=True,
                            help_text=_("Detailed description of the work to be done."))
    tradesman = models.CharField(_("Tradesman"), max_length=255, blank=True, null=True,
                            help_text=_("Name/ID of the tradesman performing the work."))
    contractor = models.CharField(_("Contractor Company"), max_length=255, blank=True, null=True,
                            help_text=_("Name/ID of the contractor company."))
    
    required_materials = models.TextField(_("Required Materials"), blank=True, null=True)
    budget = models.DecimalField(_("Budget"), max_digits=12, decimal_places=2, blank=True, null=True)
    
    responsible_person = models.CharField(_("Responsible Person"), max_length=255, blank=True, null=True,
                            help_text=_("Name/ID of the person responsible for overseeing the work."))
    
    reason = models.TextField(_("Reason"), blank=True, null=True,
                            help_text=_("Reason for the scheduled work (e.g., 'Tenant request', 'Routine maintenance')."))
    scheduled_date = models.DateField(_("Scheduled Date"), blank=True, null=True)
    tenant_landlord_contact = models.CharField(_("Tenant/Landlord Contact"), max_length=250, null=True, blank=True,
                            help_text=_("Contact person (tenant or landlord) related to this work."))
    
    origin = models.CharField(max_length=130,choices=[('tenant_comms_history','Tenant Comms History'),('creditor_comms_history','Creditor Comms History')],default='tenant_comms_history')

    
    STATUS_CHOICES = (
        ('PENDING', _('Pending')),
        ('IN_PROGRESS', _('In Progress')),
        ('COMPLETED', _('Completed')),
        ('CANCELLED', _('Cancelled')),
        ('ON_HOLD', _('On Hold')),
    )
    status = models.CharField(_("Status"), max_length=20, choices=STATUS_CHOICES, default="PENDING")
    
    class Meta(BaseModel.Meta):
        app_label = 'maintenance'
        verbose_name = _("Work Schedule")
        verbose_name_plural = _("Work Schedules")
        ordering = ['scheduled_date', 'status']

    def __str__(self):
        return f"Work Schedule: {self.title} for {self.property or self.lease}"

class MaintenanceSchedule(BaseModel):
    maintenance_number = models.CharField(_('Maintenance Unique Number'), max_length=25, unique=True, blank=True, null=True)
    lease = models.ForeignKey('leases.Lease', on_delete=models.SET_NULL, null=True, blank=True,
            related_name='maintenance_schedules',
            help_text=_("The lease associated with this maintenance schedule, if property is leased."))
    
    title = models.CharField(_("Title"), max_length=255, blank=True, null=True,
            help_text=_("A brief title for the maintenance schedule."))
    details = models.TextField(_("Details"), blank=True, null=True,
            help_text=_("Detailed description of the maintenance to be done."))
    
    tradesman = models.CharField(_("Tradesman"), max_length=255, blank=True, null=True)
    contractor = models.ForeignKey('Contractor', on_delete=models.SET_NULL, null=True, blank=True)
    
    required_materials = models.TextField(_("Required Materials"), blank=True, null=True)
    budget = models.DecimalField(_("Budget"), max_digits=12, decimal_places=2, blank=True, null=True)
    
    responsible_person = models.CharField(_("Responsible Person"), max_length=255, blank=True, null=True)
    reason = models.TextField(_("Reason"), blank=True, null=True)
    
    FREQUENCY_CHOICES = (
        ('DAILY', _('Daily')),
        ('WEEKLY', _('Weekly')),
        ('MONTHLY', _('Monthly')),
        ('QUARTERLY', _('Quarterly')),
        ('ANNUALLY', _('Annually')),
        ('BI_ANNUALLY', _('Bi-Annually')),
        ('OTHER', _('Other')),
    )
    frequency = models.CharField(_("Frequency"), max_length=20, choices=FREQUENCY_CHOICES, blank=True, null=True)
    
    scheduled_day = models.CharField(_("Scheduled Day (e.g., 'Monday', '15th')"), max_length=255, blank=True, null=True)
    month_frequency = models.IntegerField(_("Month Frequency (e.g., Every 3 months)"), null=True, blank=True)
    
    tenant_landlord_contact = models.CharField(_("Tenant/Landlord Contact"), max_length=255, null=True, blank=True)
    
    origin = models.CharField(max_length=130,choices=[('tenant_comms_history','Tenant Comms History'),('creditor_comms_history','Creditor Comms History')],default='tenant_comms_history')

    
    STATUS_CHOICES = (
        ('PENDING', _('Pending')),
        ('SCHEDULED', _('Scheduled')),
        ('COMPLETED', _('Completed')),
        ('CANCELLED', _('Cancelled')),
        ('OVERDUE', _('Overdue')),
    )
    status = models.CharField(_("Status"), max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def save(self, *args, **kwargs):
        if not self.maintenance_number:
            year = timezone.now().year
            last_maintenance = (
                MaintenanceSchedule.objects.filter(maintenance_number__startswith=f"#MS-{year}-")
                .order_by('-maintenance_number')
                .first()
            )

            if last_maintenance:
                last_number = int(last_maintenance.maintenance_number.split('-')[-1]) + 1
            else:
                last_number = 1  

            
            self.maintenance_number = f"#MS-{year}-{last_number:04}"

        super().save(*args, **kwargs)
    class Meta(BaseModel.Meta):
        app_label = 'maintenance'
        verbose_name = _("Maintenance Schedule")
        verbose_name_plural = _("Maintenance Schedules")
        ordering = ['-date_created']

    def __str__(self):
        return f"Maintenance Schedule: {self.title} for {self.lease} ({self.frequency})"

class Industry(BaseModel):
    name = models.CharField(_("Name"), max_length=255)
    description = models.TextField(_("Description"), blank=True, null=True)

    class Meta():
        app_label = 'maintenance'
        verbose_name = ('Industry')
        verbose_name = ('Industries')
        ordering = ['name',]

    def __str__(self):
        return self.name
    
class Contractor(BaseModel):
    reg_number = models.CharField(_("Registration Number / ID Number"), max_length=255)
    name = models.CharField(_("Name"), max_length=255)
    phone = models.CharField(_("Phone"), max_length=20, blank=True, null=True)
    email = models.EmailField(_("Email"), blank=True, null=True)
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True)

    # contact person if its a company

    contact_person = models.CharField(_("Contact Person"), max_length=255, blank=True, null=True)
    contact_phone = models.CharField(_("Contact Phone"), max_length=20, blank=True, null=True)
    contact_email = models.EmailField(_("Contact Email"), blank=True, null=True)

    charge_currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, blank=True)
    standard_rate = models.DecimalField(_("Standard Charge"), max_digits=12, decimal_places=2, blank=True, null=True)
    emergency_rate = models.DecimalField(_("Standard Charge"), max_digits=12, decimal_places=2, blank=True, null=True)
    license_number = models.CharField(_("License Number"), max_length=255, unique=True)

    address = GenericRelation('common.Address', on_delete=models.SET_NULL)
    is_active = models.BooleanField(_("Active Status"), default=True)

    class Meta(BaseModel.Meta):
        app_label = 'maintenance'
        verbose_name = _("Contractor")
        verbose_name_plural = _("Contractors")
        ordering = ['id',]
    
    def __str__(self):
        return f'{self.name} ({self.phone})'