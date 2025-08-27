# apps/properties/serializers.py

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.properties.models import Property, PropertyType, Unit
from apps.leases.models import Landlord
from apps.common.models.models import Address, Document, Note, Suburb,City
from django.contrib.contenttypes.models import ContentType
from apps.common.api.serializers import AddressSerializer
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'file', 'description', 'uploaded_at')

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'text', 'created_at')

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = ('id', 'name', 'description')

class LandlordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landlord
        fields = ('id', 'landlord_name', 'landlord_type')

class UnitListSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for listing units.
    """
    class Meta:
        model = Unit
        fields = ('id', 'unit_number', 'unit_type', 'status')

class UnitDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for retrieving, creating, and updating a single unit.
    """
    property = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Unit
        fields = (
            'id', 'property', 'unit_number', 'unit_type', 'number_of_rooms', 
            'status', 'features', 'date_created', 'date_updated'
        )
        read_only_fields = ('id', 'property', 'date_created', 'date_updated')

class PropertyListSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for listing properties. Fast and lightweight.
    """
    property_type = serializers.CharField(source='property_type.name')
    address_summary = serializers.CharField(source='get_address')
    full_address = AddressSerializer(source='addresses', many=True, read_only=True)

    class Meta:
        model = Property
        fields = ('id', 'name', 'property_type', 'status','description', 'total_number_of_units', 'address_summary', 'full_address')

class PropertyCreateSerializer(serializers.ModelSerializer):
    property_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertyType.objects.all(), source='property_type', write_only=True
    )
    
    class Meta:
        model = Property
        fields = [
            'name', 'description', 'status', 'year_built', 'total_area',
            'is_furnished', 'total_number_of_units', 'features', 'property_type_id'
        ]

class PropertyDetailSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=Property.PROPERTY_STATUS_CHOICES, required=False)
    year_built = serializers.IntegerField(required=False)
    total_area = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    is_furnished = serializers.BooleanField(required=False)
    total_number_of_units = serializers.IntegerField(required=False)
    features = serializers.JSONField(required=False, allow_null=True)

    # already present fields
    property_type = PropertyTypeSerializer(read_only=True)
    property_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertyType.objects.all(), source='property_type', write_only=True, required=False
    )
    
    units = UnitListSerializer(many=True, read_only=True)
    landlords = LandlordSerializer(many=True, read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)

    addresses_input = serializers.DictField(write_only=True, required=False)
    landlords_input = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Property
        fields = (
            'id', 'name', 'description', 'status', 'year_built', 'total_area',
            'is_furnished', 'total_number_of_units', 'features',
            'property_type', 'property_type_id',
            'units', 'landlords', 'addresses', 'documents', 'notes',
            'date_created', 'date_updated',
            'addresses_input', 'landlords_input'
        )
        read_only_fields = ('id', 'date_created', 'date_updated')

    def validate(self, attrs):
        if name := attrs.get('name'):
            qs = Property.objects.filter(name=name)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise ValidationError({"property": "Property with this name already exists."})

        addresses = attrs.get("addresses_input", {})
        if not self.instance and not addresses.get("suburb_id"):
            raise ValidationError({"addresses": "Field 'suburb_id' is required in addresses."})

        return attrs
    def create(self, validated_data):
        addresses_data = validated_data.pop("addresses_input")
        landlords_data = validated_data.pop("landlords_input", [])

        suburb_id = addresses_data.get("suburb_id")
        street_address = addresses_data.get("street_address")

        try:
            suburb = Suburb.objects.get(id=suburb_id)
        except Suburb.DoesNotExist as e:
            raise ValidationError(
                {"suburb_id": f"Suburb with id {suburb_id} does not exist."}
            ) from e

        city = suburb.city

        # Create the property
        property_instance = Property.objects.create(**validated_data)

        # Create address
        Address.objects.create(
            content_type=ContentType.objects.get_for_model(Property),
            object_id=property_instance.id,
            city=city,
            suburb=suburb,
            street_address=street_address,
            address_type='physical'
        )

        # Create or link landlords
        for landlord_data in landlords_data:
            landlord_id = landlord_data.get("landlord_id")
            landlord_name = landlord_data.get("landlord_name")
            landlord_type = landlord_data.get("landlord_type", "individual")

            if landlord_id:
                landlord, created = Landlord.objects.get_or_create(
                    landlord_id=landlord_id,
                    defaults={
                        "landlord_name": landlord_name,
                        "landlord_type": landlord_type
                    }
                )
                if not created:
                    updated = False
                    if landlord_name and landlord.landlord_name != landlord_name:
                        landlord.landlord_name = landlord_name
                        updated = True
                    if landlord_type and landlord.landlord_type != landlord_type:
                        landlord.landlord_type = landlord_type
                        updated = True
                    if updated:
                        landlord.save()
            else:
                landlord = Landlord.objects.create(
                    landlord_name=landlord_name,
                    landlord_type=landlord_type
                )

            landlord.properties.add(property_instance)

        return property_instance

    
    def update(self, instance, validated_data):
        addresses_data = validated_data.pop("addresses_input", None)
        landlords_data = validated_data.pop("landlords_input", [])

        # Handle regular fields
        instance = super().update(instance, validated_data)

        # --- Address update ---
        if addresses_data:
            suburb_id = addresses_data.get("suburb_id")
            street_address = addresses_data.get("street_address")

            try:
                suburb = Suburb.objects.get(id=suburb_id)
                city = suburb.city
            except Suburb.DoesNotExist as e:
                raise ValidationError(
                    {"suburb_id": f"Suburb with id {suburb_id} does not exist."}
                ) from e

            address_qs = Address.objects.filter(
                content_type=ContentType.objects.get_for_model(Property),
                object_id=instance.id,
                address_type='physical'
            )

            if address := address_qs.first():
                address.city = city
                address.suburb = suburb
                address.street_address = street_address
                address.save()
            else:
                Address.objects.create(
                    content_type=ContentType.objects.get_for_model(Property),
                    object_id=instance.id,
                    city=city,
                    suburb=suburb,
                    street_address=street_address,
                    address_type='physical'
                )

        # --- Landlords update ---
        existing_landlord_ids = []

        for landlord_data in landlords_data:
            landlord_id = landlord_data.get("landlord_id")
            landlord_name = landlord_data.get("landlord_name")
            landlord_type = landlord_data.get("landlord_type", "individual")

            if landlord_id:
                landlord, created = Landlord.objects.get_or_create(
                    landlord_id=landlord_id,
                    defaults={
                        "landlord_name": landlord_name,
                        "landlord_type": landlord_type
                    }
                )
                if not created:
                    updated = False
                    if landlord_name and landlord.landlord_name != landlord_name:
                        landlord.landlord_name = landlord_name
                        updated = True
                    if landlord_type and landlord.landlord_type != landlord_type:
                        landlord.landlord_type = landlord_type
                        updated = True
                    if updated:
                        landlord.save()
            else:
                landlord = Landlord.objects.create(
                    landlord_name=landlord_name,
                    landlord_type=landlord_type
                )

            landlord.properties.add(instance)
            existing_landlord_ids.append(landlord.id)

        if landlords_data:
            instance.landlords.set(Landlord.objects.filter(id__in=existing_landlord_ids))

        return instance