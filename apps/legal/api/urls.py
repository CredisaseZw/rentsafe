from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.legal.api.views.contract_views import ContractViewSet

router = DefaultRouter()
router.register(r'contracts', ContractViewSet)

urlpatterns = [
    path('', include(router.urls)),
]