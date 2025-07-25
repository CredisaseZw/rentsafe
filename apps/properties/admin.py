from django.contrib import admin
from apps.properties.models.models import Property, Unit
# Register your models here.
admin.site.register(Property)
admin.site.register(Unit)