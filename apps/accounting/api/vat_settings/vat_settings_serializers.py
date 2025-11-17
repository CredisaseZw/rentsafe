"""Serializers for VAT settings."""

from decimal import Decimal
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.accounting.models.models import VATSetting


class VATSettingSerializer(serializers.ModelSerializer):
    """Serializer for VATSetting model."""

    rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        error_messages={
            "required": "Rate: This field is required.",
            "invalid": "Rate: A valid decimal number is required.",
            "blank": "Rate: This field may not be blank.",
        },
    )
    description = serializers.CharField(
        error_messages={
            "required": "Description: This field is required.",
            "blank": "Description: This field may not be blank.",
        }
    )

    class Meta:
        model = VATSetting
        fields = ["id", "rate", "description", "vat_applicable"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.rate is None:
            representation["rate"] = "Exempt"
        return representation

    def validate_rate(self, value):
        if value is not None and (value < 0 or value > 100):
            raise ValidationError("VAT rate must be between 0 and 100.")
        return value

    def validate(self, data_list):
        """Validate bulk creation - filter out duplicates."""
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise ValidationError("Request context is required.")

        client = request.user.client
        existing_rates = VATSetting.objects.filter(
            created_by__client=client
        ).values_list("rate", flat=True)
        if data_list.get("rate") in existing_rates:
            raise ValidationError(
                f"VAT setting with rate {data_list.get('rate')} already exists for your company."
            )

        return data_list

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["updated_by"] = request.user
        return super().update(instance, validated_data)
