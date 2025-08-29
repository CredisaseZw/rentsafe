from apps.subscriptions.models.models import Subscription, SubscriptionPeriod, Services
from django.contrib import admin

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'service', 'subscription_class',
                    'period', 'total_slots', 'used_slots', 'currency',
                    'payment_method', 'total_amount', 'monthly_amount',
                    'start_date','end_date', 'is_activated'
                   ]
    list_filter = ['service', 'subscription_class', 'period']
    search_fields = ['client',]
    list_display_links = ['client']
    ordering =['-date_created',]
    readonly_fields = ['id', 'date_created', 'date_updated']
    def subscriber_object(self, obj):
        return f"{obj.content_type} - {obj.object_id}"

    def client(self, obj):
        return obj.client

    fieldsets = (
        (None, {
            'fields': ('client', 'service', 'subscription_class', 'is_activated')
        }),
        ('Subscription Details', {
            'fields': ('period', 'total_slots', 'used_slots', 'start_date', 'end_date')
        }),
        ('Financial Details', {
            'fields': ('currency', 'payment_method', 'total_amount', 'monthly_amount')
        }),
        ('Metadata', {
            'fields': ('id', 'date_created', 'date_updated')
        }),

    )
@admin.register(SubscriptionPeriod)
class SubscriptionPeriodAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'code', 'period_length_days', 'period_length_months']

@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = ['id', 'service_name']
