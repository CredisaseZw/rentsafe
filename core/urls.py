"""
URL configuration for rentsafe_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), 
    path('api/individuals/', include('apps.individuals.api.urls')),
    path('api/leases/', include('apps.leases.api.urls')),
    path('api/maintenance/', include('apps.maintenance.api.urls')),
    path('api/reports/', include('apps.reporting.api.urls')),
    path('api/auth/', include('apps.users.api.urls')),
    # path('api/inspections/', include('apps.inspections.api.urls')),
    path('api/communication/', include('apps.communications.api.urls')),
    path('api/common/', include('apps.common.api.urls')),
    path('api/legal/', include('apps.legal.api.urls')),
    path('api/credit-control/', include('apps.credit_control.api.urls')),
]
