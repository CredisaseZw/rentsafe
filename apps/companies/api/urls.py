# apps/companies/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.companies.api import views

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'branches', views.CompanyBranchViewSet)
router.register(r'contact-persons', views.ContactPersonViewSet)
router.register(r'profiles', views.CompanyProfileViewSet) 

app_name = 'companies_api'

urlpatterns = [ 
    path('', include(router.urls)),
]