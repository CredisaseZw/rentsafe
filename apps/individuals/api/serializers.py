from rest_framework import serializers
from apps.common.models.models import Address
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, Note, Document
from apps.common.api.serializers import AddressSerializer, NoteSerializer, DocumentSerializer
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
import logging

logger = logging.getLogger('file_individual')
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
    employment_details = EmploymentDetailSerializer(many=True,required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    gender_display = serializers.CharField(source='get_gender_display',read_only=True)
    identification_type_display = serializers.CharField(source='get_identification_type_display',read_only=True)
    addresses = AddressSerializer(many=True,required=True)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number', 'email', 'mobile_phone',
            'landline_phone', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin', 'documents', 
            'addresses', 'notes','date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

class IndividualCreateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=True)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)

    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'identification_type', 'identification_number', 'email',
            'mobile_phone', 'is_active', 'addresses', 'employment_details',
            'next_of_kin', 'notes', 'documents'
        ]

    def validate(self, data):
        identification_number = data.get('identification_number')
        if Individual.objects.filter(identification_number__iexact=identification_number).exists():
            raise serializers.ValidationError({"identification_number": "This identification number is already registered."})
        return data

    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('addresses', [])
        employment_data = validated_data.pop('employment_details', [])
        kin_data = validated_data.pop('next_of_kin', [])
        notes_data = validated_data.pop('notes', [])
        documents_data = validated_data.pop('documents', [])

        individual = Individual.objects.create(**validated_data)

        for addr in address_data:
            Address.objects.create(content_object=individual, **addr)

        for emp in employment_data:
            EmploymentDetail.objects.create(individual=individual, **emp)

        for kin in kin_data:
            NextOfKin.objects.create(individual=individual, **kin)

        for note in notes_data:
            Note.objects.create(
                individual=individual,
                content_type=ContentType.objects.get_for_model(individual),
                **note
            )

        for doc in documents_data:
            Document.objects.create(
                content_type=ContentType.objects.get_for_model(individual),
                object_id=individual.pk,
                **doc
            )

        return individual

class IndividualUpdateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)

    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'email', 'mobile_phone', 'is_active', 'addresses',
            'employment_details', 'next_of_kin'
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        addresses = validated_data.pop('addresses', [])
        employment = validated_data.pop('employment_details', [])
        kin = validated_data.pop('next_of_kin', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        for addr in addresses:
            Address.objects.create(content_object=instance, **addr)

        for emp in employment:
            EmploymentDetail.objects.create(individual=instance, **emp)

        for k in kin:
            NextOfKin.objects.create(individual=instance, **k)

        instance.save()
        return instance

class IndividualSearchSerializer(serializers.ModelSerializer):
    """Serializer for searching individuals Retuning minimal fields"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    latest_address = serializers.SerializerMethodField()
    current_employment = serializers.SerializerMethodField()
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'full_name',
                  'email', 'identification_number', 'mobile_phone', 
                  'latest_address','current_employment']

    def get_latest_address(self, obj):
        latest_address = obj.addresses.order_by('id').first()
        if latest_address:
            return AddressSerializer(latest_address).data
        return  None
    
    def get_current_employment(self, obj):
        current_employment = obj.employment_details.filter(is_current=True).first()
        if current_employment:
            return EmploymentDetailSerializer(current_employment).data
        return None