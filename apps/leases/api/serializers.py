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
        read_only_fields = ['lease','tenant_object']
        extra_kwargs = {
            'lease': {'required': False}
        }
    
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
        extra_kwargs = {
            'lease': {'required': False}
        }

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
        
        if landlord_type not in ['individual', 'company']:
            raise serializers.ValidationError("Invalid landlord type. Must be 'individual' or 'company'.")
        
        try:
            content_type = ContentType.objects.get(
                app_label='individuals' if landlord_type == 'individual' else 'companies',
                model='individual' if landlord_type == 'individual' else 'companybranch'
            )
            # Check if the referenced object exists
            model_class = content_type.model_class()
            if not model_class.objects.filter(id=landlord_id).exists():
                raise serializers.ValidationError(f"{landlord_type.capitalize()} with ID {landlord_id} does not exist.")
            
            data['content_type'] = content_type
            data['object_id'] = landlord_id
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Invalid content type for {landlord_type}.")
        except Exception as e:
            raise serializers.ValidationError(f"Landlord validation failed: {str(e)}")
        
        return data
    
    def create(self, validated_data):
        try:
            # Check if landlord already exists for this object
            landlord = Landlord.objects.filter(
                content_type=validated_data['content_type'],
                object_id=validated_data['object_id']
            ).first()
            
            if not landlord:
                landlord = Landlord.objects.create(
                    content_type=validated_data['content_type'],
                    object_id=validated_data['object_id']
                )
            
            return landlord
        except Exception as e:
            raise serializers.ValidationError(f"Failed to create landlord: {str(e)}")


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
                'is_furnished', 'total_number_of_units', 'address_data', 'property_type_name','features']
    
    def validate(self, data):
        address_data = data.get('address_data', {})
        required_fields = ['street_address', 'city']
        
        for field in required_fields:
            if field not in address_data:
                raise serializers.ValidationError(
                    f"Address data must include '{field}'"
                )
        
        return data
    
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
                'status', 'monthly_rent', 'features']

