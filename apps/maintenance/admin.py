from django.contrib import admin
from apps.maintenance.models.models import(
    MaintenanceSchedule, 
    WorkSchedule , 
    MaintenanceRequest, 
    Industry,
    Contractor
)

@admin.register(MaintenanceSchedule)
class MaintenanceScheduleAdmin(admin.ModelAdmin):
    list_display = ('maintenance_number', 'lease', 'title','budget', 'status','frequency', 'scheduled_day', 'month_frequency', 'tenant_landlord_contact',)

@admin.register(WorkSchedule)
class WorkScheduleAdmin(admin.ModelAdmin):
    list_display = ()

@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ('id',)

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'description')

@admin.register(Contractor)
class ContractorAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'reg_number')