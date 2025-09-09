# apps/leases/serializers.py
from rest_framework import serializers
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django.utils.text import slugify

from apps.leases.models import (
    Lease, LeaseTenant, LeaseCharge, 
    LeaseTermination, Guarantor, LeaseOpeningBalance, 
    LandlordOpeningBalance, LeaseDeposit, Landlord
)
from apps.subscriptions.models import Subscription
from apps.properties.models.models import Property, Unit, PropertyType
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch
from apps.common.models.models import Address
from apps.accounting.models import Currency,Payment, PaymentMethod
from apps.common.api.serializers import AddressSerializer
from apps.leases.utils.helpers import create_lease_with_dependencies
from apps.properties.utils.helpers import process_address_data
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'payment_method_name']

class PaymentSerializer(serializers.ModelSerializer):
    method = PaymentMethodSerializer()
    invoice_number = serializers.CharField(source='invoice.document_number')
    
    class Meta:
        model = Payment
        fields = ['id', 'invoice_number', 'amount', 'method', 'payment_date', 'reference']


# Helper serializers for related objects
class IndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = Individual
        fields = ['id', 'full_name', 'identification_number']

class CompanyBranchSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.registration_name', read_only=True)
    class Meta:
        model = CompanyBranch
        fields = ['id', 'full_name', 'company_name']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'currency_code', 'currency_name']

class MinimalLeaseSerializer(serializers.ModelSerializer):
    unit = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    landlord = serializers.PrimaryKeyRelatedField(queryset=Landlord.objects.all())
    
    class Meta:
        model = Lease
        fields = ['id', 'lease_id', 'unit', 'start_date', 'end_date', 'status', 'landlord']

class LeaseTenantSerializer(serializers.ModelSerializer):
    tenant_object = serializers.SerializerMethodField()
    tenant_type = serializers.CharField(write_only=True)
    tenant_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = LeaseTenant
        fields = ['id', 'lease', 'tenant_object', 'is_primary_tenant', 'tenant_type', 'tenant_id']
        read_only_fields = ['lease','tenant_object']
        extra_kwargs = {
            'lease': {'required': False}
        }
    
    def get_tenant_object(self, obj):
        if obj.tenant_object:
            if isinstance(obj.tenant_object, Individual):
                return IndividualSerializer(obj.tenant_object).data
            elif isinstance(obj.tenant_object, CompanyBranch):
                return CompanyBranchSerializer(obj.tenant_object).data
        return None
    
    def validate(self, data):
        lease = data.get('lease')
        tenant_type = data.get('tenant_type')
        tenant_id = data.get('tenant_id')
        
        if tenant_type not in ['individual', 'company']:
            raise serializers.ValidationError("Invalid tenant type. Must be 'individual' or 'company'.")

        try:
            content_type = ContentType.objects.get(
                app_label='individuals' if tenant_type == 'individual' else 'companies',
                model='individual' if tenant_type == 'individual' else 'companybranch'
            )
            tenant = content_type.get_object_for_this_type(id=tenant_id)
            data['content_type'] = content_type
            data['object_id'] = tenant_id
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Invalid content type for {tenant_type}.")
        except Exception as e:
            raise serializers.ValidationError(f"Tenant not found: {str(e)}")
        
        # Check if this tenant is already on the lease
        if lease and LeaseTenant.objects.filter(
            lease=lease,
            content_type=content_type,
            object_id=tenant_id
        ).exists():
            raise serializers.ValidationError("This tenant is already associated with this lease.")
        
        return data

class LeaseChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaseCharge
        fields = '__all__'
        extra_kwargs = {
            'lease': {'required': False}
        }

class LeaseChargeListSerializer(serializers.ModelSerializer):
    currency = serializers.CharField(source='currency.currency_code', read_only=True)
    class Meta:
        model = LeaseCharge
        fields = ['id', 'amount', 'currency', 'charge_type']
        extra_kwargs = {
            'lease': {'required': False}
        }

