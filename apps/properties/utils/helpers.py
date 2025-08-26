# apps/properties/helpers.py
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.properties.models import Property, Unit, PropertyType
from apps.common.models.models import Address, Suburb, City, Country
from apps.leases.models import Landlord
from apps.properties.api.serializers import PropertyCreateSerializer, UnitDetailSerializer

def create_property_with_unit(property_data, unit_data=None, user=None):
    """
    Helper function to create a property and optionally a unit.
    
    Args:
        property_data (dict): Data for creating the property
        unit_data (dict, optional): Data for creating a unit
        user (User, optional): User who is creating the property/unit
    
    Returns:
        tuple: (property_instance, unit_instance) or (property_instance, None)
    
    Raises:
        ValidationError: If property or unit creation fails
    """
    try:
        with transaction.atomic():
            # Prepare property data for serializer
            property_serializer_data = {
                'name': property_data.get('name'),
                'description': property_data.get('description', ''),
                'status': property_data.get('status', 'active'),
                'year_built': property_data.get('year_built'),
                'total_area': property_data.get('total_area'),
                'is_furnished': property_data.get('is_furnished', False),
                'total_number_of_units': property_data.get('total_number_of_units', 0),
                'features': property_data.get('features'),
                'property_type_id': property_data.get('property_type_id'),
                'addresses_input': property_data.get('address', {}),
                'landlords_input': property_data.get('landlords', [])
            }
            
            # Remove None values
            property_serializer_data = {k: v for k, v in property_serializer_data.items() if v is not None}
            
            # Create property using the serializer
            property_serializer = PropertyDetailSerializer(data=property_serializer_data)
            property_serializer.is_valid(raise_exception=True)
            property_instance = property_serializer.save()
            
            # If user is provided, update the created_by field
            if user:
                property_instance.user = user
                property_instance.save()
            
            unit_instance = None
            
            # Create unit if unit_data is provided
            if unit_data:
                unit_serializer_data = {
                    'unit_number': unit_data.get('unit_number', '1'),
                    'unit_type': unit_data.get('unit_type', 'OTHER'),
                    'number_of_rooms': unit_data.get('number_of_rooms', 0),
                    'status': unit_data.get('status', 'vacant'),
                    'features': unit_data.get('features'),
                    'property': property_instance.id
                }
                
                # Remove None values
                unit_serializer_data = {k: v for k, v in unit_serializer_data.items() if v is not None}
                
                unit_serializer = UnitDetailSerializer(data=unit_serializer_data)
                unit_serializer.is_valid(raise_exception=True)
                unit_instance = unit_serializer.save()
                
                # If user is provided, update the created_by field
                if user:
                    unit_instance.user = user
                    unit_instance.save()
            
            return property_instance, unit_instance
            
    except Exception as e:
        raise ValidationError(f"Failed to create property and unit: {str(e)}")

def create_property_bulk(properties_data, user=None):
    """
    Helper function to create multiple properties with optional units.
    
    Args:
        properties_data (list): List of dictionaries containing property and unit data
        user (User, optional): User who is creating the properties
    
    Returns:
        list: List of created property instances
    """
    created_properties = []
    
    for property_data in properties_data:
        unit_data = property_data.pop('unit', None)
        property_instance, _ = create_property_with_unit(property_data, unit_data, user)
        created_properties.append(property_instance)
    
    return created_properties

# Additional utility functions in apps/properties/helpers.py
def create_minimal_property(name, property_type_name, address_data, user=None):
    """
    Create a minimal property with just essential data.
    
    Args:
        name (str): Property name
        property_type_name (str): Property type name
        address_data (dict): Address data
        user (User, optional): User who is creating the property
    
    Returns:
        Property: Created property instance
    """
    # Get or create property type
    property_type, created = PropertyType.objects.get_or_create(
        name=property_type_name,
        defaults={'description': f'Auto-created {property_type_name} property type'}
    )
    
    property_data = {
        'name': name,
        'property_type_id': property_type.id,
        'address': address_data
    }
    
    property_instance, _ = create_property_with_unit(property_data, None, user)
    return property_instance

def create_property_with_default_unit(property_data, user=None):
    """
    Create a property with a default unit (Unit 1).
    
    Args:
        property_data (dict): Property data
        user (User, optional): User who is creating the property
    
    Returns:
        tuple: (property_instance, unit_instance)
    """
    default_unit_data = {
        'unit_number': '1',
        'unit_type': property_data.get('default_unit_type', 'APARTMENT'),
        'number_of_rooms': property_data.get('default_rooms', 1),
        'status': 'vacant'
    }
    
    return create_property_with_unit(property_data, default_unit_data, user)

