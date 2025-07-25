# apps/leases/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.leases.api.views import LeaseViewSet

router = DefaultRouter()
router.register(r'', LeaseViewSet, basename='lease')

urlpatterns = [
    path('', include(router.urls)),
]