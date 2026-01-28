"""Serializers for Trust Accounting API."""

from datetime import date
from jsonschema import ValidationError
from rest_framework import serializers
from django.db import transaction
from django.db.models import Q

from apps.trust_accounting.models import (
    TrustAccountType,
    TrustAccountSubType,
    TrustCurrency,
    TrustExchangeRate,
    TrustGeneralLedgerAccount,
    TrustPropertyExpense,
    TrustSalesCategory,
    TrustTaxType,
    TrustInvoice,
    TrustGeneralLedger,
    TrustSalesItem,
    TrustInvoiceLineItem,
)


# ==================== CURRENCY SERIALIZERS ====================


class TrustCurrencySerializer(serializers.ModelSerializer):
    """Serializer for trust currencies"""

    class Meta:
        """Meta class for TrustCurrencySerializer"""

        model = TrustCurrency
        exclude = ("date_created", "date_updated")

    def validate(self, data):
        code = data.get("currency_code")
        symbol = data.get("symbol")
        instance = self.instance

        queryset = TrustCurrency.objects.all()

        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        else:
            if not code:
                raise ValidationError("Currency code is required")
            if not symbol:
                raise ValidationError("Currency symbol is required")

        if code and queryset.filter(currency_code=code).exists():
            raise ValidationError("A currency with this code already exists.")

        return data


class TrustExchangeRateSerializer(serializers.ModelSerializer):
    """Serializer for trust currency exchange rates"""

    base_currency_code = serializers.CharField(
        source="base_currency.currency_code", read_only=True
    )
    target_currency_code = serializers.CharField(
        source="target_currency.currency_code", read_only=True
    )
    base_currency_id = serializers.PrimaryKeyRelatedField(
        source="base_currency",
        queryset=TrustCurrency.objects.all(),
        write_only=True,
        required=True,
        error_messages={
            "required": "Base currency is required.",
            "does_not_exist": "Selected base currency does not exist.",
            "incorrect_type": "Invalid base currency.",
        },
    )
    target_currency_id = serializers.PrimaryKeyRelatedField(
        source="target_currency",
        queryset=TrustCurrency.objects.all(),
        write_only=True,
        required=True,
        error_messages={
            "required": "Target currency is required.",
            "does_not_exist": "Selected target currency does not exist.",
            "incorrect_type": "Invalid target currency.",
        },
    )

    class Meta:
        """Meta class for TrustExchangeRateSerializer"""

        model = TrustExchangeRate
        exclude = ("date_created", "date_updated")
        read_only_fields = ("base_currency", "target_currency")

    def to_representation(self, instance):
        date = (
            instance.effective_date.strftime("%d-%b-%Y")
            if instance.effective_date
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
            "target_currency": instance.target_currency.currency_code,
            "rate": str(instance.rate),
            "effective_date": date,
            "created_by": created_by_display,
        }

    def validate(self, attrs):
        base_currency = attrs.get("base_currency")
        target_currency = attrs.get("target_currency")
        rate = attrs.get("rate")
        user = self.context["request"].user.client
        if rate is not None and rate <= -0:
            raise ValidationError("Current Rate must be greater than zero.")

        if self.instance:
            return attrs

        for fields in ["target_currency", "base_currency", "rate"]:
            if not attrs.get(fields):
                raise ValidationError(f"{fields.replace('_', ' ').title()} is required")
        today = date.today()
        last_rate = (
            TrustExchangeRate.objects.filter(
                created_by__client=user,
                base_currency=base_currency,
                target_currency=target_currency,
            )
            .order_by("-date_updated", "-date_created")
            .first()
        )
        if last_rate and last_rate.effective_date == today:
            raise ValidationError(
                {
                    "error": "An exchange rate for these currencies has already been set today."
                }
            )
        if last_rate and last_rate.rate == rate:
            raise ValidationError({"error": "This rate is already the latest."})

        if target_currency == base_currency:
            raise ValidationError(
                "Base Currency and Counter Currency cannot be the same."
            )
        return attrs


# ==================== TAX SERIALIZERS ====================


