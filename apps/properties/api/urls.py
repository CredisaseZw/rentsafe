# apps/properties/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.properties.api.views import PropertyViewSet, UnitViewSet, PropertyTypeViewSet

router = DefaultRouter()
router.register(r'property-types', PropertyTypeViewSet, basename='property-type')

# properties_router = routers.NestedDefaultRouter(router, r'properties', lookup='property')
router.register(r'units', UnitViewSet, basename='property-units')
router.register(r'', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
    # path('', include(properties_router.urls)),
]
