from django.contrib import admin
# Register your models here.
from accounting.models import (
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
    InvoiceItem,
    PaymentMethod,
    TransactionType,
    GeneralLedgerAccount
)
# from simple_history.admin import SimpleHistoryAdmin


@admin.register(SalesItem)
class ProductServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price",)
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("name",)
    ordering = ("name",)

@admin.register(SalesCategory)
class SalesCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(SalesAccount)
class SalesAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "account_name")
    list_display_links = ("account_name",)
    search_fields = ("account_name",)
    ordering = ("account_name",)
    
@admin.register(VATSetting)
class VATSettingAdmin(admin.ModelAdmin):
    list_display = ("id", "rate", "description")
    list_display_links = ("rate",)
    search_fields = ("rate",)
    ordering = ("rate",)
@admin.register(CashSale)
class CashSaleAdmin(admin.ModelAdmin):
    list_display = ("user", "id", "sale_date", "total_amount")
    list_display_links = ("user",)
    search_fields = ("user",)
    list_filter = ("sale_date",)
    ordering = ("-sale_date",)
    
@admin.register(CashbookEntry)
class CashbookEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "id", "payment_reference", "type", "total_including_vat","vat","matching_invoice","rate" )
    list_display_links = ("payment_reference",)
    search_fields = ("payment_reference",)
    list_filter = ("type",)
    ordering = ("-payment_reference",)

@admin.register(CurrencyRate)
class CurrencyRate(admin.ModelAdmin):
    list_display = ("user", "currency", "date_created", "current_rate", "base_currency" )
    list_display_links = ("user",)
    search_fields = ("user",)
    list_filter = ("currency",)
    ordering = ("-updated_at",)

@admin.register(Currency)
class Currency(admin.ModelAdmin):
    list_display=("currency_name","currency_code")
    list_display_links = ("currency_name",)
    search_fields = ('currency_code',)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("user", "id", "document_number", "is_individual", "sale_date")
    list_display_links = ("document_number",)
    search_fields = ("document_number", "is_individual", "user__username")
    list_filter = ("sale_date", "is_individual")
    ordering = ("-sale_date",)

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ("invoice", "id", "sales_item", "quantity", "unit_price", "total_price")
    list_display_links = ("id",)
    search_fields = ("invoice__invoice_number", )
    list_filter = ("sales_item",)
    ordering = ("-invoice",)

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("payment_method_name", "payment_method_code")
    list_display_links = ("payment_method_name",)
    search_fields = ("payment_method_name",)
    ordering = ("payment_method_name",)

@admin.register(TransactionType)
class TransactionTypeadmin(admin.ModelAdmin):
    list_display = ("transaction_type", "description")
    search_fields = ("transaction_type",)
    ordering = ("id",)

@admin.register(AccountSector)
class AccountSectorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code")
    list_display_links = ("name",)
    search_fields = ("name", "code")
    ordering = ("code",)

@admin.register(GeneralLedgerAccount)
class GeneralLedgerAdmin(admin.ModelAdmin):
    list_display = ("id","account_name", "account_number", "account_sector_code", "account_sector_name" )
    list_display_links = ("account_name",)
    search_fields = ("account_name",)
    list_filter = ("account_sector__code",)
    ordering = ("account_number",)

    def account_sector_code(self, obj):
        return obj.account_sector.code if obj.account_sector else None
    account_sector_code.short_description = "Sector Code"

    def account_sector_name(self, obj):
        return obj.account_sector.name if obj.account_sector else None
    account_sector_name.short_description = "Sector Name"