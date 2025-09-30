# apps/companies/api/views.py
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response 
from django.db import transaction, IntegrityError
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound 
from apps.common.api.views import BaseViewSet 
from apps.common.utils.caching import CacheService
from apps.common.api.serializers import DocumentSerializer, NoteSerializer
from apps.companies.models.models import Company, CompanyBranch, CompanyProfile
from apps.companies.api.serializers import (
    CompanyClaimSerializer, CompanyCreateSerializer, CompanyUpdateSerializer, CompanyDetailSerializer,
    CompanyMinimalSerializer,
    CompanyBranchSearchSerializer, CompanyBranchSerializer,
    CompanyBranchDetailSerializer, CompanyBranchMinimalSerializer,
    CompanyBranchLeaseDetailSerializer
)
from apps.common.utils import extract_error_message
import logging
from celery.result import AsyncResult 

logger = logging.getLogger('companies')


class CompanyViewSet(BaseViewSet):
    """
    ViewSet for managing Company instances.
    Handles CRUD operations and company-specific actions.
    """
    queryset = Company.objects.filter(is_deleted=False).prefetch_related('addresses', 'profile', 'branches').order_by('-date_created')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list': # List of Companies, not branches
            return CompanyMinimalSerializer
        elif self.action == 'create':
            return CompanyCreateSerializer
        elif self.action in ['update', 'partial_update', 'toggle_active', 'toggle_verified', 'soft_delete']:
            return CompanyUpdateSerializer 
        elif self.action == 'retrieve':
            return CompanyDetailSerializer
        elif self.action == 'search':
            return CompanyMinimalSerializer # For company search results
        return CompanyDetailSerializer # Default for other specific actions if not caught

    def create(self, request, *args, **kwargs):
        """Create a new company and its HQ branch."""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer) 
            
            company = serializer.instance
            hq_branch = company.branches.filter(is_headquarters=True).first()
            if hq_branch:
                response_serializer = CompanyBranchDetailSerializer(hq_branch) 
                return self._create_rendered_response(response_serializer.data, status.HTTP_201_CREATED)
            else:
                return self._create_rendered_response(
                    {'error': 'Company created but HQ branch not found'},
                    status.HTTP_201_CREATED
                )
        except Exception as e:
            logger.error(f"Error creating company: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
    
    @CacheService.cached(tag_prefix='company:{pk}')
    def retrieve(self, request, *args, **kwargs):
        """Retrieve full Company details, with caching."""
        try:
            company = self.get_object() # self.get_object() uses self.queryset
            logger.info(f'Fetching company {company.id} from the DB....')
            serializer = self.get_serializer(company)
            return self._create_rendered_response(serializer.data)
        except Company.DoesNotExist:
            raise NotFound({'error': 'Company not found'})
        
    def update(self, request, *args, **kwargs):
        """Update company (PUT request), using perform_update from BaseViewSet."""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object() # This is the Company instance now
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer) # This saves the company
            
            # Return the updated Company details, not just HQ branch
            detail_serializer = CompanyDetailSerializer(instance) # Serialize the company itself
            return self._create_rendered_response(detail_serializer.data)

        except Exception as e:
            logger.error(f"Error updating company {kwargs.get('pk', 'unknown')}: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to update company', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )
            
    @CacheService.cached(tag_prefix='companies:list')
    def list(self, request, *args, **kwargs):
        """List companies with minimal data, with caching."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            logger.info(f"Listing companies, total count: {queryset.count()}")
            
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing companies: {str(e)}")
            return self._create_rendered_response(
                {'error': 'Failed to list companies', 'details': str(e)},
                status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a company and all its associated branches.
        """
        try:
            company = self.get_object()
            logger.info(f"Soft deleting company with ID: {company.id}")

            with transaction.atomic():
                company.is_deleted = True
                company.is_active = False 
                company.save()
                
                company.branches.filter(is_deleted=False).update(is_deleted=True)
            
            return self._create_rendered_response(
                {'message': 'Company and all branches deleted successfully'}, 
                status.HTTP_204_NO_CONTENT
            )
        except Company.DoesNotExist:
            logger.error(f"Company with ID {kwargs.get('pk', 'unknown')} not found for deletion.")
            raise NotFound({'error': 'Company not found'})
        except Exception as e:
            logger.error(f"Error soft deleting company {kwargs.get('pk', 'unknown')}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='search')
    @CacheService.cached(tag_prefix='company:search')
    def search(self, request):
        """Search companies."""
        search_term = request.query_params.get('q', '').strip()
        
        if not search_term:
            return self._create_rendered_response(
                {'error': 'Search term (q) is required'}, 
                status.HTTP_400_BAD_REQUEST
            )
        
        companies = Company.objects.filter(
            Q(registration_name__icontains=search_term) |
            Q(trading_name__icontains=search_term) |
            Q(registration_number__icontains=search_term),
            is_deleted=False,
            is_active=True
        ).select_related('profile').prefetch_related(
            'addresses', 'addresses__country', 'addresses__province',
            'addresses__city', 'addresses__suburb'
        )
        
        page = self.paginate_queryset(companies)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(companies, many=True)
        return self._create_rendered_response(serializer.data)
        
    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        """Toggle company active/deleted status"""
        try:
            company = self.get_object() 
            company.is_active = not company.is_active
            company.is_deleted = not company.is_active 
            company.save()
            serializer = self.get_serializer(company)
            return self._create_rendered_response({
                "message": f"Company has been {'activated' if company.is_active else 'deactivated'}",
                "company": serializer.data
            }, status.HTTP_200_OK)
        except Company.DoesNotExist:
            raise NotFound({'error': 'Company not found'})
    
    @action(detail=False, methods=['get'], url_path='company-branches')
    def company_branches(self, request):
        """Get all branches for all companies."""
        company = request.query_params.get('company_id')
        try:
            branches = CompanyBranch.objects.filter(company__id=company, is_deleted=False).select_related('company').order_by('-date_created')
            serializer = CompanyBranchSearchSerializer(branches, many=True)
            return self._create_rendered_response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching company branches: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
            
    @action(detail=True, methods=['post'], url_path='toggle-verified')
    def toggle_verified(self, request, pk=None):
        """Toggle company verified status"""
        company = self.get_object() 
        company.is_verified = not company.is_verified
        company.save()

        serializer = self.get_serializer(company)
        return self._create_rendered_response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='add-documents')
    def add_document(self, request, pk=None):
        try:
            company = self.get_object() 
            serializer = DocumentSerializer(
                data=request.data,
                context={
                    'content_type': ContentType.objects.get_for_model(Company),
                    'object_id': company.id
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error adding document to company {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='location-data')
    @CacheService.cached(tag_prefix='choices:location',timeout=CacheService.LONG_CACHE_TIMEOUT)
    def get_location_data(self, request):
        """
        Get location data for dropdowns, with caching.
        """
        from apps.common.models.models import Country, Province, City, Suburb # Import here to avoid circular
        
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
        from apps.companies.models.models import Company, CompanyProfile # Import here
        
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
    
    @action(detail=False, methods=['get'], url_path='task-status/(?P<task_id>[^/.]+)')
    def task_status(self, request, task_id=None):
        """
        Check the status of a background task
        """
        try:
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


class CompanyBranchViewSet(BaseViewSet): 
    """
    ViewSet for managing CompanyBranch instances.
    Handles CRUD operations for branches.
    """
    queryset = CompanyBranch.objects.filter(is_deleted=False, company__is_deleted=False).select_related('company').order_by('-date_created')
    serializer_class = CompanyBranchSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        queryset = super().get_queryset()
        if search:
            queryset = queryset.filter(Q(branch_name__icontains=search) | Q(company__trading_name__icontains=search) | Q(company__registration_number__icontains=search), is_deleted=False, company__is_deleted=False)
        return queryset
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return CompanyBranchMinimalSerializer
        elif self.action == 'retrieve':
            return CompanyBranchDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CompanyBranchSerializer
        elif self.action == 'search':
            return CompanyBranchLeaseDetailSerializer
        elif self.action == 'branches_by_company':
            return CompanyBranchSerializer 
        elif self.action == 'claims':
            return CompanyClaimSerializer
        return CompanyBranchMinimalSerializer
    

    def create(self, request, *args, **kwargs):
        """Create a new branch."""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            branch = serializer.save() 
            return self._create_rendered_response(CompanyBranchMinimalSerializer(branch).data, status.HTTP_201_CREATED)
        except IntegrityError:
            return self._create_rendered_response(
                {'error': 'A branch with this name already exists for this company.'},
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating branch: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None):
        """Retrieve details of a specific branch."""
        try:
            branch = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(branch) 
            return self._create_rendered_response(serializer.data)
        except CompanyBranch.DoesNotExist:
            raise NotFound({'error': 'Branch not found'})
        except Exception as e:
            logger.error(f"Error retrieving branch {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
    

    def update(self, request, pk=None, *args, **kwargs):
        """Update a specific branch."""
        try:
            branch = self.get_queryset().get(pk=pk) 
            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(branch, data=request.data, partial=partial, context={'request': request})
            
            serializer.is_valid(raise_exception=True)
            updated_branch = serializer.save()
            
            response_serializer = self.get_serializer(updated_branch)
            return self._create_rendered_response(response_serializer.data)
        except CompanyBranch.DoesNotExist:
            raise NotFound({'error': 'Branch not found'})
        except Exception as e:
            logger.error(f"Error updating branch {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
            
    def destroy(self, request, pk=None):
        """Soft delete a specific branch."""
        try:
            branch = self.get_queryset().get(pk=pk)
            branch.is_deleted = True
            branch.save()
            return self._create_rendered_response({'message': 'Branch deleted successfully'}, status.HTTP_204_NO_CONTENT)
        except CompanyBranch.DoesNotExist:
            raise NotFound({'error': 'Branch not found'})
        except Exception as e:
            logger.error(f"Error soft deleting branch {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
            
    @action(detail=True, methods=['delete'], url_path='permanent')
    def permanent_delete(self, request, pk=None):
        """Permanently delete a specific branch."""
        try:
            branch = get_object_or_404(CompanyBranch.objects.all(), pk=pk)
            branch.delete()
            return self._create_rendered_response({'message': 'Branch deleted successfully'}, status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error permanently deleting branch {pk}: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='search')
    @CacheService.cached(tag_prefix='branches:search')
    def search(self, request):
        """Search company branches by name or associated company details."""
        search_term = request.query_params.get('q', '').strip()
        
        if not search_term:
            return self._create_rendered_response(
                {'error': 'Search term (q) is required'}, 
                status.HTTP_400_BAD_REQUEST
            )
        
        branches = self.get_queryset().filter(
            Q(branch_name__icontains=search_term) |
            Q(company__trading_name__icontains=search_term) |
            Q(company__registration_number__icontains=search_term)
        ).select_related(
            'company', 'company__profile'
        ).prefetch_related(
            'company__addresses', 'company__addresses__country',
            'company__addresses__province', 'company__addresses__city',
            'company__addresses__suburb', 'addresses', 'addresses__country',
            'addresses__province', 'addresses__city', 'addresses__suburb'
        )
        
        page = self.paginate_queryset(branches)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(branches, many=True)
        return self._create_rendered_response(serializer.data)
    
                
    @action(detail=False, methods=['get'], url_path='claims')
    def claims(self, request, pk=None):
        """Get all claims associated with a company's branches."""
        try:
            queryset = self.get_queryset()
            queryset = self.filter_queryset(queryset)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving company claims: {extract_error_message(e)}")
            return self._create_rendered_response(
                {'error': "Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
