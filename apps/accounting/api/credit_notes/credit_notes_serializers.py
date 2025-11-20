"""Serializer for Credit Note model"""

from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from apps.accounting.api.serializers.serializers import BaseCompanySerializer
from apps.accounting.api.serializers.serializers import (
    TransactionLineItemSerializer,
)
from apps.accounting.api.serializers.serializers import CurrencySerializer
from apps.accounting.api.serializers.serializers import (
    IndividualCustomerSerializer,
    CompanyCustomerSerializer,
)
from apps.accounting.models.models import (
    CreditNote,
    Currency,
    Customer,
    TransactionLineItem,
)
from apps.accounting.utils.helpers import generate_credit_note_document_number
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual


class CreditNoteSerializer(BaseCompanySerializer):
    """Serializer for Credit Note model"""

    items = TransactionLineItemSerializer(many=True, required=False)
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True, required=True)
    is_individual = serializers.BooleanField(write_only=True, required=True)
    total_vat = serializers.SerializerMethodField()
    total_excluding_vat = serializers.SerializerMethodField()
    credit_note_total = serializers.SerializerMethodField()
    line_items = TransactionLineItemSerializer(many=True, read_only=True)

    class Meta(BaseCompanySerializer.Meta):
        """Class Meta for Credit Note Serializer"""

        model = CreditNote
        fields = [
            "id",
            "document_number",
            "credit_date",
            "total_amount",
            "description",
            "discount",
            "currency",
            "currency_id",
            "items",
            "line_items",
            "customer_details",
            "customer_id",
            "is_individual",
            "total_vat",
            "total_excluding_vat",
            "credit_note_total",
        ]
        read_only_fields = ["document_number"]

    def to_representation(self, instance):
        date = (
            instance.credit_date.strftime("%B %d, %Y") if instance.credit_date else None
        )
        representation = super().to_representation(instance)
        representation["credit_date"] = date
        return representation

    def get_customer_details(self, obj):
        """Retrieve customer details based on whether it's an individual or company."""
        if hasattr(obj, "customer") and obj.customer.is_individual:
            return IndividualCustomerSerializer(obj.customer.individual).data
        if hasattr(obj, "customer"):
            return CompanyCustomerSerializer(obj.customer.company).data
        return None

    def get_total_vat(self, obj):
        """Calculate total VAT for the credit note."""
        total_vat = Decimal("0")
        currency_code = obj.currency.currency_code if obj.currency else None
        for item in obj.line_items.all():
            total_vat += item.total_vat
        return f"{total_vat.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}"

    def get_credit_note_total(self, obj):
        """Calculate total amount including VAT for the credit note."""
        total_incl_vat = Decimal("0")
        currency_code = obj.currency.currency_code if obj.currency else None
        for item in obj.line_items.all():
            total_incl_vat += item.total_price
        total_incl_vat -= obj.discount or Decimal("0")
        return f"{total_incl_vat.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}"

    def get_total_excluding_vat(self, obj):
        """Calculate total amount excluding VAT for the credit note."""
        total_excl_vat = Decimal("0")
        currency_code = obj.currency.currency_code if obj.currency else None
        for item in obj.line_items.all():
            total_excl_vat += item.total_price_excluding_vat
        return f"{total_excl_vat.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}"

    def validate(self, data):
        from apps.accounting.models.models import CurrencyRate

        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise ValidationError("Request context is required.")
        user_company = request.user.client
        customer_id = data.get("customer_id")
        is_individual = data.get("is_individual")
        credit_date = data.get("credit_date")
        discount = data.get("discount")
        items_data = data.get("items", []) or None
        today = date.today()
        if isinstance(self.instance, CreditNote):
            currency = (
                self.instance.currency
                if not data.get("currency")
                else data.get("currency")
            )
        else:
            currency = data.get("currency")
        if not customer_id:
            raise serializers.ValidationError(
                {"customer_id": "Customer ID is required."}
            )

        if is_individual:
            existing_qs = CreditNote.objects.filter(
                created_by__client=user_company,
                credit_date=credit_date,
                customer__individual__id=customer_id,
                currency=data.get("currency"),
                description=data.get("description"),
            )
        else:
            existing_qs = CreditNote.objects.filter(
                created_by__client=user_company,
                credit_date=credit_date,
                customer__company__id=customer_id,
                currency=data.get("currency"),
                description=data.get("description"),
            )
        if self.instance:
            existing_qs = existing_qs.exclude(pk=self.instance.pk)
        if existing_qs.exists():
            raise serializers.ValidationError(
                "A credit note for this customer already exists."
            )

        if credit_date:
            if credit_date > today:
                raise serializers.ValidationError(
                    {"credit_date": "Credit date cannot be in the future."}
                )

            if today.month == 1:
                prev_month = 12
                prev_month_year = today.year - 1
            else:
                prev_month = today.month - 1
                prev_month_year = today.year

            if credit_date.month == prev_month and credit_date.year == prev_month_year:
                raise serializers.ValidationError(
                    {"credit_date": "Credit date cannot be from the previous month."}
                )
        if is_individual is None:
            raise serializers.ValidationError(
                {"is_individual": "Specify if customer is an individual or company."}
            )
        try:
            if is_individual:
                customer = Individual.objects.get(id=customer_id)
                data["customer"] = customer
                data["is_individual"] = True
            else:
                customer = CompanyBranch.objects.get(id=customer_id)
                data["customer"] = customer
                data["is_individual"] = False
        except (Individual.DoesNotExist, CompanyBranch.DoesNotExist) as e:
            raise serializers.ValidationError(
                {"customer_id": "Customer not found."}
            ) from e
        # Validate items for credit note
        latest_rate = (
            CurrencyRate.objects.filter(
                created_by__client=user_company,
            )
            .order_by("-id")
            .first()
        )
        rate = latest_rate.current_rate

        if items_data:
            total_amount = Decimal("0")
            for item_data in items_data:
                sales_item = item_data.get("sales_item")
                if not sales_item:
                    raise serializers.ValidationError("Please select at least one item")

                item_price = sales_item.price_including_vat
                if sales_item.unit_price_currency != currency:
                    if provided_rate := item_data.get("conversion_rate"):
                        if currency == latest_rate.base_currency:
                            item_price = Decimal(sales_item.price) / Decimal(
                                provided_rate
                            )
                        else:
                            item_price = Decimal(sales_item.price) * Decimal(
                                provided_rate
                            )
                    elif not provided_rate:
                        if currency == latest_rate.base_currency:
                            item_price = Decimal(sales_item.price) / Decimal(rate)
                        else:
                            item_price = Decimal(sales_item.price) * Decimal(rate)
                    else:
                        raise serializers.ValidationError(
                            {
                                "items": "Sales item currency does not match credit note currency."
                            }
                        )
                    item_data["unit_price"] = item_price
                else:
                    item_data["unit_price"] = sales_item.price

                if (
                    hasattr(sales_item, "user")
                    and sales_item.user
                    and sales_item.created_by.client != user_company
                ):
                    raise serializers.ValidationError(
                        {
                            "items": "One or more sales items do not belong to your company."
                        }
                    )

                if item_data.get("quantity") is None:
                    raise serializers.ValidationError(
                        {"items": "Quantity is required for all line items."}
                    )
                vat_amount = (
                    sales_item.tax_configuration.rate / Decimal("100.00") * item_price
                )
                line_total = (item_price + vat_amount) * item_data["quantity"]
                total_amount += line_total

        if items_data:
            data["total_amount"] = total_amount - (discount or Decimal("0"))
        data.pop("customer_id", None)
        return data

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop("items", [])
        document_number = validated_data.get("document_number", "")
        client = self.context["request"].user.client
        if not document_number:
            validated_data["document_number"] = generate_credit_note_document_number(
                client
            )
        validated_data["created_by"] = self.context["request"].user
        if "customer" in validated_data:
            is_individual = validated_data.pop("is_individual", False)
            customer_obj = validated_data.pop("customer")
            validated_data["customer"], _ = Customer.objects.get_or_create(
                is_individual=is_individual,
                individual=(customer_obj if is_individual else None),
                company=(customer_obj if not is_individual else None),
            )

        credit_note = CreditNote.objects.create(**validated_data)
        for item_data in items_data:
            sales_item = item_data["sales_item"]
            TransactionLineItem.objects.create(
                parent_document=credit_note,
                sales_item=sales_item,
                unit_price=item_data.get("unit_price", sales_item.price),
                quantity=item_data["quantity"],
            )
        return credit_note

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])

        if "customer_id" in validated_data:
            is_individual = validated_data.pop("is_individual", False)
            customer_obj = validated_data.pop("customer_id")
            validated_data["customer"], _ = Customer.objects.get_or_create(
                is_individual=is_individual,
                individual=(customer_obj if is_individual else None),
                company=(customer_obj if not is_individual else None),
            )
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.line_items.all().delete()  # Clear existing and recreate
        if items_data:
            for item_data in items_data:
                TransactionLineItem.objects.create(
                    parent_document=instance,
                    sales_item=item_data["sales_item"],
                    quantity=item_data["quantity"],
                )

        instance.save()
        return instance
