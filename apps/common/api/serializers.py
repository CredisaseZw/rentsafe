from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from apps.common.models.models import Address, Document, Note, Country, Province, City, Suburb
from apps.users.models import CustomUser
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'dial_code', 'currency_code', 'currency_name']
        read_only_fields = ['slug']

class ProvinceSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), source='country', write_only=True
    )

    class Meta:
        model = Province
        fields = ['id', 'name', 'code', 'country', 'country_id']
        read_only_fields = ['slug']
        validators = [
            UniqueTogetherValidator(
                queryset=Province.objects.all(),
                fields=['country', 'code'],
                message="Province with this code already exists for this country."
            )
        ]

class CitySerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), source='province', write_only=True
    )

    class Meta:
        model = City
        fields = ['id', 'name', 'province', 'province_id']
        read_only_fields = ['slug']

class SuburbSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )

    class Meta:
        model = Suburb
        fields = ['id', 'name', 'city', 'city_id']
        read_only_fields = ['slug']

class AddressSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), source='country', write_only=True, allow_null=True, required=False
    )
    province = ProvinceSerializer(read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), source='province', write_only=True, allow_null=True, required=False
    )
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )
    suburb = SuburbSerializer(read_only=True)
    suburb_id = serializers.PrimaryKeyRelatedField(
        queryset=Suburb.objects.all(), source='suburb', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'is_primary', 'country', 'country_id', 'province', 'province_id',
            'city', 'city_id', 'suburb', 'suburb_id', 'street_address', 'line_2', 'postal_code',
            'latitude', 'longitude', 'date_created', 'date_updated' # Corrected date_updated to date_updated
        ]
        read_only_fields = ['date_created', 'date_updated']
        validators = [
            # Removed the 'condition' argument as it's not supported by DRF's UniqueTogetherValidator.
            # The model's save method handles the 'is_primary' uniqueness logic.
            UniqueTogetherValidator(
                queryset=Address.objects.all(),
                fields=['content_type', 'object_id', 'address_type', 'is_primary'],
                message="An address with this combination of content type, object ID, address type, and primary status already exists."
            )
        ]

    def validate(self, data):
        # Ensure city, province, and country hierarchy is respected if provided
        city = data.get('city')
        province = data.get('province')
        country = data.get('country')

        if city and province and city.province != province:
            raise serializers.ValidationError({"city_id": "The selected city does not belong to the selected province."})
        if city and country and city.province.country != country:
            raise serializers.ValidationError({"city_id": "The selected city's province does not belong to the selected country."})
        if province and country and province.country != country:
            raise serializers.ValidationError({"province_id": "The selected province does not belong to the selected country."})

        return data

    def create(self, validated_data):
        content_type = self.context.get('content_type')
        object_id = self.context.get('object_id')
        if not content_type or not object_id:
            raise serializers.ValidationError("Content type and object ID are required for address creation.")
        validated_data['content_type'] = content_type
        validated_data['object_id'] = object_id
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # No need to update content_type or object_id as they are part of the instance
        return super().update(instance, validated_data)


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'document_type', 'file', 'description', 'is_verified', 'date_created', 'date_updated']
        read_only_fields = ['date_created', 'date_updated']

    def create(self, validated_data):
        content_type = self.context.get('content_type')
        object_id = self.context.get('object_id')
        if not content_type or not object_id:
            raise serializers.ValidationError("Content type and object ID are required for document creation.")
        validated_data['content_type'] = content_type
        validated_data['object_id'] = object_id
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(
        # Set a default queryset to prevent AssertionError.
        # This allows the field to be writeable.
        queryset=CustomUser.objects.all(),
        source='author',
        write_only=True,
        required=False,
        allow_null=True
    )
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'content', 'is_private', 'author_id', 'author_name', 'date_created', 'date_updated']
        read_only_fields = ['date_created', 'date_updated']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Removed dynamic queryset filtering here.
        # The `author_id` field now has a default queryset.
        # The `create` method handles setting the author if not explicitly provided.


    def create(self, validated_data):
        content_type = self.context.get('content_type')
        object_id = self.context.get('object_id')
        if not content_type or not object_id:
            raise serializers.ValidationError("Content type and object ID are required for note creation.")
        validated_data['content_type'] = content_type
        validated_data['object_id'] = object_id

        # Set author if not explicitly provided and user is authenticated
        if 'request' in self.context and self.context['request'].user.is_authenticated:
            validated_data.setdefault('author', self.context['request'].user)
        return super().create(validated_data)