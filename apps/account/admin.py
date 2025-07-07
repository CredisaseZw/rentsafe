from django.contrib import admin

# Register your models here.
# accounting/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.admin import GenericTabularInline # For TransactionLineItem

# Import models from the accounting app
from accounting.models.models import (
    AccountSector, SalesAccount, Currency, SalesItem, SalesCategory, VATSetting,
    TransactionType, CashbookEntry, GeneralLedgerAccount, JournalEntry, LedgerTransaction,
    Invoice, CashSale, CreditNote, TransactionLineItem, PaymentMethod, Payment, CurrencyRate, CashBook
)
# Import related models for raw_id_fields
from leases.models.models import Lease # For Invoice
from individuals.models.models import Individual
from companies.models.models import Company

# --- Inlines for Invoice and CashSale ---

class TransactionLineItemInline(GenericTabularInline):
    model = TransactionLineItem
    extra = 1
    fields = ('sales_item', 'quantity', 'unit_price', 'vat_amount', 'total_price', 'user')
    readonly_fields = ('total_price', 'user', 'date_created', 'date_updated')
    raw_id_fields = ('sales_item',)
    classes = ('collapse',)

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 1
    fields = ('payment_date', 'amount', 'method', 'reference', 'user')
    raw_id_fields = ('method',)
    readonly_fields = ('user', 'date_created', 'date_updated')
    classes = ('collapse',)


# --- Admin for Accounting Models ---

@admin.register(AccountSector)
class AccountSectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'user_link', 'date_created')
    search_fields = ('name', 'code')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'

@admin.register(SalesAccount)
class SalesAccountAdmin(admin.ModelAdmin):
    list_display = ('account_name', 'account_number', 'account_sector', 'user_link', 'date_created')
    list_filter = ('account_sector',)
    search_fields = ('account_name', 'account_number')
    raw_id_fields = ('account_sector', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('currency_code', 'currency_name', 'user_link', 'date_created')
    search_fields = ('currency_code', 'currency_name')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(SalesItem)
class SalesItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'item_id', 'price', 'unit_price_currency', 'tax_configuration', 'sales_account', 'user_link')
    list_filter = ('category', 'tax_configuration', 'sales_account', 'unit_price_currency')
    search_fields = ('name', 'item_id')
    raw_id_fields = ('category', 'unit_price_currency', 'tax_configuration', 'sales_account', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(SalesCategory)
class SalesCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'user_link', 'date_created')
    search_fields = ('name', 'code')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(VATSetting)
class VATSettingAdmin(admin.ModelAdmin):
    list_display = ('rate', 'description', 'vat_applicable', 'user_link', 'date_created')
    list_filter = ('vat_applicable',)
    search_fields = ('description',)
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):
    list_display = ('transaction_type', 'description', 'user_link', 'date_created')
    search_fields = ('transaction_type', 'description')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(CashbookEntry)
