from rest_framework import serializers
from individuals.models.models import Individual, EmploymentDetail, NextOfKin

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
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number', 'email', 'mobile_phone',
            'landline_phone', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']