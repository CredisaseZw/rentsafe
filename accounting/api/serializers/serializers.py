from rest_framework import serializers
from accounting.models.models import *
from decimal import Decimal, ROUND_HALF_UP 
from rentsafe.models import CompanyProfile, Individual, Company 

class BaseCompanySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        read_only_fields = ['user', 'date_created', 'date_updated']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().update(instance, validated_data)


class SalesCategorySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesCategory
        fields = ['id', 'name', 'code', 'date_created']

class VATSettingSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = VATSetting
        fields = ['id', 'rate', 'description', 'vat_applicable']


class SalesAccountSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = SalesAccount
        fields = ['id', 'account_name', 'account_number', 'account_sector', 'account_sector_details']
        extra_kwargs = {
            'account_sector': {'write_only': True} 
        }
    account_sector_details = serializers.SerializerMethodField()

    def get_account_sector_details(self, obj):
        return {'id': obj.account_sector.id, 'name': obj.account_sector.name} if obj.account_sector else None


class CurrencySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Currency
        fields = ['id', 'currency_code', 'currency_name']


class SalesItemSerializer(BaseCompanySerializer):
    category_object = SalesCategorySerializer(source='category', read_only=True)
    currency_object = CurrencySerializer(source='unit_price_currency', read_only=True)
    tax_configuration_object = VATSettingSerializer(source='tax_configuration', read_only=True)
    sales_account_object = SalesAccountSerializer(source='sales_account', read_only=True)

    category = serializers.PrimaryKeyRelatedField(queryset=SalesCategory.objects.all(), write_only=True)
    unit_price_currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all(), write_only=True, allow_null=True, required=False)
    tax_configuration = serializers.PrimaryKeyRelatedField(queryset=VATSetting.objects.all(), write_only=True)
    sales_account = serializers.PrimaryKeyRelatedField(queryset=SalesAccount.objects.all(), write_only=True)

    class Meta(BaseCompanySerializer.Meta):
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

class CashbookEntrySerializer(BaseCompanySerializer):
    transaction_type_details = serializers.SerializerMethodField()
    transaction_type = serializers.PrimaryKeyRelatedField(
        queryset=TransactionType.objects.all(),
        write_only=True,
        allow_null=True,
        required=False
    )
    class Meta(BaseCompanySerializer.Meta):
        model = CashbookEntry
        fields = ['id', 'transaction_date', 'transaction_type', 'transaction_type_details', 'amount', 'description']

    def get_transaction_type_details(self, obj):
        return {'id': obj.transaction_type.id, 'transaction_type': obj.transaction_type.transaction_type} if obj.transaction_type else None


class AccountSectorSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = AccountSector
        fields = ['id', 'code', 'name']

class GeneralLedgerAccountSerializer(BaseCompanySerializer):
    account_sector = AccountSectorSerializer(read_only=True)
    account_sector_id = serializers.PrimaryKeyRelatedField(
        queryset=AccountSector.objects.all(),
        source='account_sector',
        write_only=True
    )
    class Meta(BaseCompanySerializer.Meta):
        model = GeneralLedgerAccount
        fields = ['id', 'account_name', 'account_number', 'account_sector','account_sector_id', 'date_created']

class IndividualCustomerSerializer(serializers.ModelSerializer):
    vat_number = serializers.CharField(required=False, allow_blank=True)
    tin_number = serializers.CharField(required=False, allow_blank=True)
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = Individual
        fields = ['id','full_name','identification_number','email', 'mobile', 'vat_number', 'tin_number','address']
        read_only_fields = ['id']
    def get_full_name(self, obj):
        return f"{obj.firstname} {obj.surname}" if obj.firstname and obj.surname else "N/A"

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
        model = Company
        fields = ['id', 'full_name', 'identification_number', 'vat_number', 'email', 'mobile', 'address','tin_number']
        read_only_fields = ['id'] 
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
    def get_tin_number(self, obj):
        return obj.tin_number or "N/A"

class JournalEntrySerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = JournalEntry

class LedgerTransactionSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = LedgerTransaction


class TransactionLineItemSerializer(serializers.ModelSerializer):
    sales_item = SalesItemSerializer(read_only=True)
    sales_item_id = serializers.PrimaryKeyRelatedField(
        queryset=SalesItem.objects.all(),
        source='sales_item',
        write_only=True
    )
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = TransactionLineItem
        fields = [
            'sales_item', 'sales_item_id', 'quantity', 'unit_price',
            'vat_amount', 'total_price', 'date_created', 'date_updated' 
        ]
        read_only_fields = ['vat_amount', 'total_price', 'date_created', 'date_updated'] 


class InvoiceSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    invoice_type = serializers.ChoiceField(choices=Invoice.INVOICE_TYPE_CHOICES)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )
    items = TransactionLineItemSerializer(many=True, required=False)
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)

    class Meta(BaseCompanySerializer.Meta):
        model = Invoice
        fields = ["id", "document_number", "invoice_type", "currency",
                "currency_id", "items", "discount", "date_created",
                "status", "total_excluding_vat", "vat_total",
                "total_inclusive","customer_details","customer_id","is_individual",
                "lease", "reference_number", "is_recurring", "frequency",
                "next_invoice_date", "original_invoice"
                ]
        read_only_fields = [
            'document_number', 'user', 'date_created', 'status',
            'total_excluding_vat', 'vat_total', 'total_inclusive',
            'individual', 'company', 
            'original_invoice' 
        ]
        extra_kwargs = {
            'lease': {'required': False, 'allow_null': True},
            'original_invoice': {'required': False, 'allow_null': True},
            'frequency': {'required': False, 'allow_null': True},
            'next_invoice_date': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        request_user = self.context['request'].user
        user_company = request_user.company

        # Validate customer relationship
        customer_id = data.get('customer_id')
        is_individual = data.get('is_individual')

        if not customer_id:
            raise serializers.ValidationError({"customer_id": "Customer ID is required."})

        if is_individual is None:
            raise serializers.ValidationError({"is_individual": "Specify if customer is an individual or company."})

        try:
            if is_individual:
                customer = Individual.objects.get(id=customer_id)
                data['individual'] = customer
                data['company'] = None # Ensure company is null if individual is set
            else:
                customer = Company.objects.get(id=customer_id)
                data['company'] = customer
                data['individual'] = None
        except (Individual.DoesNotExist, Company.DoesNotExist) as e:
            raise serializers.ValidationError(
                {"customer_id": "Customer not found."}
            ) from e

        total_excl_vat = Decimal('0')
        total_vat = Decimal('0')
        items_data = data.get('items', [])
        for item_data in items_data:
            sales_item = item_data.get('sales_item')
            if not sales_item:
                raise serializers.ValidationError("Invalid sales item provided in line items.")

            if hasattr(sales_item, 'user') and sales_item.user and sales_item.user.company != user_company:
                raise serializers.ValidationError({"items": "One or more sales items do not belong to your company."})


            vat_setting = sales_item.tax_configuration
            vat_rate = vat_setting.rate / Decimal('100') if vat_setting and vat_setting.vat_applicable else Decimal('0')

            quantity = item_data.get('quantity')
            unit_price = item_data.get('unit_price')

            if quantity is None or unit_price is None:
                raise serializers.ValidationError({"items": "Quantity and unit price are required for all line items."})

            item_total_excl_vat = (quantity * unit_price).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
            item_vat_amount = (item_total_excl_vat * vat_rate).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            item_data['calculated_vat_amount'] = item_vat_amount
            item_data['calculated_total_price'] = (item_total_excl_vat + item_vat_amount).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            total_excl_vat += item_total_excl_vat
            total_vat += item_vat_amount

        discount = data.get('discount', Decimal('0.00'))
        total_excl_vat = (total_excl_vat - discount).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        total_inclusive = (total_excl_vat + total_vat).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

        data['total_excluding_vat'] = total_excl_vat
        data['vat_total'] = total_vat
        data['total_inclusive'] = total_inclusive

        data.pop('customer_id', None)
        data.pop('is_individual', None)

        return data

    def get_customer_details(self, obj):
        if obj.individual:
            return IndividualCustomerSerializer(obj.individual).data
        elif obj.company:
            return CompanyCustomerSerializer(obj.company).data
        return None

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data["discount"] = abs(validated_data.get("discount", Decimal('0')))

        invoice = Invoice.objects.create(**validated_data)

        for item_data in items_data:
            calculated_vat_amount = item_data.pop('calculated_vat_amount')
            calculated_total_price = item_data.pop('calculated_total_price')

            TransactionLineItem.objects.create(
                parent_document=invoice,
                sales_item=item_data['sales_item'],
                user=invoice.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=calculated_vat_amount, 
                total_price=calculated_total_price 
            )
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        instance.discount = abs(validated_data.get("discount", instance.discount)) 

        # Handle customer updates
        if 'individual' in validated_data:
            instance.individual = validated_data.pop('individual')
        if 'company' in validated_data:
            instance.company = validated_data.pop('company')
        if 'is_individual' in validated_data:
            instance.is_individual = validated_data.pop('is_individual')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        instance.line_items.all().delete()
        for item_data in items_data:
            calculated_vat_amount = item_data.pop('calculated_vat_amount')
            calculated_total_price = item_data.pop('calculated_total_price')
            TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data['sales_item'],
                user=instance.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=calculated_vat_amount,
                total_price=calculated_total_price
            )

        # Recalculate totals on the invoice after line item updates
        total_excl_vat = Decimal('0')
        total_vat = Decimal('0')
        for item in instance.line_items.all():
            total_excl_vat += (item.quantity * item.unit_price)
            total_vat += item.vat_amount

        instance.total_excluding_vat = (total_excl_vat - instance.discount).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        instance.vat_total = total_vat.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        instance.total_inclusive = (instance.total_excluding_vat + instance.vat_total).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        instance.save() 

        return instance


