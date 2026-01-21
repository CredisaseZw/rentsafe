"""Serializers for Trust Accounting API."""

from rest_framework import serializers
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from decimal import Decimal

from apps.accounting.api.serializers.standard_serializers import AccountTypeSerializer
from apps.trust_accounting.models.models import (
    TrustInvoice,
    TrustInvoiceLineItem,
)

from apps.accounting.models.models import (
    AccountType,
    Currency,
    GeneralLedgerAccount,
    PaymentMethod,
)
from apps.trust_accounting.models.models import PropertyExpense, TrustGeneralLedger
from apps.trust_accounting.models.models import PropertyExpense


class TrustGeneralLedgerSerializer(serializers.ModelSerializer):
    """Serializer for Trust General Ledger Accounts"""

    account_type = AccountTypeSerializer(read_only=True)
    account_type_id = serializers.PrimaryKeyRelatedField(
        queryset=AccountType.objects.all(), source="account_type"
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


class PropertyExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Property Expense Accounts"""

    expense_account_name = serializers.CharField(
        source="expense_account.account_name", read_only=True
    )
    expense_account_number = serializers.CharField(
        source="expense_account.account_number", read_only=True
    )

    class Meta:
        model = PropertyExpense
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

        if PropertyExpense.objects.filter(
            expense=expense, expense_account=expense_account
        ).exists():
            raise serializers.ValidationError(
                "This expense account is already linked to the specified expense."
            )
        return data


# ==================== TRUST INVOICE SERIALIZERS ====================


class TrustInvoiceLineItemSerializer(serializers.ModelSerializer):
    """Serializer for Trust Invoice Line Items"""

    trust_gl_account_name = serializers.CharField(
        source="trust_gl_account.account_name", read_only=True
    )
    trust_gl_account_number = serializers.CharField(
        source="trust_gl_account.account_number", read_only=True
    )

    class Meta:
        model = TrustInvoiceLineItem
        fields = [
            "id",
            "trust_gl_account",
            "trust_gl_account_name",
            "trust_gl_account_number",
            "description",
            "quantity",
            "unit_price",
            "line_total",
            "tax_rate",
            "tax_amount",
            "property_reference",
            "period_from",
            "period_to",
            "date_created",
            "date_updated",
        ]
        read_only_fields = ["line_total", "tax_amount", "date_created", "date_updated"]


class TrustInvoiceLineItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Trust Invoice Line Items"""

    class Meta:
        model = TrustInvoiceLineItem
        fields = [
            "trust_gl_account",
            "description",
            "quantity",
            "unit_price",
            "tax_rate",
            "property_reference",
            "period_from",
            "period_to",
        ]


class TrustInvoiceSerializer(serializers.ModelSerializer):
    """Full serializer for Trust Invoices"""

    beneficiary_name = serializers.CharField(
        source="beneficiary.display_name", read_only=True
    )
    beneficiary_code = serializers.CharField(
        source="beneficiary.beneficiary_code", read_only=True
    )
    trust_bank_account_name = serializers.CharField(
        source="trust_bank_account.account_name", read_only=True
    )
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
        fields = [
            "id",
            "invoice_number",
            "invoice_type",
            "invoice_type_display",
            "status",
            "status_display",
            "beneficiary",
            "beneficiary_name",
            "beneficiary_code",
            "trust_bank_account",
            "trust_bank_account_name",
            "property_reference",
            "invoice_date",
            "due_date",
            "posted_date",
            "period_from",
            "period_to",
            "currency",
            "currency_code",
            "currency_symbol",
            "exchange_rate",
            "discount_amount",
            "discount_percentage",
            "subtotal",
            "tax_total",
            "total_amount",
            "amount_paid",
            "balance_due",
            "is_overdue",
            "journal_entry",
            "trust_transaction",
            "terms",
            "notes",
            "reference",
            "approved_by",
            "approved_by_name",
            "approved_date",
            "line_items",
            "date_created",
            "date_updated",
        ]
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

    beneficiary_name = serializers.CharField(
        source="beneficiary.display_name", read_only=True
    )
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
            "invoice_type",
            "invoice_type_display",
            "status",
            "status_display",
            "beneficiary_name",
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
            "beneficiary",
            "trust_bank_account",
            "property_reference",
            "invoice_date",
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
