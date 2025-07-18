# from clients.models.models import Client
# from django.contrib import admin
# from django.utils.translation import gettext_lazy as _

# @admin.register(Client)
# class ClientAdmin(admin.ModelAdmin):
#     list_display = ('name', 'client_content_type', 'client_object_id', 'status', 'external_client_id', 'created_at')
#     search_fields = ('name', 'external_client_id')
#     list_filter = ('status', 'client_content_type')
#     ordering = ('-created_at',)
    
#     fieldsets = (
#         (None, {
#             'fields': ('name', 'client_content_type', 'client_object_id', 'status', 'external_client_id')
#         }),
#         (_('Metadata'), {
#             'fields': ('created_at', 'updated_at')
#         }),
#     )
    
#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related('client_content_type')