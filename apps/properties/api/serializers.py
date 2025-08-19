# apps/properties/serializers.py

from rest_framework import serializers
from apps.properties.models import Property, PropertyType, Unit
from apps.leases.models import Landlord
from apps.common.models.models import Address, Document, Note

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'street_address', 'city', 'state_province', 'postal_code', 'country')

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
    address_summary = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ('id', 'name', 'property_type', 'status', 'total_number_of_units', 'address_summary')
        
    def get_address_summary(self, obj):
        first_address = obj.addresses.first()
        if first_address:
            return f"{first_address.city}, {first_address.state_province}"
        return None

class PropertyDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for a single property instance. Includes nested relationships.
    """
    property_type = PropertyTypeSerializer(read_only=True)
    property_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PropertyType.objects.all(), source='property_type', write_only=True
    )
    
    units = UnitListSerializer(many=True, read_only=True)
    landlords = LandlordSerializer(many=True, read_only=True)
    
    addresses = AddressSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = (
            'id', 'name', 'description', 'status', 'year_built', 'total_area',
            'is_furnished', 'total_number_of_units', 'features',
            'property_type', 'property_type_id', 
            'units', 'landlords', 'addresses', 'documents', 'notes',
            'date_created', 'date_updated'
        )
        read_only_fields = ('id', 'date_created', 'date_updated')