class TrustTaxTypeSerializer(serializers.ModelSerializer):
    """Serializer for trust tax types"""

    payable_account_name = serializers.CharField(
        source="payable_account.account_name", read_only=True
    )
    receivable_account_name = serializers.CharField(
        source="receivable_account.account_name", read_only=True
    )
    payable_account_id = serializers.PrimaryKeyRelatedField(
        source="payable_account",
        queryset=TrustGeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "required": "Payable account is required.",
            "does_not_exist": "Selected payable account does not exist.",
            "incorrect_type": "Invalid payable account.",
        },
    )
    receivable_account_id = serializers.PrimaryKeyRelatedField(
        source="receivable_account",
        queryset=TrustGeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "required": "Receivable account is required.",
            "does_not_exist": "Selected receivable account does not exist.",
            "incorrect_type": "Invalid receivable account.",
        },
    )

    class Meta:
        model = TrustTaxType
        fields = [
            "id",
            "name",
            "rate",
            "description",
            "code",
            "is_active",
            "payable_account_name",
            "receivable_account_name",
            "payable_account_id",
            "receivable_account_id",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.rate is None:
            representation["rate"] = "Exempt"
        return representation

    def validate(self, attrs):
        """
        Validate that name and code are unique for the client.
        This is called for each item in a list.
        """
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise ValidationError("Request context is required for validation.")

        client = request.user.client
        name = attrs.get("name")
        code = attrs.get("code")
        rate = attrs.get("rate")

        # Base queryset for uniqueness checks, including system-level entries.
        queryset = TrustTaxType.objects.filter(
            Q(created_by__client=client) | Q(created_by__isnull=True)
        )

        # Handle updates
        if self.instance:
            if self.instance.created_by is None:
                raise ValidationError(
                    "You don't have permission to modify this system tax type."
                )
            queryset = queryset.exclude(pk=self.instance.pk)
        else:
            if not name:
                raise ValidationError({"name": "Name is required."})
            if not code:
                raise ValidationError({"code": "Code is required."})
            if not rate:
                raise ValidationError({"rate": "Rate is required."})

        if name and queryset.filter(name__iexact=name).exists():
            raise ValidationError(
                {"name": f"A tax type with the name '{name}' already exists."}
            )

        if code and queryset.filter(code__iexact=code).exists():
            raise ValidationError(
                {"code": f"A tax type with the code '{code}' already exists."}
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
        return super().update(instance, validated_data)


# =================== ACCOUNT TYPE SERIALIZERS ====================
class TrustAccountTypeSerializer(serializers.ModelSerializer):
    """Serializer for trust account types or sectors"""

    is_system = serializers.SerializerMethodField(read_only=True)

    class Meta:
        """Class meta for trust account type serializer"""

        model = TrustAccountType
        fields = ["id", "code", "name", "account_type", "is_system"]

    def get_is_system(self, obj):
        """Determine if account type is seeded by system"""
        if obj.created_by is None:
            return True
        return False

    def validate(self, attrs: dict) -> dict:
        name = attrs.get("name")
        code = attrs.get("code")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = TrustAccountType.objects.filter(
            Q(created_by__client=user_company) | Q(created_by__isnull=True)
        )

        if instance:
            if instance.created_by is None:
                raise ValidationError(
                    "You don't have permission to modify this system account"
                )
            queryset = queryset.exclude(pk=instance.pk)
        else:
            if not name:
                raise ValidationError("Sector name is required")
            if not code:
                raise ValidationError("Sector code is required")

        if name and queryset.filter(name__iexact=name).exists():
            raise ValidationError("An account sector with this name already exists.")

        if code and queryset.filter(code__iexact=code).exists():
            raise ValidationError("An account sector with this code already exists.")

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


class TrustAccountSubTypeSerializer(serializers.ModelSerializer):
    """Serializer for trust account subtypes or classifications"""

    account_type_name = serializers.CharField(
        source="account_type.name", read_only=True
    )
    account_type_id = serializers.PrimaryKeyRelatedField(
        source="account_type",
        queryset=TrustAccountType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Account type is required.",
            "does_not_exist": "Selected account type does not exist.",
            "incorrect_type": "Invalid account type.",
        },
    )

    class Meta:
        """Class meta for trust account subtype serializer"""

        model = TrustAccountSubType
        fields = ["id", "name", "code_prefix", "account_type_name", "account_type_id"]

    def validate(self, attrs):
        """Validate account subtype data"""
        name = attrs.get("name")
        code_prefix = attrs.get("code_prefix")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = TrustAccountSubType.objects.filter(created_by__client=user_company)

        if instance:
            if instance.created_by is None:
                raise ValidationError(
                    "You don't have permission to modify this system account subtype"
                )
            queryset = queryset.exclude(pk=instance.pk)
        else:
            if not name:
                raise ValidationError("Account subtype name is required")
            if not code_prefix:
                raise ValidationError("Account subtype code prefix is required")

        if name and queryset.filter(name__iexact=name).exists():
            raise ValidationError("An account subtype with this name already exists.")

        if code_prefix and queryset.filter(code_prefix__iexact=code_prefix).exists():
            raise ValidationError(
                "An account subtype with this code prefix already exists."
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


# ==================== GENERAL LEDGER ACCOUNT SERIALIZERS ====================


class TrustGeneralLedgerAccountSerializer(serializers.ModelSerializer):
    """Serializer for main general ledger accounts"""

    account_type = TrustAccountTypeSerializer(read_only=True)
    account_type_id = serializers.PrimaryKeyRelatedField(
        source="account_type",
        queryset=TrustAccountType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Account type is required.",
            "does_not_exist": "Selected account type does not exist.",
            "incorrect_type": "Invalid account type.",
        },
    )
    account_subtype = TrustAccountSubTypeSerializer(read_only=True)
    account_subtype_id = serializers.PrimaryKeyRelatedField(
        source="account_subtype",
        queryset=TrustAccountSubType.objects.all(),
        write_only=True,
        allow_null=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected account subtype does not exist.",
            "incorrect_type": "Invalid account subtype.",
        },
    )
    # parent_account_name = serializers.CharField(
    #     source="parent_account.account_name", read_only=True
    # )
    # current_balance_display = serializers.SerializerMethodField()

    class Meta:
        model = TrustGeneralLedgerAccount
        fields = [
            "id",
            "account_name",
            "account_number",
            "account_type",
            "account_type_id",
            "account_subtype",
            "account_subtype_id",
            "is_contra_account",
            "is_system_account",
        ]

    def get_current_balance_display(self, obj):
        return obj.get_balance()

    def validate_account_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Account number must contain only digits")
        return value

    def validate(self, attrs):
        account_number = attrs.get("account_number")
        account_name = attrs.get("account_name")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = TrustGeneralLedgerAccount.objects.filter(
            Q(created_by__client=user_company) | Q(created_by__isnull=True)
        )

        if instance:
            if instance.created_by is None:
                raise ValidationError(
                    "You don't have permission to modify this system account."
                )
            queryset = queryset.exclude(pk=instance.pk)
        else:
            required_fields = ["account_number", "account_name", "account_type"]
            for field in required_fields:
                if not attrs.get(field):
                    raise ValidationError(
                        f"{field.replace('_', ' ').title()} is required."
                    )

        if account_number and queryset.filter(account_number=account_number).exists():
            raise ValidationError("An account with this number already exists.")

        if account_name and queryset.filter(account_name__iexact=account_name).exists():
            raise ValidationError("An account with this name already exists.")

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


