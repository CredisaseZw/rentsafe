from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.companies.api.views import CompanyViewSet

router = DefaultRouter()
router.register(r'', CompanyViewSet, basename='company')

urlpatterns = [
    path('', include(router.urls)),
]

# urlpatterns += [
#     path('companies/search/', CompanyViewSet.as_view({'get': 'search'}), name='company-search'),
    
#     # Location data endpoint
#     path('companies/location-data/', CompanyViewSet.as_view({'get': 'get_location_data'}), name='company-location-data'),
    
#     # Choices endpoint
#     path('companies/choices/', CompanyViewSet.as_view({'get': 'get_choices'}), name='company-choices'),
    
#     # Company branches by company
#     path('branches/by-company/', CompanyBranchViewSet.as_view({'get': 'by_company'}), name='branches-by-company'),
# ]