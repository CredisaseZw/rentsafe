from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline # For generic relations
from django.utils.html import format_html
from django.contrib.contenttypes.models import ContentType
from accounting.models.models import (
    AccountSector,
    SalesItem,
    SalesCategory,
    SalesAccount,
    CashSale,
    CashbookEntry,
    CurrencyRate,
    Currency,
    VATSetting,
    Invoice,
    CreditNote, 
    TransactionLineItem, 
    PaymentMethod,
    TransactionType,
    GeneralLedgerAccount,
)

admin.site.register(ContentType)
admin.site.site_header = "CountSafe Admin"
admin.site.site_title = "CountSafe Administration Portal"
admin.site.index_title = "Welcome to CountSafe Admin"

# --- Inlines for TransactionLineItem ---

class TransactionLineItemInline(GenericTabularInline):
    """
    Inline for TransactionLineItem to be used with Invoice, CashSale, and CreditNote.
    Allows managing line items directly from the parent document's admin page.
    """
    model = TransactionLineItem
    extra = 1 
    fields = ['sales_item', 'quantity', 'unit_price', 'vat_amount', 'total_price', 'user']
    readonly_fields = ['vat_amount', 'total_price'] # These are calculated in the model's save method
    raw_id_fields = ['sales_item', 'user'] # Use raw_id_fields for better performance with many items/users


# --- Admin Registrations ---

@admin.register(SalesItem)
class SalesItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "item_id", "price", "unit_price_currency", "category", "tax_configuration", "sales_account", "user")
    list_display_links = ("name", "item_id")
    search_fields = ("name", "item_id", "category__name", "sales_account__account_name")
    list_filter = ("category", "tax_configuration", "sales_account", "unit_price_currency")
    ordering = ("name",)
    raw_id_fields = ('category', 'unit_price_currency', 'tax_configuration', 'sales_account', 'user') 
    list_per_page = 25 

    fieldsets = (
        (None, {
            'fields': ('item_id', 'name', 'price', 'unit_name')
        }),
        ('Categorization & Accounting', {
            'fields': ('category', 'sales_account', 'tax_configuration')
        }),
        ('Pricing & Currency', {
            'fields': ('unit_price_currency',)
        }),
        ('System Info', {
            'fields': ('user',),
            'classes': ('collapse',)
        }),
    )

@admin.register(SalesCategory)
class SalesCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code", "user")
    list_display_links = ("name",)
    search_fields = ("name", "code")
    ordering = ("name",)
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(SalesAccount)
class SalesAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "account_name", "account_number", "account_sector", "user")
    list_display_links = ("account_name",)
    search_fields = ("account_name", "account_number", "account_sector__name")
    list_filter = ("account_sector",)
    ordering = ("account_name",)
    raw_id_fields = ('account_sector', 'user')
    list_per_page = 25

@admin.register(VATSetting)
class VATSettingAdmin(admin.ModelAdmin):
    list_display = ("id", "rate", "description", "vat_applicable", "user")
    list_display_links = ("description",)
    search_fields = ("description",)
    list_filter = ("vat_applicable", "rate")
    ordering = ("rate",)
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(CashSale)
class CashSaleAdmin(admin.ModelAdmin):
    list_display = ("id", "sale_date", "total_amount", "user")
    list_display_links = ("id",)
    search_fields = ("user__username",)
    list_filter = ("sale_date",)
    ordering = ("-sale_date",)
    inlines = [TransactionLineItemInline] # Add inline for line items
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(CashbookEntry)
class CashbookEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "transaction_date", "transaction_type", "amount", "description", "user")
    list_display_links = ("id", "transaction_date")
    search_fields = ("transaction_date__icontains", "transaction_type__transaction_type", "description")
    list_filter = ("transaction_type", "transaction_date")
    ordering = ("-transaction_date",)
    raw_id_fields = ('user', 'transaction_type')
    list_per_page = 25

