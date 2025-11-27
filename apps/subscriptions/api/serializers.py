from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.contrib.contenttypes.models import ContentType

from apps.accounting.api.serializers.serializers import (
    CurrencySerializer,
    PaymentMethodSerializer,
)
from apps.accounting.models.models import Currency, PaymentMethod
from apps.clients.api.serializers import MinimalClientSerializer
from apps.clients.models.models import Client
from apps.subscriptions.models.models import Subscription, SubscriptionPeriod, Services


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ["id", "service_name", "code"]


class SubscriptionPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPeriod
        fields = ["id", "name", "code", "period_length_days", "period_length_months"]


class SubscriptionViewSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    payment_method = serializers.ReadOnlyField(
        source="payment_method.payment_method_name"
    )
    service = serializers.ReadOnlyField(source="service.service_name")
    period = serializers.ReadOnlyField(source="period.name")
    client = serializers.ReadOnlyField(source="client.name")

    class Meta:
        model = Subscription
        exclude = ["date_created", "date_updated"]


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    client = MinimalClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source="client", write_only=True
    )

    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )

    payment_method = PaymentMethodSerializer(read_only=True)
    payment_method_id = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.all(), source="payment_method", write_only=True
    )

    service = ServicesSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(), source="service", write_only=True
    )

    period = SubscriptionPeriodSerializer(read_only=True)
    period_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPeriod.objects.all(), source="period", write_only=True
    )

    class Meta:
        model = Subscription
        fields = [
            "client",
            "client_id",
            "service",
            "service_id",
            "period_id",
            "period",
            "total_slots",
            "currency_id",
            "currency",
            "payment_method_id",
            "payment_method",
            "total_amount",
            "monthly_amount",
        ]

    def validate(self, data):
        client = data.get("client")
        service = data.get("service")

        for field in ["client", "service", "payment_method", "total_slots", "period"]:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required")

        return data

    def create(self, validated_data):
        client = validated_data.pop("client")
        service = validated_data.pop("service")

        if existing_subscription := Subscription.objects.filter(
            client=client, service=service
        ).first():
            existing_subscription.total_slots += validated_data.get("total_slots", 0)
            for key, value in validated_data.items():
                if key != "total_slots":
                    setattr(existing_subscription, key, value)
            existing_subscription.save()
            return existing_subscription

        validated_data["client"] = client
        validated_data["service"] = service
        return Subscription.objects.create(**validated_data)


class ClientMinimalSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            "id",
            "service",
            "start_date",
            "end_date",
            "total_slots",
            "used_slots",
            "open_slots",
        ]

    def to_representation(self, instance):
        start_date = (
            instance.start_date.strftime("%d-%B-%Y") if instance.start_date else None
        )
        end_date = instance.end_date.strftime("%d-%B-%Y") if instance.end_date else None
        return {
            "id": instance.id,
            "period": instance.period.period_length_months,
            "start_date": start_date,
            "end_date": end_date,
            "sub_type": instance.get_service_name,
            "total_slots": instance.total_slots,
            "used_slots": instance.used_slots,
            "open_slots": instance.open_slots,
        }
