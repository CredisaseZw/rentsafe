from django.contrib import admin
from django.utils.html import format_html

# ==================== ACTIVE TRUST ACCOUNTING ADMIN ====================

from apps.trust_accounting.models import (
    TrustFinancialYear,
    TrustAccountingPeriod,
    TrustAccountType,
    TrustAccountSubType,
    TrustCurrency,
    TrustExchangeRate,
    TrustGeneralLedgerAccount,
    TrustGeneralLedger,
    TrustTaxType,
    TrustPropertyExpense,
    TrustSalesCategory,
    TrustSalesItem,
    TrustJournalEntry,
    TrustLedgerTransaction,
    InvoiceType,
    TrustInvoice,
    TrustInvoiceLineItem,
)


@admin.register(TrustCurrency)
class TrustCurrencyAdmin(admin.ModelAdmin):
    list_display = [
        "currency_code",
        "currency_name",
        "symbol",
        "is_base_currency",
        "is_active",
    ]
    list_filter = ["is_active", "is_base_currency"]
    search_fields = ["currency_code", "currency_name"]
    ordering = ["currency_code"]


@admin.register(TrustExchangeRate)
class TrustExchangeRateAdmin(admin.ModelAdmin):
    list_display = [
        "base_currency",
        "target_currency",
        "rate",
        "effective_date",
        "is_active",
    ]
    list_filter = ["is_active", "base_currency", "target_currency", "effective_date"]
    search_fields = ["base_currency__currency_code", "target_currency__currency_code"]
    ordering = ["-effective_date"]
    date_hierarchy = "effective_date"


@admin.register(TrustAccountType)
class TrustAccountTypeAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "account_type", "normal_balance"]
    list_filter = ["account_type", "normal_balance"]
    search_fields = ["code", "name"]
    ordering = ["account_type", "name"]


@admin.register(TrustAccountSubType)
class TrustAccountSubTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "code_prefix", "account_type"]
    list_filter = ["account_type"]
    search_fields = ["name", "code_prefix"]
    ordering = ["account_type", "code_prefix"]


@admin.register(TrustGeneralLedgerAccount)
class TrustGeneralLedgerAccountAdmin(admin.ModelAdmin):
    list_display = [
        "account_number",
        "account_name",
        "account_type",
        "account_class",
        "current_balance",
        "is_active",
    ]
    list_filter = ["account_type", "account_class", "is_active", "is_system_account"]
    search_fields = ["account_number", "account_name"]
    ordering = ["account_number"]
    readonly_fields = ["current_balance", "balance_last_updated"]
    fieldsets = (
        ("Account Info", {"fields": ("account_number", "account_name", "description")}),
        (
            "Classification",
            {
                "fields": (
                    "account_type",
                    "account_subtype",
                    "account_class",
                    "parent_account",
                )
            },
        ),
        (
            "Flags",
            {
                "fields": (
                    "is_active",
                    "is_contra_account",
                    "is_system_account",
                    "requires_cost_center",
                    "requires_tax",
                )
            },
        ),
        (
            "Balances",
            {
                "fields": (
                    "opening_balance",
                    "opening_balance_date",
                    "current_balance",
                    "balance_last_updated",
                )
            },
        ),
    )


@admin.register(TrustGeneralLedger)
class TrustGeneralLedgerAdmin(admin.ModelAdmin):
    list_display = [
        "account_number",
        "account_name",
        "account_type",
        "is_active",
        "is_system_account",
    ]
    list_filter = ["account_type", "is_active", "is_system_account"]
    search_fields = ["account_number", "account_name"]
    ordering = ["account_number"]


@admin.register(TrustTaxType)
class TrustTaxTypeAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "rate", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["code", "name"]
    ordering = ["code"]


@admin.register(TrustPropertyExpense)
class TrustPropertyExpenseAdmin(admin.ModelAdmin):
    list_display = ["expense", "expense_account"]
    search_fields = ["expense", "expense_account__account_name"]
    ordering = ["expense"]


@admin.register(TrustSalesCategory)
class TrustSalesCategoryAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "parent_category", "is_active"]
    list_filter = ["is_active", "parent_category"]
    search_fields = ["code", "name"]
    ordering = ["code"]


@admin.register(TrustSalesItem)
class TrustSalesItemAdmin(admin.ModelAdmin):
    list_display = [
        "item_code",
        "name",
        "category",
        "unit_price",
        "currency",
        "tax_type",
        "is_active",
    ]
    list_filter = ["category", "is_active", "track_inventory", "tax_type"]
    search_fields = ["item_code", "name"]
    ordering = ["item_code"]
    fieldsets = (
        ("Basic Info", {"fields": ("item_code", "name", "description", "category")}),
        ("Pricing", {"fields": ("unit_price", "currency", "cost_price", "tax_type")}),
        (
            "Accounting",
            {
                "fields": (
                    "income_account",
                    "cost_of_sales_account",
                    "inventory_account",
                )
            },
        ),
        (
            "Inventory",
            {"fields": ("track_inventory", "current_stock", "minimum_stock")},
        ),
        ("Status", {"fields": ("is_active",)}),
    )


@admin.register(InvoiceType)
class InvoiceTypeAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["code", "name"]
    ordering = ["code"]


