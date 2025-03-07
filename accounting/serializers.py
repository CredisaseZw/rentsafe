from rest_framework import serializers
from .models import *

class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        read_only_fields = ['company', 'user']  # Prevent user from setting them

class ProductServiceSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = ProductService

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
