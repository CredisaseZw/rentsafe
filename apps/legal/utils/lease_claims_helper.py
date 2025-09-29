from django.contrib.contenttypes.models import ContentType
from celery import shared_task 
from apps.legal.models.claims import Claim
from datetime import date

@shared_task
def create_claim_from_lease(lease,*args, **kwargs):
    """
    Creates a Claim based on the lease's status.
    
    Args:
        lease: Lease instance
    Returns:
        Claim instance or None
    """
    
    debtors = lease.lease_tenants.all()

    for tenant in debtors:
        lease_tenant = tenant.tenant_object
        claim = Claim.objects.create(
            client=lease.managing_client,
            debtor_content_type=ContentType.objects.get_for_model(lease_tenant),
            debtor_object_id=lease_tenant.id,
            data_source='Lease System',
            account_number=lease.account_number,
            currency=lease.currency,
            amount=lease.current_balance,
            claim_date=date.today(),
            is_verified=True,
        )
    return claim
