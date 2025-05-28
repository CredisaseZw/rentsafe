from rest_framework import serializers
from accounting.models import *
from decimal import Decimal
from rentsafe.models import CompanyProfile

class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        try:
            read_only_fields = ['user', 'date_created', 'date_updated']  # Prevent user from setting them
        except AttributeError:
            read_only_fields = []

class SalesCategorySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesCategory
        fields = ['id', 'name', 'code', 'date_created']
class VATSettingSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = VATSetting
        fields = ['id', 'rate', 'description']


class SalesAccountSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesAccount
        fields = ['id', 'account_name', 'account_number']

class CurrencySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Currency
        fields = ['id', 'currency_code', 'currency_name']

        
class ItemSerializer(serializers.ModelSerializer):
    # Read-only nested representations
    category_object = SalesCategorySerializer(source='category', read_only=True)
    currency_object = CurrencySerializer(source='unit_price_currency', read_only=True)
    tax_configuration_object = VATSettingSerializer(source='tax_configuration', read_only=True)
    sales_account_object = SalesAccountSerializer(source='sales_account', read_only=True)

    # Write-only inputs
    category = serializers.PrimaryKeyRelatedField(queryset=SalesCategory.objects.all(), write_only=True)
    unit_price_currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all(), write_only=True, allow_null=True, required=False)
    tax_configuration = serializers.PrimaryKeyRelatedField(queryset=VATSetting.objects.all(), write_only=True)
    sales_account = serializers.PrimaryKeyRelatedField(queryset=SalesAccount.objects.all(), write_only=True)

    class Meta:
        model = SalesItem
        fields = [
            'id',
            'item_id',
            'name',
            'price',
            'unit_name',
            'category',
            'category_object',
            'unit_price_currency',
            'currency_object',
            'tax_configuration',
            'tax_configuration_object',
            'sales_account',
            'sales_account_object',
            'date_created',
        ]
        read_only_fields = ['user', 'date_created', 'date_updated']

    def get_currency_name_or_code(self, obj):
        if obj.unit_price_currency:
            return obj.unit_price_currency.currency_code
        return 'N/A'



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
class IndividualCustomerSerializer(BaseCompanySerializer):
    vat_number = serializers.CharField(required=False)
    tin_number = serializers.CharField(required=False)
    full_name = serializers.SerializerMethodField()
    class Meta(BaseCompanySerializer.Meta):
        model = Individual
        fields = ['id','full_name','identification_number','email', 'mobile', 'vat_number', 'tin_number','address']
    def get_full_name(self, obj):
        return f"{obj.firstname} {obj.surname}" if obj.firstname and obj.surname else "N/A"

class CompanyCustomerSerializer(BaseCompanySerializer):
    email = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    identification_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    vat_number = serializers.SerializerMethodField()
    mobile = serializers.SerializerMethodField()
    class Meta(BaseCompanySerializer.Meta):
        model = Company
        fields = ['id', 'full_name', 'identification_number', 'vat_number', 'email', 'mobile', 'address']
    def get_full_name(self, obj):
        return obj.registration_name
    def get_email(self, obj):
        new_ob = CompanyProfile.objects.filter(company=obj).first()
        return new_ob.email if new_ob else "N/A"
    def get_address(self, obj):
        new_ob = CompanyProfile.objects.filter(company=obj).first()
        return new_ob.current_address if new_ob else "N/A"
    def get_identification_number(self, obj):
        return obj.registration_number or "N/A"
    def get_vat_number(self, obj):
        new_ob = CompanyProfile.objects.filter(company=obj).first()
        return new_ob.vat_number if new_ob else "N/A"
    def get_mobile(self, obj):
        new_ob = CompanyProfile.objects.filter(company=obj).first()
        return new_ob.landline_phone if new_ob else "N/A"
class JournalEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = JournalEntry

class LedgerTransactionSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = LedgerTransaction
   
class AccountSectorSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = AccountSector
        fields = ['id', 'name', 'code']

class SalesItemSerializer(BaseCompanySerializer):
    unit_price_currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='unit_price_currency',
        write_only=True
    )

    class Meta(BaseCompanySerializer.Meta):
        model = SalesItem
        fields = [
            'id', 'item_id', 'name', 'price', 'unit_name',
            'unit_price_currency', 'currency_id', 'tax_configuration',
            'sales_account', 'category'
        ]
        extra_kwargs = {
            'tax_configuration': {'write_only': True},
            'sales_account': {'write_only': True},
            'category': {'write_only': True}
        }

