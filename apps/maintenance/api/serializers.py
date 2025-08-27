from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.common.models.models import Address
from apps.common.api.serializers import AddressSerializer
from apps.common.utils.validators import validate_email, normalize_zimbabwe_mobile

from django.db import transaction
from django.contrib.contenttypes.models import ContentType

import logging
logger = logging.getLogger(__name__)

from apps.maintenance.models.models import(
    MaintenanceSchedule, 
    WorkSchedule , 
    MaintenanceRequest, 
    Industry,
    Contractor
)
from apps.common.api.serializers import AddressSerializer

class ContractorMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = ['id','name', 'phone','email','industry']

class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    contractor = ContractorMinimalSerializer(read_only=True)
    contractor_id = serializers.PrimaryKeyRelatedField(
        source = 'contractor', 
        queryset=Contractor.objects.all(), 
        write_only=True
    )
    class Meta:
        model = MaintenanceSchedule
        fields = ['id','maintenance_number', 'lease', 'title', 'details', 'tradesman', 
                  'contractor', 'contractor_id','required_materials', 'budget', 
                  'responsible_person', 'reason', 'frequency', 
                  'scheduled_day', 'month_frequency', 'tenant_landlord_contact', 'origin']
        
        def validate(self, data):
            ...
        
        @transaction.atomic
        def create(self, validated_data):
            ms = MaintenanceSchedule.objects.create(**validated_data)
            if contractor_data := validated_data.pop('contractor_id', None):
                ms.contractor = contractor_data
            
            return ms
        
        @transaction.atomic
        def update(self, instance, validated_data):
            ...

            

class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = ['id', 'lease', 'tittle', 'details', 'tradesman', 
                  'contractor', 'required_materials', 'budget', 
                  'responsible_person', 'reason', 'scheduled_date', 
                  'tenant_landlord_contact', 'origin']

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    photos = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = MaintenanceRequest
        fields = ['id', 'lease', 'requested_by', 'assigned_to', 'tittle', 
                  'description', 'priority', 'status', 'requested_date', 
                  'completed_date', 'photos']

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id','name', 'description']


class ContractorSerializer(serializers.ModelSerializer):
    address = AddressSerializer(many=True, required=False)

    industry = IndustrySerializer(required=False)
    industry_id  = serializers.PrimaryKeyRelatedField(
        queryset=Industry.objects.all(), 
        write_only=True, 
        allow_null=True, 
        required=False
    )

    class Meta:
        model =  Contractor
        fields = ['id','reg_number','name', 'phone', 'email', 'industry', 
        'industry_id', 'contact_person', 'contact_phone', 'contact_email', 
        'charge_currency', 'standard_rate', 'emergency_rate', 
        'license_number', 'address', 'is_active']

    def validate(self,data):
        if email:= data.get("email"):
            if validate_email(email):
                data["email"] = email.strip()
            else:
                raise ValidationError("Invalid email address provide")
            
        if phone := data.get("phone"):
            if normalize_zimbabwe_mobile(phone):
                data["phone"] = phone
            else:
                raise ValidationError("Invalid phone number")
            
        if c_phone := data.get("contact_phone"):
            if normalize_zimbabwe_mobile(c_phone):
                data["contact_phone"] = c_phone
            else:
                raise ValidationError("Invalid contact phone number")

        return data
    
    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        industry_id = validated_data.pop('industry_id')
        
        contractor = Contractor.objects.create(**validated_data)
        if industry_id is not None:
            contractor.industry = industry_id
        for addr in address_data:
            Address.objects.create(
                content_type=ContentType.objects.get_for_model(Contractor),
                object_id=contractor.pk,
                **addr
            )

        return contractor