def get_or_create_property_by_name(name, defaults=None, user=None):
    """
    Get existing property by name or create a new one if it doesn't exist.
    
    Args:
        name (str): Property name
        defaults (dict, optional): Default values for property creation
        user (User, optional): User who is creating the property
    
    Returns:
        tuple: (property_instance, created)
    """
    try:
        property_instance = Property.objects.get(name=name)
        return property_instance, False
    except Property.DoesNotExist:
        if not defaults:
            defaults = {
                'property_type_id': PropertyType.objects.first().id,
                'address': {'street_address': 'Auto-created address'}
            }
        
        property_instance, _ = create_property_with_unit(
            {'name': name, **defaults}, None, user
        )
        return property_instance, True

def create_property_with_address(property_data, address_data, user=None):
    """
    Helper function to create a property with address.
    """
    try:
        with transaction.atomic():
            print(f"DEBUG: Property data received: {property_data}")
            print(f"DEBUG: Address data received: {address_data}")
            
            # Handle property type - support both name and ID
            property_type_name = property_data.get('property_type_name')
            property_type_id = property_data.get('property_type_id')
            
            print(f"DEBUG: Property type name: {property_type_name}")
            print(f"DEBUG: Property type ID: {property_type_id}")
            
            if property_type_name:
                property_type = get_or_create_property_type(property_type_name)
            elif property_type_id:
                try:
                    property_type = PropertyType.objects.get(id=property_type_id)
                except PropertyType.DoesNotExist:
                    raise ValidationError(f"PropertyType with ID {property_type_id} not found")
            else:
                raise ValidationError("Either property_type_name or property_type_id is required")
            
            print(f"DEBUG: Resolved property type: {property_type.id} - {property_type.name}")
            
            # Prepare property data for serializer
            property_serializer_data = {
                'name': property_data.get('name'),
                'description': property_data.get('description', ''),
                'status': property_data.get('status', 'active'),
                'year_built': property_data.get('year_built'),
                'total_area': property_data.get('total_area'),
                'is_furnished': property_data.get('is_furnished', False),
                'total_number_of_units': property_data.get('total_number_of_units', 0),
                'features': property_data.get('features'),
                'property_type_id': property_type.id,  # Use the resolved property type
                'addresses_input': address_data,
                'landlords_input': property_data.get('landlords', [])
            }
            
            print(f"DEBUG: Serializer data: {property_serializer_data}")
            if property_ob := Property.objects.filter(name=property_serializer_data['name']).first():
                return property_ob
            # Remove None values but keep empty strings and zeros
            property_serializer_data = {k: v for k, v in property_serializer_data.items() 
                if v is not None}
            
            print(f"DEBUG: Cleaned serializer data: {property_serializer_data}")
            
            # Create property using the serializer
            property_serializer = PropertyCreateSerializer(data=property_serializer_data)
            print(f"DEBUG: Serializer is valid: {property_serializer.is_valid()}")
            if not property_serializer.is_valid():
                print(f"DEBUG: Serializer errors: {property_serializer.errors}")
                raise ValidationError(property_serializer.errors)
                
            property_serializer.is_valid(raise_exception=True)
            property_instance = property_serializer.save()
            
            print(f"DEBUG: Property created successfully: {property_instance.id}")
            
            # If user is provided, update the created_by field
            if user:
                property_instance.created_by = user
                property_instance.save()
            
            return property_instance
            
    except Exception as e:
        print(f"DEBUG: Error in create_property_with_address: {str(e)}")
        raise ValidationError(f"Failed to create property: {str(e)}")

def create_unit_for_property(property_instance, unit_data, user=None):
    """
    Helper function to create a unit for a property.
    """
    try:
        with transaction.atomic():
            return Unit.objects.create(
                property=property_instance,  # This is the key - link to property
                unit_number=unit_data.get('unit_number', '1'),
                unit_type=unit_data.get('unit_type', 'OTHER'),
                number_of_rooms=unit_data.get('number_of_rooms', 0),
                status=unit_data.get('status', 'occupied'),
                features=unit_data.get('features', {}),
                created_by=user,
            )
    except Exception as e:
        raise ValidationError(f"Failed to create unit: {str(e)}")


