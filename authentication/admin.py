from django.contrib import admin
from .models import *

@admin.register(CustomUser)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("email","id","user_id","individual","company","user_type","is_superuser","is_staff","can_send_email")
    list_display_links = ("email","company")
    search_fields = ("email","company")
    list_filter = ("user_type","is_superuser","is_staff","can_send_email")
    list_per_page = 20
# Register your models here.