class LeaseCreateUpdateSerializer(serializers.ModelSerializer):
    tenants = LeaseTenantSerializer(many=True, required=False)
    charges = LeaseChargeSerializer(many=True, required=False)
    landlord_data = LandlordSerializer(required=False)
    guarantor_data = GuarantorSerializer(required=False)
    property_data = PropertyCreateSerializer(required=False)
    unit_data = UnitCreateSerializer(required=False)
    address_data = serializers.JSONField(required=False)
    
    class Meta:
        model = Lease
        fields = [
            'lease_id', 'unit', 'start_date', 'end_date', 'signed_date', 'status',
            'landlord', 'landlord_data', 'deposit_amount', 'deposit_period', 'currency',
            'payment_frequency', 'due_day_of_month', 'grace_period_days',
            'includes_utilities', 'utilities_details', 'guarantor', 'guarantor_data',
            'account_number', 'tenants', 'charges', 'property_data', 'unit_data', 'address_data'
        ]
        extra_kwargs = {
            'lease_id': {'read_only': True},
            'unit': {'required': False},
            'landlord': {'required': False},
            'currency': {'required': True},
        }
    
    def validate(self, data):
        # Either unit or property_data + unit_data must be provided
        if not data.get('unit') and not (data.get('property_data') and data.get('unit_data')):
            raise serializers.ValidationError(
                "Either provide an existing unit or property_data + unit_data to create a new one."
            )
        
        # Remove lease field from tenants and charges if present
        tenants_data = data.get('tenants', [])
        for tenant in tenants_data:
            tenant.pop('lease', None)
        
        charges_data = data.get('charges', [])
        for charge in charges_data:
            charge.pop('lease', None)
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        tenants_data = validated_data.pop('tenants', [])
        charges_data = validated_data.pop('charges', [])
        landlord_data = validated_data.pop('landlord_data', None)
        guarantor_data = validated_data.pop('guarantor_data', None)
        property_data = validated_data.pop('property_data', None)
        unit_data = validated_data.pop('unit_data', None)
        address_data = validated_data.pop('address_data', None)
        
        # Handle property and unit creation if needed
        if property_data and unit_data:
            property_serializer = PropertyCreateSerializer(data=property_data)
            property_serializer.is_valid(raise_exception=True)
            property = property_serializer.save()
            
            unit_serializer = UnitCreateSerializer(data=unit_data)
            unit_serializer.is_valid(raise_exception=True)
            unit = unit_serializer.save(property=property)
            
            validated_data['unit'] = unit
            
            # Create address for unit if not provided
            if not address_data and property.addresses.exists():
                prop_address = property.addresses.first()
                address_data = {
                    'street_address': prop_address.street_address,
                    'city': prop_address.city,
                    'country': prop_address.country,
                    'postal_code': prop_address.postal_code,
                }
        
        # Handle address creation for property/unit if needed
        if address_data:
            self._handle_address_creation(validated_data['unit'], address_data)
        
        # Handle landlord creation if needed
        landlord = None
        if landlord_data:
            try:
                # First try to get existing landlord
                content_type = ContentType.objects.get(
                    app_label='individuals' if landlord_data['landlord_type'] == 'individual' else 'companies',
                    model=landlord_data['landlord_type']
                )
                landlord = Landlord.objects.filter(
                    content_type=content_type,
                    object_id=landlord_data['landlord_id']
                ).first()
                
                if not landlord:
                    # Create new landlord if doesn't exist
                    landlord_serializer = LandlordSerializer(data=landlord_data)
                    landlord_serializer.is_valid(raise_exception=True)
                    landlord = landlord_serializer.save()
                
                validated_data['landlord'] = landlord
            except Exception as e:
                raise serializers.ValidationError(f"Failed to process landlord: {str(e)}")
        
        # Handle guarantor creation if needed
        if guarantor_data:
            try:
                content_type = ContentType.objects.get(
                    app_label='individuals' if guarantor_data['guarantor_type'] == 'individual' else 'companies',
                    model=guarantor_data['guarantor_type']
                )
                guarantor = Guarantor.objects.filter(
                    content_type=content_type,
                    object_id=guarantor_data['guarantor_id']
                ).first()
                
                if not guarantor:
                    guarantor_serializer = GuarantorSerializer(data=guarantor_data)
                    guarantor_serializer.is_valid(raise_exception=True)
                    guarantor = guarantor_serializer.save()
                
                validated_data['guarantor'] = guarantor
            except Exception as e:
                raise serializers.ValidationError(f"Failed to process guarantor: {str(e)}")
        
        # Create lease (lease_id will be auto-generated in the model's save method)
        lease = Lease.objects.create(**validated_data)
        
        # Create tenants
        for tenant_data in tenants_data:
            LeaseTenant.objects.create(lease=lease, **tenant_data)
        
        # Create charges
        for charge_data in charges_data:
            LeaseCharge.objects.create(lease=lease, **charge_data)
        
        return lease
    def _handle_address_creation(self, unit, address_data):
        """
        Helper method to create addresses for property and unit if they don't exist
        """
        from apps.common.models.models import Country, City, Suburb 
        
        try:
            # Process country
            country_id = address_data.pop('country', None)
            if country_id:
                country = Country.objects.get(id=country_id)
                address_data['country'] = country
            
            # Process city
            city_id = address_data.pop('city', None)
            if city_id:
                city = City.objects.get(id=city_id)
                address_data['city'] = city
            
            # Process suburb
            suburb_id = address_data.pop('suburb', None)
            if suburb_id:
                suburb = Suburb.objects.get(id=suburb_id)
                address_data['suburb'] = suburb
            
            # Check if property has address, if not create one
            property_ob = unit.property
            if not property_ob.addresses.exists():
                Address.objects.create(
                    content_type=ContentType.objects.get_for_model(Property),
                    object_id=property_ob.id,
                    **address_data
                )
            
            # Check if unit has address, if not create one
            if not unit.addresses.exists():
                Address.objects.create(
                    content_type=ContentType.objects.get_for_model(Unit),
                    object_id=unit.id,
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
        