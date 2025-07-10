# Signal to automatically create HQ branch (place this in signals.py and connect in apps.py)
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.companies.models.models import Company
@receiver(post_save, sender=Company)
def create_headquarters_branch_signal(sender, instance, created, **kwargs):
    if created:
        instance.auto_create_hq_branch()
