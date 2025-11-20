from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from django.db import transaction
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.accounting.api.vat_settings.vat_settings_serializers import (
    VATSettingSerializer,
)
from apps.accounting.models.models import (
    SalesCategory,
    SalesItem,
    CashSale,
    Invoice,
    Currency,
    CurrencyRate,
    VATSetting,
    CashBook,
    CashbookEntry,
    TransactionLineItem,
    TransactionType,
    AccountSector,
    LedgerTransaction,
    GeneralLedgerAccount,
    JournalEntry,
    PaymentMethod,
    Payment,
    Customer,
)
from apps.accounting.models.disbursements import Disbursement
from apps.accounting.models.pricing import ServiceSpecialPricing, ServiceStandardPricing
from apps.clients.models.models import Client
from apps.common.api.serializers import AddressSerializer
from apps.companies.models import CompanyProfile, Company
from apps.companies.models.models import CompanyBranch
from apps.individuals.models import Individual
from apps.individuals.models.models import IndividualAccounts
from apps.subscriptions.models.models import Services


class DisbursementSerializer(serializers.ModelSerializer):
    landlord_name = serializers.CharField(
        source="landlord.landlord_name", read_only=True
    )
    payment_method_name = serializers.CharField(
        source="payment_method.payment_method_name", read_only=True
    )
    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )

    class Meta:
        model = Disbursement
        fields = [
            "id",
            "landlord",
            "landlord_name",
            "amount",
            "currency",
            "currency_code",
            "payment_method",
            "payment_method_name",
            "reference",
            "status",
            "payment_date",
            "date_created",
            "date_updated",
        ]
        read_only_fields = ["date_created", "date_updated"]


class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        read_only_fields = ["created_by", "date_created", "date_updated"]

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


class SalesCategorySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesCategory
        fields = ["id", "name", "code"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        if SalesCategory.objects.filter(code__iexact=attrs.get("code")).exists():
            raise ValidationError("Sales category with this code already exists.")

        return attrs


class GeneralLedgerAccountSerializer(serializers.ModelSerializer):
    account_sector = serializers.SerializerMethodField(read_only=True)

    account_sector_id = serializers.PrimaryKeyRelatedField(
        queryset=AccountSector.objects.all(), source="account_sector", write_only=True
    )

    class Meta(BaseCompanySerializer.Meta):
        model = GeneralLedgerAccount
        fields = [
            "id",
            "account_name",
            "account_number",
            "account_sector",
            "account_sector_id",
            "is_secondary_currency",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["preset"] = True if instance.created_by is None else False
        return representation

    def get_account_sector(self, obj):
        if obj.account_sector:
            return {
                "id": obj.account_sector.id,
                "code": obj.account_sector.code,
                "name": obj.account_sector.name,
            }
        return None


class CurrencySerializer(BaseCompanySerializer):
    class Meta:
        model = Currency
        fields = ["id", "currency_code", "currency_name", "symbol"]


class SalesItemSerializer(BaseCompanySerializer):
    category_object = SalesCategorySerializer(source="category", read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=SalesCategory.objects.all(), write_only=True
    )

    tax_configuration_object = VATSettingSerializer(
        source="tax_configuration", read_only=True
    )
    unit_price_currency = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        write_only=True,
        allow_null=True,
        required=False,
    )
    tax_configuration = serializers.PrimaryKeyRelatedField(
        queryset=VATSetting.objects.all(), write_only=True
    )
    currency_object = CurrencySerializer(source="unit_price_currency", read_only=True)
    sales_account_object = GeneralLedgerAccountSerializer(
        source="sales_account", read_only=True
    )
    sales_account = serializers.PrimaryKeyRelatedField(
        queryset=GeneralLedgerAccount.objects.all(), write_only=True
    )
    item_id = serializers.CharField(required=False, allow_blank=True)

    class Meta(BaseCompanySerializer.Meta):
        model = SalesItem
        fields = [
            "id",
            "item_id",
            "name",
            "price",
            "unit_name",
            "category",
            "category_object",
            "unit_price_currency",
            "currency_object",
            "tax_configuration",
            "tax_configuration_object",
            "sales_account",
            "sales_account_object",
            "date_created",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        user_company = request.user.client

        instance = self.instance
        existing_item = SalesItem.objects.filter(
            name__iexact=attrs.get("name"),
            created_by__client=user_company,
            tax_configuration=attrs.get("tax_configuration"),
            sales_account=attrs.get("sales_account"),
            price=attrs.get("price"),
        ).exclude(id=instance.id if instance else None)

        if existing_item.exists():
            raise ValidationError(
                "this Sales item with the same name, tax configuration, sales account, and price already exists."
            )

        return attrs

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        currency = instance.unit_price_currency
        symbol = currency.symbol if currency else ""
        representation["price"] = f"{symbol}{representation['price']}"
        return representation


class CashbookEntrySerializer(BaseCompanySerializer):
    transaction_type_details = serializers.SerializerMethodField()
    transaction_type = serializers.PrimaryKeyRelatedField(
        queryset=TransactionType.objects.all(),
        write_only=True,
        allow_null=True,
        required=False,
    )

    class Meta(BaseCompanySerializer.Meta):
        model = CashbookEntry
        fields = [
            "id",
            "transaction_date",
            "transaction_type",
            "transaction_type_details",
            "amount",
            "description",
        ]

    def get_transaction_type_details(self, obj):
        return (
            {
                "id": obj.transaction_type.id,
                "transaction_type": obj.transaction_type.transaction_type,
            }
            if obj.transaction_type
            else None
        )


class AccountSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountSector
        fields = ["id", "code", "name"]


class IndividualCustomerSerializer(serializers.ModelSerializer):
    vat_number = serializers.SerializerMethodField()
    tin_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    primary_address = serializers.SerializerMethodField()

    class Meta:
        model = Individual
        fields = [
            "id",
            "full_name",
            "identification_number",
            "email",
            "phone",
            "vat_number",
            "tin_number",
            "primary_address",
        ]
        read_only_fields = ["id", "phone"]

    def get_full_name(self, obj):
        return (
            f"{obj.first_name} {obj.last_name}"
            if obj.first_name and obj.last_name
            else "N/A"
        )

    def get_vat_number(self, obj):
        account_details = IndividualAccounts.objects.filter(individual=obj).first()
        return account_details.vat_number if account_details else "N/A"

    def get_tin_number(self, obj):
        account_details = IndividualAccounts.objects.filter(individual=obj).first()
        return account_details.tin_number if account_details else "N/A"

    def get_primary_address(self, obj):
        if current_address := obj.addresses.filter(is_primary=True):
            current_address = current_address.first()
        else:
            current_address = obj.addresses.last()
        address_data = (
            AddressSerializer(current_address).data if current_address else None
        )
        return address_data


class CompanyCustomerSerializer(serializers.ModelSerializer):
    # This serializer doesn't inherit from BaseCompanySerializer directly
    email = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    identification_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    vat_number = serializers.SerializerMethodField()
    mobile = serializers.SerializerMethodField()
    tin_number = serializers.SerializerMethodField()

    class Meta:
        model = CompanyBranch
        fields = [
            "id",
            "full_name",
            "identification_number",
            "vat_number",
            "tin_number",
            "email",
            "mobile",
            "address",
        ]
        read_only_fields = ["id"]

    def get_full_name(self, obj):
        return obj.branch_name

    def get_email(self, obj):
        return obj.email or "N/A"

    def get_address(self, obj):
        current_address = obj.addresses.filter(is_primary=True).exists()
        if not current_address:
            current_address = obj.addresses.last()
        else:
            current_address = obj.addresses.order_by("-id").first()
        address_data = (
            AddressSerializer(current_address).data if current_address else None
        )
        return address_data

    def get_identification_number(self, obj):
        return obj.company.registration_number or "N/A"

    def get_vat_number(self, obj):
        new_ob = CompanyProfile.objects.filter(company=obj.company).first()
        return new_ob.vat_number if new_ob else "N/A"

    def get_mobile(self, obj):
        return obj.phone or "N/A"

    def get_tin_number(self, obj):
        new_obj = CompanyProfile.objects.filter(company=obj.company).first()
        return new_obj.tin_number if new_obj else "N/A"


class JournalEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = JournalEntry


class LedgerTransactionSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = LedgerTransaction


class TransactionLineItemSerializer(serializers.ModelSerializer):
    sales_item = SalesItemSerializer(read_only=True)
    sales_item_id = serializers.PrimaryKeyRelatedField(
        queryset=SalesItem.objects.all(), source="sales_item", write_only=True
    )
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    vat_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_price = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = TransactionLineItem
        fields = [
            "sales_item",
            "sales_item_id",
            "quantity",
            "unit_price",
            "vat_amount",
            "total_price",
            "date_created",
            "date_updated",
        ]
        read_only_fields = [
            "unit_price",
            "vat_amount",
            "total_price",
            "date_created",
            "date_updated",
        ]


class RecurringToFiscalSerializer(serializers.Serializer):
    """Serializer for converting recurring invoices to fiscal"""

    items = TransactionLineItemSerializer(many=True, required=False)
    reference_number = serializers.CharField(required=False, allow_blank=True)
    sale_date = serializers.DateField(required=False)

    def validate(self, data):
        # Validate that all required fields are present if items are provided
        if "items" in data and data["items"]:
            for item in data["items"]:
                if "sales_item" not in item:
                    raise serializers.ValidationError(
                        {"items": "Sales item is required for all line items."}
                    )
                if "quantity" not in item:
                    raise serializers.ValidationError(
                        {"items": "Quantity is required for all line items."}
                    )
        return data


class InvoiceDetailSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    invoice_type = serializers.ChoiceField(choices=Invoice.INVOICE_TYPE_CHOICES)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    items = TransactionLineItemSerializer(many=True, required=False)
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)
    line_items = TransactionLineItemSerializer(many=True, read_only=True)
    total_excluding_vat = serializers.ReadOnlyField()
    vat_total = serializers.ReadOnlyField()
    total_inclusive = serializers.ReadOnlyField()
    can_convert_to_fiscal = serializers.SerializerMethodField()

    class Meta(BaseCompanySerializer.Meta):
        model = Invoice
        fields = [
            "id",
            "document_number",
            "invoice_type",
            "currency",
            "currency_id",
            "items",
            "discount",
            "date_created",
            "status",
            "total_excluding_vat",
            "vat_total",
            "total_inclusive",
            "customer_details",
            "customer_id",
            "is_individual",
            "line_items",
            "lease",
            "reference_number",
            "is_recurring",
            "frequency",
            "next_invoice_date",
            "original_invoice",
            "is_invoiced",
            "can_convert_to_fiscal",
        ]

        read_only_fields = [
            "document_number",
            "user",
            "date_created",
            "status",
            "can_convert_to_fiscal",
            "original_invoice",
        ]
        extra_kwargs = {
            "lease": {"required": False, "allow_null": True},
            "original_invoice": {"required": False, "allow_null": True},
            "frequency": {"required": False, "allow_null": True},
            "next_invoice_date": {"required": False, "allow_null": True},
        }

    def get_customer_details(self, obj):
        from apps.accounting.api.serializers.serializers import (
            CustomersSearchSerializer,
        )

        customer = getattr(obj, "customer", None)
        if customer and customer.is_individual:
            return CustomersSearchSerializer(customer.individual).data
        elif customer:
            return CustomersSearchSerializer(customer.company).data
        return None

    def get_can_convert_to_fiscal(self, obj):
        """Check if this invoice can be converted to fiscal"""
        return obj.can_generate_fiscal()


class InvoiceSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    invoice_type = serializers.ChoiceField(choices=Invoice.INVOICE_TYPE_CHOICES)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    items = TransactionLineItemSerializer(many=True, required=False)
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)

    total_excluding_vat = serializers.ReadOnlyField()
    vat_total = serializers.ReadOnlyField()
    total_inclusive = serializers.ReadOnlyField()
    can_convert_to_fiscal = serializers.SerializerMethodField()

    class Meta(BaseCompanySerializer.Meta):
        model = Invoice
        fields = [
            "id",
            "document_number",
            "invoice_type",
            "currency",
            "currency_id",
            "items",
            "discount",
            "date_created",
            "status",
            "total_excluding_vat",
            "vat_total",
            "total_inclusive",
            "customer_details",
            "customer_id",
            "is_individual",
            "lease",
            "reference_number",
            "is_recurring",
            "frequency",
            "next_invoice_date",
            "original_invoice",
            "is_invoiced",
            "can_convert_to_fiscal",
        ]

        read_only_fields = [
            "document_number",
            "user",
            "date_created",
            "status",
            "can_convert_to_fiscal",
            "original_invoice",
        ]
        extra_kwargs = {
            "lease": {"required": False, "allow_null": True},
            "original_invoice": {"required": False, "allow_null": True},
            "frequency": {"required": False, "allow_null": True},
            "next_invoice_date": {"required": False, "allow_null": True},
        }

    def validate(self, data):
        request_user = self.context["request"].user
        user_company = request_user.client

        customer_id = data.get("customer_id")
        is_individual = data.get("is_individual")
        invoice_type = data.get("invoice_type")

        if not customer_id:
            raise serializers.ValidationError(
                {"customer_id": "Customer ID is required."}
            )

        if is_individual is None:
            raise serializers.ValidationError(
                {"is_individual": "Specify if customer is an individual or company."}
            )

        customer_instance = None
        try:
            if is_individual:
                customer_instance = Individual.objects.get(id=customer_id)
                data["customer"] = customer_instance
                data["is_individual"] = True
            else:
                customer_instance = CompanyBranch.objects.get(id=customer_id)
                data["customer"] = customer_instance
        except (Individual.DoesNotExist, CompanyBranch.DoesNotExist) as e:
            raise serializers.ValidationError(
                {"customer_id": "Customer not found."}
            ) from e

        # --- Validation for duplicate invoice type for the same customer ---
        if invoice_type and customer_instance:
            qs = Invoice.objects.filter(
                invoice_type=invoice_type, created_by__client=user_company
            )
            if is_individual:
                qs = qs.filter(customer__individual=customer_instance)
            else:
                qs = qs.filter(customer__company=customer_instance)

            # If updating an instance, exclude the current instance from the check
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    f"An invoice of type '{invoice_type}' already exists for this customer."
                )

        items_data = data.get("items", [])
        for item_data in items_data:
            sales_item = item_data.get("sales_item")
            if not sales_item:
                raise serializers.ValidationError(
                    {"items": "Invalid sales item provided in line items."}
                )

            if (
                hasattr(sales_item, "user")
                and sales_item.user
                and sales_item.created_by.client != user_company
            ):
                raise serializers.ValidationError(
                    {"items": "One or more sales items do not belong to your company."}
                )

            vat_setting = sales_item.tax_configuration
            vat_rate = (
                vat_setting.rate / Decimal("100")
                if vat_setting and vat_setting.vat_applicable
                else Decimal("0")
            )

            quantity = item_data.get("quantity")
            unit_price = sales_item.price

            if quantity is None:
                raise serializers.ValidationError(
                    {"items": "Quantity is required for all line items."}
                )

            # Store these calculated values temporarily in item_data
            item_data["unit_price"] = unit_price
            item_data["vat_amount"] = (quantity * unit_price * vat_rate).quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
            item_data["total_price"] = (
                quantity * unit_price + item_data["vat_amount"]
            ).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

        data.pop("customer_id", None)

        return data

    def get_customer_details(self, obj):
        from apps.accounting.api.serializers.serializers import (
            CustomersSearchSerializer,
        )

        if hasattr(obj, "customer"):
            if obj.customer.is_individual:
                return CustomersSearchSerializer(obj.customer.individual).data
            else:
                return CustomersSearchSerializer(obj.customer.company).data
        return None

    def get_can_convert_to_fiscal(self, obj):
        """Check if this invoice can be converted to fiscal"""
        return obj.can_generate_fiscal()

    @transaction.atomic
    def create(self, validated_data):
        from django.contrib.contenttypes.models import ContentType

        items_data = validated_data.pop("items", [])
        validated_data["discount"] = abs(validated_data.get("discount", Decimal("0")))
        print("Creating invoice with validated data:", validated_data)
        if validated_data.get("customer"):
            is_individual = validated_data.pop("is_individual", False)
            validated_data["customer"], _ = Customer.objects.get_or_create(
                is_individual=is_individual,
                individual=(validated_data["customer"] if is_individual else None),
                company=(None if is_individual else validated_data["customer"]),
            )

        # return
        invoice = Invoice.objects.create(**validated_data)

        for item_data in items_data:
            TransactionLineItem.objects.create(
                content_type=ContentType.objects.get_for_model(Invoice),
                object_id=invoice.id,
                sales_item=item_data["sales_item"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])
        instance.discount = abs(validated_data.get("discount", instance.discount))

        if "individual" in validated_data:
            instance.individual = validated_data.pop("individual")
        if "company" in validated_data:
            instance.company = validated_data.pop("company")
        if "is_individual" in validated_data:
            instance.is_individual = validated_data.pop("is_individual")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.line_items.all().delete()
        for item_data in items_data:
            TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data["sales_item"],
                user=instance.user,
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
        instance.save()

        return instance


