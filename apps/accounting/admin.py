from decimal import Decimal
from django.contrib import admin
from django.contrib.contenttypes.admin import (
    GenericTabularInline,
)  # For generic relations
from django.utils.html import format_html
from django.contrib.contenttypes.models import ContentType
from apps.accounting.models.models import (
    AccountSector,
    SalesItem,
    SalesCategory,
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
    Payment,
)
from apps.accounting.models.pricing import ServiceSpecialPricing, ServiceStandardPricing

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
    fields = ["sales_item", "quantity", "unit_price", "vat_amount", "total_price"]
    readonly_fields = [
        "vat_amount",
        "total_price",
        "unit_price",
    ]  # These are calculated in the model's save method
    raw_id_fields = [
        "sales_item"
    ]  # Use raw_id_fields for better performance with many items/users


# --- Admin Registrations ---


@admin.register(SalesItem)
class SalesItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "item_id",
        "price",
        "unit_price_currency",
        "category",
        "tax_configuration",
        "sales_account",
        "created_by",
    )
    list_display_links = ("name", "item_id")
    search_fields = ("name", "item_id", "category__name", "sales_account__account_name")
    list_filter = (
        "category",
        "tax_configuration",
        "sales_account",
        "unit_price_currency",
    )
    ordering = ("name",)
    raw_id_fields = (
        "category",
        "unit_price_currency",
        "tax_configuration",
        "sales_account",
        "created_by",
    )
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("item_id", "name", "price", "unit_name")}),
        (
            "Categorization & Accounting",
            {"fields": ("category", "sales_account", "tax_configuration")},
        ),
        ("Pricing & Currency", {"fields": ("unit_price_currency",)}),
        ("System Info", {"fields": ("created_by",), "classes": ("collapse",)}),
    )


@admin.register(SalesCategory)
class SalesCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code")
    list_display_links = ("name",)
    search_fields = ("name", "code")
    ordering = ("name",)
    list_per_page = 25


@admin.register(VATSetting)
class VATSettingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "rate",
        "description",
        "vat_applicable",
        "created_by",
        "date_created",
    )
    list_display_links = ("description",)
    search_fields = ("description",)
    list_filter = ("vat_applicable", "rate")
    ordering = ("-date_created", "-date_updated")
    raw_id_fields = ("created_by",)
    list_per_page = 25


@admin.register(CashSale)
class CashSaleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "document_number",
        "sale_date",
        "created_by",
        "currency",
        "discount",
        "invoice_total",
        "amount_received",
        "customer_details",
    )
    list_display_links = ("id", "document_number")
    search_fields = (
        "created_by__username",
        "document_number",
        "customer__individual__full_name",
        "customer__company__full_name",
    )
    list_filter = ("sale_date", "created_by")
    ordering = ("-sale_date",)
    inlines = [TransactionLineItemInline]  # Add inline for line items
    raw_id_fields = ("created_by",)
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("document_number", "sale_date", "details")}),
        (
            "Customer Details",
            {
                "fields": ("customer", "customer_details"),
                "description": "Select a customer.",
            },
        ),
        (
            "Financial",
            {
                "fields": (
                    "currency",
                    "discount",
                    "amount_received",
                    "invoice_total",
                    "payment_type",
                    "cashbook",
                )
            },
        ),
        ("System Info", {"fields": ("created_by",), "classes": ("collapse",)}),
    )

    readonly_fields = (
        "customer_details",
        "sale_date",
        "invoice_total",
    )

    def get_full_name(self, obj):
        if obj.customer.is_individual is True:
            return obj.customer.individual.full_name
        elif not obj.customer.is_individual and obj.customer.company:
            return obj.customer.company.full_name
        return "N/A"

    def customer_details(self, obj):
        if obj.customer.is_individual is True and obj.customer.individual:
            individual = obj.customer.individual
            customer_information = f"{individual.first_name} {individual.last_name} {individual.identification_number} {individual.email}"
            return customer_information
        elif not obj.customer.is_individual and obj.customer.company:
            return obj.customer.company.company.registration_name
        return "N/A"


