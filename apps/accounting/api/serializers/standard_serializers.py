# serializers/__init__.py
from datetime import date
from decimal import Decimal
from django.db.models import Q
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.accounting.models import *

# ==================== CORE ACCOUNTING SERIALIZERS ====================


class FinancialYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialYear
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "closed_at",
            "closed_by",
        )

    def validate(self, data):
        if data["start_date"] >= data["end_date"]:
            raise serializers.ValidationError("End date must be after start date")
        return data


class AccountingPeriodSerializer(serializers.ModelSerializer):
    financial_year_name = serializers.CharField(
        source="financial_year.name", read_only=True
    )

    class Meta:
        model = AccountingPeriod
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "closed_at",
            "closed_by",
        )


class AccountTypeSerializer(serializers.ModelSerializer):
    """Serializer for account types or sectors"""

    is_system = serializers.SerializerMethodField(read_only=True)

    class Meta:
        """Class meta for account type serializer"""

        model = AccountType
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

        queryset = AccountType.objects.filter(
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

        if name and queryset.filter(name=name).exists():
            raise ValidationError("An account sector with this name already exists.")

        if code and queryset.filter(code=code).exists():
            raise ValidationError("An account sector with this code already exists.")

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


class AccountSubTypeSerializer(serializers.ModelSerializer):
    """Serializer for account subtypes or classifications"""

    account_type_name = serializers.CharField(
        source="account_type.name", read_only=True
    )
    account_type_id = serializers.PrimaryKeyRelatedField(
        source="account_type",
        queryset=AccountType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Account type is required.",
            "does_not_exist": "Selected account type does not exist.",
            "incorrect_type": "Invalid account type.",
        },
    )

    class Meta:
        """Class meta for account subtype serializer"""

        model = AccountSubType
        fields = ["id", "name", "code_prefix", "account_type_name", "account_type_id"]

    def validate(self, attrs):
        """Validate account subtype data"""
        name = attrs.get("name")
        code_prefix = attrs.get("code_prefix")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = AccountSubType.objects.filter(created_by__client=user_company)

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

        if name and queryset.filter(name=name).exists():
            raise ValidationError("An account subtype with this name already exists.")

        if code_prefix and queryset.filter(code_prefix=code_prefix).exists():
            raise ValidationError(
                "An account subtype with this code prefix already exists."
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


class GeneralLedgerAccountSerializer(serializers.ModelSerializer):
    account_type = AccountTypeSerializer(read_only=True)
    account_type_id = serializers.PrimaryKeyRelatedField(
        source="account_type",
        queryset=AccountType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Account type is required.",
            "does_not_exist": "Selected account type does not exist.",
            "incorrect_type": "Invalid account type.",
        },
    )
    account_subtype = AccountSubTypeSerializer(read_only=True)
    account_subtype_id = serializers.PrimaryKeyRelatedField(
        source="account_subtype",
        queryset=AccountSubType.objects.all(),
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
        model = GeneralLedgerAccount
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

        queryset = GeneralLedgerAccount.objects.filter(
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

        if account_name and queryset.filter(account_name=account_name).exists():
            raise ValidationError("An account with this name already exists.")

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["created_by"] = user
        return super().create(validated_data)


class CostCenterSerializer(serializers.ModelSerializer):
    parent_center_name = serializers.CharField(
        source="parent_center.name", read_only=True
    )
    manager_name = serializers.CharField(source="manager.get_full_name", read_only=True)

    class Meta:
        model = CostCenter
        fields = "__all__"


class LedgerTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="account.account_name", read_only=True)
    account_number = serializers.CharField(
        source="account.account_number", read_only=True
    )
    cost_center_name = serializers.CharField(source="cost_center.name", read_only=True)

    class Meta:
        model = LedgerTransaction
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated")

    def validate(self, data):
        if data.get("debit_amount", 0) and data.get("credit_amount", 0):
            raise serializers.ValidationError(
                "Transaction cannot have both debit and credit amounts"
            )

        if not data.get("debit_amount", 0) and not data.get("credit_amount", 0):
            raise serializers.ValidationError(
                "Transaction must have either debit or credit amount"
            )

        return data


class JournalEntrySerializer(serializers.ModelSerializer):
    transactions = LedgerTransactionSerializer(many=True)
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )
    approved_by_name = serializers.CharField(
        source="approved_by.get_full_name", read_only=True
    )
    total_debit = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )
    total_credit = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )

    class Meta:
        model = JournalEntry
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "entry_number",
            "posted_date",
            "total_debit",
            "total_credit",
        )

    def validate(self, data):
        if data.get("entry_date"):
            # Validate entry date is within an open accounting period
            try:
                period = AccountingPeriod.objects.get(
                    start_date__lte=data["entry_date"],
                    end_date__gte=data["entry_date"],
                    is_open=True,
                )
                data["accounting_period"] = period
            except AccountingPeriod.DoesNotExist:
                raise serializers.ValidationError(
                    "No open accounting period found for the entry date"
                )

        return data

    def create(self, validated_data):
        transactions_data = validated_data.pop("transactions", [])

        with transaction.atomic():
            journal_entry = JournalEntry.objects.create(**validated_data)

            for transaction_data in transactions_data:
                LedgerTransaction.objects.create(
                    journal_entry=journal_entry, **transaction_data
                )

            journal_entry.update_totals()

        return journal_entry

    def update(self, instance, validated_data):
        transactions_data = validated_data.pop("transactions", None)

        with transaction.atomic():
            # Update journal entry fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if transactions_data is not None:
                # Delete existing transactions and create new ones
                instance.transactions.all().delete()
                for transaction_data in transactions_data:
                    LedgerTransaction.objects.create(
                        journal_entry=instance, **transaction_data
                    )

                instance.update_totals()

        return instance


