from django.contrib import admin
from apps.properties.models.models import Property, Unit, PropertyType
# Register your models here.
admin.site.register(Property)
admin.site.register(Unit)
admin.site.register(PropertyType)