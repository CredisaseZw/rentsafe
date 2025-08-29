# apps/leases/helpers.py
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from rest_framework.exceptions import ValidationError
from apps.accounting.models import Currency
from apps.leases.models import (
    Lease, 
    LeaseTenant, 
    LeaseCharge, 
    Landlord, 
    Guarantor, 
    LeaseOpeningBalance, 
    LandlordOpeningBalance,
    LeaseDeposit
)
from apps.properties.utils.helpers import process_address_data
from apps.properties.utils.helpers import create_property_and_unit
from datetime import date
from dateutil.relativedelta import relativedelta
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company
from apps.clients.models import Client
import logging

logger = logging.getLogger(__name__)

def create_lease_with_dependencies(lease_data, user=None):
    """
    Comprehensive helper to create a lease with all dependencies.
    """
    try:
        with transaction.atomic():
            # Avoiding to modify the original data
            data_for_lease_creation = lease_data.copy()
            # data that shouldn't go into the Lease.objects.create call
            property_data = data_for_lease_creation.pop('property_data', None)
            unit_data = data_for_lease_creation.pop('unit_data', None)
            address_data = data_for_lease_creation.pop('address_data', {})
            tenants_data = data_for_lease_creation.pop('tenants', [])
            charges_data = data_for_lease_creation.pop('charges', [])
            landlord_data = data_for_lease_creation.pop('landlord_data', None)
            guarantor_data = data_for_lease_creation.pop('guarantor_data', None)
            lease_opening_balance_data = data_for_lease_creation.pop('lease_opening_balance_data', None)
            landlord_opening_balances_data = data_for_lease_creation.pop('landlord_opening_balances_data', [])
            deposits_data = data_for_lease_creation.pop('deposits', [])
            unit_instance = data_for_lease_creation.pop('unit', None)
            property_instance = None
            
            if not unit_instance and property_data and unit_data:
                logger.debug("Creating new property and unit")
                processed_address_data = process_address_data(address_data)
                property_instance, unit_instance = create_property_and_unit(
                    property_data, unit_data, processed_address_data, user
                )
                logger.debug(f"New unit ID: {unit_instance.id}")
            elif not unit_instance:
                raise ValidationError("Either provide an existing unit or property_data + unit_data.")
            else:
                logger.debug("Using existing unit")
            
            data_for_lease_creation['unit'] = unit_instance
            
            # Handle landlord
            landlord_instance = data_for_lease_creation.pop('landlord', None)
            if not landlord_instance and landlord_data:
                landlord_instance = create_or_get_landlord(landlord_data)
            data_for_lease_creation['landlord'] = landlord_instance
            
            # Handle guarantor
            guarantor_instance = data_for_lease_creation.pop('guarantor', None)
            if not guarantor_instance and guarantor_data:
                guarantor_instance = create_or_get_guarantor(guarantor_data)
            data_for_lease_creation['guarantor'] = guarantor_instance
            
            # Add user to the data
            data_for_lease_creation['created_by'] = user
            # Create lease
            lease = Lease.objects.create(**data_for_lease_creation)
            
            # Link landlord to property if both were created
            if landlord_instance and property_instance:
                landlord_instance.properties.add(property_instance)
            
            # Create tenants
            for tenant_data in tenants_data:
                create_lease_tenant(lease, tenant_data, user)
            
            # Create charges
            for charge_data in charges_data:
                create_lease_charge(lease, charge_data, user)
            
            # Create deposits
            if deposits_data:
                for deposit_data in deposits_data:
                    create_lease_deposit(lease, deposit_data)

            # Create opening balance records
            if lease_opening_balance_data:
                LeaseOpeningBalance.objects.create(lease=lease, **lease_opening_balance_data, created_by=user)
                lease.determine_initial_risk_status()
            
            if landlord_opening_balances_data and landlord_instance:
                for balance_data in landlord_opening_balances_data:
                    LandlordOpeningBalance.objects.create(
                        landlord=landlord_instance,
                        debtor=user.client,
                        created_by=user,
                        lease_id=lease.lease_id,
                        **balance_data
                    )
            
            logger.debug("Lease creation completed successfully")
            return lease
            
    except Exception as e:
        logger.error(f"Error in create_lease_with_dependencies: {str(e)}", exc_info=True)
        raise ValidationError(f"Failed to create lease: {str(e)}")
        
def create_or_get_landlord(landlord_data):
    """
    Helper to create or get a landlord based on your model structure.
    
    Args:
        landlord_data (dict): Landlord data with landlord_type and landlord_id
    
    Returns:
        Landlord: Landlord instance
    """
    landlord_type = landlord_data.get('landlord_type')
    landlord_id = landlord_data.get('landlord_id')
    
    if not landlord_type or not landlord_id:
        raise ValidationError("Landlord data must include landlord_type and landlord_id")
    
    try:
        # Get the actual landlord object (Individual or Company)
        if landlord_type == 'individual':
            landlord_obj = Individual.objects.get(id=landlord_id)
            landlord_name = landlord_obj.full_name
        elif landlord_type == 'company':
            landlord_obj = Company.objects.get(id=landlord_id)
            landlord_name = landlord_obj.registration_name
        else:
            raise ValidationError(f"Invalid landlord type: {landlord_type}")
        
        # Check if landlord already exists with this ID
        landlord = Landlord.objects.filter(landlord_id=str(landlord_id)).first()
        
        if not landlord:
            # Create new landlord
            landlord = Landlord.objects.create(
                landlord_name=landlord_name,
                landlord_type=landlord_type,
                landlord_id=str(landlord_id)
            )
        else:
            # Update landlord name if it has changed
            if landlord.landlord_name != landlord_name:
                landlord.landlord_name = landlord_name
                landlord.save()
        
        return landlord
        
    except (Individual.DoesNotExist, Company.DoesNotExist):
        raise ValidationError(f"{landlord_type.capitalize()} with ID {landlord_id} not found")
    except Exception as e:
        raise ValidationError(f"Failed to process landlord: {str(e)}")


