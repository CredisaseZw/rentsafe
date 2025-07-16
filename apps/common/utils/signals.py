# apps/common/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.common.utils.caching import CacheService
from apps.companies.models.models import Company, CompanyBranch


def invalidate_caches(instance):
    """A central function to handle invalidation logic."""
    model_name = instance._meta.model_name.lower()
    
    CacheService.invalidate_tag(f"{model_name}:list")
    
    CacheService.invalidate_tag(f"{model_name}:search")
    
    if hasattr(instance, 'pk') and instance.pk:
        CacheService.invalidate_tag(f"{model_name}:{instance.pk}")
        CacheService.invalidate_tag(f"{model_name}:{instance.pk}:branches")

    if isinstance(instance, CompanyBranch) and hasattr(instance, 'company'):
        parent_model_name = instance.company._meta.model_name.lower()
        CacheService.invalidate_tag(f"{parent_model_name}:{instance.company.pk}")
        CacheService.invalidate_tag(f"{parent_model_name}:{instance.company.pk}:branches")


@receiver([post_save, post_delete])
def invalidate_model_cache(sender, instance, **kwargs):
    """
    Signal receiver to invalidate cache when any registered model is saved or deleted.
    """
    MONITORED_MODELS = (Company, CompanyBranch)
    
    if sender in MONITORED_MODELS:
        invalidate_caches(instance)