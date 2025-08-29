from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.subscriptions.api.views import SubscriptionAdminViewSet

router = DefaultRouter()
router.register(r'', SubscriptionAdminViewSet, basename='subscriptions')

urlpatterns = [
    path('', include(router.urls)),
]