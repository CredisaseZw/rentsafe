from apps.common.models.models import Document, Note, Country, City, Province, Suburb
from django.contrib import admin
from django.utils.translation import gettext_lazy as _

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'document_type', 'file', 'is_verified', 'date_created', 'date_updated')
    search_fields = ('document_type', 'file')
    list_filter = ('is_verified', 'date_created', 'date_updated')
    ordering = ('-date_created', 'date_updated')
    readonly_fields = ('date_created', 'date_updated')

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'content', 'is_private', 'date_created', 'date_updated')
    search_fields = ('author__username', 'content')
    list_filter = ('is_private', 'date_created', 'date_updated')
    ordering = ('-date_created', 'date_updated')
    readonly_fields = ('date_created', 'date_updated')

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'slug', 'dial_code', 'currency_code', 'currency_name', 'is_active')
    search_fields = ('name', 'code', 'slug')
    list_filter = ('is_active',)
    ordering = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'code', 'slug', 'is_active', 'approved')
    search_fields = ('name', 'code', 'slug', 'country__name')
    list_filter = ('is_active', 'approved')
    ordering = ('country__name', 'name')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'province', 'is_active')
    search_fields = ('name', 'province__name')
    list_filter = ('is_active',)
    ordering = ('province__name', 'name')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Suburb)
class SuburbAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'is_active')
    search_fields = ('name', 'city__name')
    list_filter = ('is_active',)
    ordering = ('city__name', 'name')
    prepopulated_fields = {'slug': ('name',)}