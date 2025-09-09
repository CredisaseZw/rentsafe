from typing import Tuple, Optional, Any
from django.http import HttpRequest

def determine_recipient_info(tenant_object) -> Tuple[str, int, str]:
    """
    Determine recipient type, ID, and name from a tenant object.

    Returns:
        Tuple of (recipient_type, recipient_id, recipient_name)
    """
    from apps.companies.models import CompanyBranch
    from apps.individuals.models import Individual
    
    if isinstance(tenant_object, CompanyBranch):
        recipient_type = 'company'
    elif isinstance(tenant_object, Individual):
        recipient_type = 'individual'
    else:
        raise ValueError(f"Unsupported tenant object type: {type(tenant_object)}")

    recipient_id = tenant_object.id
    recipient_name = tenant_object.full_name
    print('tenant details.....', recipient_type, recipient_id, recipient_name)
    return recipient_type, recipient_id, recipient_name


def get_primary_tenant(lease) -> Optional[Any]:
    """Get the primary tenant from a lease"""
    if hasattr(lease, 'lease_tenants'):
        primary_tenant = lease.lease_tenants.filter(is_primary_tenant=True).first()
        return primary_tenant.tenant_object if primary_tenant else None
    return None


def get_any_tenant(lease) -> Optional[Any]:
    """Get any tenant from a lease (fallback)"""
    if hasattr(lease, 'lease_tenants') and lease.lease_tenants.exists():
        return lease.lease_tenants.first().tenant_object
    return None