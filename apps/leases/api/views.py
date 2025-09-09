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
from django.db.models import Q,Sum
from django.utils import timezone
from apps.leases.models.models import Lease, LeaseTenant, LeaseTermination
from apps.accounting.models import Payment,PaymentMethod
from decimal import Decimal
from apps.leases.api.serializers import (
    LeaseCreateUpdateSerializer,
    LeaseDetailSerializer,
    LeaseTenantSerializer,
    LeaseTerminationSerializer,
    LeaseListSerializer,
    LandlordSerializer,
    GuarantorSerializer,
    PaymentSerializer,
    TenantStatementsListSerializer
)
from apps.common.utils import extract_error_message
from apps.common.services.tasks import send_notification
from apps.individuals.models import Individual
from apps.companies.models import CompanyBranch
from apps.leases.utils import CommissionHandler,get_lease_payment_message_for_sms
from apps.accounting.api.serializers.serializers import DisbursementSerializer
import logging
from django.conf import settings
logger = logging.getLogger('leases')

class LeaseViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'unit__property', 'landlord','start_date']
    ordering_fields = ['start_date', 'end_date', 'lease_id', 'date_created']
    search_fields = ['lease_id','unit__unit_number','unit__property__name']
    ordering = ['-date_created']
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
        queryset = Lease.objects.all().prefetch_related(
            'lease_tenants__tenant_object',
            'unit__property',
            'landlord',
            'guarantor'
        )

        if not user.is_authenticated:
            return queryset.none()

        if lease_status := self.request.query_params.get('status'):
            queryset = queryset.filter(status=lease_status)

        if search_term := self.request.query_params.get('search'):
            queryset = queryset.filter(
                Q(lease_id__icontains=search_term) |
                Q(unit__unit_number__icontains=search_term) |
                Q(unit__property__name__icontains=search_term)
            )
        # Filter by staff/admin
        if user.is_staff or user.is_superuser:
            return queryset.filter(created_by__client=user.client)

        # Filter by client user
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
                
            self._send_lease_creation_notification(lease, request)
            
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
        lease = self.get_object()
        notify_tenant = request.data.get('notify_tenant',False)
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            termination, created = LeaseTermination.objects.get_or_create(
                lease=lease,
                **serializer.validated_data
            )
            
            # Update lease status to terminated
            lease.status = 'TERMINATED'
            lease.save(request=request)
            
            # Update unit status to vacant
            lease.unit.status = 'vacant'
            lease.unit.save()
            if notify_tenant:
                self._send_lease_status_notification(lease, 'TERMINATED', termination.reason)
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
        queryset = Lease.objects.filter(managing_client=request.user.client).prefetch_related('lease_tenants__tenant_object','unit__property')

        # Apply DB-side filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        tenant_name = request.query_params.get('search')
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        if tenant_name:
            tenant_name = tenant_name.lower()
            queryset = [lease for lease in queryset if any(
                tenant_name in str(lt.tenant_object.full_name).lower()
                for lt in lease.lease_tenants.all()
            )]
        # Pagination and serialization
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
        try:
            with transaction.atomic():
                amount = Decimal(request.data.get('amount', 0))
                method_id = request.data.get('payment_method_id')
                reference = request.data.get('reference', '')
                description = request.data.get('description', '')
                payment_date = request.data.get('payment_date') or timezone.now().date()

                primary_tenant = lease.lease_tenants.filter(is_primary_tenant=True).first() if lease.lease_tenants else None

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
                payments_made, overpayment_amount = lease.apply_payment(
                    amount, payment_date, method, reference, request, description
                )
                
                self._send_payment_notification(lease, amount, payment_date, primary_tenant)
            current_balance = lease.current_balance

            response_data = {
                'payments_made': len(payments_made),
                'overpayment_amount': str(overpayment_amount),
                'current_balance': str(current_balance),
                'invoice_payments': [
                    {
                        'invoice_number': p.invoice.document_number,
                        'amount': str(p.amount),
                    }
                    for p in payments_made
                ],
                'message': (
                    f'Payment processed. ${overpayment_amount} applied as overpayment. Current balance: ${current_balance}'
                    if overpayment_amount > 0
                    else f'Payment processed successfully. Current balance: ${current_balance}'
                ),
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error processing payment for lease {lease.id}: {e}")
            return Response(
                {'error': 'An error occurred while processing the payment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False, methods=['post'], url_path='bulk-payments')
    def bulk_make_payment(self, request):
        results = []
        errors = []
        for payment_data in request.data.get("payments", []):
            lease_id = payment_data.get("lease_id")
            amount = Decimal(payment_data.get("amount", 0))
            method_id = payment_data.get("payment_method_id")
            description = payment_data.get("description", "")
            reference = payment_data.get("reference", "")
            payment_date = payment_data.get("payment_date") or timezone.now().date()
            try:
                with transaction.atomic():
                    lease = Lease.objects.get(lease_id=lease_id)
                    if not lease:
                        errors.append({"error": f"Lease with ID {lease_id} not found"})
                        continue
                    primary_tenant = lease.lease_tenants.filter(is_primary_tenant=True).first() if lease.lease_tenants else None
                    if amount <= 0:
                        raise ValueError("Payment amount must be positive")

                    method = PaymentMethod.objects.get(id=method_id)

                    payments_made, overpayment = lease.apply_payment(
                        amount, payment_date, method, reference, request, description=description
                    )
                    current_balance = lease.current_balance
                    self._send_payment_notification(lease, amount, payment_date, primary_tenant)

                results.append({
                    "lease_id": lease_id,
                    "status": "success",
                    "payments_made": len(payments_made),
                    "overpayment": str(overpayment),
                    "current_balance": str(current_balance)
                })

            except Exception as e:
                logger.error(f"Bulk payment failed for lease {lease_id}: {e}")
                errors.append({"error": str(e)})
        return Response({
            "results": results,
            "errors": errors
        }, status=status.HTTP_207_MULTI_STATUS)

    @action(detail=True, methods=['get'], url_path='payment-history')
    def payment_history(self, request, lease_id=None):
        lease = self.get_object()
        payments = Payment.objects.filter(
            invoice__lease=lease
        ).select_related('invoice', 'method').order_by('-payment_date')
        
        # Calculate cumulative balances
        total_invoiced = lease.invoices.filter(
            invoice_type__in=['fiscal', 'proforma']
        ).aggregate(total=Sum('total_inclusive'))['total'] or Decimal('0.00')
        
        # Get opening balance if exists
        opening_balance = Decimal('0.00')
        if hasattr(lease, 'opening_balance'):
            opening_balance = lease.opening_balance.outstanding_balance
        
        # Calculate running balance for each payment
        payments_list = list(payments)
        remaining_balances = {}
        current_balance = total_invoiced + opening_balance
        
        # Process payments in chronological order (oldest first)
        chronological_payments = sorted(payments_list, key=lambda x: x.payment_date)
        
        for payment in chronological_payments:
            current_balance -= payment.amount
            remaining_balances[payment.id] = str(current_balance)
        
        # Paginate the payments (in reverse chronological order)
        page = self.paginate_queryset(payments_list)
        if page is not None:
            serializer = PaymentSerializer(page, many=True, context={'remaining_balances': remaining_balances})
            response = self.get_paginated_response(serializer.data)
            # Add opening balance to the response
            response.data['opening_balance'] = str(opening_balance)
            response.data['primary_tenant'] = str(lease.get_tenant_names())
            response.data['address'] = str(lease.unit.property.get_address())
            response.data['total_invoiced'] = str(total_invoiced)
            response.data['current_balance'] = str(lease.current_balance)
            return response
        
        serializer = PaymentSerializer(payments_list, many=True, context={'remaining_balances': remaining_balances})
        response_data = {
            'opening_balance': str(opening_balance),
            'total_invoiced': str(total_invoiced),
            'current_balance': str(lease.current_balance),
            'primary_tenant': str(lease.get_tenant_names()),
            'address': str(lease.unit.property.get_address()),
            'payments': serializer.data
        }
        return Response(response_data)
    
    @action(detail=False, methods=['get'], url_path='tenant-statements-summary')
    def tenant_statement(self, request):
        queryset = self.get_queryset()
        serializer = TenantStatementsListSerializer(self.paginate_queryset(queryset), many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['get'], url_path='landlord-statement')
    def landlord_statement(self, request, lease_id=None):
        """
        Get statement for the landlord associated with this lease
        """
        lease = self.get_object()
        
        if not lease.landlord:
            return Response(
                {'error': 'No landlord associated with this lease'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date') or timezone.now().date()
        
        if start_date:
            try:
                start_date = timezone.datetime.strptime(start_date, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid start_date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        disbursements = CommissionHandler.get_landlord_statement(
            lease.landlord, start_date, end_date
        )
        
        # Calculate totals
        total_disbursements = disbursements.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        current_balance = CommissionHandler.get_landlord_balance(lease.landlord)
        
        serializer = DisbursementSerializer(disbursements, many=True)
        
        return Response({
            'landlord': {
                'id': lease.landlord.id,
                'name': str(lease.landlord),
                'commission_percentage': getattr(lease.landlord, 'commission_percentage', 0)
            },
            'statement_period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'current_balance': str(current_balance),
            'total_disbursements': str(total_disbursements),
            'disbursements': serializer.data
        })

    @action(detail=True, methods=['get'], url_path='lease-commissions')
    def get_lease_commissions(self, request, lease_id=None):
        """
        Get all lease commissions
        """
        # Implementation for fetching lease commissions
        return Response({"message": "Fetching lease commissions"})

    @action(detail=False, methods=['get'], url_path='all-landlords-statement')
    def all_landlords_statement(self, request):
        """
        Get statement for all landlords
        """
        from apps.leases.models import Landlord
        
        landlords = Landlord.objects.all()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date') or timezone.now().date()
        
        result = []
        for landlord in landlords:
            disbursements = CommissionHandler.get_landlord_statement(
                landlord, start_date, end_date
            )
            
            total_disbursements = disbursements.aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
            
            current_balance = CommissionHandler.get_landlord_balance(landlord)
            
            result.append({
                'landlord_id': landlord.id,
                'landlord_name': str(landlord),
                'commission_percentage': getattr(landlord, 'commission_percentage', 0),
                'current_balance': str(current_balance),
                'total_disbursements_period': str(total_disbursements),
                'disbursement_count': disbursements.count()
            })
        
        return Response(result)
    
    def _send_lease_creation_notification(self, lease, request):
        """Send lease creation notification to all tenants"""
        from apps.common.utils.messages import prepare_lease_creation_context
        from apps.leases.utils.notification_utils import determine_recipient_info
        
        for tenant_relation in lease.lease_tenants.all():
            tenant = tenant_relation.tenant_object
            
            # Determine recipient type and ID
            recipient_type, recipient_id, recipient_name = determine_recipient_info(tenant)
            
            # Prepare context for both email and SMS
            context = prepare_lease_creation_context(lease, tenant, for_email=True)
            context.update({
                'platform_name': getattr(settings, 'PLATFORM_NAME', 'Fincheck'),
                'portal_url': f"{request.build_absolute_uri('/')}tenant-portal",
            })
            
            # Send notification - force email for lease creation details
            send_notification.delay(
                recipient_type=recipient_type,
                recipient_id=recipient_id,
                notification_type=settings.LEASE_CREATED,
                context=context,
                template_name='lease_created',
                sms_template_name='LEASE_CREATED',
                subject=f"New Lease Created - {lease.client_name}",
                force_method='email' if recipient_type == 'company' else 'sms'
            )


    def _send_payment_notification(self, lease, amount, payment_date, primary_tenant=None):
        """Send payment confirmation notification"""
        from apps.common.utils.messages import prepare_lease_payment_context
        from apps.leases.utils.notification_utils import determine_recipient_info, get_primary_tenant, get_any_tenant
        
        # Determine recipient
        if primary_tenant:
            tenant = primary_tenant.tenant_object
        else:
            tenant = get_primary_tenant(lease) or get_any_tenant(lease)
        
        if not tenant:
            return  # No tenants to notify
        
        # Determine recipient type and ID
        recipient_type, recipient_id, recipient_name = determine_recipient_info(tenant)
        
        # Prepare context
        context = prepare_lease_payment_context(lease, amount, payment_date, tenant)
        context.update({
            'platform_name': getattr(settings, 'PLATFORM_NAME', 'Fincheck'),
            'portal_url': f"{self.request.build_absolute_uri('/')}tenant-portal",
        })
        
        # Send notification
        send_notification.delay(
            recipient_type=recipient_type,
            recipient_id=recipient_id,
            notification_type=settings.PAYMENT_RECEIVED,
            context=context,
            template_name='payment_received',
            sms_template_name='PAYMENT_RECEIVED',
            subject=f"Payment Received - {lease.client_name}"
        )


    def _send_lease_status_notification(self, lease, new_status, reason=None):
        """Send lease status update notification"""
        from apps.common.utils.messages import prepare_lease_status_context
        from apps.leases.utils.notification_utils import determine_recipient_info
        
        # Status display mapping
        status_display = {
            'ACTIVE': 'Active',
            'TERMINATED': 'Terminated',
            'EXPIRED': 'Expired',
            'DRAFT': 'Draft',
            'PENDING_APPROVAL': 'Pending Approval',
            'RENEWED': 'Renewed',
            'SUSPENDED': 'Suspended',
        }
        
        for tenant_relation in lease.lease_tenants.all():
            tenant = tenant_relation.tenant_object
            
            # Determine recipient type and ID
            recipient_type, recipient_id, recipient_name = determine_recipient_info(tenant)
            
            # Prepare context
            context = prepare_lease_status_context(lease, new_status, status_display, reason, tenant)
            context.update({
                'platform_name': getattr(settings, 'PLATFORM_NAME', 'Fincheck'),
                'portal_url': f"{self.request.build_absolute_uri('/')}tenant-portal",
            })
            
            # Send notification
            send_notification.delay(
                recipient_type=recipient_type,
                recipient_id=recipient_id,
                notification_type=settings.LEASE_STATUS,
                context=context,
                template_name='lease_status_update',
                sms_template_name='LEASE_STATUS',
                subject=f"Lease Status Update - {lease.lease_id}"
            )


    def _send_risk_status_notification(self, lease, old_risk_status):
        """Send risk status update notification"""
        from apps.common.utils.messages import prepare_risk_status_context
        from apps.leases.utils.notification_utils import determine_recipient_info
        
        # Get the last payment date
        last_payment = Payment.objects.filter(
            invoice__lease=lease
        ).order_by('-payment_date').first()
        
        last_payment_date = last_payment.payment_date if last_payment else None
        
        # Determine if risk improved
        risk_levels = ['NON_PAYER', 'HIGH_HIGH', 'HIGH', 'MEDIUM', 'LOW']
        risk_improved = (risk_levels.index(lease.risk_level) < risk_levels.index(old_risk_status))
        
        for tenant_relation in lease.lease_tenants.all():
            tenant = tenant_relation.tenant_object
            
            # Determine recipient type and ID
            recipient_type, recipient_id, recipient_name = determine_recipient_info(tenant)
            
            # Prepare context
            context = prepare_risk_status_context(lease, old_risk_status, last_payment_date, risk_improved, tenant)
            context.update({
                'platform_name': getattr(settings, 'PLATFORM_NAME', 'Fincheck'),
                'portal_url': f"{self.request.build_absolute_uri('/')}tenant-portal",
            })
            
            # Send notification
            send_notification.delay(
                recipient_type=recipient_type,
                recipient_id=recipient_id,
                notification_type=settings.RISK_STATUS_UPDATED,
                context=context,
                template_name='risk_status_update',
                sms_template_name='RISK_STATUS_UPDATED',
                subject=f"Risk Status Update - {lease.lease_id}"
            )

    def _send_lease_renewal_notification(self, lease, days_until_expiry):
        """Send lease renewal reminder notification"""
        from apps.common.utils.messages import prepare_lease_renewal_context
        from apps.leases.utils.notification_utils import determine_recipient_info
        
        for tenant_relation in lease.lease_tenants.all():
            tenant = tenant_relation.tenant_object
            
            # Determine recipient type and ID
            recipient_type, recipient_id, recipient_name = determine_recipient_info(tenant)
            
            # Prepare context
            context = prepare_lease_renewal_context(lease, days_until_expiry, tenant)
            context.update({
                'platform_name': getattr(settings, 'PLATFORM_NAME', 'Fincheck'),
                'portal_url': f"{self.request.build_absolute_uri('/')}tenant-portal",
            })
            
            # Send notification
            send_notification.delay(
                recipient_type=recipient_type,
                recipient_id=recipient_id,
                notification_type=settings.LEASE_RENEWAL_REMINDER,
                context=context,
                template_name='lease_renewal_reminder',
                sms_template_name='LEASE_RENEWAL_REMINDER',
                subject=f"Lease Renewal Reminder - {lease.lease_id}"
            )

    