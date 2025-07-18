from rest_framework import serializers
from apps.common.models.models import Address
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, Note, Document, IndividualContactDetail
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

class ContactDetailsSerializer(serializers.ModelSerializer):
    individual_id = serializers.PrimaryKeyRelatedField(
        queryset = Individual.objects.all(),
        source= 'individual',
        write_only = True,  
    )
    mobile_phone = serializers.ListField(
        child=serializers.CharField(max_length=15),
        allow_empty=False
    )
    class Meta:
        model = IndividualContactDetail
        fields = ['id','individual_id' ,'mobile_phone', 'email',]
    
class IndividualSerializer(serializers.ModelSerializer):
    employment_details = EmploymentDetailSerializer(many=True,required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    gender_display = serializers.CharField(source='get_gender_display',read_only=True)
    identification_type_display = serializers.CharField(source='get_identification_type_display',read_only=True)
    addresses = AddressSerializer(many=True,required=True)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False, source='contact_details')
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin', 'documents', 
            'addresses', 'notes','date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

class IndividualMinimalSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    current_employment = serializers.SerializerMethodField()
    contact_details = ContactDetailsSerializer(many=True, required=False, source='contact_details')
    
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                  'gender','date_of_birth','marital_status','address', 
                  'current_employment', 'contact_details']
    
    # Get the primary address    
    def get_address(self, obj):
        primary_address = obj.addresses.filter(is_primary=True).first()
        if primary_address:
            return AddressSerializer(primary_address).data
        # fallback: return first address if no primary is set
        latest_address = obj.addresses.order_by('id').first()
        if latest_address:
            return AddressSerializer(latest_address).data
        return None

    
    def get_current_employment(self, obj):
        current_employment = obj.employment_details.filter(is_current=True).first()
        if current_employment:
            return EmploymentDetailSerializer(current_employment).data
        return None

    
class IndividualCreateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=True)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False, source='contact_details')
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'identification_type', 'identification_number','contact_details',
            'addresses', 'employment_details', 'next_of_kin', 'documents','notes'
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
        contact_data= validated_data.pop('contact_details', [])
        documents_data = validated_data.pop('documents',[])
        notes_data = validated_data.pop('notes', [])

        individual = Individual.objects.create(**validated_data)

        # Create addresses
        for address_data in address_data:
            Address.objects.create(
                content_object=individual,
                **address_data,
                is_primary=True
            )

        for contact in contact_data:
            IndividualContactDetail.objects.create(
                individual=individual,
                **contact
            )

        for emp in employment_data:
            EmploymentDetail.objects.create(individual=individual, **emp)

        if kin_data: 
            for kin in kin_data:
                NextOfKin.objects.create(individual=individual, **kin)
        if documents_data:
            for doc in documents_data:
                Document.objects.create(content_object = individual, **doc)  

        if notes_data:
            for note in notes_data:
                Note.objects.create(content_object=individual,**note)
                
        return individual

class IndividualUpdateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False, source='contact_details')


    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'contact_details', 'is_active', 'addresses',
            'employment_details', 'next_of_kin'
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        addresses = validated_data.pop('addresses', [])
        employment = validated_data.pop('employment_details', [])
        kin = validated_data.pop('next_of_kin', [])
        contact_details = validated_data.pop('contact_details', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if addresses is not None:
            instance.addresses.update(is_primary=False)
            for addr in addresses:
                Address.objects.create(content_object=instance,is_primary=True, **addr)

        for emp in employment:
            EmploymentDetail.objects.create(individual=instance, **emp)

        for contact in contact_details:
            phone_numbers = contact.get('phone_number')
            email = contact.get('contact_value')

            if phone_numbers:
                IndividualContactDetail.objects.create(
                    individual=instance,
                    phone_number=phone_numbers,
                )

            if email:
                IndividualContactDetail.objects.create(
                    individual=instance,
                    contact_value=email,
                )
            IndividualContactDetail.objects.update(individual=instance,**contact)
            
        for k in kin:
            NextOfKin.objects.create(individual=instance, **k)

        return instance

class IndividualSearchSerializer(serializers.ModelSerializer):
    """Serializer for searching individuals Retuning minimal fields"""
    latest_address = serializers.SerializerMethodField()
    current_employment = serializers.SerializerMethodField()
    contact_details = ContactDetailsSerializer(many=True, required=False, source='contact_details')
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                    'contact_details']
