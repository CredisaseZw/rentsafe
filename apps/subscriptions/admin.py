from django.contrib import admin

# Register your models here.
# subscriptions/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

# Import models from the subscriptions app
from subscriptions.models.models import Services, SubscriptionPeriod, Subscription
# Import related models for raw_id_fields
from accounting.models.models import Currency
from individuals.models.models import Individual
from companies.models.models import Company

# --- Admin for Services ---
@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'user_link', 'date_created')
    search_fields = ('service_name',)
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('service_name',)
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


# --- Admin for SubscriptionPeriod ---
@admin.register(SubscriptionPeriod)
class SubscriptionPeriodAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'period_length_days', 'period_length_months', 'user_link', 'date_created')
    search_fields = ('name', 'code')
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'period_length_days', 'period_length_months')
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


# --- Admin for Subscriptions ---
@admin.register(Subscriptions)
class SubscriptionsAdmin(admin.ModelAdmin):
    list_display = (
        'subscriber_object', 'service', 'is_activated', 'start_date', 'end_date',
        'total_lease_slots', 'used_lease_slots', 'has_available_slots_display',
        'currency', 'total_amount', 'user_link'
    )
    list_filter = (
        'service__service_name', 'is_activated', 'subscription_class',
        'period__name', 'currency__currency_code'
    )
    search_fields = (
        'subscriber_object__first_name', 'subscriber_object__organization_name',
        'service__service_name', 'payment_method'
    )
    raw_id_fields = (
        'content_type', 'service', 'period', 'currency', 'user'
    )
    date_hierarchy = 'start_date'
    save_on_top = True
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id', 'service', 'is_activated', 'subscription_class', 'user')
        }),
        ('Period & Slots', {
            'fields': ('period', 'start_date', 'end_date', 'total_lease_slots', 'used_lease_slots'),
        }),
        ('Financial Details', {
            'fields': ('currency', 'payment_method', 'total_amount', 'monthly_amount'),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = (
        'used_lease_slots', 'has_available_slots_display', 'date_created', 'date_updated', 'user'
    )

    def has_available_slots_display(self, obj):
        if obj.has_available_slots:
            return format_html('<span style="color: green; font-weight: bold;">Yes</span>')
        return format_html('<span style="color: red; font-weight: bold;">No</span>')
    has_available_slots_display.short_description = "Slots Available?"
    has_available_slots_display.boolean = True 

    def user_link(self, obj):
        if obj.user:
            link = reverse("admin:auth_user_change", args=[obj.user.pk])
            return format_html('<a href="{}">{}</a>', link, obj.user.get_full_name() or obj.user.username)
        return "-"
    user_link.short_description = "Created/Updated By"
    user_link.admin_order_field = 'user__username'