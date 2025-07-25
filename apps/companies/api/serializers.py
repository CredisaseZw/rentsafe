# apps/companies/api/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.contenttypes.models import ContentType
from apps.companies.models.models import Company, CompanyBranch, ContactPerson, CompanyProfile
from apps.common.models.models import Address, Document, Note
from apps.individuals.api.serializers import IndividualSerializer 
from apps.common.api.serializers import AddressSerializer, DocumentSerializer, NoteSerializer
from apps.individuals.models.models import Individual
import logging
from django.db import transaction

logger = logging.getLogger(__name__)

class ContactPersonSerializer(serializers.ModelSerializer):
    """Serializer for ContactPerson model"""
    individual_name = serializers.SerializerMethodField()
    contact_type_display = serializers.CharField(source='get_contact_type_display', read_only=True)
    
    class Meta:
        model = ContactPerson
        fields = [
            'id', 'individual', 'individual_name', 'contact_type', 
            'contact_type_display', 'is_primary', 'position'
        ]
    
    def get_individual_name(self, obj):
        if obj.individual:
            return f"{obj.individual.first_name} {obj.individual.last_name}"
        return None


class CompanyBranchSerializer(serializers.ModelSerializer):
    """Serializer for CompanyBranch model"""
    addresses = AddressSerializer(many=True, required=False)
    contacts = ContactPersonSerializer(many=True, read_only=True)
    
    class Meta:
        model = CompanyBranch
        fields = ['id', 'company', 'branch_name', 'addresses', 'contacts']
    
    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        branch = CompanyBranch.objects.create(**validated_data)
        user = self.context.get('user')
        company_content_type = ContentType.objects.get_for_model(CompanyBranch)
        # Create addresses for the branch
        for address_data in addresses_data:
            Address.objects.create(
                user=user,
                content_type=company_content_type,
                object_id=branch.id,
                **address_data
            )
        
        return branch
    
    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', None)
        instance = super().update(instance, validated_data)
        user = self.context.get('user')
        
        if addresses_data is not None:
            instance.addresses.all().delete()
            for address_data in addresses_data:
                Address.objects.create(
                    user=user,
                    content_type=ContentType.objects.get_for_model(CompanyBranch),
                    object_id=instance.id,
                    **address_data
                )
        
        return instance
    
