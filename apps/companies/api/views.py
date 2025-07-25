# apps/companies/api/views.py
from rest_framework import viewsets, mixins, status, serializers
from rest_framework.decorators import action, api_view
from django.db import transaction, IntegrityError
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from apps.common.api.views import BaseViewSet
from apps.common.utils.caching import CacheService
from apps.common.api.serializers import DocumentSerializer, NoteSerializer
from apps.companies.models.models import Company, CompanyBranch, CompanyProfile
from apps.companies.api.serializers import (
    CompanyCreateSerializer, CompanyUpdateSerializer, CompanyDetailSerializer,
    CompanyMinimalSerializer, CompanyBranchSearchSerializer, CompanyBranchSerializer
)
import logging
from celery import shared_task

logger = logging.getLogger('companies')


class CompanyViewSet(BaseViewSet):
    """
    ViewSet for managing companies and their branches with search functionality.
    Inherits caching and soft-delete logic from BaseSoftDeleteViewSet.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Returns the base queryset for companies, filtering out soft-deleted ones.
        Overrides BaseSoftDeleteViewSet's get_queryset if Company model uses `is_deleted`.
        """
        return (
            Company.objects.filter(is_deleted=False)
            .select_related()
            .prefetch_related(
                'addresses',
                'addresses__country',
                'addresses__province',
                'addresses__city',
                'addresses__suburb',
                'branches',
                'branches__addresses',
                'profile',
            )
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
        """Create a new company, using perform_create from BaseViewSet."""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            detail_serializer = CompanyDetailSerializer(serializer.instance)
            return self._create_rendered_response(detail_serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating company: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to create company', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )
    
    @CacheService.cached(tag_prefix='company:{pk}')
    def retrieve(self, request, *args, **kwargs):
        """Retrieve full company details, with caching."""
        try:
            company = self.get_object()
            serializer = CompanyDetailSerializer(company)
            return self._create_rendered_response(serializer.data)
        except Company.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Company not found'}, 
                status.HTTP_404_NOT_FOUND
            )
        
    def update(self, request, *args, **kwargs):
        """Update company (PUT request), using perform_update from BaseViewSet."""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            detail_serializer = CompanyDetailSerializer(serializer.instance)
            return self._create_rendered_response(detail_serializer.data)
        except Exception as e:
            logger.error(f"Error updating company {kwargs.get('pk', 'unknown')}: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to update company', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )

    @CacheService.cached(tag_prefix='company:list')
    def list(self, request, *args, **kwargs):
        """List companies with minimal data, with caching."""
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            logger.info(f"Listing companies, total count: {queryset.count()}")
            if page is not None:
                serializer = CompanyMinimalSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = CompanyMinimalSerializer(queryset, many=True)
            return self._create_rendered_response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing companies: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to list companies', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a company, leveraging perform_destroy from BaseSoftDeleteViewSet.
        """
        logger.info(f"Soft deleting company with ID: {kwargs.get('pk', 'unknown')}")
        try:
            company = self.get_object()
            company.is_deleted = True
            company.is_active = False 
            company.save()
            self.perform_destroy(company)
            return self._create_rendered_response({'message': 'Company deleted successfully'}, status.HTTP_204_NO_CONTENT)
        except Company.DoesNotExist:
            logger.error(f"Company with ID {kwargs.get('pk', 'unknown')} not found for deletion.")
            return self._create_rendered_response(
                {'error': 'Company not found'}, 
                status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], url_path='search')
    @CacheService.cached(tag_prefix='company:search')
    def search(self, request):
        """
        Search companies by registration name, trading name, or registration number, with caching.
        """
        search_term = request.query_params.get('q', '').strip()
        company_pk = request.query_params.get('pk', '').strip()
        
        if not search_term:
            return self._create_rendered_response(
                {'error': 'Search term (q) is required'}, 
                status.HTTP_400_BAD_REQUEST
            )
        
        if company_pk:
            try:
                company = Company.objects.get(pk=company_pk, is_deleted=False)
                serializer = CompanyDetailSerializer(company)
                return self._create_rendered_response(serializer.data)
            except Company.DoesNotExist:
                return self._create_rendered_response(
                    {'error': 'Company not found'}, 
                    status.HTTP_404_NOT_FOUND
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
        
        page = self.paginate_queryset(branches)
        if page is not None:
            serializer = CompanyBranchSearchSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CompanyBranchSearchSerializer(branches, many=True)
        return self._create_rendered_response(serializer.data)

    @action(detail=True, methods=['get'], url_path='get-branches')
    @CacheService.cached(tag_prefix='company:{pk}:branches')
    def branches(self, request, pk=None):
        """Get all branches for a specific company, with caching."""
        print('Fetching branches for company from the DB....:', pk)
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
        return self._create_rendered_response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='create-branch')
    def create_branch(self, request, pk=None):
        """Create a new branch for a company"""
        company = self.get_object()
        
        data = request.data.copy()
        data['company'] = company.id
        if CompanyBranch.objects.filter(company=company, branch_name=data.get('branch_name')).exists():
            return self._create_rendered_response(
                {'error': 'Branch with this name already exists'},
                status.HTTP_400_BAD_REQUEST
            )
        try:
            serializer = CompanyBranchSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            branch = serializer.save()
            response_serializer = CompanyBranchSerializer(branch)
            return self._create_rendered_response(response_serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating branch for company {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to create branch', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
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
                return self._create_rendered_response(serializer.data)
                
            elif request.method in ['PUT', 'PATCH']:
                branch = CompanyBranch.objects.get(pk=branch_pk, company=company, is_deleted=False)
                data = request.data.copy()
                data['company'] = company.id
                partial = request.method == 'PATCH'
                serializer = CompanyBranchSerializer(branch, data=data, partial=partial)
                serializer.is_valid(raise_exception=True)
                branch = serializer.save()
                return self._create_rendered_response(serializer.data)
                
            elif request.method == 'DELETE':
                branch = CompanyBranch.objects.get(pk=branch_pk, company=company, is_deleted=False)
                branch.is_deleted = True
                branch.save()
                return self._create_rendered_response({'message': 'Branch deleted successfully'}, status.HTTP_204_NO_CONTENT)
                
        except CompanyBranch.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Branch not found'}, 
                status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in branch operation {request.method} for branch {branch_pk} in company {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': f'Failed to {request.method.lower()} branch', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['delete'], url_path='branches/(?P<branch_pk>[^/.]+)/permanent')
    def permanent_delete_branch(self, request, pk=None, branch_pk=None):
        """Permanently delete a specific branch"""
        company = self.get_object()
        
        try:
            branch = CompanyBranch.objects.get(pk=branch_pk, company=company)
            branch.delete()
            return self._create_rendered_response({'message': 'Branch permanently deleted successfully'}, status.HTTP_204_NO_CONTENT)
        except CompanyBranch.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Branch not found'}, 
                status.HTTP_404_NOT_FOUND
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
            return self._create_rendered_response({
                "message": f"Company has been {'activated' if company.is_active else 'deactivated'}",
                "company": serializer.data
            }, status.HTTP_200_OK)
        except Company.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Company not found'}, 
                status.HTTP_404_NOT_FOUND
            )
    @action(detail=True, methods=['post'], url_path='toggle-verified')
    def toggle_verified(self, request, pk=None):
        """Toggle company verified status"""
        company = self.get_object()
        company.is_verified = not company.is_verified
        company.save()
        
        
        serializer = CompanyDetailSerializer(company)
        return self._create_rendered_response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='delete')
    def soft_delete(self, request, pk=None):
        """Soft delete a company"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self._create_rendered_response({'message': 'Company deleted successfully'}, status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], url_path='location-data')
    @CacheService.cached(tag_prefix='choices:location',timeout=CacheService.LONG_CACHE_TIMEOUT)
    def get_location_data(self, request):
        """
        Get location data for dropdowns, with caching.
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
        
        return self._create_rendered_response(data)
    
    @action(detail=False, methods=['get'], url_path='choices')
    @CacheService.cached('c')
    def get_choices(self, request):
        """Get model choices for dropdowns, with caching."""
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
        return self._create_rendered_response(choices)
    
    @action(detail=False, methods=['get'], url_path='company-branches')
    @CacheService.cached(tag_prefix='company:{pk}:branches')
    def branches_by_company(self, request, pk=None):
        """Get all branches for a specific company (legacy endpoint), with caching."""
        company_id = request.query_params.get('company_id')
        
        if not company_id:
            return self._create_rendered_response(
                {'error': 'company_id parameter is required'},
                status.HTTP_400_BAD_REQUEST
            )
        try:
            company = get_object_or_404(Company, pk=company_id, is_deleted=False)
            branches = CompanyBranch.objects.filter(company_id=company_id, is_deleted=False)
            serializer = CompanyBranchSerializer(branches, many=True)
            return self._create_rendered_response(serializer.data)
        except Company.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Company not found'}, 
                status.HTTP_404_NOT_FOUND
            )
    @action(detail=False, methods=['get'], url_path='task-status/(?P<task_id>[^/.]+)')
    def task_status(self, request, task_id=None):
        """
        Check the status of a background task
        """
        try:
            from celery.result import AsyncResult
            
            task_result = AsyncResult(task_id)
            
            if task_result.ready():
                if task_result.successful():
                    result = task_result.get()
                    if result.get('success'):
                        company_id = result.get('company_id')
                        try:
                            company = Company.objects.get(id=company_id)
                            detail_serializer = CompanyDetailSerializer(company)
                            return self._create_rendered_response({
                                'status': 'completed',
                                'company': detail_serializer.data,
                                'message': result.get('message', 'Company created successfully')
                            })
                        except Company.DoesNotExist:
                            return self._create_rendered_response({
                                'status': 'completed',
                                'message': result.get('message', 'Company created successfully')
                            })
                    else:
                        return self._create_rendered_response({
                            'status': 'failed',
                            'error': result.get('error', 'Unknown error')
                        })
                else:
                    return self._create_rendered_response({
                        'status': 'failed',
                        'error': str(task_result.info)
                    })
            else:
                return self._create_rendered_response({
                    'status': 'processing',
                    'message': 'Company creation is still in progress'
                })
                
        except Exception as e:
            logger.error(f"Error checking task status: {str(e)}")
            return self._create_rendered_response({
                'status': 'error',
                'error': 'Failed to check task status'
            }, status.HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=True, methods=['post'], url_path='add-documents')
    def add_document(self, request, pk=None):
        company = self.get_object()
        serializer = DocumentSerializer(
            data=request.data,
            context={
                'content_type': ContentType.objects.get_for_model(Company),
                'object_id': company.id
            }
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)