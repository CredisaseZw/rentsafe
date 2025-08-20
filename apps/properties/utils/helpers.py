from apps.properties.models import Property, Unit


def create_unit(property_instance, user, **validated_data):
    """
    Create a new Unit instance associated with a Property and User.
    """
    return Unit.objects.create(
        property=property_instance, 
        created_by=user,
        updated_by=user,
        unit_number=validated_data.get("unit_number"),
        unit_type=validated_data.get("unit_type"),
        number_of_rooms=validated_data.get("number_of_rooms"),
        status=validated_data.get("status"),
        features=validated_data.get("features", {}),
    )