@admin.register(CashbookEntry)
class CashbookEntryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "transaction_date",
        "transaction_type",
        "amount",
        "description",
        "created_by",
    )
    list_display_links = ("id", "transaction_date")
    search_fields = (
        "transaction_date__icontains",
        "transaction_type__transaction_type",
        "description",
    )
    list_filter = ("transaction_type", "transaction_date")
    ordering = ("-transaction_date",)
    raw_id_fields = ("created_by", "transaction_type")
    list_per_page = 25


@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):  # Corrected class name
    list_display = (
        "id",
        "created_by",
        "base_currency",
        "currency",
        "current_rate",
        "date_updated",
    )
    list_display_links = ("id", "created_by")
    search_fields = (
        "created_by__username",
        "base_currency__currency_code",
        "currency__currency_code",
    )
    list_filter = ("base_currency", "currency")
    ordering = ("-date_created",)
    raw_id_fields = ("created_by", "base_currency", "currency")
    list_per_page = 25


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):  # Corrected class name
    list_display = ("id", "currency_name", "currency_code")
    list_display_links = ("currency_name",)
    search_fields = ("currency_code", "currency_name")
    ordering = ("currency_code",)
    list_per_page = 25


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "document_number",
        "invoice_type",
        "status",
        "sale_date",
        "total_inclusive",
        "currency",
        "is_recurring",
        "created_by",
    )
    list_display_links = ("document_number",)
    search_fields = ("document_number", "reference_number")
    list_filter = ("invoice_type", "status", "sale_date", "currency", "is_recurring")
    ordering = ("-sale_date", "document_number")
    inlines = [TransactionLineItemInline]  # Add inline for line items
    raw_id_fields = ("created_by", "customer", "lease", "currency", "original_invoice")
    list_per_page = 25

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "invoice_type",
                    "document_number",
                    "status",
                    "sale_date",
                    "reference_number",
                )
            },
        ),
        (
            "Customer Details",
            {"fields": ("lease", "customer"), "description": "Select a customer."},
        ),
        (
            "Financials",
            {
                "fields": (
                    "currency",
                    "discount",
                    "total_excluding_vat",
                    "vat_total",
                    "total_inclusive",
                )
            },
        ),
        (
            "Recurring Invoice Settings",
            {
                "fields": (
                    "is_recurring",
                    "frequency",
                    "next_invoice_date",
                    "original_invoice",
                ),
                "classes": ("collapse",),
            },
        ),
        ("System Info", {"fields": ("created_by",), "classes": ("collapse",)}),
    )

    readonly_fields = (
        "document_number",
        "total_excluding_vat",
        "vat_total",
        "total_inclusive",
    )

    def customer_display(self, obj):
        if obj.customer():
            return f"{obj.customer.get_full_name()}"
        return "N/A"

    customer_display.short_description = "Customer"


@admin.register(CreditNote)  # New: Register CreditNote
class CreditNoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "document_number",
        "credit_date",
        "total_credit_note_amount",
        "customer",
        "currency",
        "created_by",
        "customer_details",
    )
    list_display_links = ("document_number",)
    search_fields = (
        "document_number",
        "customer",
    )
    list_filter = ("credit_date", "customer", "currency")
    ordering = ("-id",)
    inlines = [TransactionLineItemInline]  # `` Add inline for line items
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("document_number", "credit_date", "description")}),
        (
            "Customer Details",
            {
                "fields": ("customer", "customer_details"),
                "description": "Select a customer.",
            },
        ),
        ("Financial", {"fields": ("currency", "total_credit_note_amount", "discount")}),
        ("System Info", {"fields": ("created_by",), "classes": ("collapse",)}),
    )

    readonly_fields = (
        "document_number",
        "total_credit_note_amount",
        "customer_details",
    )

    def get_full_name(self, obj):
        if obj.customer.is_individual is True:
            return obj.customer.individual.full_name
        elif not obj.customer.is_individual and obj.customer.company:
            return obj.customer.company.full_name
        return "N/A"

    def customer_details(self, obj):
        if obj.customer.is_individual is True and obj.customer.individual:
            individual = obj.customer.individual
            customer_information = f"{individual.first_name} {individual.last_name} {individual.identification_number} {individual.email}"
            return customer_information
        elif not obj.customer.is_individual and obj.customer.company:
            return obj.customer.company.company.registration_name
        return "N/A"

    def total_credit_note_amount(self, obj):
        total = Decimal("0.00")
        for line_item in obj.line_items.all():
            total += line_item.total_price_excluding_vat + line_item.vat_amount
        total -= obj.discount or Decimal("0.00")
        return total

    total_credit_note_amount.display_description = "Total Amount"


