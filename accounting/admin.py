from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *
# from simple_history.admin import SimpleHistoryAdmin


@admin.register(Item)
class ProductServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price",)
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("name",)
    ordering = ("name",)

@admin.register(ProductService)
class ProductServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "vat_applicable")
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("vat_applicable",)
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
    list_display = ("user", "id", "transaction_date", "transaction_type", "amount")
    list_display_links = ("transaction_date",)
    search_fields = ("transaction_date",)
    list_filter = ("transaction_type",)
    ordering = ("-transaction_date",)