class CompanyProfileSerializer(serializers.ModelSerializer):
    """Serializer for CompanyProfile model"""
    trading_status_display = serializers.CharField(source='get_trading_status_display', read_only=True)
    trend_display = serializers.CharField(source='get_trend_display', read_only=True)
    risk_class_display = serializers.CharField(source='get_risk_class_display', read_only=True)
    is_under_judicial_display = serializers.CharField(source='get_is_under_judicial_display', read_only=True)
    contact_person = ContactPersonSerializer(read_only=True)
    
    class Meta:
        model = CompanyProfile
        fields = [
            'trading_status', 'trading_status_display', 'mobile_phone', 'landline_phone',
            'email', 'logo', 'registration_date', 'tin_number', 'vat_number',
            'number_of_employees', 'website', 'trend', 'trend_display',
            'twitter', 'facebook', 'instagram', 'linkedin', 'operations',
            'contact_person', 'risk_class', 'risk_class_display',
            'account_number', 'is_under_judicial', 'is_under_judicial_display',
            'is_suspended'
        ]
    
    def update(self, instance, validated_data):
        """Update profile instance with validated data"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CompanyMinimalSerializer(serializers.ModelSerializer):
    """Minimal serializer for company search results"""
    legal_status_display = serializers.CharField(source='get_legal_status_display', read_only=True)
    primary_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'registration_number', 'registration_name', 'trading_name',
            'legal_status', 'legal_status_display', 'industry', 'is_verified',
            'primary_address'
        ]
    
    def get_primary_address(self, obj):
        """Get the primary physical address"""
        primary_address = obj.addresses.filter(
            address_type='physical', 
            is_primary=True
        ).first()

        return AddressSerializer(primary_address).data if primary_address else None


class CompanyDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for full company data"""
    legal_status_display = serializers.CharField(source='get_legal_status_display', read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    branches = CompanyBranchSerializer(many=True, read_only=True)
    profile = CompanyProfileSerializer(read_only=True)
    
    class Meta:
        model = Company
        fields = [
            'id', 'registration_number', 'registration_name', 'trading_name',
            'legal_status', 'legal_status_display', 'date_of_incorporation',
            'industry', 'is_verified', 'is_active', 'addresses', 'branches',
            'profile', 'date_created', 'date_updated'
        ]


class CompanyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating companies with addresses and profile"""
    addresses = AddressSerializer(many=True, required=False)
    documents = DocumentSerializer(many=True, required=False)
    notes = NoteSerializer(many=True, required=False)
    profile = CompanyProfileSerializer(required=False)
    class Meta:
        model = Company
        fields = [
            'registration_number', 'registration_name', 'trading_name',
            'legal_status', 'date_of_incorporation', 'industry',
            'addresses','documents', 'notes', 'profile'
        ]
    
    @transaction.atomic
    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        profile_data = validated_data.pop('profile', None)
        documents_data = validated_data.pop('documents', [])
        notes_data = validated_data.pop('notes', [])
        user = self.context.get('user')
        company = Company.objects.create(**validated_data)
        company_content_type = ContentType.objects.get_for_model(Company)

        for address_data in addresses_data:
            if is_primary := address_data.get('is_primary', False):
                Address.objects.filter(
                    user=user,
                    content_type=company_content_type,
                    object_id=company.id,
                    address_type=address_data['address_type'],
                    is_primary=True
                ).update(is_primary=False)

            Address.objects.create(
                user=user,
                content_type=company_content_type,
                object_id=company.id,
                **address_data
            )
        # Creating documents
        for document_data in documents_data:
            Document.objects.create(
                user=user,
                content_type=company_content_type,
                object_id=company.id,
                **document_data
            )
        
        # Creating notes
        for note_data in notes_data:
            Note.objects.create(
                user=user,
                content_type=company_content_type,
                object_id=company.id,
                **note_data
            )

        if profile_data:
            CompanyProfile.objects.create(
                user=user,
                company=company,
                **profile_data
            )

        company.auto_create_hq_branch()

        return company

class CompanyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating companies"""
    addresses = AddressSerializer(many=True, required=False)
    profile = CompanyProfileSerializer(required=False)
    
    class Meta:
        model = Company
        fields = [
            'registration_number', 'registration_name', 'trading_name',
            'legal_status', 'date_of_incorporation', 'industry',
            'is_verified', 'is_active', 'addresses', 'profile'
        ]
        
    
    @transaction.atomic
    def update(self, instance, validated_data):
        user = self.context.get('user')
        addresses_data = validated_data.pop('addresses', None)
        profile_data = validated_data.pop('profile', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if addresses_data is not None:
            company_content_type = ContentType.objects.get_for_model(Company)
            
            instance.addresses.all().delete()
            
            for address_data in addresses_data:
                Address.objects.create(
                    user=user,
                    content_type=company_content_type,
                    object_id=instance.id,
                    **address_data
                )
        
        if profile_data is not None:
            try:
                profile = CompanyProfile.objects.get(user=user, company=instance)

                for attr, value in profile_data.items():
                    setattr(profile, attr, value)
                profile.save()
                
            except CompanyProfile.DoesNotExist:
                CompanyProfile.objects.create(
                    user=user,
                    company=instance,
                    **profile_data
                )
        
        return instance

class CompanyBranchSearchSerializer(serializers.ModelSerializer):
    """Serializer for company branch search results"""
    company = CompanyMinimalSerializer(read_only=True)
    primary_address = serializers.SerializerMethodField()
    
    class Meta:
        model = CompanyBranch
        fields = ['id', 'branch_name', 'company', 'primary_address']
    
    def get_primary_address(self, obj):
        """Get the primary address for this branch"""
        primary_address = obj.addresses.filter(
            address_type='physical', 
            is_primary=True
        ).first()

        return AddressSerializer(primary_address).data if primary_address else None