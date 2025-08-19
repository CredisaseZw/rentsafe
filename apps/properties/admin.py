from django.contrib import admin
from apps.properties.models.models import Property, Unit, PropertyType
# Register your models here.

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','total_number_of_units','year_built')
    search_fields = ('name','total_number_of_units','year_built')

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'unit_number')
    search_fields = ('unit_number', 'property__name')

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
