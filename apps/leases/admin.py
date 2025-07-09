from django.contrib import admin

# Register your models here.
# leases/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from leases.models.models import Lease, LeaseTenant, Guarantor, LeaseCharge, LeaseTermination
from leases.models.landlord import Landlord
from common.admin import DocumentInline, NoteInline
from properties.models.models import Unit
from accounting.models.models import Currency, Invoice
from individuals.models.models import Individual
from companies.models.models import Company

# --- Inlines for Lease Model ---

class LeaseTenantInline(admin.TabularInline):
    model = LeaseTenant
    extra = 0
    fields = ('content_type', 'object_id', 'tenant_object', 'is_primary_tenant', 'user')
    readonly_fields = ('tenant_object', 'user', 'date_created', 'date_updated')
    raw_id_fields = ('content_type',) # Individual/Company are linked via GFK, ContentType is FK

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # Limit content_type choices for GenericForeignKey
        from django.contrib.contenttypes.models import ContentType
        from django.db.models import Q
        formset.form.base_fields['content_type'].queryset = ContentType.objects.filter(
            Q(app_label='individuals', model='individual') | Q(app_label='companies', model='companybranch')
        )
        return formset

class LeaseChargeInline(admin.TabularInline):
    model = LeaseCharge
    extra = 1 # One empty form by default
    fields = ('charge_type', 'description', 'amount', 'currency', 'frequency', 'effective_date', 'end_date', 'is_active', 'user')
    raw_id_fields = ('currency',)
    readonly_fields = ('user', 'date_created', 'date_updated')
    classes = ('collapse',)

# --- Admin for Lease Model ---

