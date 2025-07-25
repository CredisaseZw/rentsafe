# apps/leases/utils/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.leases.models.models import Lease
from apps.properties.models.models import Unit

@receiver(post_save, sender=Lease)
def update_unit_status(sender, instance, **kwargs):
    """
    Updates the unit status based on lease status
    """
    if instance.unit:
        if instance.status == 'ACTIVE':
            instance.unit.status = 'occupied'
        elif instance.status in ['TERMINATED', 'EXPIRED']:
            instance.unit.status = 'vacant'
        instance.unit.save()