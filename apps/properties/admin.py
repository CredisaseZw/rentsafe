from django.contrib import admin
from apps.properties.models.models import Property, Unit, PropertyType
from apps.leases.models import Landlord
# Register your models here.

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','total_number_of_units','year_built','get_address')
    fieldsets = (
        (None, {
            'fields': ('managing_client','property_type', 'name', 'description', 'status', 'year_built', 'total_area', 'is_furnished', 'total_number_of_units', 'features')
        }),
        ('Timestamps', {
            'fields': ('date_created', 'date_updated'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('date_created', 'date_updated')
    search_fields = ('name','total_number_of_units','year_built','addresses')

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'unit_number')
    search_fields = ('unit_number', 'property__name')

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Landlord)
class LandlordAdmin(admin.ModelAdmin):
    list_display = ('id', 'landlord_name', 'landlord_type','landlord_id')
    search_fields = ('landlord_name', 'landlord_type')