@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    list_display = (
        'lease_id', 'unit_link', 'display_tenants', 'landlord_link', 'status',
        'risk_level_display', 'start_date', 'end_date', 'deposit_amount',
        'payment_frequency', 'currency', 'user_link'
    )
    list_filter = (
        'status', 'payment_frequency', 'includes_utilities',
        'currency__currency_code', 'landlord__owner_object__organization_name', # Filter by landlord company name
        'landlord__owner_object__first_name', # Filter by landlord individual name
    )
    search_fields = (
        'lease_id', 'unit__name', 'unit__unit_number',
        'lease_tenants__tenant_object__first_name', 'lease_tenants__tenant_object__organization_name',
        'landlord__owner_object__first_name', 'landlord__owner_object__organization_name',
        'account_number', 'utilities_details'
    )
    raw_id_fields = (
        'unit', 'landlord', 'currency', 'guarantor', 'user' # user is from BaseModel
    )
    date_hierarchy = 'start_date'
    save_on_top = True
    inlines = [LeaseTenantInline, LeaseChargeInline, DocumentInline, NoteInline]

    fieldsets = (
        (None, {
            'fields': ('lease_id', 'unit', 'status', 'landlord', 'user')
        }),
        ('Lease Dates', {
            'fields': ('start_date', 'end_date', 'signed_date', 'termination_date'),
            'classes': ('collapse',)
        }),
        ('Financial Terms', {
            'fields': ('deposit_amount', 'deposit_period', 'currency', 'payment_frequency',
                    'due_day_of_month', 'grace_period_days'),
        }),
        ('Utilities & Other Details', {
            'fields': ('includes_utilities', 'utilities_details', 'account_number', 'guarantor'),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = (
        'lease_id', 'risk_level_display', 'date_created', 'date_updated', 'user'
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related(
            'unit', 'landlord', 'currency', 'guarantor', 'user'
        ).prefetch_related(
            'lease_tenants__content_type', 'lease_tenants__tenant_object',
            'invoices' # Needed for risk_level calculation
        )
        return qs

    def unit_link(self, obj):
        if obj.unit:
            link = reverse("admin:properties_unit_change", args=[obj.unit.pk])
            return format_html('<a href="{}">{}</a>', link, obj.unit.__str__())
        return "-"
    unit_link.short_description = "Unit"
    unit_link.admin_order_field = 'unit__unit_number'

    def landlord_link(self, obj):
        if obj.landlord and obj.landlord.owner_object:
            content_type = obj.landlord.content_type
            link = reverse(f"admin:{content_type.app_label}_{content_type.model}_change", args=[obj.landlord.object_id])
            return format_html('<a href="{}">{}</a>', link, obj.landlord.owner_object.__str__())
        return "-"
    landlord_link.short_description = "Landlord"
    landlord_link.admin_order_field = 'landlord__owner_object__organization_name' # or first_name

    def display_tenants(self, obj):
        # This will show primary tenant first, then others
        primary_tenant = obj.get_primary_tenant()
        other_tenants = [lt.tenant_object.__str__() for lt in obj.lease_tenants.all() if not lt.is_primary_tenant]

        display_names = []
        if primary_tenant:
            display_names.append(f"**{primary_tenant.__str__()}** (Primary)")
        display_names.extend(other_tenants)

        return format_html("<br>".join(display_names)) if display_names else "-"
    display_tenants.short_description = "Tenants"

    def risk_level_display(self, obj):
        risk = obj.risk_level
        if risk == 'LOW':
            return format_html('<span style="color: green; font-weight: bold;">{}</span>', risk)
        elif risk == 'MEDIUM':
            return format_html('<span style="color: orange; font-weight: bold;">{}</span>', risk)
        elif risk in ['HIGH', 'HIGH HIGH']:
            return format_html('<span style="color: red; font-weight: bold;">{}</span>', risk)
        elif risk == 'NON_PAYER':
            return format_html('<span style="color: darkred; font-weight: bold;">{}</span>', risk)
        return risk
    risk_level_display.short_description = "Risk Level"
    risk_level_display.admin_order_field = '_risk_level_order' 


    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk]) 
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


# --- Admin for Lease Related Models ---

@admin.register(LeaseTenant)
class LeaseTenantAdmin(admin.ModelAdmin):
    list_display = ('lease_link', 'tenant_object', 'is_primary_tenant', 'user_link')
    list_filter = ('is_primary_tenant',)
    search_fields = (
        'lease__lease_id', 'tenant_object__first_name', 'tenant_object__organization_name'
    )
    raw_id_fields = ('lease', 'content_type', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('lease', 'content_type', 'object_id', 'is_primary_tenant')
        }),
        ('Audit Information', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

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


@admin.register(Guarantor)
class GuarantorAdmin(admin.ModelAdmin):
    list_display = ('guarantor_object', 'guarantee_amount', 'user_link')
    search_fields = ('guarantor_object__first_name', 'guarantor_object__organization_name')
    raw_id_fields = ('content_type', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id', 'guarantee_amount')
        }),
        ('Audit Information', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'


@admin.register(LeaseCharge)
class LeaseChargeAdmin(admin.ModelAdmin):
    list_display = ('lease_link', 'charge_type', 'amount', 'currency', 'frequency', 'effective_date', 'is_active', 'user_link')
    list_filter = ('charge_type', 'frequency', 'is_active', 'currency__currency_code')
    search_fields = ('lease__lease_id', 'description')
    raw_id_fields = ('lease', 'currency', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    date_hierarchy = 'effective_date'
    fieldsets = (
        (None, {
            'fields': ('lease', 'charge_type', 'description', 'amount', 'currency', 'frequency', 'effective_date', 'end_date', 'is_active')
        }),
        ('Audit Information', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

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


@admin.register(LeaseTermination)
class LeaseTerminationAdmin(admin.ModelAdmin):
    list_display = ('lease_link', 'termination_date', 'reason', 'user_link')
    list_filter = ('termination_date',)
    search_fields = ('lease__lease_id', 'reason', 'notes')
    raw_id_fields = ('lease', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    date_hierarchy = 'termination_date'
    fieldsets = (
        (None, {
            'fields': ('lease', 'termination_date', 'reason', 'notes')
        }),
        ('Audit Information', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

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


@admin.register(Landlord)
class LandlordAdmin(admin.ModelAdmin):
    list_display = ('owner_object', 'user_link', 'date_created')
    search_fields = ('owner_object__first_name', 'owner_object__organization_name')
    raw_id_fields = ('content_type', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id')
        }),
        ('Audit Information', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'