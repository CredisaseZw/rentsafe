# apps/leases/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.leases.api.views import LandlordViewSet, LeaseViewSet, TenantViewSet

router = DefaultRouter()

router.register(r"tenants", TenantViewSet, basename="tenant")
router.register(r"landlords", LandlordViewSet, basename="landlord")
router.register(r"", LeaseViewSet, basename="lease")

urlpatterns = [
    path("", include(router.urls)),
]