class TrustInvoiceLineItemInline(admin.TabularInline):
    model = TrustInvoiceLineItem
    extra = 1
    readonly_fields = ["total_price"]
    fields = ["sales_item", "quantity", "unit_price", "vat_amount", "total_price"]


@admin.register(TrustInvoice)
class TrustInvoiceAdmin(admin.ModelAdmin):
    list_display = [
        "invoice_number",
        "invoice_type",
        "landlord",
        "status",
        "formatted_total",
        "date_created",
    ]
    list_filter = ["status", "invoice_type", "date_created"]
    search_fields = ["invoice_number", "landlord__name"]
    ordering = ["-date_created"]
    date_hierarchy = "date_created"
    readonly_fields = ["invoice_number"]
    inlines = [TrustInvoiceLineItemInline]

    def formatted_total(self, obj):
        return format_html(
            "<strong>{}</strong>",
            obj.total_amount if hasattr(obj, "total_amount") else "-",
        )

    formatted_total.short_description = "Total"


@admin.register(TrustInvoiceLineItem)
class TrustInvoiceLineItemAdmin(admin.ModelAdmin):
    list_display = [
        "invoice",
        "sales_item",
        "quantity",
        "unit_price",
        "vat_amount",
        "total_price",
    ]
    list_filter = ["invoice__status", "sales_item__category"]
    search_fields = ["invoice__invoice_number", "sales_item__name"]
    ordering = ["-invoice__date_created"]


# ==================== FINANCIAL YEAR & PERIOD ADMIN ====================


class TrustAccountingPeriodInline(admin.TabularInline):
    model = TrustAccountingPeriod
    extra = 0
    fields = ["name", "period_number", "start_date", "end_date", "is_open"]
    readonly_fields = ["closed_at", "closed_by"]


@admin.register(TrustFinancialYear)
class TrustFinancialYearAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date", "is_active", "is_closed"]
    list_filter = ["is_active", "is_closed"]
    search_fields = ["name"]
    ordering = ["-start_date"]
    date_hierarchy = "start_date"
    readonly_fields = ["closed_at", "closed_by"]
    inlines = [TrustAccountingPeriodInline]
    fieldsets = (
        ("Year Details", {"fields": ("name", "start_date", "end_date")}),
        ("Status", {"fields": ("is_active", "is_closed", "closed_at", "closed_by")}),
    )


@admin.register(TrustAccountingPeriod)
class TrustAccountingPeriodAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "financial_year",
        "period_number",
        "start_date",
        "end_date",
        "is_open",
    ]
    list_filter = ["financial_year", "is_open"]
    search_fields = ["name", "financial_year__name"]
    ordering = ["financial_year", "period_number"]
    readonly_fields = ["closed_at", "closed_by"]
    fieldsets = (
        ("Period Details", {"fields": ("financial_year", "name", "period_number")}),
        ("Dates", {"fields": ("start_date", "end_date")}),
        ("Status", {"fields": ("is_open", "closed_at", "closed_by")}),
    )


# ==================== JOURNAL ENTRY & TRANSACTIONS ADMIN ====================


class TrustLedgerTransactionInline(admin.TabularInline):
    model = TrustLedgerTransaction
    extra = 1
    fields = ["account", "debit_amount", "credit_amount", "description", "reference"]
    autocomplete_fields = ["account"]


@admin.register(TrustJournalEntry)
class TrustJournalEntryAdmin(admin.ModelAdmin):
    list_display = [
        "entry_number",
        "entry_date",
        "entry_type",
        "description",
        "total_debit",
        "total_credit",
        "is_posted",
        "is_reversed",
    ]
    list_filter = ["entry_type", "is_posted", "is_reversed", "accounting_period"]
    search_fields = ["entry_number", "description", "reference"]
    ordering = ["-entry_date", "-id"]
    date_hierarchy = "entry_date"
    readonly_fields = [
        "entry_number",
        "total_debit",
        "total_credit",
        "posted_date",
        "reviewed_date",
        "approved_date",
    ]
    inlines = [TrustLedgerTransactionInline]
    fieldsets = (
        (
            "Entry Details",
            {
                "fields": (
                    "entry_number",
                    "entry_date",
                    "entry_type",
                    "accounting_period",
                )
            },
        ),
        ("Description", {"fields": ("description", "reference", "source_document")}),
        (
            "Totals",
            {"fields": ("total_debit", "total_credit"), "classes": ["collapse"]},
        ),
        (
            "Status",
            {
                "fields": (
                    "is_posted",
                    "posted_date",
                    "is_reversed",
                    "reversal_entry",
                )
            },
        ),
        (
            "Audit",
            {
                "fields": (
                    "reviewed_by",
                    "reviewed_date",
                    "approved_by",
                    "approved_date",
                ),
                "classes": ["collapse"],
            },
        ),
    )


@admin.register(TrustLedgerTransaction)
class TrustLedgerTransactionAdmin(admin.ModelAdmin):
    list_display = [
        "journal_entry",
        "account",
        "debit_amount",
        "credit_amount",
        "description",
    ]
    list_filter = ["account__account_type", "journal_entry__is_posted"]
    search_fields = [
        "journal_entry__entry_number",
        "account__account_number",
        "account__account_name",
        "description",
    ]
    ordering = ["-journal_entry__entry_date"]
    autocomplete_fields = ["account", "journal_entry"]
