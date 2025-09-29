from datetime import date
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from apps.accounting.models.models import Currency
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual
from apps.legal.models import Claim

from apps.clients.models.models import Client

class ClaimSerializer(serializers.ModelSerializer):
    currency = serializers.ReadOnlyField(source="currency.currency_code")
    debtor = serializers.SerializerMethodField()
    client = serializers.ReadOnlyField(source="client.name")
    class Meta:
        model = Claim
        exclude = ['date_created', 'date_updated', 'debtor_content_type']
        read_only_fields = ['id', 'client']

    def get_debtor(self, obj):
        if obj.debtor_content_type:
            return str(obj.debtor_object)
        return None
      
class ClaimCreateSerializer(serializers.ModelSerializer):
    currency = serializers.ReadOnlyField(source="currency.currency_code", read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True 
    )
    
    class Meta:
        model = Claim
        exclude = ['date_created', 'date_updated',]
        read_only_fields = ['id', 'client']

    def get_debtor_object(self, obj):
        if obj.debtor_content_type:
            return str(obj.debtor_object)
        return None
    
    def validate(self, data):
        request = self.context.get('request')
        is_partial = self.context['request'] and self.context['request'].method == 'PATCH'

        data['client'] = self.context['request'].user.client
        data['created_by'] = self.context['request'].user

        if not data.get('data_source'):
            data['data_source'] = 'Manual Input'

        content_type_val = data.get('debtor_content_type')
        object_id = data.get('debtor_object_id')
        amount = data.get('amount')

        content_type_model = None
        ct_instance = None

        if content_type_val:
            if isinstance(content_type_val, ContentType):
                ct_instance = content_type_val
                content_type_model = ct_instance.model
            elif isinstance(content_type_val, str):
                content_type_model = content_type_val.lower()
            else:
                try:
                    ct_instance = ContentType.objects.filter(id=int(content_type_val)).first()
                    if ct_instance:
                        content_type_model = ct_instance.model
                except (TypeError, ValueError):
                    pass

            if not content_type_model:
                raise ValidationError("debtor type is required and must be valid")

            # Validate object existence based on model
            if content_type_model == 'individual':
                if object_id and not Individual.objects.filter(id=object_id).exists():
                    raise ValidationError("No Individual found with the provided id.")
                ct_instance = ContentType.objects.filter(app_label='individuals', model='individual').first()

            elif content_type_model == 'companybranch':
                if object_id and not CompanyBranch.objects.filter(id=object_id).exists():
                    raise ValidationError("No CompanyBranch found with the provided id.")
                ct_instance = ContentType.objects.filter(app_label='companies', model='companybranch').first()
            else:
                raise ValidationError("debtor type must be either 'individual' or 'companybranch'.")

            data['debtor_content_type'] = ct_instance

        # Only validate required fields if it's a full update or field is present
        required_fields = ['debtor_content_type', 'debtor_object_id', 'amount', 'currency', 'claim_date']
        for field in required_fields:
            if not is_partial or field in data:
                if not data.get(field):
                    raise ValidationError(f"{field.replace('_', ' ').title()} is required")

        if amount is not None:
            if amount <= 0:
                raise ValidationError("You cannot create a claim with zero or negative amount.")

        if object_id is not None:
            try:
                data['debtor_object_id'] = int(object_id)
            except (ValueError, TypeError):
                raise ValidationError("debtor_object_id must be a valid integer.")

        return data
  
    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        validated_data['updated_at'] = date.today()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ClaimMinimalSerializer(serializers.ModelSerializer):
    currency = serializers.ReadOnlyField(source="currency.currency_code")
    client = serializers.ReadOnlyField(source="client.name")
    
    class Meta:
        model = Claim
        fields = ['id','client', 'amount', 'currency', 'claim_date', 
                  'is_closed', 'closed_date', 'is_verified'
                ]

    def get_debtor(self, obj):
        if obj.debtor_content_type:
            return str(obj.debtor_object)
        return None
