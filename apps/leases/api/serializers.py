# apps/leases/serializers.py
from rest_framework import serializers
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from apps.leases.models.models import Lease, LeaseTenant, LeaseCharge, LeaseTermination, Guarantor
from apps.leases.models.landlord import Landlord
from apps.properties.models.models import Property, Unit, PropertyType
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch
from apps.common.models.models import Address
from decimal import Decimal

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
        read_only_fields = ['tenant_object']
    
    def get_tenant_object(self, obj):
        if obj.tenant_object:
            if isinstance(obj.tenant_object, Individual):
                return {
                    'type': 'individual',
                    'id': obj.tenant_object.id,
                    'name': obj.tenant_object.full_name,
                    'identification_number': obj.tenant_object.identification_number
                }
            elif isinstance(obj.tenant_object, CompanyBranch):
                return {
                    'type': 'company_branch',
                    'id': obj.tenant_object.id,
                    'name': obj.tenant_object.full_name,
                    'company_name': obj.tenant_object.company.registration_name
                }
        return None
    
    def validate(self, data):
        lease = data.get('lease')
        tenant_type = data.get('tenant_type')
        tenant_id = data.get('tenant_id')
        
        if tenant_type not in ['individual', 'company_branch']:
            raise serializers.ValidationError("Invalid tenant type. Must be 'individual' or 'company_branch'.")
        
        try:
            content_type = ContentType.objects.get(
                app_label='individuals' if tenant_type == 'individual' else 'companies',
                model=tenant_type
            )
            tenant = content_type.get_object_for_this_type(id=tenant_id)
            data['content_type'] = content_type
            data['object_id'] = tenant_id
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Invalid content type for {tenant_type}.")
        except Exception as e:
            raise serializers.ValidationError(f"Tenant not found: {str(e)}")
        
        # Check if this tenant is already on the lease
        if LeaseTenant.objects.filter(
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

class LeaseTerminationSerializer(serializers.ModelSerializer):
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
                return {
                    'type': 'individual',
                    'id': obj.guarantor_object.id,
                    'name': obj.guarantor_object.full_name,
                    'identification_number': obj.guarantor_object.identification_number
                }
            elif isinstance(obj.guarantor_object, CompanyBranch):
                return {
                    'type': 'company_branch',
                    'id': obj.guarantor_object.id,
                    'name': obj.guarantor_object.full_name,
                    'company_name': obj.guarantor_object.company.registration_name
                }
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

class LandlordSerializer(serializers.ModelSerializer):
    landlord_object = serializers.SerializerMethodField()
    landlord_type = serializers.CharField(write_only=True)
    landlord_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Landlord
        fields = ['id', 'landlord_object', 'landlord_type', 'landlord_id']
        read_only_fields = ['landlord_object']
    
    def get_landlord_object(self, obj):
        if obj.landlord_object:
            if isinstance(obj.landlord_object, Individual):
                return {
                    'type': 'individual',
                    'id': obj.landlord_object.id,
                    'name': obj.landlord_object.full_name,
                    'identification_number': obj.landlord_object.identification_number
                }
            elif isinstance(obj.landlord_object, CompanyBranch):
                return {
                    'type': 'company_branch',
                    'id': obj.landlord_object.id,
                    'name': obj.landlord_object.full_name,
                    'company_name': obj.landlord_object.company.registration_name
                }
        return None
    
    def validate(self, data):
        landlord_type = data.get('landlord_type')
        landlord_id = data.get('landlord_id')
        
        if landlord_type not in ['individual', 'company_branch']:
            raise serializers.ValidationError("Invalid landlord type. Must be 'individual' or 'company_branch'.")
        
        try:
            content_type = ContentType.objects.get(
                app_label='individuals' if landlord_type == 'individual' else 'companies',
                model=landlord_type
            )
            landlord = content_type.get_object_for_this_type(id=landlord_id)
            data['content_type'] = content_type
            data['object_id'] = landlord_id
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Invalid content type for {landlord_type}.")
        except Exception as e:
            raise serializers.ValidationError(f"Landlord not found: {str(e)}")
        
        return data

class LeaseCreateUpdateSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, required=False)
    charges = LeaseChargeSerializer(many=True, required=False)
    landlord_data = LandlordSerializer(required=False)
    guarantor_data = GuarantorSerializer(required=False)
    address_data = serializers.JSONField(required=False)
    
    class Meta:
        model = Lease
        fields = [
            'lease_id', 'unit', 'start_date', 'end_date', 'signed_date', 'status',
            'landlord', 'landlord_data', 'deposit_amount', 'deposit_period', 'currency',
            'payment_frequency', 'due_day_of_month', 'grace_period_days',
            'includes_utilities', 'utilities_details', 'guarantor', 'guarantor_data',
            'account_number', 'tenants', 'charges', 'address_data'
        ]
    
    def create(self, validated_data):
        tenants_data = validated_data.pop('tenants', [])
        charges_data = validated_data.pop('charges', [])
        landlord_data = validated_data.pop('landlord_data', None)
        guarantor_data = validated_data.pop('guarantor_data', None)
        address_data = validated_data.pop('address_data', None)
        
        # Handle landlord creation if needed
        if landlord_data and not validated_data.get('landlord'):
            landlord_serializer = LandlordSerializer(data=landlord_data)
            landlord_serializer.is_valid(raise_exception=True)
            landlord = landlord_serializer.save()
            validated_data['landlord'] = landlord
        
        # Handle guarantor creation if needed
        if guarantor_data and not validated_data.get('guarantor'):
            guarantor_serializer = GuarantorSerializer(data=guarantor_data)
            guarantor_serializer.is_valid(raise_exception=True)
            guarantor = guarantor_serializer.save()
            validated_data['guarantor'] = guarantor
        
        # Handle address creation for property/unit if needed
        if address_data:
            self._handle_address_creation(validated_data['unit'], address_data)
        
        lease = Lease.objects.create(**validated_data)
        
        # Create tenants
        for tenant_data in tenants_data:
            LeaseTenant.objects.create(lease=lease, **tenant_data)
        
        # Create charges
        for charge_data in charges_data:
            LeaseCharge.objects.create(lease=lease, **charge_data)
        
        return lease
    
    def update(self, instance, validated_data):
        tenants_data = validated_data.pop('tenants', None)
        charges_data = validated_data.pop('charges', None)
        landlord_data = validated_data.pop('landlord_data', None)
        guarantor_data = validated_data.pop('guarantor_data', None)
        address_data = validated_data.pop('address_data', None)
        
        # Handle landlord update if needed
        if landlord_data:
            landlord_serializer = LandlordSerializer(instance.landlord, data=landlord_data, partial=True)
            landlord_serializer.is_valid(raise_exception=True)
            landlord_serializer.save()
        
        # Handle guarantor update if needed
        if guarantor_data:
            if instance.guarantor:
                guarantor_serializer = GuarantorSerializer(instance.guarantor, data=guarantor_data, partial=True)
            else:
                guarantor_serializer = GuarantorSerializer(data=guarantor_data)
            guarantor_serializer.is_valid(raise_exception=True)
            guarantor = guarantor_serializer.save()
            instance.guarantor = guarantor
        
        # Handle address update if needed
        if address_data:
            self._handle_address_creation(instance.unit, address_data)
        
        # Update lease fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle tenants update if provided
        if tenants_data is not None:
            self._update_tenants(instance, tenants_data)
        
        # Handle charges update if provided
        if charges_data is not None:
            self._update_charges(instance, charges_data)
        
        return instance
    
    def _handle_address_creation(self, unit, address_data):
        # Check if property has address, if not create one
        property = unit.property
        if not property.addresses.exists():
            Address.objects.create(
                content_type=ContentType.objects.get_for_model(Property),
                object_id=property.id,
                **address_data
            )
        
        # Check if unit has address, if not create one
        if not unit.addresses.exists():
            Address.objects.create(
                content_type=ContentType.objects.get_for_model(Unit),
                object_id=unit.id,
                **address_data
            )
    
    def _update_tenants(self, lease, tenants_data):
        # Get current tenants
        current_tenants = list(lease.lease_tenants.all())
        
        # Process new tenants
        for tenant_data in tenants_data:
            tenant_id = tenant_data.get('id')
            if tenant_id:
                # Update existing tenant
                tenant = next((t for t in current_tenants if t.id == tenant_id), None)
                if tenant:
                    for attr, value in tenant_data.items():
                        if attr not in ['id', 'lease']:
                            setattr(tenant, attr, value)
                    tenant.save()
                    current_tenants.remove(tenant)
            else:
                # Create new tenant
                LeaseTenant.objects.create(lease=lease, **tenant_data)
        
        # Delete remaining tenants that weren't in the update
        for tenant in current_tenants:
            tenant.delete()
    
    def _update_charges(self, lease, charges_data):
        # Get current charges
        current_charges = list(lease.charges.all())
        
        # Process new charges
        for charge_data in charges_data:
            charge_id = charge_data.get('id')
            if charge_id:
                # Update existing charge
                charge = next((c for c in current_charges if c.id == charge_id), None)
                if charge:
                    for attr, value in charge_data.items():
                        if attr not in ['id', 'lease']:
                            setattr(charge, attr, value)
                    charge.save()
                    current_charges.remove(charge)
            else:
                # Create new charge
                LeaseCharge.objects.create(lease=lease, **charge_data)
        
        # Delete remaining charges that weren't in the update
        for charge in current_charges:
            charge.delete()

class LeaseDetailSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, read_only=True)
    charges = LeaseChargeSerializer(many=True, read_only=True)
    landlord = LandlordSerializer(read_only=True)
    guarantor = GuarantorSerializer(read_only=True)
    unit = serializers.SerializerMethodField()
    
    class Meta:
        model = Lease
        fields = '__all__'
    
    def get_unit(self, obj):
        return {
            'id': obj.unit.id,
            'unit_number': obj.unit.unit_number,
            'property': {
                'id': obj.unit.property.id,
                'name': obj.unit.property.name
            }
        }

class LeaseSearchSerializer(serializers.ModelSerializer):
    tenants = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()
    landlord = serializers.SerializerMethodField()
    
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
    
    def get_landlord(self, obj):
        if obj.landlord and obj.landlord.landlord_object:
            return {
                'name': obj.landlord.landlord_object.full_name if hasattr(obj.landlord.landlord_object, 'full_name') else str(obj.landlord.landlord_object),
                'id': obj.landlord.id
            }
        return None

class PropertyCreateSerializer(serializers.ModelSerializer):
    address_data = serializers.JSONField(write_only=True)
    property_type_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Property
        fields = ['name', 'description', 'status', 'year_built', 'total_area', 
                'is_furnished', 'number_of_rooms', 'address_data', 'property_type_name']
    
    def create(self, validated_data):
        address_data = validated_data.pop('address_data')
        property_type_name = validated_data.pop('property_type_name')
        
        # Get or create property type
        property_type, _ = PropertyType.objects.get_or_create(name=property_type_name)
        
        with transaction.atomic():
            property = Property.objects.create(
                property_type=property_type,
                **validated_data
            )
            
            # Create address for property
            Address.objects.create(
                content_type=ContentType.objects.get_for_model(Property),
                object_id=property.id,
                **address_data
            )
        
        return property

class UnitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['unit_number', 'unit_type', 'number_of_rooms', 'unit_context', 
                'status', 'monthly_rent', 'deposit_amount', 'features']
