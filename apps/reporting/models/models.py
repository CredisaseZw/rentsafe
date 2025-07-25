from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from apps.common.models.base_models import BaseModel

# from simple_history.models import HistoricalRecords

User = get_user_model()
class ReportTemplate(BaseModel):
    REPORT_TYPES = (
        ('lease', 'Lease Report'),
        ('financial', 'Financial Report'),
        ('property', 'Property Report'),
        ('tenant', 'Tenant Report'),
        ('custom', 'Custom Report'),
    )
    
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True, null=True)
    template_file = models.FileField(upload_to='report_templates/')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        app_label = 'reporting'
        db_table = "report_templates"
        verbose_name = _('report template')
        verbose_name_plural = _('report templates')
    
    def __str__(self):
        return self.name

class GeneratedReport(BaseModel):
    report_template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE)
    parameters = models.JSONField()
    generated_file = models.FileField(upload_to='generated_reports/')
    
    class Meta:
        app_label = 'reporting'
        db_table = "generated_reports"
        verbose_name = _('generated report')
        verbose_name_plural = _('generated reports')
        ordering = ['-date_created']

    def __str__(self):
        return f"Report generated from {self.report_template} on {self.date_created}"

class Enquiry(BaseModel):
    enquired_entity_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                    limit_choices_to=Q(app_label='individuals', model='individual') |
                    Q(app_label='companies', model='companybranch'),
                    related_name='enquiries_for_entity_type',
                    help_text=_("The type of entity that was enquired about."))
    enquired_entity_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the entity (Individual or Company) that was enquired about.")
    )
    enquired_entity = GenericForeignKey('enquired_entity_content_type', 'enquired_entity_object_id')

    class Meta(BaseModel.Meta):
        app_label = 'reporting'
        db_table = "enquiries"
        verbose_name = _("Enquiry")
        verbose_name_plural = _("Enquiries")
        ordering = ['-date_created']

    def __str__(self):
        return f"Enquiry by {self.user.username if self.user else 'System'} about {self.enquired_entity} on {self.date_created}"