# apps/leases/utils.py
from django.contrib.contenttypes.models import ContentType
from apps.common.models.models import Address
from apps.properties.models.models import Property, Unit
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch
from datetime import datetime

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

def get_lease_payment_message_for_sms(lease,amount, payment_date):
    """
    Generates a payment confirmation message for the lease tenant
    """
    if isinstance(payment_date, str):
        try:
            payment_date = datetime.fromisoformat(payment_date)
        except ValueError:
            payment_date = None
    primary_tenant = lease.lease_tenants.filter(is_primary_tenant=True).first() if lease.lease_tenants else None
    full_name = get_tenant_display(primary_tenant.tenant_object) if primary_tenant else "Tenant"
    receiver = lease.managing_client.name if lease.managing_client else "Property Manager"
    currency = lease.currency.currency_code or "USD"
    amount_str = f"{currency} {amount:.2f}"
    payment_date = payment_date.strftime("%d-%B-%Y") if payment_date else "N/A"
    balance = lease.current_balance
    balance_str = f"{currency} {balance:.2f}"
    payment_status = lease.risk_level
    remarks = "Please pay balance to upgrade your risk status." if lease.risk_level != "LOW" else ""
    return f"Hi {full_name},\nConfirmed rent received by {receiver.capitalize()} of {amount_str} on {payment_date}.Balance left is {balance_str}.Your payment risk status is {payment_status}. {remarks}"
    