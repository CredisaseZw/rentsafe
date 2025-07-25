# apps/leases/utils.py
from django.contrib.contenttypes.models import ContentType
from apps.common.models.models import Address
from apps.properties.models.models import Property, Unit
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch

def create_address_for_entity(entity, address_data):
    """
    Creates an address for any entity (Property, Unit, Individual, CompanyBranch)
    """
    content_type = ContentType.objects.get_for_model(entity.__class__)
    
    address = Address.objects.create(
        content_type=content_type,
        object_id=entity.id,
        **address_data
    )
    return address

def handle_lease_addresses(unit, address_data):
    """
    Ensures both the property and unit have addresses
    """
    if not unit.property.addresses.exists():
        create_address_for_entity(unit.property, address_data)
    
    if not unit.addresses.exists():
        create_address_for_entity(unit, address_data)

def get_tenant_display(tenant):
    """
    Returns a consistent display string for a tenant (individual or company branch)
    """
    if isinstance(tenant, Individual):
        return f"{tenant.first_name} {tenant.last_name}"
    elif isinstance(tenant, CompanyBranch):
        return f"{tenant.branch_name} ({tenant.company.registration_name})"
    return str(tenant)