def create_property_and_unit(property_data, unit_data, address_data, user=None):
    """
    Helper function to create both property and unit in one transaction.
    """
    try:
        with transaction.atomic():
            print("DEBUG: Starting property and unit creation")
            
            # Create property first
            property_instance = create_property_with_address(property_data, address_data, user)
            print(f"DEBUG: Property created with ID: {property_instance.id}")
            
            # Then create unit linked to the property
            if unit_instance := Unit.objects.filter(property=property_instance, unit_number=unit_data.get('unit_number', '1')).first():
                unit_instance = unit_instance
            else:
                unit_instance = create_unit_for_property(property_instance, unit_data, user)
                
            print(f"DEBUG: Unit created with ID: {unit_instance.id}, linked to property: {unit_instance.property_id}")
            
            print("DEBUG: Property and unit created successfully")
            return property_instance, unit_instance
            
    except Exception as e:
        print(f"DEBUG: Error in create_property_and_unit: {str(e)}")
        raise ValidationError(f"Failed to create property and unit: {str(e)}")

def get_or_create_property_type(name, description=None):
    """
    Helper to get or create a property type.
    """
    property_type, created = PropertyType.objects.get_or_create(
        name=name.strip(),
        defaults={'description': description or f'Auto-created {name} property type'}
    )
    return property_type


def process_address_data(address_data):
    """
    Process address data and resolve country, city, suburb objects.
    """
    processed_data = address_data.copy()
    
    # Handle suburb (required field)
    if 'suburb_id' in processed_data:
        try:
            suburb = Suburb.objects.get(id=processed_data['suburb_id'])
            processed_data['suburb'] = suburb
            processed_data['suburb_id'] = suburb.id
        except Suburb.DoesNotExist:
            raise ValidationError(f"Suburb with ID {processed_data['suburb_id']} not found")
    else:
        raise ValidationError("suburb_id is required in address_data")
    
    # Handle country
    if 'country' in processed_data:
        if isinstance(processed_data['country'], str):
            try:
                country = Country.objects.get(code=processed_data['country'])
                processed_data['country'] = country
            except Country.DoesNotExist:
                try:
                    country = Country.objects.get(name=processed_data['country'])
                    processed_data['country'] = country
                except Country.DoesNotExist:
                    raise ValidationError(f"Country '{processed_data['country']}' not found")
        elif isinstance(processed_data['country'], int):
            try:
                country = Country.objects.get(id=processed_data['country'])
                processed_data['country'] = country
            except Country.DoesNotExist:
                raise ValidationError(f"Country with ID {processed_data['country']} not found")
    
    # Handle city
    if 'city' in processed_data:
        if isinstance(processed_data['city'], str):
            try:
                city = City.objects.get(name__iexact=processed_data['city'])
                processed_data['city'] = city
            except City.DoesNotExist:
                # Create city if it doesn't exist
                if 'country' in processed_data and isinstance(processed_data['country'], Country):
                    city = City.objects.create(
                        name=processed_data['city'],
                        country=processed_data['country']
                    )
                    processed_data['city'] = city
                else:
                    raise ValidationError("Cannot create city without country reference")
        elif isinstance(processed_data['city'], int):
            try:
                city = City.objects.get(id=processed_data['city'])
                processed_data['city'] = city
            except City.DoesNotExist:
                raise ValidationError(f"City with ID {processed_data['city']} not found")
    
    return processed_data
# BASIC USAGE

# property_data = {
#     'name': 'Sunset Apartments',
#     'description': 'Luxury apartment complex',
#     'property_type_id': 1,  # ID of existing property type
#     'address': {
#         'suburb_id': 1,
#         'street_address': '123 Sunset Blvd'
#     }
# }

# unit_data = {
#     'unit_number': '101',
#     'unit_type': 'APARTMENT',
#     'number_of_rooms': 2,
#     'status': 'vacant'
# }

# try:
#     property_instance, unit_instance = create_property_with_unit(
#         property_data, unit_data, request.user
#     )
#     print(f"Created property: {property_instance.name}")
#     if unit_instance:
#         print(f"Created unit: {unit_instance.unit_number}")
# except ValidationError as e:
#     print(f"Error: {e}")

# Minimal property
# from apps.properties.helpers import create_minimal_property

# address_data = {
#     'suburb_id': 1,
#     'street_address': '456 Ocean Drive'
# }

# property_instance = create_minimal_property(
#     'Beach House', 'Residential', address_data, request.user
# )

# BULK CREATION
# properties_data = [
#     {
#         'name': 'Property 1',
#         'property_type_id': 1,
#         'address': {'suburb_id': 1, 'street_address': 'Address 1'},
#         'unit': {'unit_number': '101'}
#     },
#     {
#         'name': 'Property 2', 
#         'property_type_id': 1,
#         'address': {'suburb_id': 1, 'street_address': 'Address 2'}
#     }
# ]

# created_properties = create_property_bulk(properties_data, request.user)