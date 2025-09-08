# apps/leases/admin.py

from django.contrib import admin
from apps.leases.models import (
    Lease, LeaseTenant, LeaseCharge,
    LeaseLog, Guarantor, LeaseOpeningBalance, 
    LandlordOpeningBalance, LeaseDeposit, LeaseTermination
)
from django.contrib.contenttypes.admin import GenericTabularInline

class LeaseTenantInline(admin.TabularInline):
    model = LeaseTenant
    extra = 1


class LeaseChargeInline(admin.TabularInline):
    model = LeaseCharge
    extra = 1


class LeaseLogInline(admin.TabularInline):
    model = LeaseLog
    extra = 0
    readonly_fields = ('timestamp', 'user', 'log_type', 'details', 'content_type', 'object_id', 'related_object')
    can_delete = False


class GuarantorInline(GenericTabularInline):
    model = Guarantor
    extra = 1


@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    list_display = ('lease_id', 'unit', 'status', 'start_date', 'end_date')
    search_fields = ('lease_id', 'unit__name', 'unit__property__name')
    list_filter = ('status', 'start_date', 'end_date')
    readonly_fields = ('date_created', 'date_updated')

    inlines = [
        LeaseTenantInline,
        LeaseChargeInline,
        LeaseLogInline,
        GuarantorInline,
    ]


@admin.register(LeaseTenant)
class LeaseTenantAdmin(admin.ModelAdmin):
    list_display = ('tenant_object', 'lease', 'is_primary_tenant')
    search_fields = ('lease__lease_id',)
    readonly_fields = ('date_created', 'date_updated')


@admin.register(LeaseCharge)
class LeaseChargeAdmin(admin.ModelAdmin):
    list_display = ('lease', 'charge_type', 'amount', 'effective_date', 'frequency', 'is_active')
    list_filter = ('charge_type', 'frequency', 'is_active')
    search_fields = ('lease__lease_id', 'description')
    readonly_fields = ('date_created', 'date_updated')


@admin.register(LeaseLog)
class LeaseLogAdmin(admin.ModelAdmin):
    list_display = ('lease', 'log_type', 'timestamp', 'user')
    list_filter = ('log_type', 'timestamp')
    search_fields = ('lease__lease_id', 'details')
    readonly_fields = ('timestamp', 'user', 'log_type', 'details', 'content_type', 'object_id', 'related_object')


@admin.register(Guarantor)
class GuarantorAdmin(admin.ModelAdmin):
    list_display = ('guarantor_object', 'guarantee_amount')
    readonly_fields = ('date_created', 'date_updated')

@admin.register(LeaseOpeningBalance)
class LeaseOpeningBalanceAdmin(admin.ModelAdmin):
    list_display = ('lease', 'outstanding_balance','current_month_balance',
                    'one_month_back_balance','two_months_back_balance',
                    'three_months_back_balance','three_months_plus_balance')
    list_display_links = ('lease','outstanding_balance')
    readonly_fields = ('date_created', 'date_updated')


@admin.register(LandlordOpeningBalance)
class LandlordOpeningBalanceAdmin(admin.ModelAdmin):
    list_display = ('landlord', 'amount', 'date_created')
    readonly_fields = ('date_created', 'date_updated')

@admin.register(LeaseDeposit)
class LeaseDepositAdmin(admin.ModelAdmin):
    list_display = ('lease', 'amount', 'currency', 'deposit_date', 'deposit_holder')
    readonly_fields = ('date_created', 'date_updated')

@admin.register(LeaseTermination)
class LeaseTerminationAdmin(admin.ModelAdmin):
    list_display = ('lease', 'termination_date', 'reason')
    readonly_fields = ('date_created', 'date_updated')