class JournalEntryPostSerializer(serializers.Serializer):
    """Serializer for posting journal entries"""

    post = serializers.BooleanField(default=True)

    def validate(self, data):
        journal_entry = self.context["journal_entry"]
        if journal_entry.is_posted:
            raise serializers.ValidationError("Journal entry is already posted")
        return data


# ==================== SUBSIDIARY LEDGER SERIALIZERS ====================


class CustomerSerializer(serializers.ModelSerializer):
    individual_name = serializers.CharField(
        source="individual.full_name", read_only=True
    )
    company_name = serializers.CharField(source="company.full_name", read_only=True)
    current_balance = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )
    available_credit = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )

    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "customer_code",
            "current_balance",
        )


class VendorSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.full_name", read_only=True)
    current_balance = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )

    class Meta:
        model = Vendor
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated", "vendor_code")


# ==================== TAX SERIALIZERS ====================


class TaxTypeSerializer(serializers.ModelSerializer):
    payable_account_name = serializers.CharField(
        source="payable_account.account_name", read_only=True
    )
    receivable_account_name = serializers.CharField(
        source="receivable_account.account_name", read_only=True
    )
    payable_account_id = serializers.PrimaryKeyRelatedField(
        source="payable_account",
        queryset=GeneralLedgerAccount.objects.all(),
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
        queryset=GeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "required": "Receivable account is required.",
            "does_not_exist": "Selected receivable account does not exist.",
            "incorrect_type": "Invalid receivable account.",
        },
    )

    class Meta:
        model = TaxType
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
        queryset = TaxType.objects.filter(
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


# ==================== PRODUCT/SERVICE CATALOG SERIALIZERS ====================


class SalesCategorySerializer(serializers.ModelSerializer):
    parent_category_name = serializers.CharField(
        source="parent_category.name", read_only=True
    )

    class Meta:
        model = SalesCategory
        fields = ["id", "code", "name", "parent_category_name"]

    def validate(self, attrs):
        name = attrs.get("name")
        code = attrs.get("code")
        user_company = self.context["request"].user.client
        instance = self.instance

        queryset = SalesCategory.objects.filter(created_by__client=user_company)
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


class SalesItemSerializer(serializers.ModelSerializer):
    """Serializer for sales items (products/services)"""

    currency_id = serializers.PrimaryKeyRelatedField(
        source="currency",
        queryset=Currency.objects.all(),
        write_only=True,
        error_messages={
            "required": "Currency is required.",
            "does_not_exist": "Selected currency does not exist.",
            "incorrect_type": "Invalid currency.",
        },
    )
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=SalesCategory.objects.all(),
        write_only=True,
        error_messages={
            "required": "Category is required.",
            "does_not_exist": "Selected category does not exist.",
            "incorrect_type": "Invalid category.",
        },
    )
    tax_type_id = serializers.PrimaryKeyRelatedField(
        source="tax_type",
        queryset=TaxType.objects.all(),
        write_only=True,
        error_messages={
            "required": "Tax type is required.",
            "does_not_exist": "Selected tax type does not exist.",
            "incorrect_type": "Invalid tax type.",
        },
    )
    income_account_id = serializers.PrimaryKeyRelatedField(
        source="income_account",
        queryset=GeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected income account does not exist.",
            "incorrect_type": "Invalid income account.",
        },
    )
    cost_of_sales_account_id = serializers.PrimaryKeyRelatedField(
        source="cost_of_sales_account",
        queryset=GeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected cost of sales account does not exist.",
            "incorrect_type": "Invalid cost of sales account.",
        },
    )
    inventory_account_id = serializers.PrimaryKeyRelatedField(
        source="inventory_account",
        queryset=GeneralLedgerAccount.objects.all(),
        write_only=True,
        required=False,
        error_messages={
            "does_not_exist": "Selected inventory account does not exist.",
            "incorrect_type": "Invalid inventory account.",
        },
    )

    class Meta:
        """Class meta for sales item serializer"""

        model = SalesItem
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

        queryset = SalesItem.objects.filter(created_by__client=user_company)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        else:
            required_fields = [
                "name",
                "category",
                "tax_type",
                "unit_price",
                "unit_name",
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


# ==================== INVOICE SERIALIZERS ====================


class InvoiceLineItemSerializer(serializers.ModelSerializer):
    sales_item_name = serializers.CharField(source="sales_item.name", read_only=True)
    sales_item_code = serializers.CharField(
        source="sales_item.item_code", read_only=True
    )
    line_total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    line_total_with_tax = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = InvoiceLineItem
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated", "tax_amount")


class InvoiceSerializer(serializers.ModelSerializer):
    line_items = InvoiceLineItemSerializer(many=True)
    customer_name = serializers.CharField(
        source="customer.display_name", read_only=True
    )
    customer_code = serializers.CharField(
        source="customer.customer_code", read_only=True
    )
    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )
    is_overdue = serializers.BooleanField(read_only=True)
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )

    class Meta:
        model = Invoice
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "invoice_number",
            "posted_date",
            "subtotal",
            "tax_total",
            "total_amount",
            "amount_paid",
            "balance_due",
            "journal_entry",
        )

    def validate(self, data):
        if data.get("due_date") and data.get("invoice_date"):
            if data["due_date"] < data["invoice_date"]:
                raise serializers.ValidationError(
                    "Due date cannot be before invoice date"
                )

        return data

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])

        with transaction.atomic():
            invoice = Invoice.objects.create(**validated_data)

            for line_item_data in line_items_data:
                InvoiceLineItem.objects.create(invoice=invoice, **line_item_data)

            invoice.update_totals()

        return invoice

    def update(self, instance, validated_data):
        line_items_data = validated_data.pop("line_items", None)

        with transaction.atomic():
            # Update invoice fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if line_items_data is not None:
                # Update line items
                instance.line_items.all().delete()
                for line_item_data in line_items_data:
                    InvoiceLineItem.objects.create(invoice=instance, **line_item_data)

                instance.update_totals()

        return instance