class LeaseTerminationSerializer(serializers.ModelSerializer):
    lease = serializers.CharField(required=False)
    class Meta:
        model = LeaseTermination
        fields = '__all__'

class GuarantorSerializer(serializers.ModelSerializer):
    guarantor_object = serializers.SerializerMethodField()
    guarantor_type = serializers.CharField(write_only=True)
    guarantor_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Guarantor
        fields = ['id', 'guarantor_object', 'guarantee_amount', 'guarantor_type', 'guarantor_id']
        read_only_fields = ['guarantor_object']
    
    def get_guarantor_object(self, obj):
        if obj.guarantor_object:
            if isinstance(obj.guarantor_object, Individual):
                return IndividualSerializer(obj.guarantor_object).data
            elif isinstance(obj.guarantor_object, CompanyBranch):
                return CompanyBranchSerializer(obj.guarantor_object).data
        return None
    
    def validate(self, data):
        guarantor_type = data.get('guarantor_type')
        guarantor_id = data.get('guarantor_id')
        
        if guarantor_type not in ['individual', 'company_branch']:
            raise serializers.ValidationError("Invalid guarantor type. Must be 'individual' or 'company_branch'.")
        
        try:
            content_type = ContentType.objects.get(
                app_label='individuals' if guarantor_type == 'individual' else 'companies',
                model=guarantor_type
            )
            guarantor = content_type.get_object_for_this_type(id=guarantor_id)
            data['content_type'] = content_type
            data['object_id'] = guarantor_id
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Invalid content type for {guarantor_type}.")
        except Exception as e:
            raise serializers.ValidationError(f"Guarantor not found: {str(e)}")
        return data
    def create(self, validated_data):
        content_type = validated_data.pop('content_type')
        object_id = validated_data.pop('object_id')
        
        validated_data.pop('guarantor_type', None)
        validated_data.pop('guarantor_id', None)

        return Guarantor.objects.create(
            content_type=content_type, 
            object_id=object_id, 
            **validated_data
        )

class LandlordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Landlord
        fields = ['id', 'landlord_name', 'landlord_type', 'landlord_id']
        read_only_fields = ['id']

class LeaseDepositSerializer(serializers.ModelSerializer):
    """
    Serializer for the LeaseDeposit model.
    This serializer handles the nested deposit data within the lease payload.
    """
    class Meta:
        model = LeaseDeposit
        fields = ['id', 'amount', 'currency', 'deposit_date', 'deposit_holder']
        read_only_fields = ['id']

class LeaseOpeningBalanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the LeaseOpeningBalance model.
    """
    class Meta:
        model = LeaseOpeningBalance
        exclude = ['lease', 'created_by', 'updated_by','date_created','date_updated']
        read_only_fields = ['id', 'date_created', 'date_updated']

class LandlordOpeningBalanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the LandlordOpeningBalance model.
    It uses write_only fields for debtor identification.
    """
    landlord = LandlordSerializer(read_only=True)
    class Meta:
        model = LandlordOpeningBalance
        exclude = ['debtor', 'created_by', 'updated_by','date_created','date_updated','lease_id']
        read_only_fields = ['id']

    def validate(self, data):
        return data

class LeaseDetailSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, source='lease_tenants', read_only=True)
    charges = LeaseChargeListSerializer(many=True, read_only=True)
    guarantor = GuarantorSerializer(read_only=True)
    deposits = LeaseDepositSerializer(many=True, read_only=True)
    unit = serializers.SerializerMethodField()
    currency = CurrencySerializer(read_only=True)
    risk_level_class = serializers.SerializerMethodField()
    owing = serializers.SerializerMethodField()
    lease_opening_balance_data = serializers.SerializerMethodField()
    landlord_opening_balances_data = serializers.SerializerMethodField()
    

    class Meta:
        model = Lease
        exclude = ['landlord', 'created_by', 'updated_by']
        # fields = '__all__'

    def get_risk_level_class(self, obj):
        return obj.risk_level
    
    def get_owing(self,obj):
        return obj.get_latest_balance

    def get_lease_opening_balance_data(self, obj):
        if hasattr(obj, 'opening_balance'):
            return LeaseOpeningBalanceSerializer(obj.opening_balance).data
        return None
    
    def get_landlord_opening_balances_data(self, obj):
        if hasattr(obj.landlord, 'opening_balances'):
            user = self.context.get('request').user if self.context.get('request') else None
            landlord_balances = LandlordOpeningBalance.objects.filter(landlord=obj.landlord, lease_id=obj.lease_id)
            return LandlordOpeningBalanceSerializer(landlord_balances, many=True).data
        return None

    def get_unit(self, obj):
        return {
            'id': obj.unit.id,
            'unit_number': obj.unit.unit_number,
            'property': {
                'id': obj.unit.property.id,
                'name': obj.unit.property.name,
                'slug': obj.unit.property.slug,
                'addresses': AddressSerializer(obj.unit.property.addresses.all(), many=True).data,
            }
        }

class LeaseListSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, source='lease_tenants', read_only=True)
    landlord = LandlordSerializer(read_only=True)
    unit = serializers.SerializerMethodField()
    currency = CurrencySerializer(read_only=True)
    risk_level_class = serializers.SerializerMethodField()
    owing = serializers.FloatField(source='get_latest_balance', read_only=True)

    class Meta:
        model = Lease
        fields = ['id', 'lease_id', 'start_date', 'end_date', 'status', 'tenants', 'landlord', 'unit', 'currency', 'risk_level_class', 'owing']

    def get_risk_level_class(self, obj):
        return obj.risk_level

    def get_unit(self, obj):
        return {
            'id': obj.unit.id,
            'unit_number': obj.unit.unit_number,
            'property': {
                'id': obj.unit.property.id,
                'name': obj.unit.property.name,
                'type': obj.unit.property.property_type.name if obj.unit.property.property_type else None,
                'slug': obj.unit.property.slug,
                'addresses': AddressSerializer(obj.unit.property.addresses.all(), many=True).data,
            }
        }

class LeaseSearchSerializer(serializers.ModelSerializer):
    tenants = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()
    landlord = LandlordSerializer(read_only=True)

    class Meta:
        model = Lease
        fields = ['id', 'lease_id', 'start_date', 'end_date', 'status', 'tenants', 'unit', 'landlord']
    
    def get_tenants(self, obj):
        return [{
            'name': lt.tenant_object.full_name if hasattr(lt.tenant_object, 'full_name') else str(lt.tenant_object),
            'is_primary': lt.is_primary_tenant
        } for lt in obj.lease_tenants.all()]
    
    def get_unit(self, obj):
        return {
            'id': obj.unit.id,
            'unit_number': obj.unit.unit_number,
            'property_name': obj.unit.property.name
        }
    

class PropertyCreateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(required=False)
    property_type_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Property
        fields = ['name', 'description', 'status', 'year_built', 'total_area', 
                'is_furnished', 'total_number_of_units', 'addresses', 'property_type_name','features']
    
    def validate(self, data):
        required_fields = ['street_address', 'city']
        if address_data := data.get('addresses'):
            for field in required_fields:
                if field not in address_data:
                    raise serializers.ValidationError(
                        f"Address data must include '{field}'"
                    )
        
        return data
    
    def create(self, validated_data):
        address_data = validated_data.pop('addresses', {})
        property_type_name = validated_data.pop('property_type_name')
        
        # Get or create property type
        property_type, _ = PropertyType.objects.get_or_create(name=property_type_name)
        
        with transaction.atomic():
            property = Property.objects.create(
                property_type=property_type,
                **validated_data
            )
            
            # Process address data
            from apps.common.models.models import Country, City, Suburb
            
            try:
                country = Country.objects.get(id=address_data['country'])
                city = City.objects.get(id=address_data['city'])
                
                address_data['country'] = country
                address_data['city'] = city
                
                if 'suburb' in address_data:
                    suburb = Suburb.objects.get(id=address_data['suburb'])
                    address_data['suburb'] = suburb
                
                # Create address for property
                Address.objects.create(
                    content_type=ContentType.objects.get_for_model(Property),
                    object_id=property.id,
                    **address_data
                )
            except Country.DoesNotExist:
                raise serializers.ValidationError("Invalid country ID provided")
            except City.DoesNotExist:
                raise serializers.ValidationError("Invalid city ID provided")
            except Suburb.DoesNotExist:
                raise serializers.ValidationError("Invalid suburb ID provided")
            except Exception as e:
                raise serializers.ValidationError(f"Address creation failed: {str(e)}")
        
        return property

class UnitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['unit_number', 'unit_type', 'number_of_rooms', 
                'status', 'features']

class LeaseCreateUpdateSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, required=False)
    charges = LeaseChargeSerializer(many=True, required=False)
    deposits = LeaseDepositSerializer(many=True, required=False)
    landlord_data = LandlordSerializer(required=False)
    guarantor_data = GuarantorSerializer(required=False)
    property_data = PropertyCreateSerializer(required=False)
    unit_data = UnitCreateSerializer(required=False)
    address_data = serializers.JSONField(required=False)
    lease_opening_balance_data = LeaseOpeningBalanceSerializer(required=False, allow_null=True)
    landlord_opening_balances_data = LandlordOpeningBalanceSerializer(many=True, required=False, allow_null=True)
    
    
    class Meta:
        model = Lease
        fields = [
            'lease_id', 'unit', 'start_date', 'end_date', 'signed_date', 'status',
            'landlord', 'landlord_data', 'deposits', 'currency',
            'payment_frequency', 'due_day_of_month', 'grace_period_days',
            'includes_utilities', 'utilities_details', 'guarantor', 'guarantor_data',
            'account_number', 'tenants', 'charges', 'property_data', 'unit_data','is_rent_variable',
            'address_data', 'lease_opening_balance_data', 'landlord_opening_balances_data'
        ]
        extra_kwargs = {
            'lease_id': {'read_only': True},
            'unit': {'required': False},
            'landlord': {'required': False},
            'currency': {'required': True},
        }
    
    def validate(self, data):
        from apps.common.utils.subscriptions import check_rentsafe_subscription
        user = self.context.get('request').user if self.context.get('request') else None
        # Either unit or property_data + unit_data must be provided
        if not data.get('unit') and not (data.get('property_data') and data.get('unit_data')):
            raise serializers.ValidationError(
                "Either provide an existing unit or property_data + unit_data to create a new one."
            )

        if not user.client:
            raise serializers.ValidationError("User should be associated with a client, request to join one to the admins.")
        if not check_rentsafe_subscription(user.client, 'rentsafe'):
            raise serializers.ValidationError("No active Rentsafe subscription found or the subscription has expired.")
        # New validation to prevent duplicate property creation
        if data.get('property_data'):
            if property_name := data['property_data'].get('name'):
                # Assuming the slug is generated from the name
                property_slug = slugify(property_name)
                if Lease.objects.filter(
                    unit__property__slug=property_slug, 
                    unit__unit_number=data['unit_data'].get('unit_number'), 
                    status='ACTIVE'
                ).exists():
                    raise serializers.ValidationError(
                        "This unit is already associated with an active lease."
                    )

        # Remove lease field from tenants and charges if present
        tenants_data = data.get('tenants', [])
        for tenant in tenants_data:
            tenant.pop('lease', None)

        charges_data = data.get('charges', [])
        for charge in charges_data:
            charge.pop('lease', None)

        deposits_data = data.get('deposits', [])
        for deposit in deposits_data:
            deposit.pop('lease', None)

        return data
    
    @transaction.atomic
    def create(self, validated_data):
        # Use the helper function instead of manual processing
        try:
            if address_data := validated_data.pop('address_data', None):
                address_data = process_address_data(address_data)
                validated_data['address_data'] = address_data

            # Get user from context
            user = self.context.get('request').user if self.context.get('request') else None

            return create_lease_with_dependencies(validated_data, user)
        except Exception as e:
            raise serializers.ValidationError(f"Lease creation failed: {str(e)}")
