from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.contrib.contenttypes.models import ContentType

from apps.accounting.api.serializers.serializers import CurrencySerializer, PaymentMethodSerializer
from apps.accounting.models.models import Currency, PaymentMethod
from apps.clients.api.serializers import MinimalClientSerializer
from apps.clients.models.models import Client
from apps.subscriptions.models.models import Subscription, SubscriptionPeriod, Services


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields =['id', 'service_name', 'code']

class SubscriptionPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPeriod
        fields =['id', 'name', 'code', 'period_length_days', 'period_length_months']

class SubscriptionViewSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    service = ServicesSerializer(read_only=True)
    period = SubscriptionPeriodSerializer(read_only=True)
    client = MinimalClientSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id','client','service', 'start_date', 'end_date', 'subscription_class',
                  'period', 'total_slots', 'used_slots', 'currency',
                  'payment_method', 'total_amount', 'monthly_amount', 'is_activated'
                ]
        
class SubscriptionCreateSerializer(serializers.ModelSerializer):
    client = MinimalClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source='client',
        write_only=True
    )

    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )

    payment_method = PaymentMethodSerializer(read_only=True)
    payment_method_id = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.all(),
        source='payment_method',
        write_only=True
    )

    service = ServicesSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(),
        source='service',
        write_only=True
    )

    period = SubscriptionPeriodSerializer(read_only=True)
    period_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPeriod.objects.all(),
        source='period',
        write_only=True
    )

    class Meta:
        model = Subscription
        fields = [
            'client', 'client_id',
            'service', 'service_id',
            'subscription_class',
            'period_id', 'period',
            'total_slots',
            'currency_id', 'currency',
            'payment_method_id', 'payment_method',
            'total_amount', 'monthly_amount'
        ]

    def validate(self, data):
        for field in ['client', 'service', 'payment_method', 'total_slots', 'period']:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required")

            for model in [Client, Services, PaymentMethod, SubscriptionPeriod]:
                model_id = data.get(f"{model.__name__.lower()}_id")
                if not model.objects.filter(pk=model_id).exists():
                    raise ValidationError({f"{model.__name__.lower()}_id": f"{model.__name__} does not exist."})
            
        return data

    def create(self, validated_data):
        return super().create(validated_data)

