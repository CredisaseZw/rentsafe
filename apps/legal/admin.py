from attr import attr
from django.contrib import admin
from apps.legal.models import Claim
from django.utils.html import format_html

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'get_debtor','amount', 'claim_date', 'is_verified', 'is_closed', 'verified_by', 'closed_by', 'get_opened_by', 'date_created')
    search_fields = ('client__name', 'amount')
    list_filter = ('claim_date', 'client')
    readonly_fields = ('id', 'created_by', 'date_created', 'date_updated', 'get_debtor', 'get_debtor_info')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('client', 'debtor_content_type', 'debtor_object_id', 'amount', 'currency', 'data_source')
        }),
        ('Debtor Information', {
            'fields': ('get_debtor', 'get_debtor_info'),
        }),
        ('Status', {
            'fields': ('is_verified', 'verified_by', 'is_closed', 'closed_by')
        }),
        ('Audit Info', {
            'fields': ('created_by', 'date_created', 'date_updated')
        }),
        ('Time Info', {
            'fields': ('claim_date', 'verified_date', 'closed_date')
        })
    )
    from django.utils.html import format_html

    def get_debtor_info(self, obj):
        """
        Return a nicely formatted summary of the debtor (name/email/phone/address).
        Uses line breaks and bold labels for readability in Django admin.
        """
        debtor = getattr(obj, 'debtor_object', None)
        if not debtor:
            return '-'

        field_map = {
            'Name': ['name', 'full_name'],
            'Email': ['email'],
            'Phone': ['phone', 'phone_number'],
            'Address': ['address'],
        }

        # for attr in list(field_map.get('Email', [])):
        #     val = getattr(debtor, attr, None)
        #     if val:
        #         mailto = format_html("<a href='mailto:{}'>{}</a>", val, val)
         
        #     try:
        #         setattr(debtor, attr, mailto)
        #     except Exception:
        #         fallback = f"_mailto_{attr}"
        #         setattr(debtor, fallback, mailto)
        #         field_map['Email'].insert(0, fallback)
        #     break

        parts = []
        for label, attr_names in field_map.items():
            for attr in attr_names:
                val = getattr(debtor, attr, None)
                if val:
                    parts.append(f"<strong>{label}:</strong> {val}")
                    break 

        return format_html("<br>".join(parts)) if parts else str(debtor)

    get_debtor_info.short_description = 'Debtor Info'


    def get_debtor(self, obj):
        return str(obj.debtor_object)
    get_debtor.short_description = 'Debtor'
    
    def get_opened_by(self, obj):
        return obj.created_by.get_full_name() or obj.created_by.username if obj.created_by else '-'
    get_opened_by.short_description = 'Opened By'