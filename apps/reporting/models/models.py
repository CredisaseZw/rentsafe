from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from common.models.base_models import BaseModel
from common.models.models import Document, Note

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
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = _('report template')
        verbose_name_plural = _('report templates')
    
    def __str__(self):
        return self.name

class GeneratedReport(BaseModel):
    report_template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE)
    parameters = models.JSONField()
    generated_file = models.FileField(upload_to='generated_reports/')
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = _('generated report')
        verbose_name_plural = _('generated reports')
        ordering = ['-created_at']

    def __str__(self):
        return f"Report generated from {self.report_template} on {self.created_at}"