# ==================== SALES CATEGORY & ITEM SERIALIZERS ====================
class TrustSalesCategorySerializer(serializers.ModelSerializer):
    """Serializer for trust sales categories (product/service categories)"""

    parent_category_name = serializers.CharField(
        source="parent_category.name", read_only=True
    )

    class Meta:
        model = TrustSalesCategory
        fields = ["id", "code", "name", "parent_category_name"]

    def validate(self, attrs):
        name = attrs.get("name")
        code = attrs.get("code")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = TrustSalesCategory.objects.filter(created_by__client=user_company)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        else:
            required_fields = ["name", "code"]
            for field in required_fields:
                if not attrs.get(field):
                    raise ValidationError(
                        {"error": f"{field.replace('_', ' ').title()} is required."}
                    )

        if name and queryset.filter(name__iexact=name).exists():
            raise ValidationError(
                {"error": "A sales category with this name already exists."}
            )
        if code and queryset.filter(code__iexact=code).exists():
            raise ValidationError(
                {"error": "A sales category with this code already exists."}
            )
        return attrs


class TrustSalesItemSerializer(serializers.ModelSerializer):
    """Serializer for trust sales items (products/services)"""

    currency_id = serializers.PrimaryKeyRelatedField(
        source="currency",
        queryset=TrustCurrency.objects.all(),
        write_only=True,
        error_messages={
            "required": "Currency is required.",
            "does_not_exist": "Selected currency does not exist.",
            "incorrect_type": "Invalid currency.",
        },
    )
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=TrustSalesCategory.objects.all(),
        write_only=True,
        error_messages={
            "required": "Category is required.",
            "does_not_exist": "Selected category does not exist.",
            "incorrect_type": "Invalid category.",
        },
    )
    tax_type_id = serializers.PrimaryKeyRelatedField(
        source="tax_type",
        queryset=TrustTaxType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Tax type is required.",
            "does_not_exist": "Selected tax type does not exist.",
            "incorrect_type": "Invalid tax type.",
        },
    )
    income_account_id = serializers.PrimaryKeyRelatedField(
        source="income_account",
        queryset=TrustGeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected income account does not exist.",
            "incorrect_type": "Invalid income account.",
        },
    )
    cost_of_sales_account_id = serializers.PrimaryKeyRelatedField(
        source="cost_of_sales_account",
        queryset=TrustGeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected cost of sales account does not exist.",
            "incorrect_type": "Invalid cost of sales account.",
        },
    )
    inventory_account_id = serializers.PrimaryKeyRelatedField(
        source="inventory_account",
        queryset=TrustGeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected inventory account does not exist.",
            "incorrect_type": "Invalid inventory account.",
        },
    )

    class Meta:
        """Class meta for trust sales item serializer"""

        model = TrustSalesItem
        exclude = ["date_created", "date_updated", "created_by", "updated_by"]
        read_only_fields = (
            "id",
            "item_code",
            "category",
            "tax_type",
            "income_account",
            "cost_of_sales_account",
            "inventory_account",
            "currency",
        )

    def to_representation(self, instance):
        represantation = {
            "id": instance.id,
            "item_code": instance.item_code,
            "name": instance.name,
            "description": instance.description,
            "category": instance.category.name if instance.category else None,
            "price": str(instance.unit_price),
            "price_including_tax": str(instance.price_including_tax),
            "vat_price": str(instance.vat_price),
            "currency": instance.currency.currency_code if instance.currency else None,
            "is_active": instance.is_active,
            "tax_type": instance.tax_type.name if instance.tax_type else None,
            "income_account": (
                instance.income_account.account_name
                if instance.income_account
                else None
            ),
            "cost_of_sales_account": (
                instance.cost_of_sales_account.account_name
                if instance.cost_of_sales_account
                else None
            ),
            "inventory_account": (
                instance.inventory_account.account_name
                if instance.inventory_account
                else None
            ),
        }
        return represantation

    def validate(self, attrs):
        name = attrs.get("name")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = TrustSalesItem.objects.filter(created_by__client=user_company)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        else:
            required_fields = [
                "name",
                "category",
                "tax_type",
                "unit_price",
            ]
            for field in required_fields:
                if not attrs.get(field):
                    raise ValidationError(
                        {"error": f"{field.replace('_', ' ').title()} is required."}
                    )

        if name and queryset.filter(name__iexact=name).exists():
            raise ValidationError(
                {"error": "A sales item with this name already exists."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)

    @transaction.atomic
    def update(self, validated_data):
        user = self.context["request"].user
        validated_data["updated_by"] = user
        return super().update(validated_data)


# ===================== TRUST GENERAL LEDGERS SERIALIZERS  ====================


class TrustGeneralLedgerSerializer(serializers.ModelSerializer):
    """Serializer for Trust General Ledger Accounts"""

    account_type = TrustAccountTypeSerializer(read_only=True)
    account_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TrustAccountType.objects.all(), source="account_type"
    )

    class Meta:
        model = TrustGeneralLedger
        fields = [
            "id",
            "account_number",
            "account_name",
            "account_type",
            "account_type_id",
            "is_system_account",
        ]
        read_only_fields = ["date_created", "date_updated"]

    def validate(self, attrs):
        """Ensure no duplicate GL accounts in Trust General Ledger"""
        account_number = attrs.get("account_number")
        account_name = attrs.get("account_name")
        user = self.context["request"].user
        client = user.client

        if self.instance:
            account_number = account_number or self.instance.account_number
            account_name = account_name or self.instance.account_name

        if not self.instance or "account_number" in attrs:
            if not account_number:
                raise serializers.ValidationError(
                    {"account_number": "Account number is required."}
                )
            if not account_number.startswith("T"):
                raise serializers.ValidationError(
                    {
                        "account_number": (
                            "The Trust General Ledger account number "
                            "must start with 'T'."
                        )
                    }
                )

        if not self.instance or "account_name" in attrs:
            if not account_name:
                raise serializers.ValidationError(
                    {"account_name": "Account name is required."}
                )

        if not self.instance or "account_type" in attrs:
            if not attrs.get("account_type"):
                raise serializers.ValidationError(
                    {"account_type": "Account type is required."}
                )

        # Efficient queries: only check what's being changed
        if "account_number" in attrs:
            queryset = TrustGeneralLedger.objects.filter(
                created_by__client=client, account_number=account_number
            )
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    {
                        "account_number": (
                            "This account number already exists "
                            "for your organization."
                        )
                    }
                )

        if "account_name" in attrs:
            queryset = TrustGeneralLedger.objects.filter(
                created_by__client=client, account_name=account_name
            )
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    {
                        "account_name": (
                            "This account name already exists " "for your organization."
                        )
                    }
                )

        return attrs


