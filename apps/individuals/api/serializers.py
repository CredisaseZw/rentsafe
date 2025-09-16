from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType

from apps.common.models.models import Country
from apps.individuals.models.models import Individual, EmploymentDetail, NextOfKin, Note, Document, IndividualContactDetail
from apps.common.api.serializers import AddressSerializer, NoteSerializer, DocumentSerializer,AddressCreateSerializer
from apps.common.utils.validators import (
    validate_email,
    normalize_zimbabwe_mobile, 
    validate_national_id, 
    validate_future_dates
)
from apps.individuals.utils.helpers import(
     individual_notes_helper,
     create_address_helper, 
     individual_contact_helper, 
     individual_documents_helper, 
     individual_next_of_kin_helper,
     individual_employment_details_helper
)
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
            if validate_email(email):
                data["email"] = email.strip()
            else:
                raise ValidationError("Invalid employer email address provide")
            
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
        
    def validate(self,data):
        if mobile := data.get('mobile_phone'):
            if formatted := normalize_zimbabwe_mobile(mobile):
                data["mobile_phone"] = formatted
            else:
                raise ValidationError("Invalid phone number")
        
        if email:= data.get("email"):

            
            if validate_email(email):
                data["email"] = email.strip()
            else:
                raise ValidationError("Invalid email address provided")
            
        return data

class ContactDetailsSerializer(serializers.ModelSerializer):
    mobile_phone = serializers.ListField(
        child=serializers.CharField(max_length=15),
        allow_empty=False,
        required=True,
        min_length=1,
        error_messages={
            'required': 'Phone number is required',
            'null': 'Phone number is required',
            'blank': 'Phone number is required',
        }
    )

    class Meta:
        model = IndividualContactDetail
        fields = ['id', 'individual_id', 'mobile_phone', 'email']
    
    def validate(self, data):
        email = data.get('email', '').strip()

        if email:
            existing_qs = IndividualContactDetail.objects.filter(email__iexact=email)

            if self.instance:
                existing_qs = existing_qs.exclude(pk=self.instance.pk)

            if existing_qs.exists():
                raise ValidationError("This email address is already registered")

            if validate_email(email):
                data["email"] = email.strip()
            else:
                raise ValidationError("Invalid email address provided")
        
        mobile_phone_numbers = data.get("mobile_phone",[])
        normalized_phone = []
        existing_numbers = []
    
        existing_numbers = set(
            normalize_zimbabwe_mobile(phone_number)
            for phone_numbers in IndividualContactDetail.objects.values_list('mobile_phone', flat=True)
            for phone_number in phone_numbers if phone_number
        )
        for phone in mobile_phone_numbers:
            formatted = normalize_zimbabwe_mobile(phone)

            if formatted:
                if formatted in existing_numbers:
                    raise ValidationError(f"This phone number is already registered: {formatted}")
                
                normalized_phone.append(formatted)
            else:
                raise ValidationError(f"Invalid phone number: {phone}")
        data["mobile_phone"] = normalized_phone

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
            'date_of_birth', 'gender', 'gender_display','marital_status',
            'identification_type', 'identification_type_display',
            'identification_number','contact_details', 'is_verified', 'is_active',
            'employment_details', 'next_of_kin', 'documents', 
            'addresses', 'notes','date_created', 'date_updated'
        ]
        read_only_fields = ['date_created', 'date_updated']

class IndividualMinimalSerializer(serializers.ModelSerializer):
    current_employment = serializers.SerializerMethodField()
    contact_details = serializers.SerializerMethodField()
    addresses = serializers.SerializerMethodField()
    
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                  'gender','date_of_birth','marital_status', 
                  'current_employment', 'contact_details', 'addresses']
    
    # Get the primary address    
    def get_addresses(self, obj):
        if primary_address := obj.addresses.filter(is_primary=True).first():
            return AddressSerializer(primary_address).data
        # fallback: return first address if no primary is set
        if latest_address := obj.addresses.order_by('-id').first():
            return AddressSerializer(latest_address).data
        return None
    
    def get_contact_details(self, obj):
        if contact := obj.contact_details.order_by('-id').first():
            return ContactDetailsSerializer(contact).data
        return None

    
    def get_current_employment(self, obj):
        if current_employment := obj.employment_details.filter(is_current=True).first():
            return EmploymentDetailSerializer(current_employment).data
        return None

    