class CashSaleSerializer(BaseCompanySerializer):
    items = TransactionLineItemSerializer(many=True, required=False)
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )

    total_amount = serializers.ReadOnlyField()  # Now a property

    class Meta(BaseCompanySerializer.Meta):
        model = CashSale
        fields = ["id", "sale_date", "total_amount", "currency", "currency_id", "items"]
        read_only_fields = ["sale_date"]

    def validate(self, data):
        items_data = data.get("items", [])
        request_user = self.context["request"].user
        user_company = request_user.client

        if not data.get("currency"):
            raise serializers.ValidationError(
                {"currency_id": "Currency is required for Cash Sale."}
            )

        for item_data in items_data:
            sales_item = item_data.get("sales_item")

            if not sales_item:
                raise serializers.ValidationError(
                    {"items": "Invalid sales item provided in line items."}
                )

            if (
                hasattr(sales_item, "user")
                and sales_item.user
                and sales_item.created_by.client != user_company
            ):
                raise serializers.ValidationError(
                    {"items": "One or more sales items do not belong to your company."}
                )

            vat_setting = sales_item.tax_configuration
            vat_rate = (
                vat_setting.rate / Decimal("100")
                if vat_setting and vat_setting.vat_applicable
                else Decimal("0")
            )

            quantity = item_data.get("quantity")
            unit_price = sales_item.price

            if quantity is None:
                raise serializers.ValidationError(
                    {"items": "Quantity is required for all line items."}
                )

            item_data["unit_price"] = unit_price
            item_data["vat_amount"] = (quantity * unit_price * vat_rate).quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
            item_data["total_price"] = (
                quantity * unit_price + item_data["vat_amount"]
            ).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        cash_sale = CashSale.objects.create(**validated_data)

        for item_data in items_data:
            TransactionLineItem.objects.create(
                parent_document=cash_sale,
                sales_item=item_data["sales_item"],
                user=cash_sale.user,
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
        return cash_sale

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.line_items.all().delete()
        for item_data in items_data:
            TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data["sales_item"],
                user=instance.user,
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
        instance.save()
        return instance


class CashSaleSerializer(BaseCompanySerializer):
    items = TransactionLineItemSerializer(many=True, required=False)
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
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)
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
            "total_excluding_vat",
            "discount",
            "vat_total",
            "invoice_total",
            "payment_type",
            "payment_type_id",
            "cashbook",
            "cashbook_id",
            "details",
            "reference",
            "amount_received",
        ]
        read_only_fields = ["sale_date", "total_amount"]

    def validate(self, data):
        total_amount = Decimal("0")
        total_exluding_vat = Decimal("0")
        vat_total = Decimal("0")
        invoice_total = Decimal("0")
        items_data = data.get("items", [])
        request_user = self.context["request"].user
        user_company = request_user.client

        if not data.get("currency"):
            raise serializers.ValidationError(
                {"currency_id": "Currency is required for Cash Sale."}
            )
        for item_data in items_data:
            sales_item = item_data.get("sales_item")

            if not sales_item:
                raise serializers.ValidationError(
                    "Invalid sales item provided in line items."
                )

            # Validate that the sales item belongs to the same company as the user
            if (
                hasattr(sales_item, "user")
                and sales_item.user
                and sales_item.created_by.client != user_company
            ):
                raise serializers.ValidationError(
                    {"items": "One or more sales items do not belong to your company."}
                )

            vat_setting = sales_item.tax_configuration
            vat_rate = (
                vat_setting.rate / Decimal("100")
                if vat_setting and vat_setting.vat_applicable
                else Decimal("0")
            )

            quantity = item_data.get("quantity")
            unit_price = sales_item.price

            if quantity is None or unit_price is None:
                raise serializers.ValidationError(
                    {
                        "items": "Quantity and unit price are required for all line items."
                    }
                )

            item_total_excl_vat = (quantity * unit_price).quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )
            item_vat_amount = (item_total_excl_vat * vat_rate).quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )

            item_data["vat_amount"] = item_vat_amount
            item_data["total_price"] = (item_total_excl_vat + item_vat_amount).quantize(
                Decimal("0.00"), rounding=ROUND_HALF_UP
            )

            total_amount += item_data["total_price"]
            total_exluding_vat += unit_price * quantity
            vat_total += item_vat_amount
            invoice_total += data.get("invoice_total")

        discount = data.get("discount", Decimal("0.00"))
        data["invoice_total"] = (total_amount - discount).quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        data["total_excluding_vat"] = total_exluding_vat.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        data["vat_total"] = vat_total.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)

        return data

    def get_customer_details(self, obj):
        if obj.individual:
            return IndividualCustomerSerializer(obj.individual).data
        elif obj.company:
            return CompanyCustomerSerializer(obj.company).data
        return None

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        cash_sale = CashSale.objects.create(**validated_data)
        for item_data in items_data:
            sales_item = item_data["sales_item"]
            TransactionLineItem.objects.create(
                parent_document=cash_sale,
                sales_item=item_data["sales_item"],
                user=cash_sale.user,
                quantity=item_data["quantity"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
        return cash_sale

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])

        # Update CashSale fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create line items
        instance.line_items.all().delete()  # Clear existing and recreate
        total_amount = Decimal("0")
        for item_data in items_data:
            line_item = TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data["sales_item"],
                user=instance.user,
                quantity=item_data["quantity"],
                vat_amount=item_data["vat_amount"],
                total_price=item_data["total_price"],
            )
            total_amount += line_item.total_price

        instance.total_amount = total_amount.quantize(
            Decimal("0.00"), rounding=ROUND_HALF_UP
        )
        instance.save()
        return instance


class PaymentSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Payment
        fields = "__all__"


class CurrencyRateSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    base_currency = CurrencySerializer(read_only=True)
    base_currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="base_currency", write_only=True
    )

    class Meta:
        model = CurrencyRate
        fields = [
            "id",
            "base_currency",
            "currency",
            "base_currency_id",
            "currency_id",
            "current_rate",
            "date_created",
            "created_by",
        ]

    def to_representation(self, instance):
        date = (
            instance.date_updated.strftime("%d-%b-%Y")
            if instance.date_updated
            else instance.date_created.strftime("%d-%b-%Y")
        )
        created_by = instance.created_by
        if (
            created_by
            and hasattr(created_by, "first_name")
            and hasattr(created_by, "last_name")
            and created_by.first_name
            and created_by.last_name
        ):
            created_by_display = (
                f"{created_by.first_name[0].upper()}. {created_by.last_name}"
            )
        else:
            created_by_display = None
        return {
            "id": instance.id,
            "base_currency": instance.base_currency.currency_code,
            "currency": instance.currency.currency_code,
            "current_rate": str(instance.current_rate),
            "date_updated": date,
            "updated_by": created_by_display,
        }

    def validate(self, attrs):
        base_currency = attrs.get("base_currency")
        counter_currency = attrs.get("currency")
        rate = attrs.get("current_rate")
        user = self.context["request"].user.client
        if rate is not None and rate <= 0:
            raise ValidationError("Current Rate must be greater than zero.")

        if self.instance:
            return attrs

        for fields in ["currency", "base_currency", "current_rate"]:
            if not attrs.get(fields):
                raise ValidationError(f"{fields.replace('_', ' ').title()} is required")
        last_rate = (
            CurrencyRate.objects.filter(
                created_by__client=user,
                base_currency=base_currency,
                currency=counter_currency,
            )
            .order_by("-date_updated", "-date_created")
            .first()
        )

        if last_rate and last_rate.current_rate == rate:
            raise ValidationError({"error": "This rate is already the latest."})

        if counter_currency == base_currency:
            raise ValidationError(
                "Base Currency and Counter Currency cannot be the same."
            )
        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["updated_by"] = request.user
            validated_data["date_updated"] = timezone.now()
        return super().update(instance, validated_data)


class CashBookSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    general_ledger_account = GeneralLedgerAccountSerializer(read_only=True)
    general_ledger_account_id = serializers.PrimaryKeyRelatedField(
        queryset=GeneralLedgerAccount.objects.all(),
        source="general_ledger_account",
        write_only=True,
        required=True,
    )

    class Meta(BaseCompanySerializer.Meta):
        model = CashBook
        fields = [
            "id",
            "cashbook_id",
            "cashbook_name",
            "requisition_status",
            "account_type",
            "currency",
            "currency_id",
            "bank_account_number",
            "branch_name",
            "general_ledger_account",
            "general_ledger_account_id",
        ]
        read_only_fields = ["cashbook_id"]

    def validate(self, data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.client:
            user_company = request.user.client
        else:
            user_company = None
        general_ledger_account = data.get("general_ledger_account")
        if (
            general_ledger_account
            and hasattr(general_ledger_account, "user")
            and general_ledger_account.user
            and general_ledger_account.created_by.client != user_company
        ):
            raise serializers.ValidationError(
                {
                    "general_ledger_account_id": "General ledger account does not belong to your company."
                }
            )

        instance = getattr(self, "instance", None)

        company_cashbook = CashBook.objects.filter(created_by__client=user_company)

        if instance:
            company_cashbook = company_cashbook.exclude(pk=instance.pk)

        if cashbook_data_exists := company_cashbook.filter(
            cashbook_name=data.get("cashbook_name"),
            currency=data.get("currency"),
            general_ledger_account=data.get("general_ledger_account"),
        ).exists():
            raise serializers.ValidationError(
                "These details (name, currency, GL account) already exist in another cashbook for your company."
            )

        bank_account = data.get("bank_account_number")
        branch = data.get("branch_name")

        if bank_account and not branch:
            raise serializers.ValidationError(
                {
                    "branch_name": "This field is required if bank account number is provided."
                }
            )

        return data


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "payment_method_name"]


