# apps/leases/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from apps.leases.models.models import Lease, LeaseTenant, LeaseCharge, LeaseTermination, Guarantor
from apps.leases.models.landlord import Landlord
from apps.leases.api.serializers import (
    LeaseCreateUpdateSerializer,
    LeaseDetailSerializer,
    LeaseTenantSerializer,
    LeaseTerminationSerializer,
    LeaseListSerializer,
    LandlordSerializer,
    GuarantorSerializer
)
from apps.common.utils import extract_error_message
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from apps.individuals.models import Individual
from apps.companies.models import CompanyBranch
import logging
from rest_framework.exceptions import ValidationError
logger = logging.getLogger('leases')

class LeaseViewSet(viewsets.ModelViewSet):
    queryset = Lease.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'unit__property', 'landlord']
    search_fields = ['lease_id', 'unit__unit_number', 'unit__property__name', 
                    'lease_tenants__tenant_object__first_name',
                    'lease_tenants__tenant_object__last_name',
                    'lease_tenants__tenant_object__branch_name',
                    'lease_tenants__tenant_object__company__registration_name']
    ordering_fields = ['start_date', 'end_date', 'lease_id']
    ordering = ['-start_date']
    lookup_field = 'lease_id'
    def get_serializer_class(self):
        if self.action == 'list':
            return LeaseListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return LeaseCreateUpdateSerializer
        elif self.action == 'terminate':
            return LeaseTerminationSerializer
        return LeaseDetailSerializer
    def get_queryset(self):
        """
        Custom queryset to filter leases based on the user's company,
        unless the user is a superuser or staff member.
        """
        queryset = self.queryset
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()  # Return no leases for unauthenticated users

        if user.is_staff or user.is_superuser:
            return queryset.filter(created_by__client=user.client) 
        try:
            if hasattr(user, 'client') and user.client:
                return queryset.filter(created_by=user)
            else:
                return queryset.none()
        except Exception as e:
            logger.error(f"Error filtering queryset for user {user.id}: {e}")
            return queryset.none()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Pass request context for user tracking
            serializer.context['request'] = request
            
            lease = serializer.save()
            
            if lease.status == 'ACTIVE':
                lease.unit.status = 'occupied'
                lease.unit.save()
                
            return Response(LeaseDetailSerializer(lease).data, 
                        status=status.HTTP_201_CREATED)
        except ValidationError as ve:
            logger.error(f"Lease creation failed: {str(ve)}", exc_info=True)
            return Response(
                {"error": extract_error_message(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Lease creation failed: {str(e)}", exc_info=True)
            return Response(
                {"error": "Lease creation failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Set the request in the context for logging purposes
        serializer.context['request'] = request
        
        lease = serializer.save()
        
        # Update unit status based on lease status
        if lease.status == 'ACTIVE':
            lease.unit.status = 'occupied'
        elif lease.status in ['TERMINATED', 'EXPIRED']:
            lease.unit.status = 'vacant'
        lease.unit.save()
        
        return Response(LeaseDetailSerializer(lease).data)

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        lease = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        termination = LeaseTermination.objects.create(
            lease=lease,
            **serializer.validated_data
        )
        
        # Update lease status to terminated
        lease.status = 'TERMINATED'
        lease.save(request=request)
        
        # Update unit status to vacant
        lease.unit.status = 'vacant'
        lease.unit.save()
        
        return Response({'status': 'lease terminated'}, status=status.HTTP_200_OK)

    
    @action(detail=True, methods=['post'], url_path='add-tenant')
    def add_tenant(self, request, lease_id=None):
        lease = self.get_object()
        serializer = LeaseTenantSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        tenant_type = serializer.validated_data.pop('tenant_type', None)
        tenant_id = serializer.validated_data.pop('tenant_id', None)
        
        if tenant_type == 'individual':
            ModelClass = Individual
            app_label = 'individuals'
        elif tenant_type == 'company':
            ModelClass = CompanyBranch
            app_label = 'companies'
        else:
            return Response({"error": "Invalid tenant type."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tenant_ct = ContentType.objects.get(app_label=app_label, model=ModelClass._meta.model_name)
            if LeaseTenant.objects.filter(lease=lease, content_type=tenant_ct, object_id=tenant_id).exists():
                return Response({"error": "This tenant is already associated with this lease."}, status=status.HTTP_400_BAD_REQUEST)
            tenant_obj = get_object_or_404(ModelClass, id=tenant_id)
                
            tenant = LeaseTenant.objects.create(
                lease=lease,
                tenant_object=tenant_obj,
                **serializer.validated_data
            )
            
            return Response(LeaseTenantSerializer(tenant).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": f"Failed to add tenant: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['post'], url_path='remove-tenant')
    def remove_tenant(self, request, lease_id=None):
        lease = self.get_object()
        tenant_id = request.data.get('tenant_id')
        
        if not tenant_id:
            return Response({'error': 'tenant_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        tenant = get_object_or_404(LeaseTenant, id=tenant_id, lease=lease)
        
        # Prevent removing the only primary tenant if this is the primary
        if tenant.is_primary_tenant and lease.lease_tenants.filter(is_primary_tenant=True).count() == 1:
            return Response(
                {'error': 'Cannot remove the only primary tenant. Assign another primary tenant first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tenant.delete(request=request)
        
        return Response({'status': 'tenant removed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='set-primary-tenant')
    def set_primary_tenant(self, request, lease_id=None):
        lease = self.get_object()
        tenant_id = request.data.get('tenant_id')
        
        if not tenant_id:
            return Response({'error': 'tenant_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        tenant = get_object_or_404(LeaseTenant, id=tenant_id, lease=lease)
        
        # First unset any existing primary tenants
        lease.lease_tenants.filter(is_primary_tenant=True).update(is_primary_tenant=False)
        
        # Set this tenant as primary
        tenant.is_primary_tenant = True
        tenant.save(request=request)
        
        return Response({'status': 'primary tenant set'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='available-tenants')
    def available_tenants(self, request, lease_id=None):
        """
        Returns a list of individuals and company branches that are not already tenants on this lease
        """
        lease = self.get_object()
        
        # Get content types for individuals and company branches
        individual_ct = ContentType.objects.get(app_label='individuals', model='individual')
        company_branch_ct = ContentType.objects.get(app_label='companies', model='companybranch')
        
        # Get IDs of existing tenants
        existing_tenant_ids = lease.lease_tenants.values_list('object_id', flat=True)
        
        # Get available individuals
        from apps.individuals.models.models import Individual
        available_individuals = Individual.objects.filter(
            id__in=existing_tenant_ids,
        ).values('id', 'first_name', 'last_name', 'identification_number')
        
        # Get available company branches
        from apps.companies.models.models import CompanyBranch
        available_branches = CompanyBranch.objects.filter(
            id__in=existing_tenant_ids,
        ).values('id', 'branch_name', 'company__registration_name')
        
        return Response({
            'individuals': list(available_individuals),
            'company_branches': list(available_branches)
        })
    
    @action(detail=True, methods=['post'], url_path='set-landlord')
    def set_landlord(self, request, lease_id=None):
        lease = self.get_object()
        serializer = LandlordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            landlord_instance = serializer.save()
            
            if lease.landlord and lease.landlord.id == landlord_instance.id:
                return Response({"error": "This landlord is already assigned to this lease."}, status=status.HTTP_400_BAD_REQUEST)
            lease.landlord = landlord_instance
            lease.save(request=request)
            
            return Response(LeaseDetailSerializer(lease).data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to set landlord: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='remove-landlord')
    def remove_landlord(self, request, lease_id=None):
        lease = self.get_object()

        if not lease.landlord:
            return Response({"status": "No landlord to remove."}, status=status.HTTP_200_OK)
        lease.landlord = None
        lease.save()
        
        return Response({"status": "Landlord removed from lease."}, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['post'], url_path='set-guarantor')
    def set_guarantor(self, request, lease_id=None):
        lease = self.get_object()
        serializer = GuarantorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # The serializer's create method now handles the GFK fields
            guarantor_instance = serializer.save()
            
            # Update the lease's guarantor field
            if lease.guarantor and lease.guarantor.id == guarantor_instance.id:
                return Response({"error": "This guarantor is already assigned to this lease."}, status=status.HTTP_400_BAD_REQUEST)
                
            lease.guarantor = guarantor_instance
            lease.save(request=request)
            
            return Response(LeaseDetailSerializer(lease).data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"Failed to set guarantor: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='remove-guarantor')
    def remove_guarantor(self, request, lease_id=None):
        lease = self.get_object()

        if not lease.guarantor:
            return Response({"status": "No guarantor to remove."}, status=status.HTTP_200_OK)
        
        with transaction.atomic():
            guarantor_instance = lease.guarantor
            lease.guarantor = None
            lease.save(request=request)
            guarantor_instance.delete()
        
        return Response({"status": "Guarantor removed."}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Enhanced search with filters
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Additional filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        min_deposit = request.query_params.get('min_deposit')
        max_deposit = request.query_params.get('max_deposit')
        
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        if min_deposit:
            queryset = queryset.filter(deposit_amount__gte=min_deposit)
        if max_deposit:
            queryset = queryset.filter(deposit_amount__lte=max_deposit)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)