# ==================== PROPERTY EXPENSES SERIALIZERS ===================


class TrustPropertyExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Trust Property Expense Accounts"""

    expense_account_name = serializers.CharField(
        source="expense_account.account_name", read_only=True
    )
    expense_account_number = serializers.CharField(
        source="expense_account.account_number", read_only=True
    )

    class Meta:
        model = TrustPropertyExpense
        fields = [
            "id",
            "expense",
            "expense_account",
            "expense_account_name",
            "expense_account_number",
            "date_created",
            "date_updated",
        ]
        read_only_fields = ["date_created", "date_updated"]

    def validate(self, data):
        """Ensure no duplicate expense accounts for the same expense"""
        expense = data.get("expense")
        expense_account = data.get("expense_account")

        if TrustPropertyExpense.objects.filter(
            expense=expense, expense_account=expense_account
        ).exists():
            raise serializers.ValidationError(
                "This expense account is already linked to the specified expense."
            )
        return data


# ==================== TRUST INVOICE SERIALIZERS ====================


class TrustInvoiceLineItemSerializer(serializers.ModelSerializer):
    """Serializer for Trust Invoice Line Items"""

    class Meta:
        model = TrustInvoiceLineItem
        fields = [
            "invoice",
            "sales_item",
            "quantity",
            "unit_price",
            "vat_amount",
            "total_price",
            "total_vat",
            "total_price_excluding_vat",
            "total_including_vat",
        ]
        read_only_fields = [
            "total_vat",
            "total_price_excluding_vat",
            "total_including_vat",
            "date_created",
            "date_updated",
        ]


class TrustInvoiceLineItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Trust Invoice Line Items"""

    class Meta:
        model = TrustInvoiceLineItem
        fields = [
            "sales_item",
            "quantity",
            "unit_price",
        ]