class InvoicePostSerializer(serializers.Serializer):
    """Serializer for posting invoices to ledger"""

    post = serializers.BooleanField(default=True)

    def validate(self, data):
        invoice = self.context["invoice"]
        if invoice.journal_entry:
            raise serializers.ValidationError("Invoice already posted to ledger")
        if invoice.status != "pending":
            raise serializers.ValidationError("Only pending invoices can be posted")
        return data


class InvoicePaymentSerializer(serializers.Serializer):
    """Serializer for applying payments to invoices"""

    amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, min_value=Decimal("0.01")
    )
    payment_date = serializers.DateField(required=False)
    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHODS, default="bank_transfer"
    )
    reference = serializers.CharField(max_length=255, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    cash_account = serializers.PrimaryKeyRelatedField(
        queryset=GeneralLedgerAccount.objects.filter(account_number__startswith="10"),
        required=False,
    )

    def validate_amount(self, value):
        invoice = self.context["invoice"]
        if value > invoice.balance_due:
            raise serializers.ValidationError(
                f"Payment amount exceeds balance due of {invoice.balance_due}"
            )
        return value


# ==================== PAYMENT SERIALIZERS ====================


class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source="invoice.invoice_number", read_only=True
    )
    customer_name = serializers.CharField(
        source="invoice.customer.display_name", read_only=True
    )
    cash_account_name = serializers.CharField(
        source="cash_account.account_name", read_only=True
    )
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "payment_number",
            "journal_entry",
        )

    def create(self, validated_data):
        with transaction.atomic():
            payment = Payment.objects.create(**validated_data)
            # Auto-post to ledger
            payment.post_to_ledger()
        return payment