class CashbookEntryAdmin(admin.ModelAdmin):
    list_display = ('transaction_date', 'transaction_type', 'amount', 'description', 'user_link')
    list_filter = ('transaction_type',)
    search_fields = ('description',)
    raw_id_fields = ('transaction_type', 'user')
    readonly_fields = ('transaction_date', 'date_created', 'date_updated', 'user')
    date_hierarchy = 'transaction_date'

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(GeneralLedgerAccount)
class GeneralLedgerAccountAdmin(admin.ModelAdmin):
    list_display = ('account_name', 'account_number', 'account_sector', 'user_link', 'date_created')
    list_filter = ('account_sector',)
    search_fields = ('account_name', 'account_number')
    raw_id_fields = ('account_sector', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'description', 'user_link')
    search_fields = ('description',)
    readonly_fields = ('date', 'date_created', 'date_updated', 'user')
    date_hierarchy = 'date'

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(LedgerTransaction)
class LedgerTransactionAdmin(admin.ModelAdmin):
    list_display = ('entry_link', 'account', 'debit', 'credit', 'user_link')
    list_filter = ('account',)
    search_fields = ('entry__description', 'account__account_name')
    raw_id_fields = ('entry', 'account', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def entry_link(self, obj):
        if obj.entry:
            link = reverse("admin:accounting_journalentry_change", args=[obj.entry.pk])
            return format_html('<a href="{}">{}</a>', link, obj.entry.__str__())
        return "-"
    entry_link.short_description = "Journal Entry"
    entry_link.admin_order_field = 'entry__date'

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'document_number', 'invoice_type', 'status', 'customer_display', 'lease_link',
        'currency', 'total_inclusive', 'amount_due', 'sale_date', 'due_date', 'is_recurring', 'user_link'
    )
    list_filter = (
        'invoice_type', 'status', 'is_recurring', 'currency__currency_code', 'frequency'
    )
    search_fields = (
        'document_number', 'reference_number', 'individual__first_name', 'individual__surname',
        'company__name', 'lease__lease_id'
    )
    raw_id_fields = (
        'lease', 'individual', 'company', 'currency', 'original_invoice', 'user'
    )
    date_hierarchy = 'sale_date'
    save_on_top = True
    inlines = [TransactionLineItemInline, PaymentInline]

    fieldsets = (
        (None, {
            'fields': ('invoice_type', 'document_number', 'status', 'user')
        }),
        ('Customer & Lease', {
            'fields': ('individual', 'company', 'lease', 'reference_number'),
        }),
        ('Financial Details', {
            'fields': ('currency', 'discount', 'sale_date', 'due_date'),
        }),
        ('Recurring Invoice Settings', {
            'fields': ('is_recurring', 'frequency', 'next_invoice_date', 'original_invoice'),
            'classes': ('collapse',)
        }),
        ('Totals (Read-Only)', {
            'fields': ('total_excluding_vat', 'vat_total', 'total_inclusive', 'amount_due'),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = (
        'document_number', 'total_excluding_vat', 'vat_total', 'total_inclusive',
        'amount_due', 'is_fully_paid', 'date_created', 'date_updated', 'user'
    )

    def customer_display(self, obj):
        if obj.individual:
            return f"Individual: {obj.individual.firstname} {obj.individual.surname}"
        elif obj.company:
            return f"Company: {obj.company.name}"
        return "N/A"
    customer_display.short_description = "Customer"

    def lease_link(self, obj):
        if obj.lease:
            link = reverse("admin:leases_lease_change", args=[obj.lease.pk])
            return format_html('<a href="{}">{}</a>', link, obj.lease.lease_id)
        return "-"
    lease_link.short_description = "Lease ID"
    lease_link.admin_order_field = 'lease__lease_id'

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(CashSale)
class CashSaleAdmin(admin.ModelAdmin):
    list_display = (
        'document_number', 'sale_date', 'customer_display', 'currency', 'invoice_total',
        'amount_received', 'payment_type', 'user_link'
    )
    list_filter = ('currency', 'payment_type', 'is_individual')
    search_fields = (
        'document_number', 'individual__first_name', 'individual__surname',
        'company__name', 'reference'
    )
    raw_id_fields = ('individual', 'company', 'currency', 'payment_type', 'cashbook', 'user')
    date_hierarchy = 'sale_date'
    save_on_top = True
    inlines = [TransactionLineItemInline]

    fieldsets = (
        (None, {
            'fields': ('document_number', 'sale_date', 'user')
        }),
        ('Customer Details', {
            'fields': ('is_individual', 'individual', 'company'),
        }),
        ('Financials', {
            'fields': ('currency', 'discount', 'total_excluding_vat', 'vat_total', 'invoice_total'),
            'classes': ('collapse',)
        }),
        ('Payment Details', {
            'fields': ('payment_type', 'cashbook', 'amount_received', 'reference', 'details'),
        }),
        ('Audit Information', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = (
        'document_number', 'total_excluding_vat', 'vat_total', 'invoice_total',
        'date_created', 'date_updated', 'user'
    )

    def customer_display(self, obj):
        if obj.is_individual and obj.individual:
            return f"Individual: {obj.individual.firstname} {obj.individual.surname}"
        elif not obj.is_individual and obj.company:
            return f"Company: {obj.company.name}"
        return "N/A"
    customer_display.short_description = "Customer"

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(CreditNote)
class CreditNoteAdmin(admin.ModelAdmin):
    list_display = (
        'document_number', 'credit_date', 'customer_display', 'currency', 'total_amount', 'user_link'
    )
    list_filter = ('currency', 'is_individual')
    search_fields = (
        'document_number', 'individual__first_name', 'individual__surname',
        'company__registration_name', 'description'
    )
    raw_id_fields = ('individual', 'company', 'currency', 'user')
    date_hierarchy = 'credit_date'
    save_on_top = True
    inlines = [TransactionLineItemInline]

    fieldsets = (
        (None, {
            'fields': ('document_number', 'credit_date', 'user')
        }),
        ('Customer Details', {
            'fields': ('is_individual', 'individual', 'company'),
        }),
        ('Financials', {
            'fields': ('currency', 'total_amount', 'description'),
        }),
        ('Audit Information', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = (
        'document_number', 'total_amount', 'date_created', 'date_updated', 'user'
    )

    def customer_display(self, obj):
        if obj.is_individual and obj.individual:
            return f"Individual: {obj.individual.firstname} {obj.individual.surname}"
        elif not obj.is_individual and obj.company:
            return f"Company: {obj.company.registration_name}"
        return "N/A"
    customer_display.short_description = "Customer"

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(TransactionLineItem)
class TransactionLineItemAdmin(admin.ModelAdmin):
    list_display = ('parent_document', 'sales_item', 'quantity', 'unit_price', 'vat_amount', 'total_price', 'user_link')
    list_filter = ('sales_item__category', 'sales_item__sales_account')
    search_fields = ('parent_document__document_number', 'sales_item__name')
    raw_id_fields = ('content_type', 'sales_item', 'user')
    readonly_fields = ('total_price', 'date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('payment_method_name', 'user_link', 'date_created')
    search_fields = ('payment_method_name',)
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice_link', 'payment_date', 'amount', 'method', 'reference', 'user_link')
    list_filter = ('method',)
    search_fields = ('invoice__document_number', 'reference')
    raw_id_fields = ('invoice', 'method', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    date_hierarchy = 'payment_date'

    def invoice_link(self, obj):
        if obj.invoice:
            link = reverse("admin:accounting_invoice_change", args=[obj.invoice.pk])
            return format_html('<a href="{}">{}</a>', link, obj.invoice.document_number)
        return "-"
    invoice_link.short_description = "Invoice"
    invoice_link.admin_order_field = 'invoice__document_number'

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = ('base_currency', 'currency', 'current_rate', 'user_link', 'date_created')
    list_filter = ('base_currency', 'currency')
    search_fields = ('base_currency__currency_code', 'currency__currency_code')
    raw_id_fields = ('base_currency', 'currency', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(CashBook)
class CashBookAdmin(admin.ModelAdmin):
    list_display = ('cashbook_id', 'cashbook_name', 'currency', 'account_type', 'requisition_status', 'general_ledger_account', 'user_link')
    list_filter = ('currency', 'account_type', 'requisition_status')
    search_fields = ('cashbook_id', 'cashbook_name', 'bank_account_number')
    raw_id_fields = ('currency', 'general_ledger_account', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'