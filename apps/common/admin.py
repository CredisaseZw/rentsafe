from django.contrib import admin

# Register your models here.
# common/admin.py
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline, GenericStackedInline
from common.models.models import Document, Note 
from common.models.base_models import BaseModel


class DocumentInline(GenericTabularInline):
    model = Document
    extra = 0 
    fields = ('document_type', 'file', 'description', 'is_verified', 'user', 'date_created')
    readonly_fields = ('uploaded_at', 'user', 'date_created', 'date_updated')
    classes = ('collapse',) 

class NoteInline(GenericStackedInline):
    model = Note
    extra = 0
    fields = ('author', 'content', 'is_private', 'user', 'date_created')
    readonly_fields = ('author', 'user', 'date_created', 'date_updated') # Author is set by the system
    classes = ('collapse',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'content_object', 'file', 'is_verified', 'uploaded_at', 'user')
    list_filter = ('document_type', 'is_verified')
    search_fields = ('description', 'content_type__model')
    raw_id_fields = ('content_type', 'user') # content_type is a FK
    readonly_fields = ('uploaded_at', 'user', 'date_created', 'date_updated')
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id', 'document_type', 'file', 'description')
        }),
        ('Verification & Audit', {
            'fields': ('is_verified', 'user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('content_object', 'author', 'content', 'is_private', 'date_created', 'user')
    list_filter = ('is_private',)
    search_fields = ('content', 'content_object__name', 'author__username')
    raw_id_fields = ('content_type', 'author', 'user')
    readonly_fields = ('date_created', 'date_updated', 'user')
    fieldsets = (
        (None, {
            'fields': ('content_type', 'object_id', 'author', 'content', 'is_private')
        }),
        ('Audit Info', {
            'fields': ('user', 'date_created', 'date_updated'),
            'classes': ('collapse',)
        }),
    )