class TrustInvoiceSerializer(serializers.ModelSerializer):
    """Full serializer for Trust Invoices"""

    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )
    currency_symbol = serializers.CharField(source="currency.symbol", read_only=True)
    invoice_type_display = serializers.CharField(
        source="get_invoice_type_display", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    approved_by_name = serializers.CharField(
        source="approved_by.get_full_name", read_only=True
    )
    is_overdue = serializers.BooleanField(read_only=True)
    line_items = TrustInvoiceLineItemSerializer(many=True, read_only=True)

    class Meta:
        model = TrustInvoice
        fields = "__all__"
        read_only_fields = [
            "invoice_number",
            "subtotal",
            "tax_total",
            "total_amount",
            "amount_paid",
            "balance_due",
            "posted_date",
            "approved_by",
            "approved_date",
            "date_created",
            "date_updated",
        ]


class TrustInvoiceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing Trust Invoices"""

    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    invoice_type_display = serializers.CharField(
        source="get_invoice_type_display", read_only=True
    )
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = TrustInvoice
        fields = [
            "id",
            "invoice_number",
            "invoice_type_display",
            "status_display",
            "invoice_date",
            "due_date",
            "total_amount",
            "balance_due",
            "currency_code",
            "is_overdue",
        ]


class TrustInvoiceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Trust Invoices with line items"""

    line_items = TrustInvoiceLineItemCreateSerializer(many=True, required=False)

    class Meta:
        model = TrustInvoice
        fields = [
            "invoice_type",
            "property_reference",
            "invoice_date",
            "tenant",
            "landlord",
            "due_date",
            "period_from",
            "period_to",
            "currency",
            "exchange_rate",
            "discount_percentage",
            "terms",
            "notes",
            "reference",
            "line_items",
        ]

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])

        with transaction.atomic():
            invoice = TrustInvoice.objects.create(**validated_data)

            for line_item_data in line_items_data:
                TrustInvoiceLineItem.objects.create(invoice=invoice, **line_item_data)

            if line_items_data:
                invoice.update_totals()

        return invoice

    def update(self, instance, validated_data):
        line_items_data = validated_data.pop("line_items", None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if line_items_data is not None:
                # Replace all line items
                instance.line_items.all().delete()
                for line_item_data in line_items_data:
                    TrustInvoiceLineItem.objects.create(
                        invoice=instance, **line_item_data
                    )
                instance.update_totals()

        return instance


class TrustInvoiceApproveSerializer(serializers.Serializer):
    """Serializer for approving Trust Invoices"""

    notes = serializers.CharField(required=False, allow_blank=True)


class TrustInvoicePaymentSerializer(serializers.Serializer):
    """Serializer for applying payment to Trust Invoices"""

    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    payment_date = serializers.DateField(required=False)
    payment_reference = serializers.CharField(required=False, allow_blank=True)