class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = ["transaction_type", "description"]


class ServiceSpecialPricingSerializer(serializers.ModelSerializer):
    currency = serializers.ReadOnlyField(source="currency.currency_code")
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )
    client_customer = serializers.ReadOnlyField(source="client_customer.name")
    client_customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source="client_customer", write_only=True
    )
    service = serializers.ReadOnlyField(source="service.service_name")
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(), source="service", write_only=True
    )

    class Meta:
        model = ServiceSpecialPricing
        fields = [
            "service",
            "individual_charge",
            "company_charge",
            "currency",
            "currency_id",
            "client_customer",
            "client_customer_id",
            "service_id",
        ]

    def validate(self, data):

        for field in [
            "service",
            "client_customer",
            "individual_charge",
            "company_charge",
            "currency",
        ]:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required")

        return data


class ServiceStandardPricingSerializer(serializers.ModelSerializer):
    service = serializers.ReadOnlyField(source="service.service_name")
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(), source="service", write_only=True
    )
    currency = serializers.ReadOnlyField(source="currency.currency_code")
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source="currency", write_only=True
    )

    class Meta:
        model = ServiceStandardPricing
        fields = [
            "id",
            "service",
            "individual_charge",
            "company_charge",
            "currency",
            "currency_id",
            "current_rate",
            "service_id",
            "date_updated",
        ]

    def validate(self, data):
        if self.instance:
            return data

        for field in ["service", "individual_charge", "company_charge", "currency"]:
            if not data.get(field):
                raise ValidationError(f"{field.replace('_', ' ').title()} is required")

        if ServiceStandardPricing.objects.filter(
            service=data.get("service"), currency=data.get("currency")
        ).exists():
            raise ValidationError(
                "Standard pricing for this service and currency already exists."
            )

        return data

    def to_representation(self, instance):
        date_updated = (
            instance.date_updated.strftime("%d-%B-%Y")
            if instance.date_updated
            else None
        )

        return {
            "id": instance.id,
            "service": instance.service.service_name if instance.service else None,
            "individual_charge": instance.individual_charge,
            "company_charge": instance.company_charge,
            "currency": instance.currency.currency_code if instance.currency else None,
            "current_rate": instance.current_rate,
            "date_updated": date_updated,
        }


class CustomersSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    tin_number = serializers.SerializerMethodField()
    vat_number = serializers.SerializerMethodField()
    account_number = serializers.SerializerMethodField()
    industry = serializers.SerializerMethodField()
    customer_type = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        if isinstance(obj, Individual):
            return obj.full_name
        elif isinstance(obj, CompanyBranch):
            return obj.full_name
        return None

    def _get_company_profile(self, obj):
        if not hasattr(self, "_company_profile_cache"):
            self._company_profile_cache = {}
        if isinstance(obj, CompanyBranch):
            company_id = obj.company.pk if obj.company else None
            if company_id not in self._company_profile_cache:
                self._company_profile_cache[company_id] = CompanyProfile.objects.filter(
                    company=obj.company
                ).first()
            return self._company_profile_cache[company_id]
        return None

    def _get_individual_account(self, obj):
        if not hasattr(self, "_individual_account_cache"):
            self._individual_account_cache = {}
        if isinstance(obj, Individual):
            individual_id = obj.pk
            if individual_id not in self._individual_account_cache:
                self._individual_account_cache[individual_id] = (
                    IndividualAccounts.objects.filter(individual=obj).first()
                )
            return self._individual_account_cache[individual_id]
        return None

    def get_customer_type(self, obj):
        if isinstance(obj, Individual):
            return "individual"
        elif isinstance(obj, CompanyBranch):
            return "company"
        return None

    def get_account_number(self, obj):
        if isinstance(obj, Individual):
            return obj.account_number or None
        else:
            profile = self._get_company_profile(obj)
            return profile.account_number if profile else None
        return None

    def get_industry(self, obj):
        if isinstance(obj, Individual):
            employment_detail = obj.employment_details.order_by("-id").first()
            return employment_detail.industry if employment_detail else None
        elif isinstance(obj, CompanyBranch):
            return obj.company.industry if obj.company else None
        return None

    def get_phone(self, obj):
        if isinstance(obj, Individual):
            return obj.phone or None
        elif isinstance(obj, CompanyBranch):
            profile = self._get_company_profile(obj)
            return obj.phone or (profile.landline_phone if profile else None)
        return None

    def get_email(self, obj):
        if isinstance(obj, Individual):
            return obj.email or None
        elif isinstance(obj, CompanyBranch):
            profile = self._get_company_profile(obj)
            return obj.email or (profile.email if profile else None)
        return None

    def get_tin_number(self, obj):
        if isinstance(obj, Individual):
            profile = self._get_individual_account(obj)
            return profile.tin_number if profile else None
        elif isinstance(obj, CompanyBranch):
            profile = self._get_company_profile(obj)
            return profile.tin_number if profile else None
        return None

    def get_vat_number(self, obj):
        if isinstance(obj, Individual):
            profile = self._get_individual_account(obj)
            return profile.vat_number if profile else None
        elif isinstance(obj, CompanyBranch):
            profile = self._get_company_profile(obj)
            return profile.vat_number if profile else None
        return None

    def get_address(self, obj):
        if isinstance(obj, Individual):
            address = obj.addresses.order_by("-id").first()
            return AddressSerializer(address).data if address else None
        elif isinstance(obj, CompanyBranch):
            address = (
                obj.primary_address
                if obj.primary_address
                else obj.company.addresses.order_by("-id").first()
            )
            return AddressSerializer(address).data if address else None
        return None