@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin): # Corrected class name
    list_display = ("id", "user", "base_currency", "currency", "current_rate", "date_updated")
    list_display_links = ("id", "user")
    search_fields = ("user__username", "base_currency__currency_code", "currency__currency_code")
    list_filter = ("base_currency", "currency")
    ordering = ("-date_created",)
    raw_id_fields = ('user', 'base_currency', 'currency')
    list_per_page = 25

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin): # Corrected class name
    list_display = ("id", "currency_name", "currency_code", "user")
    list_display_links = ("currency_name",)
    search_fields = ('currency_code', 'currency_name')
    ordering = ("currency_code",)
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "document_number", "invoice_type", "status", "sale_date",
                    "customer_display", "total_inclusive", "currency", "is_recurring", "user")
    list_display_links = ("document_number",)
    search_fields = ("document_number", "individual__firstname", "individual__surname", "company__name", "reference_number")
    list_filter = ("invoice_type", "status", "sale_date", "is_individual", "currency", "is_recurring")
    ordering = ("-sale_date", "document_number")
    inlines = [TransactionLineItemInline] # Add inline for line items
    raw_id_fields = ('user', 'individual', 'company', 'lease', 'currency', 'original_invoice')
    list_per_page = 25

    fieldsets = (
        (None, {
            'fields': ('invoice_type', 'document_number', 'status', 'sale_date', 'reference_number')
        }),
        ('Customer Details', {
            'fields': ('is_individual', 'individual', 'company', 'lease'),
            'description': 'Select either an individual or a company customer.'
        }),
        ('Financials', {
            'fields': ('currency', 'discount', 'total_excluding_vat', 'vat_total', 'total_inclusive')
        }),
        ('Recurring Invoice Settings', {
            'fields': ('is_recurring', 'frequency', 'next_invoice_date', 'original_invoice'),
            'classes': ('collapse',)
        }),
        ('System Info', {
            'fields': ('user',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('document_number', 'total_excluding_vat', 'vat_total', 'total_inclusive')

    def customer_display(self, obj):
        if obj.is_individual and obj.individual:
            return f"{obj.individual.firstname} {obj.individual.surname}"
        elif not obj.is_individual and obj.company:
            return obj.company.name
        return "N/A"
    customer_display.short_description = "Customer"

@admin.register(CreditNote) # New: Register CreditNote
class CreditNoteAdmin(admin.ModelAdmin):
    list_display = ("id", "document_number", "credit_date", "total_amount", "customer_display", "currency", "user")
    list_display_links = ("document_number",)
    search_fields = ("document_number", "individual__firstname", "individual__surname", "company__name")
    list_filter = ("credit_date", "is_individual", "currency")
    ordering = ("-credit_date", "document_number")
    inlines = [TransactionLineItemInline] # Add inline for line items
    raw_id_fields = ('user', 'individual', 'company', 'currency')
    list_per_page = 25

    fieldsets = (
        (None, {
            'fields': ('document_number', 'credit_date', 'description')
        }),
        ('Customer Details', {
            'fields': ('is_individual', 'individual', 'company'),
            'description': 'Select either an individual or a company customer.'
        }),
        ('Financials', {
            'fields': ('currency', 'total_amount')
        }),
        ('System Info', {
            'fields': ('user',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('document_number', 'total_amount')

    def customer_display(self, obj):
        if obj.is_individual and obj.individual:
            return f"{obj.individual.firstname} {obj.individual.surname}"
        elif not obj.is_individual and obj.company:
            return obj.company.name
        return "N/A"
    customer_display.short_description = "Customer"


@admin.register(TransactionLineItem) # New: Register TransactionLineItem directly
class TransactionLineItemAdmin(admin.ModelAdmin):
    list_display = ("id", "parent_document_link", "sales_item", "quantity", "unit_price", "vat_amount", "total_price", "user")
    list_display_links = ("id",)
    search_fields = ("sales_item__name", "object_id")
    list_filter = ("sales_item", "content_type")
    ordering = ("-id",)
    raw_id_fields = ('sales_item', 'user')
    list_per_page = 25

    def parent_document_link(self, obj):
        """Creates a link to the parent document in the admin."""
        if obj.parent_document:
            content_type = obj.content_type
            app_label = content_type.app_label
            model_name = content_type.model
            url = f"/admin/{app_label}/{model_name}/{obj.object_id}/change/"
            return format_html('<a href="{}">{} {}</a>', url, content_type.model.replace('_', ' ').title(), obj.object_id)
        return "N/A"
    parent_document_link.short_description = "Parent Document"


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("id", "payment_method_name", "payment_method_code", "user")
    list_display_links = ("payment_method_name",)
    search_fields = ("payment_method_name", "payment_method_code")
    ordering = ("payment_method_name",)
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin): # Corrected class name
    list_display = ("id", "transaction_type", "description", "user")
    search_fields = ("transaction_type", "description")
    ordering = ("transaction_type",)
    raw_id_fields = ('user',)
    list_per_page = 25


@admin.register(AccountSector)
class AccountSectorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code", "user")
    list_display_links = ("name",)
    search_fields = ("name", "code")
    ordering = ("code",)
    raw_id_fields = ('user',)
    list_per_page = 25

@admin.register(GeneralLedgerAccount)
class GeneralLedgerAccountAdmin(admin.ModelAdmin): # Corrected class name
    list_display = ("id", "account_name", "account_number", "account_sector_code", "account_sector_name", "user")
    list_display_links = ("account_name",)
    search_fields = ("account_name", "account_number")
    list_filter = ("account_sector__code", "account_sector__name")
    ordering = ("account_number",)
    raw_id_fields = ('account_sector', 'user')
    list_per_page = 25

    def account_sector_code(self, obj):
        return obj.account_sector.code if obj.account_sector else None
    account_sector_code.short_description = "Sector Code"
    account_sector_code.admin_order_field = "account_sector__code" # Allows sorting by this field

    def account_sector_name(self, obj):
        return obj.account_sector.name if obj.account_sector else None
    account_sector_name.short_description = "Sector Name"
    account_sector_name.admin_order_field = "account_sector__name" # Allows sorting by this field
