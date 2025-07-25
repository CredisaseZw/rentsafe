from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
        
class BaseModel(models.Model):
    """
    An abstract base model that provides common fields and methods for all models.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                            default=None, blank=True, null=True,
                            help_text=_("The user who last created or modified this record."))
    date_created = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        abstract = True
        ordering = ['-date_created']
        verbose_name = _("base model")
        verbose_name_plural = _("base models")
        
    def save(self, *args, **kwargs):
        if not self.pk: 
            if 'request' in kwargs and hasattr(kwargs['request'], 'user') and kwargs['request'].user.is_authenticated:
                self.user = kwargs['request'].user
            elif self.user is None and settings.DEBUG:
                print("Warning: BaseModel instance saved without an associated user in save method.")
        request = kwargs.pop('request', None) 
        
        super().save(*args, **kwargs)