class CashSaleSerializer(BaseCompanySerializer):
    items = TransactionLineItemSerializer(many=True, required=False)
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )

    class Meta(BaseCompanySerializer.Meta):
        model = CashSale
        fields = ['id', 'sale_date', 'total_amount', 'currency', 'currency_id', 'items']
        read_only_fields = ['sale_date', 'total_amount'] 

    def validate(self, data):
        total_amount = Decimal('0')
        items_data = data.get('items', [])
        request_user = self.context['request'].user
        user_company = request_user.company

        if not data.get('currency'):
            raise serializers.ValidationError({"currency_id": "Currency is required for Cash Sale."})

        for item_data in items_data:
            sales_item = item_data.get('sales_item') 

            if not sales_item:
                raise serializers.ValidationError("Invalid sales item provided in line items.")

            # Validate that the sales item belongs to the same company as the user
            if hasattr(sales_item, 'user') and sales_item.user and sales_item.user.company != user_company:
                raise serializers.ValidationError({"items": "One or more sales items do not belong to your company."})


            vat_setting = sales_item.tax_configuration
            vat_rate = vat_setting.rate / Decimal('100') if vat_setting and vat_setting.vat_applicable else Decimal('0')

            quantity = item_data.get('quantity')
            unit_price = item_data.get('unit_price')

            if quantity is None or unit_price is None:
                raise serializers.ValidationError({"items": "Quantity and unit price are required for all line items."})

            item_total_excl_vat = (quantity * unit_price).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
            item_vat_amount = (item_total_excl_vat * vat_rate).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            item_data['vat_amount'] = item_vat_amount 
            item_data['total_price'] = (item_total_excl_vat + item_vat_amount).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            total_amount += item_data['total_price']

        data['total_amount'] = total_amount.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])

        cash_sale = CashSale.objects.create(**validated_data)

        for item_data in items_data:
            TransactionLineItem.objects.create(
                parent_document=cash_sale,
                sales_item=item_data['sales_item'],
                user=cash_sale.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=item_data['vat_amount'],
                total_price=item_data['total_price']
            )
        return cash_sale

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])

        # Update CashSale fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create line items
        instance.line_items.all().delete() # Clear existing and recreate
        total_amount = Decimal('0')
        for item_data in items_data:
            line_item = TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data['sales_item'],
                user=instance.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=item_data['vat_amount'],
                total_price=item_data['total_price']
            )
            total_amount += line_item.total_price

        instance.total_amount = total_amount.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        instance.save()
        return instance


