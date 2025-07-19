from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from apps.leases.models.landlord import Landlord

class LandlordInline(GenericTabularInline):
    model = Landlord
    extra = 1
    verbose_name = "Landlord"
    verbose_name_plural = "Landlords"
    fields = ('content_type', 'object_id', 'landlord_object')
    readonly_fields = ('content_type', 'object_id', 'landlord_object')

class LandlordAdmin(admin.ModelAdmin):
    list_display = ('landlord_object', 'content_type', 'object_id', 'date_created')
    search_fields = ('landlord_object__name',)
    readonly_fields = ('date_created', 'date_updated')
    
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id', 'landlord_object')
        }),
        ('Dates', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )
admin.site.register(Landlord, LandlordAdmin)