from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.maintenance.api.views import ContractorView, IndustryView, MaintenanceScheduleView

router = DefaultRouter()
router.register(r'contractor', ContractorView, basename='contractor')
router.register(r'maintenance-schedule', MaintenanceScheduleView, basename='maintenance_schedule')
router.register(r'', IndustryView, basename='industry')


urlpatterns = [
    path('', include(router.urls)),
]