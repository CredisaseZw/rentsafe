from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.api.views import (
    LoginView,
    CurrentUserView,
    UserViewSet,
    RoleViewSet
)

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('', include(router.urls)),
]