@admin.register(TransactionLineItem)  # New: Register TransactionLineItem directly
class TransactionLineItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "parent_document_link",
        "sales_item",
        "quantity",
        "unit_price",
        "vat_amount",
        "total_price",
    )
    list_display_links = ("id",)
    search_fields = ("sales_item__name", "object_id")
    list_filter = ("sales_item", "content_type")
    ordering = ("-id",)
    raw_id_fields = ("sales_item",)
    list_per_page = 25

    def parent_document_link(self, obj):
        """Creates a link to the parent document in the admin."""
        if obj.parent_document:
            content_type = obj.content_type
            app_label = content_type.app_label
            model_name = content_type.model
            url = f"/admin/{app_label}/{model_name}/{obj.object_id}/change/"
            return format_html(
                '<a href="{}">{} {}</a>',
                url,
                content_type.model.replace("_", " ").title(),
                obj.object_id,
            )
        return "N/A"

    parent_document_link.short_description = "Parent Document"


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "payment_method_name",
    )
    list_display_links = ("payment_method_name",)
    search_fields = ("payment_method_name",)
    ordering = ("payment_method_name",)
    list_per_page = 25


@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):  # Corrected class name
    list_display = ("id", "transaction_type", "description")
    search_fields = ("transaction_type", "description")
    ordering = ("transaction_type",)
    list_per_page = 25


@admin.register(AccountSector)
class AccountSectorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code")
    list_display_links = ("name",)
    search_fields = ("name", "code")
    ordering = ("code",)
    list_per_page = 25


@admin.register(GeneralLedgerAccount)
class GeneralLedgerAccountAdmin(admin.ModelAdmin):  # Corrected class name
    list_display = (
        "id",
        "account_name",
        "account_number",
        "account_sector_code",
        "account_sector_name",
    )
    list_display_links = ("account_name",)
    search_fields = ("account_name", "account_number")
    list_filter = ("account_sector__code", "account_sector__name")
    ordering = ("account_number",)
    raw_id_fields = ("account_sector",)
    list_per_page = 25

    def account_sector_code(self, obj):
        return obj.account_sector.code if obj.account_sector else None

    account_sector_code.short_description = "Sector Code"
    account_sector_code.admin_order_field = (
        "account_sector__code"  # Allows sorting by this field
    )

    def account_sector_name(self, obj):
        return obj.account_sector.name if obj.account_sector else None

    account_sector_name.short_description = "Sector Name"
    account_sector_name.admin_order_field = (
        "account_sector__name"  # Allows sorting by this field
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "invoice", "amount", "payment_date")
    list_display_links = ("id", "invoice")
    search_fields = ("invoice__document_number", "payment_method__payment_method_name")
    list_filter = ("invoice",)
    ordering = ("-payment_date",)
    list_per_page = 25


@admin.register(ServiceSpecialPricing)
class ServiceSpecialPricingInline(admin.ModelAdmin):
    list_display = (
        "id",
        "service",
        "client_customer",
        "individual_charge",
        "company_charge",
        "currency",
    )
    list_display_links = ("service", "client_customer")
    search_fields = ("service__service_name", "client_customer__name")
    list_filter = ("currency",)
    ordering = ("service__service_name", "client_customer__name")


@admin.register(ServiceStandardPricing)
class ServiceStandardPricingInline(admin.ModelAdmin):
    list_display = (
        "id",
        "service",
        "individual_charge",
        "company_charge",
        "currency",
        "current_rate",
    )
    list_display_links = ("service",)
    search_fields = ("service__service_name",)
    list_filter = ("currency",)
    ordering = ("service__service_name",)
