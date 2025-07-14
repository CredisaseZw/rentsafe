# apps/companies/api/views.py

from rest_framework import viewsets, mixins, status, serializers
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db import transaction, IntegrityError
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from apps.companies.models.models import Company, CompanyBranch
from apps.companies.api.serializers import (
    CompanyCreateSerializer, CompanyUpdateSerializer, CompanyDetailSerializer,
    CompanyMinimalSerializer, CompanyBranchSearchSerializer, CompanyBranchSerializer
)
import logging

logger = logging.getLogger('companies')

class CompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing companies and their branches with search functionality
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Base queryset for companies"""
        return Company.objects.filter(is_deleted=False).select_related().prefetch_related(
            'addresses', 'addresses__country', 'addresses__province', 
            'addresses__city', 'addresses__suburb', 'branches', 
            'branches__addresses', 'profile'
        )
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CompanyCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CompanyUpdateSerializer
        elif self.action == 'retrieve':
            return CompanyDetailSerializer
        elif self.action == 'search':
            return CompanyBranchSearchSerializer
        elif self.action in ['create_branch', 'update_branch', 'partial_update_branch', 'branch_detail']:
            return CompanyBranchSerializer
        return CompanyMinimalSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new company"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            company = serializer.save()
            
            # Return full company details after creation
            detail_serializer = CompanyDetailSerializer(company)
            return Response(detail_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating company: {str(e)}")
            return Response(
                {'error': 'Failed to create company', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Update company (PUT request)"""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            company = serializer.save()
            
            # Return full company details after update
            detail_serializer = CompanyDetailSerializer(company)
            return Response(detail_serializer.data)
        except Exception as e:
            logger.error(f"Error updating company {kwargs.get('pk', 'unknown')}: {str(e)}")
            return Response(
                {'error': 'Failed to update company', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def partial_update(self, request, *args, **kwargs):
        """Partial update company (PATCH request)"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve full company details"""
        try:
            company = self.get_object()
            serializer = CompanyDetailSerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response(
                {'error': 'Company not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
    def list(self, request, *args, **kwargs):
        """List companies with minimal data"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = CompanyMinimalSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CompanyMinimalSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy to use soft delete"""
        try:
            company = self.get_object()
            company.is_deleted = True
            company.is_active = False
            company.save()
            
            return Response({'message': 'Company deleted successfully'})
        except Company.DoesNotExist:
            return Response(
                {'error': 'Company not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """
        Search companies by registration name, trading name, or registration number
        Returns minimal data unless pk is provided
        
        Query Parameters:
        - q: Search term (required)
        - pk: Company primary key (optional) - returns full data if provided
        """
        search_term = request.query_params.get('q', '').strip()
        company_pk = request.query_params.get('pk', '').strip()
        
        if not search_term:
            return Response(
                {'error': 'Search term (q) is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if company_pk:
            try:
                company = Company.objects.get(pk=company_pk, is_deleted=False)
                serializer = CompanyDetailSerializer(company)
                return Response(serializer.data)
            except Company.DoesNotExist:
                return Response(
                    {'error': 'Company not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        branches = CompanyBranch.objects.filter(
            Q(company__registration_name__icontains=search_term) |
            Q(company__trading_name__icontains=search_term) |
            Q(company__registration_number__icontains=search_term) |
            Q(branch_name__icontains=search_term),
            company__is_deleted=False,
            company__is_active=True,
            is_deleted=False
        ).select_related(
            'company'
        ).prefetch_related(
            'company__addresses', 'company__addresses__country',
            'company__addresses__province', 'company__addresses__city',
            'company__addresses__suburb', 'addresses', 'addresses__country',
            'addresses__province', 'addresses__city', 'addresses__suburb'
        )
        
        # Paginate results
        page = self.paginate_queryset(branches)
        if page is not None:
            serializer = CompanyBranchSearchSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CompanyBranchSearchSerializer(branches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='get-branches')
    def branches(self, request, pk=None):
        """Get all branches for a specific company"""
        company = self.get_object()
        branches = CompanyBranch.objects.filter(
            company=company, 
            is_deleted=False
        ).select_related('company').prefetch_related(
            'addresses', 'addresses__country', 'addresses__province',
            'addresses__city', 'addresses__suburb', 'contacts'
        )
        
        page = self.paginate_queryset(branches)
        if page is not None:
            serializer = CompanyBranchSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = CompanyBranchSerializer(branches, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='create-branch')
    def create_branch(self, request, pk=None):
        """Create a new branch for a company"""
        company = self.get_object()
        
        data = request.data.copy()
        data['company'] = company.id
        
        try:
            serializer = CompanyBranchSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            branch = serializer.save()
            
            # Return the created branch with its addresses
            response_serializer = CompanyBranchSerializer(branch)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating branch for company {pk}: {str(e)}")
            return Response(
                {'error': 'Failed to create branch', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get', 'put', 'patch', 'delete'], url_path='branches/(?P<branch_pk>[^/.]+)')
    def branch_operations(self, request, pk=None, branch_pk=None):
        """Handle all branch operations (GET, PUT, PATCH, DELETE)"""
        company = self.get_object()
        
        try:
            if request.method == 'GET':
                branch = CompanyBranch.objects.select_related('company').prefetch_related(
                    'addresses', 'addresses__country', 'addresses__province',
                    'addresses__city', 'addresses__suburb', 'contacts'
                ).get(pk=branch_pk, company=company, is_deleted=False)
                
                serializer = CompanyBranchSerializer(branch)
                return Response(serializer.data)
                
            elif request.method in ['PUT', 'PATCH']:
                branch = CompanyBranch.objects.get(pk=branch_pk, company=company, is_deleted=False)
                
                data = request.data.copy()
                data['company'] = company.id
                
                partial = request.method == 'PATCH'
                serializer = CompanyBranchSerializer(branch, data=data, partial=partial)
                serializer.is_valid(raise_exception=True)
                branch = serializer.save()
                
                return Response(serializer.data)
                
            elif request.method == 'DELETE':
                branch = CompanyBranch.objects.get(pk=branch_pk, company=company, is_deleted=False)
                branch.is_deleted = True
                branch.save()
                
                return Response({'message': 'Branch deleted successfully'})
                
        except CompanyBranch.DoesNotExist:
            return Response(
                {'error': 'Branch not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in branch operation {request.method} for branch {branch_pk} in company {pk}: {str(e)}")
            return Response(
                {'error': f'Failed to {request.method.lower()} branch', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['delete'], url_path='branches/(?P<branch_pk>[^/.]+)/permanent')
    def permanent_delete_branch(self, request, pk=None, branch_pk=None):
        """Permanently delete a specific branch"""
        company = self.get_object()
        
        try:
            branch = CompanyBranch.objects.get(pk=branch_pk, company=company)
            branch.delete()
            
            return Response({'message': 'Branch permanently deleted successfully'})
        except CompanyBranch.DoesNotExist:
            return Response(
                {'error': 'Branch not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        """Toggle company active/deleted status"""
        try:
            company = Company.objects.get(pk=pk)
            company.is_active = not company.is_active
            company.is_deleted = not company.is_active
            company.save()

            serializer = CompanyDetailSerializer(company)
            return Response({
                "message": f"Company has been {'activated' if company.is_active else 'deactivated'}",
                "company": serializer.data
            }, status=status.HTTP_200_OK)
        except Company.DoesNotExist:
            return Response(
                {'error': 'Company not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    @action(detail=True, methods=['post'], url_path='toggle-verified')
    def toggle_verified(self, request, pk=None):
        """Toggle company verified status"""
        company = self.get_object()
        company.is_verified = not company.is_verified
        company.save()
        
        serializer = CompanyDetailSerializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='delete')
    def soft_delete(self, request, pk=None):
        """Soft delete a company"""
        company = self.get_object()
        company.is_deleted = True
        company.is_active = False
        company.save()
        
        return Response({'message': 'Company deleted successfully'})
    
    @action(detail=False, methods=['get'], url_path='location-data')
    def get_location_data(self, request):
        """
        Get location data for dropdowns
        
        Query Parameters:
        - country_id: Filter provinces by country
        - province_id: Filter cities by province
        - city_id: Filter suburbs by city
        """
        from apps.common.models.models import Country, Province, City, Suburb
        
        country_id = request.query_params.get('country_id')
        province_id = request.query_params.get('province_id')
        city_id = request.query_params.get('city_id')
        
        data = {}
        
        if not country_id:
            countries = Country.objects.filter(is_active=True).values('id', 'name', 'code')
            data['countries'] = list(countries)
        
        if country_id:
            provinces = Province.objects.filter(
                country_id=country_id, 
                is_active=True
            ).values('id', 'name', 'code')
            data['provinces'] = list(provinces)
        
        if province_id:
            cities = City.objects.filter(
                province_id=province_id, 
                is_active=True
            ).values('id', 'name')
            data['cities'] = list(cities)
        
        if city_id:
            suburbs = Suburb.objects.filter(
                city_id=city_id, 
                is_active=True
            ).values('id', 'name')
            data['suburbs'] = list(suburbs)
        
        return Response(data)
    
    @action(detail=False, methods=['get'], url_path='choices')
    def get_choices(self, request):
        """Get model choices for dropdowns"""
        from apps.companies.models.models import Company, CompanyProfile
        
        choices = {
            'legal_status': Company.LEGAL_STATUS_CHOICES,
            'address_types': [
                ('physical', 'Physical Address'),
                ('postal', 'Postal Address'),
                ('billing', 'Billing Address'),
                ('work', 'Work Address'),
                ('other', 'Other'),
            ],
            'trading_status': CompanyProfile.TRADING_STATUS_CHOICES,
            'trend': CompanyProfile.TREND_CHOICES,
            'risk_class': CompanyProfile.RISK_CLASS_CHOICES,
            'is_under_judicial': CompanyProfile.IS_JUDICIAL_CHOICES,
            'contact_types': [
                ('primary', 'Primary Contact'),
                ('finance', 'Finance Contact'),
                ('technical', 'Technical Contact'),
                ('other', 'Other'),
            ]
        }
        return Response(choices)
    
    @action(detail=False, methods=['get'], url_path='company-branches')
    def branches_by_company(self, request, pk=None):
        """Get all branches for a specific company (legacy endpoint)"""
        company_id = request.query_params.get('company_id')
        
        if not company_id:
            return Response(
                {'error': 'company_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            company = get_object_or_404(Company, pk=company_id, is_deleted=False)
            branches = CompanyBranch.objects.filter(company_id=company_id, is_deleted=False)
            serializer = CompanyBranchSerializer(branches, many=True)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response(
                {'error': 'Company not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )