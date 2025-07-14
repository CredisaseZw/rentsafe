# apps/common/api/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from apps.common.models.models import Country, Province, City, Suburb
from apps.common.api.serializers import (
    CountrySerializer, ProvinceSerializer,
    CitySerializer, SuburbSerializer
)
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger('common')

class CountryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing countries with filtering and search capabilities
    """
    queryset = Country.objects.filter(is_active=True)
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'code', 'currency_code']
    filterset_fields = ['is_active']
    http_method_names = ['get', 'post', 'patch', 'delete'] 

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('name')

    def perform_destroy(self, instance):
        """Override delete to set is_active=False instead of actual deletion"""
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['get'], url_path='provinces')
    def provinces(self, request, pk=None):
        """Get all provinces for a specific country"""
        country = self.get_object()
        provinces = country.provinces.filter(is_active=True)
        serializer = ProvinceSerializer(provinces, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='with-inactive')
    def with_inactive(self, request):
        """Get all countries including inactive ones (for admin purposes)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admin users can view inactive countries'},
                status=status.HTTP_403_FORBIDDEN
            )
        countries = Country.objects.all()
        serializer = self.get_serializer(countries, many=True)
        return Response(serializer.data)

class ProvinceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing provinces with filtering by country
    """
    queryset = Province.objects.filter(is_active=True)
    serializer_class = ProvinceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'code']
    filterset_fields = ['country', 'is_active', 'approved']
    http_method_names = ['get', 'post', 'patch', 'delete']  

    def get_queryset(self):
        queryset = super().get_queryset()
        if country_id := self.request.query_params.get('country_id'):
            queryset = queryset.filter(country_id=country_id)
        return queryset.order_by('name')

    def perform_destroy(self, instance):
        """Override delete to set is_active=False instead of actual deletion"""
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['get'], url_path='cities')
    def cities(self, request, pk=None):
        """Get all cities for a specific province"""
        province = self.get_object()
        cities = province.cities.filter(is_active=True)
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='approve')
    def approve(self, request, pk=None):
        """Approve a province (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admin users can approve provinces'},
                status=status.HTTP_403_FORBIDDEN
            )
        province = self.get_object()
        province.approved = True
        province.save()
        serializer = self.get_serializer(province)
        return Response(serializer.data)

class CityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cities with filtering by province
    """
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['province', 'is_active']
    http_method_names = ['get', 'post', 'patch', 'delete']  

    def get_queryset(self):
        queryset = super().get_queryset()
        if province_id := self.request.query_params.get('province_id'):
            queryset = queryset.filter(province_id=province_id)
        return queryset.order_by('name')

    def perform_destroy(self, instance):
        """Override delete to set is_active=False instead of actual deletion"""
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['get'], url_path='suburbs')
    def suburbs(self, request, pk=None):
        """Get all suburbs for a specific city"""
        city = self.get_object()
        suburbs = city.suburbs.filter(is_active=True)
        serializer = SuburbSerializer(suburbs, many=True)
        return Response(serializer.data)

class SuburbViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing suburbs with filtering by city
    """
    queryset = Suburb.objects.filter(is_active=True)
    serializer_class = SuburbSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['city', 'is_active']
    http_method_names = ['get', 'post', 'patch', 'delete']  

    def get_queryset(self):
        queryset = super().get_queryset()
        if city_id := self.request.query_params.get('city_id'):
            queryset = queryset.filter(city_id=city_id)
        return queryset.order_by('name')

    def perform_destroy(self, instance):
        """Override delete to set is_active=False instead of actual deletion"""
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby_suburbs(self, request):
        """
        Get suburbs near a specific suburb (by ID)
        Useful for location-based searches
        """
        suburb_id = request.query_params.get('suburb_id')
        if not suburb_id:
            return Response(
                {'error': 'suburb_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            suburb = get_object_or_404(Suburb, pk=suburb_id)
            # Get suburbs in the same city
            nearby = Suburb.objects.filter(
                city=suburb.city,
                is_active=True
            ).exclude(pk=suburb_id)
            serializer = self.get_serializer(nearby, many=True)
            return Response(serializer.data)
        except Suburb.DoesNotExist:
            return Response(
                {'error': 'Suburb not found'},
                status=status.HTTP_404_NOT_FOUND
            )