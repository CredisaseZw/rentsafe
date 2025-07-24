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

        if email:
            existing_qs = IndividualContactDetail.objects.filter(email__iexact=email)

            if self.instance:
                existing_qs = existing_qs.exclude(pk=self.instance.pk)

            if existing_qs.exists():
                raise serializers.ValidationError({"email": "This email address is already registered"})

            try:
                validate_email(email)
            except DjangoValidationError as e:
                raise serializers.ValidationError({'email': e.messages})

        
        phone = data.get("mobile_phone",[])

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
        if latest_address := obj.addresses.order_by('id').first():
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
            existing = Individual.objects.filter(identification_number__iexact=identification_number).first()
            if existing:
                if not existing.is_deleted:
                    raise serializers.ValidationError(
                        f"This identification number {identification_number} is already registered and active."
                    )
                self._existing_individual = existing 
        except Exception as e:
            logger.error(f"Error validating individual: {e}")
            raise serializers.ValidationError(f'Failed to validate individual: {e}')
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
        
        individual = getattr(self,'_existing_individual', None)
        if individual:
            for attr, value in validated_data.items():
                setattr(individual, attr, value)
            individual.is_deleted = False
            individual.is_active = True
            individual.save()
        else:
            individual = Individual.objects.create(**validated_data)

        # Create addresses
        # for address_data in address_data:
        #     Address.objects.create(
        #         user=user,
        #         content_object=individual,
        #         **address_data,
        #         is_primary=True
        #     )

        individual_ct = ContentType.objects.get_for_model(individual)

        for addr in address_data:
            address_id = addr.get('id', None)

            if address_id:
                try:
                    address_obj = Address.objects.get(
                        id=address_id,
                        content_type=individual_ct,
                        object_id=individual.pk,
                        is_primary=True
                    )
                    for key, val in addr.items():
                        setattr(address_obj, key, val)
                    address_obj.save()
                except Address.DoesNotExist:
                    Address.objects.create(
                        user=user,
                        content_type=individual_ct,
                        object_id=individual.pk,
                        **addr,
                        is_primary=True
                    )
            else:
                existing = Address.objects.filter(
                    content_type=individual_ct,
                    object_id=individual.pk,
                    address_type=addr.get('address_type'),
                    is_primary=addr.get('is_primary', True)
                ).first()

                if existing:
                    for key, val in addr.items():
                        setattr(existing, key, val)
                    existing.save()
                else:
                    Address.objects.create(
                        user=user,
                        content_type=individual_ct,
                        object_id=individual.pk,
                        **addr,
                        is_primary=True
                    )

        for contact in contact_data:
            contact_id = contact.get('id', None)

            if contact_id:
                try:
                    contact_obj = IndividualContactDetail.objects.get(
                        id=contact_id, 
                        individual=individual
                    )
                    for key, val in contact.items():
                        setattr(contact_obj, key, val)
                    contact_obj.save()
                except IndividualContactDetail.DoesNotExist:
                    IndividualContactDetail.objects.create(
                        user=user, 
                        individual=individual,
                        **contact
                    )
            else:
                email = contact.get('email', None)
                if email:
                    existing = IndividualContactDetail.objects.filter(
                        individual=individual,
                        email__iexact=email
                    ).first()
                    if existing:
                        for key, val in contact.items():
                            setattr(existing, key, val)
                        existing.save()
                    else:
                        IndividualContactDetail.objects.create(
                            user=user, 
                            individual=individual,
                            **contact
                        )
                else:
                    IndividualContactDetail.objects.create(
                        user=user, 
                        individual=individual, 
                        **contact
                    )

        for emp in employment_data:
            emp_id = emp.get('id', None)
            if emp_id:
                try:
                    emp_obj = EmploymentDetail.objects.get(
                        id=emp_id, 
                        individual=individual
                    )
                    for key, val in emp.items():
                        setattr(emp_obj, key, val)
                    emp_obj.save()
                except EmploymentDetail.DoesNotExist:
                    EmploymentDetail.objects.create(
                        user=user, 
                        individual=individual, 
                        **emp
                    )
            else:
                EmploymentDetail.objects.create(
                    user=user, 
                    individual=individual, 
                    **emp
                )

        if kin_data: 
            for kin in kin_data:
                NextOfKin.objects.create(
                    user=user,
                    individual=individual, 
                    **kin
                )
        if documents_data:
            for doc in documents_data:
                document_id = doc.get('id', None)
                
                if document_id:
                    try:
                        doc_obj = Document.objects.get(
                            id = document_id,
                            content_type = individual_ct,
                            object_id = individual.pk
                        )
                        for key , val in doc.items():
                            setattr(doc_obj, key , val)
                        doc_obj.save()
                    except Document.DoesNotExist:
                        Document.objects.create(
                            user=user,
                            content_object = individual, 
                            **doc
                        )
                else:
                    existing = Document.objects.filter(
                        content_type=individual_ct,
                        object_id=individual.pk,
                        file = doc.get('file'),
                        document_type = doc.get('document_type')   
                    ).first()
                    if existing:
                        for key, val in addr.items():
                            setattr(existing, key, val)
                        existing.save()
                    else:
                        Document.objects.create(
                            user=user,
                            content_object = individual, 
                            **doc
                        )

        if notes_data:
            for note in notes_data:
                Note.objects.create(
                    user=user,
                    content_object=individual,
                    **note
                )
                
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

        for addr in address_data:
            address_id = addr.get('id', None)

            if address_id:
                try:
                    address_obj = Address.objects.get(
                        id=address_id,
                        content_type=individual_ct,
                        object_id=instance.pk,
                        is_primary=True
                    )
                    for key, val in addr.items():
                        setattr(address_obj, key, val)
                    address_obj.save()
                except Address.DoesNotExist:
                    Address.objects.create(
                        user=user,
                        content_type=individual_ct,
                        object_id=instance.pk,
                        **addr,
                        is_primary=True
                    )
            else:
                existing = Address.objects.filter(
                    content_type=individual_ct,
                    object_id=instance.pk,
                    address_type=addr.get('address_type'),
                    is_primary=addr.get('is_primary', True)
                ).first()

                if existing:
                    for key, val in addr.items():
                        setattr(existing, key, val)
                    existing.save()
                else:
                    Address.objects.create(
                        user=user,
                        content_type=individual_ct,
                        object_id=instance.pk,
                        **addr,
                        is_primary=True
                    )

        for contact in contact_data:
            contact_id = contact.get('id', None)

            if contact_id:
                try:
                    contact_obj = IndividualContactDetail.objects.get(
                        id=contact_id, 
                        individual=instance
                    )
                    for key, val in contact.items():
                        setattr(contact_obj, key, val)
                    contact_obj.save()
                except IndividualContactDetail.DoesNotExist:
                    IndividualContactDetail.objects.create(
                        user=user, 
                        individual=instance,
                        **contact
                    )
            else:
                email = contact.get('email', None)
                if email:
                    existing = IndividualContactDetail.objects.filter(
                        individual=instance,
                        email__iexact=email
                    ).first()
                    if existing:
                        for key, val in contact.items():
                            setattr(existing, key, val)
                        existing.save()
                    else:
                        IndividualContactDetail.objects.create(
                            user=user, 
                            individual=instance,
                            **contact
                        )
                else:
                    IndividualContactDetail.objects.create(
                        user=user, 
                        individual=instance, 
                        **contact
                    )

        for emp in employment_data:
            emp_id = emp.get('id', None)
            if emp_id:
                try:
                    emp_obj = EmploymentDetail.objects.get(
                        id=emp_id, 
                        individual=instance
                    )
                    for key, val in emp.items():
                        setattr(emp_obj, key, val)
                    emp_obj.save()
                except EmploymentDetail.DoesNotExist:
                    EmploymentDetail.objects.create(
                        user=user, 
                        individual=instance, 
                        **emp
                    )
            else:
                EmploymentDetail.objects.create(
                    user=user, 
                    individual=instance, 
                    **emp
                )

        if kin_data: 
            for kin in kin_data:
                NextOfKin.objects.create(
                    user=user,
                    individual=instance, 
                    **kin
                )
        if documents_data:
            for doc in documents_data:
                document_id = doc.get('id', None)
                
                if document_id:
                    try:
                        doc_obj = Document.objects.get(
                            id = document_id,
                            content_type = individual_ct,
                            object_id = instance.pk
                        )
                        for key , val in doc.items():
                            setattr(doc_obj, key , val)
                        doc_obj.save()
                    except Document.DoesNotExist:
                        Document.objects.create(
                            user=user,
                            content_object = instance, 
                            **doc
                        )
                else:
                    existing = Document.objects.filter(
                        content_type=individual_ct,
                        object_id=instance.pk,
                        file = doc.get('file'),
                        document_type = doc.get('document_type')   
                    ).first()
                    if existing:
                        for key, val in addr.items():
                            setattr(existing, key, val)
                        existing.save()
                    else:
                        Document.objects.create(
                            user=user,
                            content_object = instance, 
                            **doc
                        )

        if notes_data:
            for note in notes_data:
                Note.objects.create(
                    user=user,
                    content_object=instance,
                    **note
                )
                
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
