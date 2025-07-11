from django.urls import path
from apps.users.api.views import (
    LoginView,
    CurrentUserView,
    CompanyUserCreateView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('company/', CompanyUserCreateView.as_view(), name='company-user-create'),
]