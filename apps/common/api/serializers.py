# common/api/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from apps.common.models.models import Address, Document, Note, Country, Province, City, Suburb
from apps.users.models import CustomUser
from django.contrib.contenttypes.models import ContentType
import logging
logger = logging.getLogger(__name__)

class MinimalSuburbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suburb
        fields = ['id', 'name']
        read_only_fields = ['id', 'name'] 

class MinimalCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']
        read_only_fields = ['id', 'name']

class MinimalProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name', 'code']
        read_only_fields = ['id', 'name', 'code']

class MinimalCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']
        read_only_fields = ['id', 'name', 'code']

class SuburbSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source='city.name', read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )

    class Meta:
        model = Suburb
        fields = ['id', 'name', 'city', 'city_id', 'slug', 'is_active'] 
        read_only_fields = ['slug']

class CitySerializer(serializers.ModelSerializer):
    province = serializers.CharField(source='province.name', read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), source='province', write_only=True
    )

    class Meta:
        model = City
        fields = ['id', 'name', 'province', 'province_id', 'slug', 'is_active'] 
        read_only_fields = ['slug']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get('include_nested', False):
            self.fields['suburbs'] = MinimalSuburbSerializer(many=True, read_only=True)

class ProvinceSerializer(serializers.ModelSerializer):
    country = serializers.CharField(source='country.name', read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), source='country', write_only=True
    )

    class Meta:
        model = Province
        fields = ['id', 'name', 'code', 'country', 'country_id', 'slug', 'is_active', 'approved'] 
        read_only_fields = ['slug']
        validators = [
            UniqueTogetherValidator(
                queryset=Province.objects.all(),
                fields=['country_id', 'code'],
                message="Province with this code already exists for this country."
            )
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get('include_nested', False):
            self.fields['cities'] = MinimalCitySerializer(many=True, read_only=True)

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'dial_code', 'currency_code', 'currency_name', 'slug', 'is_active'] 
        read_only_fields = ['slug']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get('include_nested', False):
            self.fields['provinces'] = MinimalProvinceSerializer(many=True, read_only=True)

class AddressSerializer(serializers.ModelSerializer):
    """Serializer for Address model with nested location data"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    province_name = serializers.CharField(source='province.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    suburb_name = serializers.CharField(source='suburb.name', read_only=True)
    address_type_display = serializers.CharField(source='get_address_type_display', read_only=True)

    country = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(), write_only=True, allow_null=True, required=False
    )
    province = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), write_only=True, allow_null=True, required=False
    )
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), write_only=True
    )
    suburb = serializers.PrimaryKeyRelatedField(
        queryset=Suburb.objects.all(), write_only=True, allow_null=True, required=False
    )
    
    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'address_type_display', 'is_primary',
            'country', 'country_name', 'province', 'province_name', 
            'city', 'city_name', 'suburb', 'suburb_name',
            'street_address', 'line_2', 'postal_code',
            'latitude', 'longitude', 'date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']
        validators = [
            UniqueTogetherValidator(
                queryset=Address.objects.all(),
                fields=['content_type', 'object_id', 'address_type', 'is_primary'],
                message="An address with this combination of content type, object ID, address type, and primary status already exists."
            )
        ]

    def validate(self, data):
        city_instance = data.get('city')
        province_instance = data.get('province')
        country_instance = data.get('country')
        suburb_instance = data.get('suburb')

        if suburb_instance and city_instance and suburb_instance.city != city_instance:
            raise serializers.ValidationError({"suburb": f"Suburb '{suburb_instance.name}' does not belong to city '{city_instance.name}'."})
        
        if city_instance and province_instance and city_instance.province != province_instance:
            raise serializers.ValidationError({"city": f"City '{city_instance.name}' does not belong to province '{province_instance.name}'."})
        
        if province_instance and country_instance and province_instance.country != country_instance:
            raise serializers.ValidationError({"province": f"Province '{province_instance.name}' does not belong to country '{country_instance.name}'."})

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

    def create(self, validated_data):
        content_type = self.context.get('content_type')
        object_id = self.context.get('object_id')
        if not content_type or not object_id:
            raise serializers.ValidationError("Content type and object ID are required for note creation.")
        validated_data['content_type'] = content_type
        validated_data['object_id'] = object_id

        if 'request' in self.context and self.context['request'].user.is_authenticated:
            validated_data.setdefault('author', self.context['request'].user)
        return super().create(validated_data)