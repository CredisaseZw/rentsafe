from django.urls import path
from apps.users.api.views import (
    LoginView,
    CurrentUserView,
    CompanyUserCreateView
)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/company/', CompanyUserCreateView.as_view(), name='company-user-create'),
]