# ==================== CASH MANAGEMENT SERIALIZERS ====================


class BankAccountSerializer(serializers.ModelSerializer):
    gl_account_name = serializers.CharField(
        source="gl_account.account_name", read_only=True
    )
    gl_account_number = serializers.CharField(
        source="gl_account.account_number", read_only=True
    )
    current_balance = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )
    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )

    class Meta:
        model = BankAccount
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated")


class CashReceiptSerializer(serializers.ModelSerializer):
    bank_account_name = serializers.CharField(
        source="bank_account.account_name", read_only=True
    )
    income_account_name = serializers.CharField(
        source="income_account.account_name", read_only=True
    )
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )

    class Meta:
        model = CashReceipt
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "receipt_number",
            "journal_entry",
        )

    def create(self, validated_data):
        with transaction.atomic():
            cash_receipt = CashReceipt.objects.create(**validated_data)
            # Auto-post to ledger
            cash_receipt.post_to_ledger()
        return cash_receipt


# ==================== CURRENCY SERIALIZERS ====================


class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for currencies"""

    class Meta:
        """Meta class for CurrencySerializer"""

        model = Currency
        exclude = ("date_created", "date_updated")

    def validate(self, data):
        code = data.get("currency_code")
        symbol = data.get("symbol")
        instance = self.instance

        queryset = Currency.objects.all()

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


class ExchangeRateSerializer(serializers.ModelSerializer):
    """Serializer for currency exchange rates"""

    base_currency_code = serializers.CharField(
        source="base_currency.currency_code", read_only=True
    )
    target_currency_code = serializers.CharField(
        source="target_currency.currency_code", read_only=True
    )
    base_currency_id = serializers.PrimaryKeyRelatedField(
        source="base_currency",
        queryset=Currency.objects.all(),
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
        queryset=Currency.objects.all(),
        write_only=True,
        required=True,
        error_messages={
            "required": "Target currency is required.",
            "does_not_exist": "Selected target currency does not exist.",
            "incorrect_type": "Invalid target currency.",
        },
    )

    class Meta:
        """Meta class for ExchangeRateSerializer"""

        model = ExchangeRate
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
            ExchangeRate.objects.filter(
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


# ==================== REPORT SERIALIZERS ====================


class TrialBalanceItemSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(
        source="account.account_number", read_only=True
    )
    account_name = serializers.CharField(source="account.account_name", read_only=True)

    class Meta:
        model = TrialBalanceItem
        fields = "__all__"


class TrialBalanceSerializer(serializers.ModelSerializer):
    items = TrialBalanceItemSerializer(many=True, read_only=True)
    period_name = serializers.CharField(source="period.name", read_only=True)
    generated_by_name = serializers.CharField(
        source="generated_by.get_full_name", read_only=True
    )

    class Meta:
        model = TrialBalance
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated", "generated_at")


# ==================== COMPATIBILITY SERIALIZERS ====================


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "description"]

    def validate(self, attrs):
        name = attrs.get("name")
        user_company = self.context["request"].user.client
        instance = self.instance
        queryset = PaymentMethod.objects.filter(
            Q(created_by__isnull=True) | Q(created_by__client=user_company)
        )
        if instance:
            queryset = queryset.exclude(pk=instance.pk)

        if queryset.filter(name__iexact=name).exists():
            raise ValidationError("A payment method with this name already exists.")

        return attrs


class CashSaleLineItemSerializer(serializers.ModelSerializer):
    sales_item_name = serializers.CharField(source="sales_item.name", read_only=True)
    sales_item_code = serializers.CharField(
        source="sales_item.item_code", read_only=True
    )
    line_total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    line_total_with_tax = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = CashSaleLineItem
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_updated", "tax_amount")


class CashSaleSerializer(serializers.ModelSerializer):
    line_items = CashSaleLineItemSerializer(many=True)
    customer_name = serializers.CharField(
        source="customer.display_name", read_only=True
    )
    currency_code = serializers.CharField(
        source="currency.currency_code", read_only=True
    )
    cash_account_name = serializers.CharField(
        source="cash_account.account_name", read_only=True
    )
    sales_account_name = serializers.CharField(
        source="sales_account.account_name", read_only=True
    )
    is_fully_paid = serializers.BooleanField(read_only=True)
    balance_due = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )

    class Meta:
        model = CashSale
        fields = "__all__"
        read_only_fields = (
            "id",
            "date_created",
            "date_updated",
            "receipt_number",
            "posted_date",
            "subtotal",
            "tax_total",
            "total_amount",
            "change_given",
            "journal_entry",
            "is_posted",
        )

    def validate(self, data):
        # Validate amount tendered is sufficient
        if data.get("amount_tendered") and data.get("total_amount"):
            if data["amount_tendered"] < data["total_amount"]:
                raise serializers.ValidationError(
                    "Amount tendered is less than total amount"
                )

        # Validate line items exist
        line_items = data.get("line_items", [])
        if not line_items:
            raise serializers.ValidationError(
                "Cash sale must have at least one line item"
            )

        return data

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])

        with transaction.atomic():
            cash_sale = CashSale.objects.create(**validated_data)

            for line_item_data in line_items_data:
                CashSaleLineItem.objects.create(cash_sale=cash_sale, **line_item_data)

            cash_sale.update_totals()

        return cash_sale

    def update(self, instance, validated_data):
        line_items_data = validated_data.pop("line_items", None)

        with transaction.atomic():
            # Update cash sale fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if line_items_data is not None:
                # Update line items
                instance.line_items.all().delete()
                for line_item_data in line_items_data:
                    CashSaleLineItem.objects.create(
                        cash_sale=instance, **line_item_data
                    )

                instance.update_totals()

        return instance


class CashSalePostSerializer(serializers.Serializer):
    """Serializer for posting cash sales to ledger"""

    post = serializers.BooleanField(default=True)

    def validate(self, data):
        cash_sale = self.context["cash_sale"]
        if cash_sale.journal_entry:
            raise serializers.ValidationError("Cash sale already posted to ledger")
        return data


class QuickCashSaleSerializer(serializers.Serializer):
    """Simplified serializer for quick cash sales"""

    customer_display_name = serializers.CharField(max_length=255)
    line_items = serializers.ListField(child=serializers.DictField(), min_length=1)
    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHODS, default="cash"
    )
    amount_tendered = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01")
    )
    discount_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
        min_value=Decimal("0.00"),
        max_value=Decimal("100.00"),
    )
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_line_items(self, value):
        for item in value:
            if "sales_item" not in item or "quantity" not in item:
                raise serializers.ValidationError(
                    "Each line item must have sales_item and quantity"
                )
        return value
