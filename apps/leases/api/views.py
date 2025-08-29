# apps/leases/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q
from apps.leases.models.models import Lease, LeaseTenant, LeaseCharge, LeaseTermination, Guarantor
from apps.leases.models.landlord import Landlord
from decimal import Decimal
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
from apps.individuals.models import Individual
from apps.companies.models import CompanyBranch
from apps.accounting.models import PaymentMethod
import logging
logger = logging.getLogger('leases')

class LeaseViewSet(viewsets.ModelViewSet):
    queryset = Lease.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'unit__property', 'landlord','start_date']
    ordering_fields = ['start_date', 'end_date', 'lease_id']
    search_fields = ['lease_id','unit__unit_number','unit__property__name']
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
        user = self.request.user
        queryset = self.queryset
        if not user.is_authenticated:
            return queryset.none()  # Return no leases for unauthenticated users
        if lease_status := self.request.query_params.get('status', None):
            queryset = self.queryset.filter(status=lease_status)
        if search_term := self.request.query_params.get('search'):
            return queryset.filter(
                Q(lease_id__icontains=search_term) |
                Q(unit__unit_number__icontains=search_term) |
                Q(unit__property__name__icontains=search_term)
            )

            # matching_leases = []
            # for lease in queryset.prefetch_related('lease_tenants'):
            #     for lt in lease.lease_tenants.all():
            #         if to :=lt.tenant_object:
            #             if (hasattr(to, 'first_name') and search_term.lower() in to.first_name.lower()) or \
            #                 (hasattr(to, 'last_name') and search_term.lower() in to.last_name.lower()) or \
            #                 (hasattr(to, 'branch_name') and search_term.lower() in to.branch_name.lower()) or \
            #                 (hasattr(to, 'company') and hasattr(to.company, 'registration_name') and search_term.lower() in to.company.registration_name.lower()):
            #                 matching_leases.append(lease)
            #                 break  # no need to check more tenants for this lease
            # queryset = queryset.filter(id__in=[l.id for l in matching_leases])

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
    def terminate(self, request, lease_id=None):
        try:
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
        except Exception as e:
            logger.error(f"Error terminating lease {lease.id}: {str(e)}")
            return Response({'error': extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST)

    
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
    
    @action(detail=False, methods=['get'], url_path='property-leases')
    def get_property_leases(self, request):
        slug = request.query_params.get('slug')
        if slug:
            queryset = self.get_queryset().filter(unit__property__slug=slug)
            serializer = LeaseListSerializer(queryset, many=True)
            return Response(serializer.data) 
        else:
            return Response(
                {"error": "slug query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=True, methods=['post'], url_path='make-payment')
    def make_payment(self, request, lease_id=None):
        lease = self.get_object()
        
        # Validate payment data
        try:
            amount = Decimal(request.data.get('amount', 0))
            method_id = request.data.get('payment_method_id')
            reference = request.data.get('reference', '')
            payment_date = request.data.get('payment_date') or timezone.now().date()
            
            if amount <= 0:
                return Response(
                    {'error': 'Payment amount must be positive'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                method = PaymentMethod.objects.get(id=method_id)
            except PaymentMethod.DoesNotExist:
                return Response(
                    {'error': 'Invalid payment method'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Apply payment
            payments_made, remaining_amount = lease.apply_payment(
                amount, payment_date, method, reference, request
            )
            
            response_data = {
                'payments_made': len(payments_made),
                'remaining_amount': str(remaining_amount),
                'invoice_payments': [
                    {
                        'invoice_number': p.invoice.document_number,
                        'amount': str(p.amount)
                    } for p in payments_made
                ]
            }
            
            if remaining_amount > 0:
                response_data['warning'] = f'${remaining_amount} was not applied to any invoice'
            
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error processing payment for lease {lease.id}: {e}")
            return Response(
                {'error': 'An error occurred while processing the payment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], url_path='payment-history')
    def payment_history(self, request, lease_id=None):
        lease = self.get_object()
        
        payments = Payment.objects.filter(
            invoice__lease=lease
        ).select_related('invoice', 'method').order_by('-payment_date')
        
        page = self.paginate_queryset(payments)
        if page is not None:
            serializer = PaymentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    