class InvoiceItemSerializer(serializers.ModelSerializer):
    sales_item = SalesItemSerializer(read_only=True)
    sales_item_id = serializers.PrimaryKeyRelatedField(
        queryset=SalesItem.objects.all(),
        source='sales_item',
        write_only=True
    )
    qty = serializers.DecimalField(source='quantity', max_digits=10, decimal_places=2)
    price = serializers.DecimalField(source='unit_price', max_digits=10, decimal_places=2)

    class Meta:
        model = InvoiceItem
        fields = [
            'sales_item', 'sales_item_id', 'qty', 'price',
            'vat_amount', 'total_price'
        ]
        read_only_fields = ['vat_amount', 'total_price']
class InvoiceSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    invoice_type = serializers.ChoiceField(choices=Invoice.INVOICE_TYPE_CHOICES)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )
    items = InvoiceItemSerializer(many=True, required=False)
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)

    class Meta(BaseCompanySerializer.Meta):
        model = Invoice
        fields = ["id", "document_number", "invoice_type", "currency",
                  "currency_id", "items", "discount", "date_created",
                  "status", "total_excluding_vat", "vat_total",
                  "total_inclusive","customer_details","customer_id","is_individual"]
        read_only_fields = [
            'document_number', 'user', 'date_created', 'status',
            'total_excluding_vat', 'vat_total', 'total_inclusive',
            'individual', 'company'  # These will be set via customer_id
        ]

    def validate(self, data):
        user_company = self.context['request'].user.company
        
        # Validate customer
        customer_id = data.get('customer_id')
        is_individual = data.get('is_individual')
        
        if not customer_id:
            raise serializers.ValidationError("customer_id is required")
        try:
            if is_individual:
                customer = Individual.objects.get(id=customer_id)
                data['individual'] = customer
            else:
                customer = Company.objects.get(id=customer_id)
                data['company'] = customer
        except (Individual.DoesNotExist, Company.DoesNotExist):
            raise serializers.ValidationError("Customer not found")

        if data['invoice_type'] == 'fiscal':
            data['status'] = 'pending'

        # Validate items
        for item in data.get('items', []):
            sales_item = item.get('sales_item')
            if sales_item.user.company != user_company:
                raise serializers.ValidationError("Invalid sales item")

        data.pop('customer_id', None)
        data.pop('is_individual', None)
        return data
    def get_customer_details(self, obj):
        if obj.individual:
            return IndividualCustomerSerializer(obj.individual).data
        elif obj.company:
            return CompanyCustomerSerializer(obj.company).data
        return None

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data["discount"] = abs(validated_data.get("discount", Decimal('0')))
        invoice = Invoice.objects.create(**validated_data)

        # Calculate totals
        total_excl_vat = Decimal('0')
        total_vat = Decimal('0')
        
        for item_data in items_data:
            sales_item = item_data.pop('sales_item')
            vat_rate = sales_item.tax_configuration.rate / Decimal('100')
            
            quantity = Decimal(str(item_data['quantity']))
            unit_price = Decimal(str(item_data['unit_price']))
            
            item_vat = (unit_price * vat_rate).quantize(Decimal('0.00'))
            item_total = (unit_price * quantity * (1 + vat_rate)).quantize(Decimal('0.00'))

            InvoiceItem.objects.create(
                invoice=invoice,
                sales_item=sales_item,
                quantity=quantity,
                unit_price=unit_price,
                vat_amount=item_vat,
                total_price=item_total
            )
            
            total_excl_vat += unit_price * quantity
            total_vat += item_vat
        # Apply discount
        discount = validated_data.get('discount', Decimal('0'))
        total_excl_vat -= discount
        
        invoice.total_excluding_vat = total_excl_vat.quantize(Decimal('0.00'))
        invoice.vat_total = total_vat.quantize(Decimal('0.00'))
        invoice.total_inclusive = (total_excl_vat + total_vat).quantize(Decimal('0.00'))
        invoice.save()
        
        return invoice

class PaymentSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Payment
        fields = "__all__"

class CurrencyRateSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = CurrencyRate

class CashBookSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )

    class Meta(BaseCompanySerializer.Meta):
        model = CashBook
        fields= ['id', 'cashbook_id', 'cashbook_name', 'requisition_status','account_type', 'currency','currency_id', 'bank_account_number', 'branch_name', 'general_ledger_account']

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

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_name','payment_method_code']   

class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = ['transaction_type', 'description']