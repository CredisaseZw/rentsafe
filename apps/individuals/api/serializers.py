from rest_framework import serializers
from apps.common.models.models import Address
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, Note, Document, IndividualContactDetail
from apps.common.api.serializers import AddressSerializer, NoteSerializer, DocumentSerializer
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError as DjangoValidationError
from apps.individuals.services.validators import validate_email
from apps.individuals.utils.phone import normalize_phone_number

from django.db import transaction
import logging
import re

logger = logging.getLogger('individuals')
class EmploymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetail
        fields = [
            'id', 'employer_name', 'job_title', 
            'start_date', 'end_date', 'is_current',
            'monthly_income'
        ]
    
    def validate(self,data):
        if email:= data.get("email"):
            try:
                validate_email(email)
            except Exception as e:
                raise ValueError("Invalid employer email address provide")
            
        return data

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
        
    def validate(self, data):
        try:
            if email := data.get("email",''):
                validate_email(email)
                
        except Exception as e:
            raise ValueError(f"Error while creating next of kin {e}")
        
        return data

class ContactDetailsSerializer(serializers.ModelSerializer):
    mobile_phone = serializers.ListField(
        child=serializers.CharField(max_length=15),
        allow_empty=False
    )

    class Meta:
        model = IndividualContactDetail
        fields = ['id', 'individual_id', 'mobile_phone', 'email']

    def validate(self, data):
        email = data.get('email', '').strip()
        
        if IndividualContactDetail.objects.filter(email__iexact=email):
            raise ValueError("This email address is already registered")
        # Validate email
        try:
            
            validate_email(email)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'email': e.messages})
        
        phone = data.get("mobile_phone",[])

        # Access country from parent serializer context
        country = None
        parent = self.parent
        if hasattr(parent, 'initial_data'):
            address_id = parent.initial_data.get("address")
            if address_id:
                try:
                    address = Address.objects.get(pk=address_id)
                    country = address.country.lower().strip()
                except Address.DoesNotExist:
                    pass

        if phone and country == "zimbabwe":
            data["mobile_phone"] = normalize_phone_number(phone)


        return data
        
class IndividualSerializer(serializers.ModelSerializer):
    employment_details = EmploymentDetailSerializer(many=True,required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    gender_display = serializers.CharField(source='get_gender_display',read_only=True)
    identification_type_display = serializers.CharField(source='get_identification_type_display',read_only=True)
    addresses = AddressSerializer(many=True,required=True)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False)
    
    class Meta:
        model = Individual
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'gender', 'gender_display',
            'identification_type', 'identification_type_display',
            'identification_number','contact_details', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin', 'documents', 
            'addresses', 'notes','date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

class IndividualMinimalSerializer(serializers.ModelSerializer):
    current_employment = serializers.SerializerMethodField()
    contact_details = ContactDetailsSerializer(many=True, required=False)
    
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                  'gender','date_of_birth','marital_status','address', 
                  'current_employment', 'contact_details']
    
    # Get the primary address    
    def get_address(self, obj):
        if primary_address := obj.addresses.filter(is_primary=True).first():
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
    contact_details = ContactDetailsSerializer(many=True, required=False)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    class Meta:
        model = Individual
        fields = [
            'id','first_name', 'last_name', 'date_of_birth', 'gender','marital_status',
            'identification_type', 'identification_number','contact_details',
            'addresses', 'employment_details', 'next_of_kin', 'documents','notes'
        ]

    def validate(self, data):
        identification_number = re.sub(r'[-\s]', '', data.get('identification_number'))  
        try:
            
            if Individual.objects.filter(identification_number__iexact=identification_number).exists():
                raise serializers.ValidationError(
                    f"This identification{identification_number} number is already registered."
                )
        except Exception as e:
            raise serializers.ValidationError(f'failed to create individual: {e}')
        return data

    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('addresses', [])
        employment_data = validated_data.pop('employment_details', [])
        kin_data = validated_data.pop('next_of_kin', [])
        contact_data= validated_data.pop('contact_details', [])
        documents_data = validated_data.pop('documents',[])
        notes_data = validated_data.pop('notes', [])
        user = self.context.get('user')

        individual = Individual.objects.create(**validated_data)

        # Create addresses
        for address_data in address_data:
            Address.objects.create(
                user=user,
                content_object=individual,
                **address_data,
                is_primary=True
            )

        for contact in contact_data:
            IndividualContactDetail.objects.create(
                user=user,
                individual=individual,
                **contact
            )

        for emp in employment_data:
            EmploymentDetail.objects.create(user=user,individual=individual, **emp)

        if kin_data: 
            for kin in kin_data:
                NextOfKin.objects.create(user=user,individual=individual, **kin)
        if documents_data:
            for doc in documents_data:
                Document.objects.create(user=user,content_object = individual, **doc)  

        if notes_data:
            for note in notes_data:
                Note.objects.create(user=user,content_object=individual,**note)
                
        return individual

class IndividualUpdateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False)


    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'contact_details', 'is_active', 'addresses',
            'employment_details', 'next_of_kin'
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        employment = validated_data.pop('employment_details', [])
        kin = validated_data.pop('next_of_kin', [])
        contact_data = validated_data.pop('contact_details', [])
        documents = validated_data.pop('documents',[])
        notes_data = validated_data.pop('notes', [])

        user = self.context.get('user')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if addresses_data is not None:
            company_content_type = ContentType.objects.get_for_model(Individual)
                        
            for address_data in addresses_data:
                Address.objects.create(
                    user=user,
                    content_type=company_content_type,
                    object_id=instance.id,
                    **address_data
                )

        if employment is not None:
            for emp in employment:
              EmploymentDetail.objects.create(user=user, individual=instance, **emp)

        if contact_data is not None:
            for contact in contact_data:
                IndividualContactDetail.objects.create(user=user, individual=instance, **contact)

        # Handle Next of Kin
        if kin is not None:
            for k in kin:
                NextOfKin.objects.create(user=user, individual=instance, **k)

        if documents is not None:
            for doc in documents:
                Document.objects.create(user=user,Individual=instance,**doc)
        if notes_data is not None:
            for n in notes_data:
                Note.objects.create(user=user, individual=instance, **n)
        return instance

class IndividualSearchSerializer(serializers.ModelSerializer):
    """Serializer for searching individuals Retuning minimal fields"""
    contact_details = ContactDetailsSerializer(many=True, required=False)
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                    'contact_details', 'is_active']
