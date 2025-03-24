from rest_framework import serializers
from accounting.models import *

class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        read_only_fields = ['company', 'user']  # Prevent user from setting them

class ProductServiceSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = ProductService
        
class ItemSerializer(BaseCompanySerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=SalesCategory.objects.all())
    tax_configuration = serializers.PrimaryKeyRelatedField(queryset=VATSetting.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True) 
    # sales_account = serializers.PrimaryKeyRelatedField(queryset=SalesAccount.objects.all())

    class Meta(BaseCompanySerializer.Meta):
        model = Item
        
class VATSettingSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = VATSetting

class SalesCategorySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesCategory

class SalesAccountSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesAccount

class CashSaleSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = CashSale

class CashbookEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = CashbookEntry

class GeneralLedgerAccountSerializer(BaseCompanySerializer):
    acount_sector = serializers.PrimaryKeyRelatedField(queryset=AccountSector.objects.all())
    
    class Meta(BaseCompanySerializer.Meta):
        model = GeneralLedgerAccount

class JournalEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = JournalEntry

class LedgerTransactionSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = LedgerTransaction
    
    
class AccountSectorSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = AccountSector
        
class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = "__all__"

    def create(self, validated_data):
        """Handles creating invoice and associated items."""
        items_data = validated_data.pop("items", [])
        invoice = Invoice.objects.create(**validated_data)

        for item in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item)

        return invoice


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

class RecurringInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringInvoice
        fields = "__all__"

class ProformaInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaInvoice
        fields = "__all__"