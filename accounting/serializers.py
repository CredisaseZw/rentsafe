from rest_framework import serializers
from .models import *

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
    sales_account = serializers.PrimaryKeyRelatedField(queryset=SalesAccount.objects.all())

    class Meta(BaseCompanySerializer.Meta):
        model = Item

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
    class Meta(BaseCompanySerializer.Meta):
        model = GeneralLedgerAccount

class JournalEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = JournalEntry

class LedgerTransactionSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = LedgerTransaction