class IndividualCreateSerializer(serializers.ModelSerializer):
    addresses = AddressCreateSerializer(many=True, required=True)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False)
    class Meta:
        model = Individual
        fields = [
            'id','first_name', 'last_name', 'date_of_birth', 'gender','marital_status',
            'identification_type', 'identification_number','contact_details',
            'addresses', 'employment_details', 'next_of_kin'
        ]
    def validate(self, data):
        id_type = data.get('identification_type')
        id_number = re.sub(r'[-\s]', '', data.get('identification_number', ''))
        dob = data.get('date_of_birth')
        addresses = data.get('addresses', [])
        for address in addresses:
            street = address.get('street_address')
            suburb = address.get('suburb') 

            if not street or not hasattr(suburb, 'id') or not suburb.id:
                raise ValidationError("Each address must have a street address and suburb_id")
        if id_type:
            if id_type == 'national_id':
                if not id_number or not validate_national_id( id_number):
                    raise ValidationError("Invalid or missing national id")
            elif id_type == 'passport':
                if not id_number:
                    raise ValidationError("Invalid or missing passport number")
                if not (5 <= len(id_number) <= 15):
                    raise ValidationError("Passport number must be between 5 and 15 characters")
            else:
                raise ValidationError("Invalid identification type provided")


        for field in ['first_name', 'last_name', 'identification_number', 'identification_type']:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required")

        if dob is not None:
            if validate_future_dates(dob):
                data['date_of_birth'] = dob
            else:
                raise ValidationError("Invalid date of birth, Individual must be at least 18 years old.")
        existing = Individual.objects.filter(identification_number__iexact=id_number).first()

        if existing and not existing.is_deleted:
                raise ValidationError(
                    f"This identification number {id_number} is already registered and active."
                )
        else: 
            self._existing_individual = existing 

        return data

    @transaction.atomic
    def create(self, validated_data):
        address_data  = [
            {
                'street_address': addr.get('street_address'),
                'address_type': addr.get('address_type'),
                'line_2': addr.get('line_2'),
                'suburb': addr.get('suburb').instance if hasattr(addr.get('suburb'), 'instance') else addr.get('suburb'),
            }
            for addr in validated_data.pop('addresses', [])
        ]
        employment_data = validated_data.pop('employment_details', [])
        kin_data = validated_data.pop('next_of_kin', [])
        contact_data= validated_data.pop('contact_details', [])
        
        individual = getattr(self,'_existing_individual', None)
        if individual:
            for attr, value in validated_data.items():
                setattr(individual, attr, value)
            individual.is_deleted = False
            individual.is_active = True
            individual.save()
        else:
            individual = Individual.objects.create(**validated_data)

        individual_ct = ContentType.objects.get_for_model(individual)
        create_address_helper(individual_ct, address_data, individual.pk)
        individual_contact_helper(individual, contact_data)
        individual_employment_details_helper(individual, employment_data)
        individual_next_of_kin_helper(individual, kin_data)
                
        return individual

class IndividualUpdateSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, required=False)
    employment_details = EmploymentDetailSerializer(many=True, required=False)
    next_of_kin = NextOfKinSerializer(many=True, required=False)
    contact_details = ContactDetailsSerializer(many=True, required=False)
    notes = NoteSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)


    class Meta:
        model = Individual
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender',
            'contact_details', 'is_active', 'addresses',
            'employment_details', 'next_of_kin', 'notes', 'documents'
        ]

    def validate(self, data):
        id_type = data.get('identification_type')
        id_number = re.sub(r'[-\s]', '', data.get('identification_number', ''))
        dob = data.get('date_of_birth')

        if id_type:
            if id_type == 'national_id':
                if not id_number or not validate_national_id(id_number):
                    raise ValidationError("Invalid or missing national id")
            elif id_type == 'passport':
                if not id_number:
                    raise ValidationError("Invalid or missing passport number")
                if not (5 <= len(id_number) <= 15):
                    raise ValidationError("Passport number must be between 5 and 15 characters")
            else:
                raise ValidationError("Invalid identification type provided")

        for field in ['first_name', 'last_name', 'identification_number', 'identification_type']:
            if field in data and not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} cannot be empty")

        if dob is not None:
            if not validate_future_dates(dob):
                raise ValidationError("Invalid date of birth")
            data['date_of_birth'] = dob
        
        return data
    
    @transaction.atomic
    def update(self, instance, validated_data):
        address_data = validated_data.pop('addresses', [])
        employment_data = validated_data.pop('employment_details', [])
        kin_data = validated_data.pop('next_of_kin', [])
        contact_data = validated_data.pop('contact_details', [])
        documents_data = validated_data.pop('documents',[])
        notes_data = validated_data.pop('notes', [])

        user = self.context.get('user')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        

        individual_ct = ContentType.objects.get_for_model(instance)
        
        create_address_helper(individual_ct, address_data, instance.pk)
        individual_documents_helper(individual_ct, documents_data, instance.pk)
        individual_notes_helper(individual_ct, notes_data, instance.pk)

        individual_contact_helper(instance, contact_data)
        individual_employment_details_helper(instance, employment_data)
        individual_next_of_kin_helper(instance, kin_data)
        
                
        return instance

class IndividualSearchSerializer(serializers.ModelSerializer):
    """Serializer for searching individuals Retuning minimal fields"""
    contact_details = serializers.SerializerMethodField()
    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_number',
                    'contact_details', 'is_active']
        
    def get_contact_details(self, obj):
        if contact := obj.contact_details.order_by('-id').first():
            return ContactDetailsSerializer(contact).data
        return None

class IndividualAddressSerializer(serializers.ModelSerializer):
    contact_details = serializers.SerializerMethodField()
    primary_address = serializers.SerializerMethodField()

    class Meta:
        model = Individual
        fields = ['id', 'first_name', 'last_name', 'identification_type','identification_number',
                  'contact_details','primary_address', 'is_active']

    def get_primary_address(self, obj):
        if primary_address := obj.addresses.filter(is_primary=True, address_type="physical").first():
            return AddressSerializer(primary_address).data
        # fallback: return first address if no primary, physical is set
        if latest_address := obj.addresses.order_by('-id').first():
            return AddressSerializer(latest_address).data
        return None
    
    def get_contact_details(self, obj):
        contact = obj.contact_details.order_by('-id').first()
        if contact:
            mobile_phones = contact.mobile_phone[0] if contact.mobile_phone else None
            return {
                'mobile_phone': mobile_phones,
                'email': contact.email
            }
        return None
