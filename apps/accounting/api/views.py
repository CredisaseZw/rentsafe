from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from urllib import request
from django.http import JsonResponse
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from apps.accounting.models.models import (
    SalesItem,VATSetting, SalesCategory,
    SalesAccount,CashSale,CashbookEntry,
    GeneralLedgerAccount,JournalEntry,
    LedgerTransaction,AccountSector,
    Invoice, Payment,CurrencyRate,
    PaymentMethod,TransactionType,
    CashBook,Currency,CreditNote,
)
from apps.accounting.api.serializers.serializers import (
    SalesItemSerializer,VATSettingSerializer,
    SalesCategorySerializer,SalesAccountSerializer,
    CashSaleSerializer, CashbookEntrySerializer,
    GeneralLedgerAccountSerializer, JournalEntrySerializer,
    LedgerTransactionSerializer, AccountSectorSerializer,
    InvoiceSerializer, PaymentSerializer,
    CurrencyRateSerializer,PaymentMethodSerializer,
    TransactionTypeSerializer,CashBookSerializer,
    CurrencySerializer,CreditNoteSerializer, DisbursementSerializer
)
from apps.leases.models import Landlord
from apps.clients.models import Client
from apps.accounting.models.disbursements import Disbursement
import logging

logger = logging.getLogger('accounting')


class BaseCompanyViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically filters data for the requesting user's company
    and assigns the user to new objects.
    """
    permission_classes = [IsAuthenticated] # Ensure users are authenticated

    def get_queryset(self):
        """Ensure users only access objects belonging to their company."""
        # Ensure user and company attributes exist before filtering
        if self.request.user.is_authenticated and hasattr(self.request.user, 'company'):
            return self.queryset.filter(user__company=self.request.user.company)
        return self.queryset.none() # Return empty queryset if no company or not authenticated

    def perform_create(self, serializer):
        """Automatically assign the user when creating objects."""
        serializer.save(user=self.request.user)

class ItemViewSet(BaseCompanyViewSet):
    queryset = SalesItem.objects.all()
    serializer_class = SalesItemSerializer

class VATSettingViewSet(BaseCompanyViewSet):
    queryset = VATSetting.objects.all()
    serializer_class = VATSettingSerializer

    def create(self, request, *args, **kwargs):
        """
        Allows bulk creation of VAT settings and prevents duplicate descriptions per company.
        """
        data = request.data
        if not isinstance(data, list):
            # If not a list, proceed with standard single object creation
            return super().create(request, *args, **kwargs)

        company = self.request.user.company

        # Get descriptions of existing VAT settings for the user's company
        existing_descriptions = set(
            VATSetting.objects.filter(user__company=company).values_list("description", flat=True)
        )

        # Filter out data for VAT settings that already exist
        valid_data = [
            item for item in data if item.get("description") not in existing_descriptions
        ]

        if not valid_data:
            return Response({"error": "All provided VAT settings already exist for your company."}, status=status.HTTP_400_BAD_REQUEST)

        # The perform_create in BaseCompanyViewSet handles assigning the user.
        # So we just need to pass the valid_data to the serializer.
        serializer = self.get_serializer(data=valid_data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer) # This will call serializer.save(user=self.request.user) for each object

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SalesCategoryViewSet(BaseCompanyViewSet):
    queryset = SalesCategory.objects.all()
    serializer_class = SalesCategorySerializer

class SalesAccountViewSet(BaseCompanyViewSet):
    queryset = SalesAccount.objects.all()
    serializer_class = SalesAccountSerializer

class CashSaleViewSet(BaseCompanyViewSet):
    queryset = CashSale.objects.all()
    serializer_class = CashSaleSerializer

class CashbookEntryViewSet(BaseCompanyViewSet):
    queryset = CashbookEntry.objects.all()
    serializer_class = CashbookEntrySerializer

class GeneralLedgerAccountViewSet(BaseCompanyViewSet):
    queryset = GeneralLedgerAccount.objects.all()
    serializer_class = GeneralLedgerAccountSerializer

class JournalEntryViewSet(BaseCompanyViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer

class LedgerTransactionViewSet(BaseCompanyViewSet):
    queryset = LedgerTransaction.objects.all()
    serializer_class = LedgerTransactionSerializer

class AccountSectorViewSet(BaseCompanyViewSet):
    queryset = AccountSector.objects.all()
    serializer_class = AccountSectorSerializer

class InvoiceViewSet(BaseCompanyViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=True, methods=['post'], url_path='mark-paid')
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save()
        return Response(self.get_serializer(invoice).data)

    @action(detail=True, methods=['post'], url_path='convert-to-fiscal')
    def convert_to_fiscal(self, request, pk=None):
        """Convert proforma to fiscal invoice"""
        invoice = self.get_object()
        try:
            invoice.convert_to_fiscal()
            return Response(self.get_serializer(invoice).data)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='generate-recurring')
    def generate_recurring(self, request, pk=None):
        """Generate next recurring invoice from a recurring template invoice."""
        invoice = self.get_object()
        try:
            new_invoice = invoice.generate_recurring_invoice()
            serializer = self.get_serializer(new_invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='get-pending-invoices') # Changed to False as it's a list operation
    def get_pending_invoices(self, request):
        """Get all pending invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status='pending')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='get-paid-invoices') # Changed to False
    def get_paid_invoices(self, request):
        """Get all paid invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status='paid')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'],url_path="get-cancelled-invoices")
    def get_cancelled_invoices(self, request):
        """Get all cancelled invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status='cancelled')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cancel-invoice')
    def cancel_invoice(self, request, pk=None):
        """Cancel an invoice"""
        invoice = self.get_object()
        invoice.status = 'cancelled'
        invoice.save()
        return Response(self.get_serializer(invoice).data)

    @action(detail=False, methods=['get'],url_path="proforma-invoices")
    def proforma_invoices(self, request):
        """Get all proforma invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='proforma')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'],url_path="fiscal-invoices")
    def fiscal_invoices(self, request):
        """Get all fiscal invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='fiscal')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'],url_path="recurring-invoices")
    def recurring(self, request):
        """Get all recurring invoice templates for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='recurring')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CreditNoteViewSet(BaseCompanyViewSet):
    queryset = CreditNote.objects.all()
    serializer_class = CreditNoteSerializer

class PaymentViewSet(BaseCompanyViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class CurrencyRateViewSet(BaseCompanyViewSet):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer

    @action(detail=False, methods=["GET", "POST", "PUT", "PATCH"], url_path="rate-setup")
    def rate_setup(self, request, pk=None):
        """
        Endpoint to get or set currency rate settings for the user's company.
        There should ideally be only one CurrencyRate instance per company (or a system-wide rate).
        """
        currency_rate_query = self.queryset.filter(user__company=request.user.company)
        instance = currency_rate_query.last() 

        if request.method == "GET":
            if instance:
                serializer = self.get_serializer(instance)
                return Response({"currency_rate_settings": serializer.data})
            return Response({"errors": "No currency rate settings found for your company."}, status=status.HTTP_404_NOT_FOUND)

        if request.method in ["POST", "PUT", "PATCH"]:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
                
            base_currency = request.data.get('base_currency')
            target_currency = request.data.get('currency')
            
            current_rate = request.data.get('current_rate')
            try:
                current_rate = float(current_rate)
            except (TypeError, ValueError):
                return Response({"error": "Current rate must be a valid number"},status=status.HTTP_400_BAD_REQUEST)

            if current_rate <= 0:
                return Response({"error": "Current rate must be greater than zero"},status=status.HTTP_400_BAD_REQUEST)
            
            if serializer.is_valid(raise_exception=True): # raise_exception=True handles errors automatically
                if base_currency == target_currency:
                    return Response({"error": "Base currency and Target currency cannot be the same"}, status=status.HTTP_400_BAD_REQUEST)
                
                serializer.save(user=request.user) # Assign user during save via perform_create/update
                message = "Rate updated successfully" if instance else "Rate created successfully"
                return Response({"Success ": message,}, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)
            # If serializer.is_valid() was False, errors would be raised by raise_exception=True
            # and handled by DRF's exception handler.

class CashBookViewSet(BaseCompanyViewSet):
    queryset = CashBook.objects.all()
    serializer_class = CashBookSerializer

class CurrencyViewSet(BaseCompanyViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    pagination_class = None
    # overide the base get queryset
    def get_queryset(self):
        return self.queryset.all()

class PaymentMethodViewSet(BaseCompanyViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    pagination_class = None
    def get_queryset(self):
        return self.queryset.all()
    
    def create(self, request,*args,**kwargs):
        company = request.user.company
        name = request.data.get('payment_method_name')

        if PaymentMethod.objects.filter(user__company=company, payment_method_name=name).exists():
            return Response({"error!": "This Payment Method Already Exists."}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class TransactionTypeViewSet(BaseCompanyViewSet):
    queryset = TransactionType.objects.all()
    serializer_class = TransactionTypeSerializer

class DisbursementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A ViewSet for viewing disbursement history and generating creditor statements.
    """
    queryset = Disbursement.objects.all().select_related('landlord', 'payee', 'currency', 'payment_method')
    serializer_class = DisbursementSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'landlord', 'payee', 'payment_method']
    search_fields = ['reference', 'payee__client_name']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']
    
    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        
        if not user.is_staff and not user.is_superuser:
            if hasattr(user, 'client'):
                # Assumes the user is an agent and can only see disbursements
                # made to landlords or to their own agency (the payee).
                return queryset.filter(Q(landlord__isnull=False) | Q(payee=user.client))
            else:
                return queryset.none()
        return queryset

    @action(detail=False, methods=['get'], url_path='creditor-statements')
    def get_creditor_statement(self, request):
        """
        Generates a statement for a specific creditor (Landlord or other Client).
        Expects a `creditor_id` and an optional `creditor_type` (e.g., 'landlord', 'agency').
        """
        creditor_id = request.query_params.get('creditor_id')
        creditor_type = request.query_params.get('creditor_type')

        if not creditor_id:
            return Response({'error': 'creditor_id query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle landlord statements separately for a clear link
        if creditor_type == 'landlord':
            landlord = get_object_or_404(Landlord, id=creditor_id)
            disbursements = self.get_queryset().filter(landlord=landlord).order_by('payment_date')
            creditor_name = landlord.landlord_name
        else:
            # Handle all other clients (e.g., the agency itself)
            payee_client = get_object_or_404(Client, id=creditor_id)
            disbursements = self.get_queryset().filter(payee=payee_client).order_by('payment_date')
            creditor_name = payee_client.client_name

        # Calculate totals
        totals = disbursements.aggregate(
            total_processed=Sum('amount', filter=Q(status='processed')),
            total_pending=Sum('amount', filter=Q(status='pending'))
        )
        total_paid = totals['total_processed'] or 0
        total_pending = totals['total_pending'] or 0
        
        serializer = self.get_serializer(disbursements, many=True)
        
        return Response({
            'creditor_name': creditor_name,
            'total_paid': total_paid,
            'total_pending': total_pending,
            'transactions': serializer.data
        })