def create_or_get_guarantor(guarantor_data):
    """
    Helper to create or get a guarantor.
    
    Args:
        guarantor_data (dict): Guarantor data
    
    Returns:
        Guarantor: Guarantor instance
    """
    guarantor_type = guarantor_data.get('guarantor_type')
    guarantor_id = guarantor_data.get('guarantor_id')
    guarantee_amount = guarantor_data.get('guarantee_amount')
    
    if not guarantor_type or not guarantor_id:
        raise ValidationError("Guarantor data must include guarantor_type and guarantor_id")
    
    try:
        content_type = ContentType.objects.get(
            app_label='individuals' if guarantor_type == 'individual' else 'companies',
            model='individual' if guarantor_type == 'individual' else 'companybranch'
        )
        
        # Check if guarantor already exists
        guarantor = Guarantor.objects.filter(
            content_type=content_type,
            object_id=guarantor_id
        ).first()
        
        if not guarantor:
            # Create new guarantor
            guarantor = Guarantor.objects.create(
                content_type=content_type,
                object_id=guarantor_id,
                guarantee_amount=guarantee_amount
            )
        
        return guarantor
        
    except ContentType.DoesNotExist:
        raise ValidationError(f"Invalid guarantor type: {guarantor_type}")
    except Exception as e:
        raise ValidationError(f"Failed to process guarantor: {str(e)}")


def create_lease_tenant(lease, tenant_data, user=None):
    """
    Helper to create a lease tenant.
    
    Args:
        lease (Lease): Lease instance
        tenant_data (dict): Tenant data
        user (User, optional): User who is creating the tenant
    """
    tenant_type = tenant_data.get('tenant_type')
    tenant_id = tenant_data.get('tenant_id')
    is_primary_tenant = tenant_data.get('is_primary_tenant', False)
    
    if not tenant_type or not tenant_id:
        raise ValidationError("Tenant data must include tenant_type and tenant_id")
    
    try:
        content_type = ContentType.objects.get(
            app_label='individuals' if tenant_type == 'individual' else 'companies',
            model='individual' if tenant_type == 'individual' else 'companybranch'
        )
        
        # Check if tenant already exists on this lease
        if LeaseTenant.objects.filter(
            lease=lease,
            content_type=content_type,
            object_id=tenant_id
        ).exists():
            raise ValidationError("Tenant is already associated with this lease")
        
        # Create lease tenant
        lease_tenant = LeaseTenant.objects.create(
            lease=lease,
            content_type=content_type,
            object_id=tenant_id,
            is_primary_tenant=is_primary_tenant
        )
        
        return lease_tenant
        
    except ContentType.DoesNotExist:
        raise ValidationError(f"Invalid tenant type: {tenant_type}")
    except Exception as e:
        raise ValidationError(f"Failed to create lease tenant: {str(e)}")


def create_lease_charge(lease, charge_data, user=None):
    """
    Helper to create a lease charge.
    
    Args:
        lease (Lease): Lease instance
        charge_data (dict): Charge data
        user (User, optional): User who is creating the charge
    """
    try:
        charge_data['lease'] = lease
        return LeaseCharge.objects.create(**charge_data)
    except Exception as e:
        raise ValidationError(f"Failed to create lease charge: {str(e)}")

def create_lease_deposit(lease, deposit_data):
    """
    Helper to create a lease deposit.
    
    Args:
        lease (Lease): Lease instance
        deposit_data (dict): Deposit data
    """
    try:
        deposit_data['lease'] = lease
        currency_id = deposit_data.pop('currency')
        currency_instance = Currency.objects.get(id=currency_id.id)
        deposit_data['currency'] = currency_instance

        return LeaseDeposit.objects.create(**deposit_data)
    except Currency.DoesNotExist:
        raise ValidationError(f"Currency with ID {currency_id} not found.")
    except Exception as e:
        raise ValidationError(f"Failed to create lease deposit: {str(e)}")


def get_opening_balance_oldest(opening_balance):
    today = date.today()
    sale_date = today 
    if opening_balance.three_months_plus_balance > 0:
        sale_date = today - relativedelta(months=4)
    elif opening_balance.three_months_back_balance > 0:
        sale_date = today - relativedelta(months=3)
    elif opening_balance.two_months_back_balance > 0:
        sale_date = today - relativedelta(months=2)
    elif opening_balance.one_month_back_balance > 0:
        sale_date = today - relativedelta(months=1)
    elif opening_balance.current_month_balance > 0:
        sale_date = today 
    return sale_date