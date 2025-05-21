from rest_framework import serializers
from accounting.models import *

class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        try:
            read_only_fields = ['user', 'date_created']  # Prevent user from setting them
        except AttributeError:
            read_only_fields = []

class ProductServiceSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = ProductService
        
class ItemSerializer(BaseCompanySerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=SalesCategory.objects.all())
    unit_price_currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all())
    tax_configuration = serializers.PrimaryKeyRelatedField(queryset=VATSetting.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True)
    # sales_account = serializers.PrimaryKeyRelatedField(queryset=SalesAccount.objects.all())

    class Meta(BaseCompanySerializer.Meta):
        model = Item

    def create(self, validated_data):
        try:
            currency= Currency.objects.get(currency_code=validated_data['unit_price_currency'])
        except Currency.DoesNotExist:
            raise serializers.ValidationError("Currency does not exist.")
        validated_data['unit_price_currency'] = currency  
        return super().create(validated_data)
     
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
    account_sector = serializers.PrimaryKeyRelatedField(queryset=AccountSector.objects.all())
    
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
    
class InvoiceSerializer(BaseCompanySerializer):
    items = InvoiceItemSerializer(many=True, required=False)

    class Meta(BaseCompanySerializer.Meta):
        model = Invoice
        fields = "__all__"

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        invoice = Invoice.objects.create(**validated_data)
        for item in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item)
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                InvoiceItem.objects.create(invoice=instance, **item)
        return instance


class PaymentSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Payment
        fields = "__all__"



class PaymentSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Payment

class RecurringInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringInvoice
        fields = "__all__"

class ProformaInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaInvoice
        fields = "__all__"

class CurrencyRateSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = CurrencyRate

class CashBookSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = CashBook

    def validate(self, data):

        request = self.context.get('request')
        # company = request.user.company
        bank_account = data.get('bank_account_number')
        branch = data.get('branch_name')

        if bank_account and not branch:
            raise serializers.ValidationError({"branch_name": "This field is required if bank account number is provided."})

        company_cashbooks = CashBook.objects.filter(user__company = request.user.company)
        cashbook_data = company_cashbooks.filter(
            cashbook_name = data.get('cashbook_name'),
            currency = data.get('currency'),
            requisition_status = data.get('requisition_status'),
            account_type = data.get('account_type'),
            bank_account_number = data.get('bank_account_number'),
            branch_name = data.get('branch_name'),
            general_ledger_account = data.get('general_ledger_account'),
        )
        
        if cashbook_data.exists():
            raise serializers.ValidationError("These details already exist in another account.")
        
        return data

class CurrencySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Currency