class CreditNoteSerializer(BaseCompanySerializer):
    items = TransactionLineItemSerializer(many=True, required=False)
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.IntegerField(write_only=True)
    is_individual = serializers.BooleanField(write_only=True)

    class Meta(BaseCompanySerializer.Meta):
        model = CreditNote
        fields = [
            'id', 'document_number', 'credit_date', 'total_amount',
            'description', 'currency', 'currency_id', 'items',
            'customer_details', 'customer_id', 'is_individual'
        ]
        read_only_fields = ['document_number', 'total_amount', 'credit_date']

    def validate(self, data):
        request_user = self.context['request'].user
        user_company = request_user.company

        # Validate customer relationship
        customer_id = data.get('customer_id')
        is_individual = data.get('is_individual')

        if not customer_id:
            raise serializers.ValidationError({"customer_id": "Customer ID is required."})

        if is_individual is None:
            raise serializers.ValidationError({"is_individual": "Specify if customer is an individual or company."})

        try:
            if is_individual:
                customer = Individual.objects.get(id=customer_id)
                data['individual'] = customer
                data['company'] = None
            else:
                customer = Company.objects.get(id=customer_id)
                data['company'] = customer
                data['individual'] = None
        except (Individual.DoesNotExist, Company.DoesNotExist) as e:
            raise serializers.ValidationError(
                {"customer_id": "Customer not found."}
            ) from e

        # Validate items and calculate preliminary total_amount for credit note
        total_amount = Decimal('0')
        items_data = data.get('items', [])
        for item_data in items_data:
            sales_item = item_data.get('sales_item')
    
            if not sales_item:
                raise serializers.ValidationError("Invalid sales item provided in line items.")

            if hasattr(sales_item, 'user') and sales_item.user and sales_item.user.company != user_company:
                raise serializers.ValidationError({"items": "One or more sales items do not belong to your company."})


            vat_setting = sales_item.tax_configuration
            vat_rate = vat_setting.rate / Decimal('100') if vat_setting and vat_setting.vat_applicable else Decimal('0')

            quantity = item_data.get('quantity')
            unit_price = item_data.get('unit_price')

            if quantity is None or unit_price is None:
                raise serializers.ValidationError({"items": "Quantity and unit price are required for all line items."})

            item_total_excl_vat = (quantity * unit_price).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
            item_vat_amount = (item_total_excl_vat * vat_rate).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            item_data['vat_amount'] = item_vat_amount
            item_data['total_price'] = (item_total_excl_vat + item_vat_amount).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

            total_amount += item_data['total_price']

        data['total_amount'] = total_amount.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

        data.pop('customer_id', None)
        data.pop('is_individual', None)

        return data

    def get_customer_details(self, obj):
        if obj.individual:
            return IndividualCustomerSerializer(obj.individual).data
        elif obj.company:
            return CompanyCustomerSerializer(obj.company).data
        return None

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        credit_note = CreditNote.objects.create(**validated_data)

        for item_data in items_data:
            TransactionLineItem.objects.create(
                parent_document=credit_note,
                sales_item=item_data['sales_item'],
                user=credit_note.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=item_data['vat_amount'],
                total_price=item_data['total_price']
            )
        return credit_note

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])

        if 'individual' in validated_data:
            instance.individual = validated_data.pop('individual')
        if 'company' in validated_data:
            instance.company = validated_data.pop('company')
        if 'is_individual' in validated_data:
            instance.is_individual = validated_data.pop('is_individual')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.line_items.all().delete() # Clear existing and recreate
        total_amount = Decimal('0')
        for item_data in items_data:
            line_item = TransactionLineItem.objects.create(
                parent_document=instance,
                sales_item=item_data['sales_item'],
                user=instance.user,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                vat_amount=item_data['vat_amount'],
                total_price=item_data['total_price']
            )
            total_amount += line_item.total_price

        instance.total_amount = total_amount.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        instance.save()
        return instance


class PaymentSerializer(BaseCompanySerializer):
    class Meta(BaseCompanySerializer.Meta):
        model = Payment
        fields = "__all__"

class CurrencyRateSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    base_currency = CurrencySerializer(read_only=True)
    class Meta(BaseCompanySerializer.Meta):
        model = CurrencyRate

class CashBookSerializer(BaseCompanySerializer):
    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        source='currency',
        write_only=True
    )
    general_ledger_account = GeneralLedgerAccountSerializer(read_only=True)
    general_ledger_account_id = serializers.PrimaryKeyRelatedField(
        queryset=GeneralLedgerAccount.objects.all(),
        source='general_ledger_account',
        write_only=True,
        required=True
    )

    class Meta(BaseCompanySerializer.Meta):
        model = CashBook
        fields= ['id', 'cashbook_id', 'cashbook_name', 'requisition_status','account_type', 'currency','currency_id', 'bank_account_number', 'branch_name', 'general_ledger_account', 'general_ledger_account_id']
        read_only_fields = ['cashbook_id']

    def validate(self, data):
        request = self.context.get('request')
        user_company = request.user.company

        general_ledger_account = data.get('general_ledger_account')
        if general_ledger_account and hasattr(general_ledger_account, 'user') and general_ledger_account.user and general_ledger_account.user.company != user_company:
            raise serializers.ValidationError({"general_ledger_account_id": "General ledger account does not belong to your company."})

        instance = getattr(self, 'instance', None)

        company_cashbook = CashBook.objects.filter(user__company=user_company)

        if instance:
            company_cashbook = company_cashbook.exclude(pk=instance.pk)

        if cashbook_data_exists := company_cashbook.filter(
            cashbook_name=data.get('cashbook_name'),
            currency=data.get('currency'),
            requisition_status=data.get('requisition_status'),
            account_type=data.get('account_type'),
            bank_account_number=data.get('bank_account_number'),
            branch_name=data.get('branch_name'),
            general_ledger_account=data.get('general_ledger_account'),
        ).exists():
            raise serializers.ValidationError("These details (name, currency, status, type, bank, branch, GL account) already exist in another cashbook for your company.")

        bank_account = data.get('bank_account_number')
        branch = data.get('branch_name')

        if bank_account and not branch:
            raise serializers.ValidationError({"branch_name": "This field is required if bank account number is provided."})

        return data

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_name','payment_method_code']

class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = ['transaction_type', 'description']

