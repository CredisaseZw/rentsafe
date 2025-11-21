""" "Serializer for Cash Sale API endpoints."""

from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.accounting.api.serializers.serializers import (
    BaseCompanySerializer,
    CompanyCustomerSerializer,
    CurrencySerializer,
    CustomersSearchSerializer,
    IndividualCustomerSerializer,
    TransactionLineItemSerializer,
)
from apps.accounting.models.models import (
    CashBook,
    CashSale,
    Currency,
    Customer,
    PaymentMethod,
    TransactionLineItem,
)
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual


class CashSaleSerializer(BaseCompanySerializer):
    """Serializer for Cash Sale model."""

    items = TransactionLineItemSerializer(many=True, required=False)
    line_items = TransactionLineItemSerializer(many=True, read_only=True)
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    cashbook_id = serializers.PrimaryKeyRelatedField(
        queryset=CashBook.objects.all(), source="cashbook", write_only=True
    )
    payment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.all(), source="payment_type", write_only=True
    )
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True, required=False)
    is_individual = serializers.BooleanField(write_only=True)
    vat_total = serializers.SerializerMethodField()
    total_excluding_vat = serializers.SerializerMethodField()
    created_by = serializers.ReadOnlyField(source="created_by.first_name")
    change = serializers.SerializerMethodField()

    # Further implementation of the customer information to be implemented later

    class Meta(BaseCompanySerializer.Meta):
        model = CashSale
        fields = [
            "id",
            "document_number",
            "is_individual",
            "customer_details",
            "customer_id",
            "sale_date",
            "currency",
            "currency_id",
            "items",
            "line_items",
            "discount",
            "vat_total",
            "total_excluding_vat",
            "invoice_total",
            "payment_type",
            "payment_type_id",
            "cashbook",
            "cashbook_id",
            "details",
            "reference",
            "amount_received",
            "change",
            "created_by",
        ]
        read_only_fields = ["sale_date", "total_amount"]

    def to_representation(self, instance):
        date = instance.sale_date.strftime("%B %d, %Y")
        representation = super().to_representation(instance)
        representation["sale_date"] = date
        return representation

    def get_customer_details(self, obj: CashSale):
        """Retrieve customer details based on whether it's an individual or company."""
        if obj.customer:
            if obj.customer.is_individual:
                serializer = CustomersSearchSerializer(obj.customer.individual)
            else:
                serializer = CustomersSearchSerializer(obj.customer.company)
            return serializer.data
        return None

    def get_vat_total(self, obj: CashSale) -> str:
        """Calculate the total VAT for the cash sale."""
        vat_total = Decimal("0.00")
        currency_code = obj.currency.currency_code if obj.currency else ""
        for item in obj.line_items.all():
            vat_total += item.vat_amount
        return f"{vat_total.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}".strip()

    def get_total_excluding_vat(self, obj: CashSale) -> str:
        """Calculate the total amount excluding VAT for the cash sale."""
        total_excl_vat = Decimal("0.00")
        currency_code = obj.currency.currency_code if obj.currency else ""
        for item in obj.line_items.all():
            total_excl_vat += item.total_price - item.vat_amount
        return f"{total_excl_vat.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}".strip()

    def get_change(self, obj: CashSale) -> str:
        """Calculate the change to be given back to the customer."""
        currency_code = obj.currency.currency_code if obj.currency else ""
        if obj.amount_received and obj.invoice_total:
            change_amount = obj.amount_received - obj.invoice_total
            return f"{change_amount.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)} {currency_code}".strip()
        return f"0.00 {currency_code}".strip()

    def validate(self, attrs):

        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise ValidationError("Request context is required.")
        total_amount = Decimal("0")
        items_data = attrs.get("items", [])
        user_company = request.user.client
        currency = attrs.get("currency")
        discount = attrs.get("discount", Decimal("0"))
        customer_id = attrs.get("customer_id")
        is_individual = attrs.get("is_individual")
        cash_book = attrs.get("cashbook")

        if isinstance(self.instance, CashSale):
            currency = (
                self.instance.currency
                if not attrs.get("currency")
                else attrs.get("currency")
            )
        else:
            currency = attrs.get("currency")

        if cash_book.currency != currency:
            raise ValidationError(
                {"cashbook": "Cash book currency must match cash sale currency."}
            )
        if not customer_id:
            raise ValidationError({"customer_id": "Customer ID is required."})
        if is_individual is None:
            raise ValidationError(
                {"is_individual": "Specify if customer is an individual or company."}
            )
        try:
            if is_individual:
                customer = Individual.objects.get(id=customer_id)
                attrs["customer"] = customer
                attrs["is_individual"] = True
            else:
                customer = CompanyBranch.objects.get(id=customer_id)
                attrs["customer"] = customer
                attrs["is_individual"] = False
        except (Individual.DoesNotExist, CompanyBranch.DoesNotExist) as e:
            raise ValidationError({"customer_id": "Customer not found."}) from e

        customer_filter = {
            "individual" if is_individual else "company": customer,
            "is_individual": is_individual,
        }
        existing_qs = CashSale.objects.filter(
            created_by__client=user_company,
            customer__in=Customer.objects.filter(**customer_filter),
            line_items__sales_item__in=[item.get("sales_item") for item in items_data],
            sale_date=attrs.get("sale_date", date.today()),
        )
        if self.instance:
            existing_qs = existing_qs.exclude(id=self.instance.id)
        if existing_qs.exists():
            raise ValidationError(
                "A cash sale with the same customer, items, and sale date already exists."
            )
        if items_data:
            total_amount = Decimal("0")
            for item_data in items_data:
                sales_item = item_data.get("sales_item")
                if not sales_item:
                    raise ValidationError("Please select at least one item")
                if sales_item.created_by.client != user_company:
                    raise ValidationError(
                        {
                            "items": f"Sales item '{sales_item.name}' does not exist in your company."
                        }
                    )
                item_price = sales_item.price
                if currency != sales_item.unit_price_currency:
                    if not item_data["unit_price"]:
                        raise ValidationError(
                            {
                                "items": "Unit price is required for items with different currency."
                            }
                        )
                item_data["unit_price"] = sales_item.price

                if item_data.get("quantity") is None:
                    raise ValidationError(
                        {"items": "Quantity is required for all line items."}
                    )
                vat_amount = (
                    sales_item.tax_configuration.rate / Decimal("100.00") * item_price
                )
                line_total = (item_price + vat_amount) * item_data["quantity"]
                total_amount += line_total

        if items_data:
            attrs["invoice_total"] = total_amount - (discount or Decimal("0"))

        if discount and discount > total_amount:
            raise ValidationError(
                {"discount": "Discount cannot be greater than total amount."}
            )
        if not attrs.get("amount_received"):
            attrs["amount_received"] = attrs["invoice_total"]
        attrs.pop("customer_id", None)
        return attrs

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop("items", [])

        if "customer" in validated_data:
            is_individual = validated_data.pop("is_individual", False)
            customer_obj = validated_data.pop("customer")
            validated_data["customer"], _ = Customer.objects.get_or_create(
                is_individual=is_individual,
                individual=(customer_obj if is_individual else None),
                company=(customer_obj if not is_individual else None),
            )
        validated_data["created_by"] = self.context["request"].user
        cash_sale = CashSale.objects.create(**validated_data)
        for item_data in items_data:
            sales_item = item_data["sales_item"]
            TransactionLineItem.objects.create(
                parent_document=cash_sale,
                sales_item=sales_item,
                unit_price=item_data.get("unit_price", sales_item.price),
                quantity=item_data["quantity"],
            )
        return cash_sale

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
        validated_data["updated_by"] = self.context["request"].user
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
