from rest_framework import serializers
from apps.common.models.models import Address
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin
from apps.common.api.serializers import AddressSerializer

class EmploymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetail
        fields = [
            'id', 'employer_name', 'job_title', 
            'start_date', 'end_date', 'is_current',
            'monthly_income', 'marital_status'
        ]

class NextOfKinSerializer(serializers.ModelSerializer):
    relationship_display = serializers.CharField(
        source='get_relationship_display',
        read_only=True
    )
    
    class Meta:
        model = NextOfKin
        fields = [
            'id', 'first_name', 'last_name',
            'relationship', 'relationship_display',
            'mobile_phone', 'email', 'physical_address'
        ]

class IndividualSerializer(serializers.ModelSerializer):
    employment_details = EmploymentDetailSerializer(
        many=True,
        read_only=True
    )
    next_of_kin = NextOfKinSerializer(
        many=True,
        read_only=True
    )
    gender_display = serializers.CharField(
        source='get_gender_display',
        read_only=True
    )
    identification_type_display = serializers.CharField(
        source='get_identification_type_display',
        read_only=True
    )
    
    address = AddressSerializer(
        source='addresses',
        many=True,
        read_only=True
    )
    address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(),
        write_only=True,
    )
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number', 'email', 'mobile_phone',
            'landline_phone', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin',
            'date_created', 'date_updated', 'address', 'address_id'
        ]
        read_only_fields = ['date_created', 'date_updated']
        
    def create(self, validated_data):
        employment_details_data = validated_data.pop('employment_details', [])
        next_of_kin_data = validated_data.pop('next_of_kin', [])
        address_data = validated_data.pop('addresses', [])
        
        individual = Individual.objects.create(**validated_data)
        
        for employment_detail in employment_details_data:
            EmploymentDetail.objects.create(individual=individual, **employment_detail)
        
        for kin in next_of_kin_data:
            NextOfKin.objects.create(individual=individual, **kin)
            
        for address in address_data:
            Address.objects.create(content_object=individual, **address)

        return individual