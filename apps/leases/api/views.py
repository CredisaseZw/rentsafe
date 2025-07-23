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
    LeaseSearchSerializer,
    LeaseTerminationSerializer,
    MinimalLeaseSerializer
)
from apps.properties.models.models import Unit
from apps.common.models.models import Address
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

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

    def get_serializer_class(self):
        if self.action == 'list':
            return LeaseSearchSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return LeaseCreateUpdateSerializer
        elif self.action == 'terminate':
            return LeaseTerminationSerializer
        return LeaseDetailSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set the request in the context for logging purposes
        serializer.context['request'] = request
        
        lease = serializer.save()
        
        # Update unit status if lease is active
        if lease.status == 'ACTIVE':
            lease.unit.status = 'occupied'
            lease.unit.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(LeaseDetailSerializer(lease).data, status=status.HTTP_201_CREATED, headers=headers)

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

    @action(detail=True, methods=['post'])
    def add_tenant(self, request, pk=None):
        lease = self.get_object()
        serializer = LeaseTenantSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Set the lease ID from the URL
        serializer.validated_data['lease'] = lease
        
        tenant = serializer.save()
        
        return Response(LeaseTenantSerializer(tenant).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def remove_tenant(self, request, pk=None):
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

    @action(detail=True, methods=['post'])
    def set_primary_tenant(self, request, pk=None):
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

    @action(detail=True, methods=['get'])
    def available_tenants(self, request, pk=None):
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
        available_individuals = Individual.objects.exclude(
            id__in=existing_tenant_ids,
            lease_tenants__content_type=individual_ct
        ).values('id', 'first_name', 'last_name', 'identification_number')
        
        # Get available company branches
        from apps.companies.models.models import CompanyBranch
        available_branches = CompanyBranch.objects.exclude(
            id__in=existing_tenant_ids,
            lease_tenants__content_type=company_branch_ct
        ).values('id', 'branch_name', 'company__registration_name')
        
        return Response({
            'individuals': list(available_individuals),
            'company_branches': list(available_branches)
        })
    
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