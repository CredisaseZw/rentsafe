from django.http import JsonResponse
from rest_framework import viewsets,status
from django.http import JsonResponse
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from accounting.models import (
    SalesItem, 
    VATSetting, 
    SalesCategory, 
    SalesAccount, 
    CashSale, 
    CashbookEntry, 
    GeneralLedgerAccount, 
    JournalEntry, 
    LedgerTransaction, 
    AccountSector, 
    Invoice, 
    Payment, 
    CurrencyRate, 
    PaymentMethod, 
    TransactionType, 
    CashBook, 
    Currency,
    )
from .serializers import *
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import action
from django.utils.timezone import now
from inertia import render as inertia_render
from rest_framework.response import Response

class BaseCompanyViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically filters data for the requesting user's company.
    """
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensure users only access objects belonging to their company."""
        return self.queryset.filter(user__company=self.request.user.company)

    def perform_create(self, serializer):
        """Automatically assign the user's company when creating objects."""
        serializer.save(user=self.request.user)

class ItemViewSet(BaseCompanyViewSet):
    queryset = SalesItem.objects.all()
    serializer_class = ItemSerializer

class VATSettingViewSet(BaseCompanyViewSet):
    queryset = VATSetting.objects.all()
    serializer_class = VATSettingSerializer

    def create(self, request, *args, **kwargs):
        """
        Allows bulk creation of VAT settings and prevents duplicate descriptions per company.
        """
        data = request.data
        if not isinstance(data, list):
            return super().create(request, *args, **kwargs)  # Fall back to single create

        company = request.user.company

        existing_descriptions = set(
            VATSetting.objects.filter(company=company).values_list("description", flat=True)
        )

        valid_data = [
            item for item in data if item.get("description") not in existing_descriptions
        ]

        if not valid_data:
            return Response({"error": "All VAT settings already exist"}, status=status.HTTP_400_BAD_REQUEST)

        for item in valid_data:
            item["company"] = company
            item["user"] = request.user.id

        serializer = self.get_serializer(data=valid_data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

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
        """Generate next recurring invoice"""
        invoice = self.get_object()
        try:
            new_invoice = invoice.generate_recurring_invoice()
            serializer = self.get_serializer(new_invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='generate-credit-note')
    def generate_credit_note(self, request, pk=None):
        """Generate credit note from invoice"""
        invoice = self.get_object()
        try:
            credit_note = invoice.generate_credit_note()
            serializer = self.get_serializer(credit_note)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='generate-debit-note')
    def generate_debit_note(self, request, pk=None):
        """Generate debit note from invoice"""
        invoice = self.get_object()
        try:
            debit_note = invoice.generate_debit_note()
            serializer = self.get_serializer(debit_note)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'], url_path='get-pending-invoices')
    def get_pending_invoices(self, request, pk=None):
        """Get all pending invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status='pending')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['post'], url_path='get-paid-invoices')
    def get_paid_invoices(self, request, pk=None):
        """Get all paid invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status='paid')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'], url_path='get-cancelled-invoices')
    def get_cancelled_invoices(self, request, pk=None):
        """Get all cancelled invoices"""
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
        """Get all proforma invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='proforma')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'],url_path="fiscal-invoices")
    def fiscal_invoices(self, request):
        """Get all fiscal invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='fiscal')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'],url_path="recurring-invoices")
    def recurring(self, request):
        """Get all recurring templates"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type='recurring')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PaymentViewSet(BaseCompanyViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class CurrencyRateViewSet(BaseCompanyViewSet):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer
    
    @action(detail=False, methods=["GET", "POST", "PUT", "PATCH"], url_path="rate-setup")
    def rate_setup(self, request, pk=None):  
        currency_object = CurrencyRate.objects.filter(user__company=request.user.company)  
        instance = currency_object.last() if currency_object.exists() else None  

        if request.method == "GET":  
            if instance:  
                serializer = self.get_serializer(instance)  
                return Response({"currency_rate_settings": serializer.data})  
            return Response({"errors": "No currency settings found"}, status=status.HTTP_404_NOT_FOUND)  

        if request.method in ["POST", "PUT", "PATCH"]:  
            serializer = self.get_serializer(instance, data=request.data, partial=True)  
            if serializer.is_valid():  
                serializer.save(user=request.user)  
                message = "Rate updated successfully" if instance else "Rate created successfully"  
                return Response({"success": message})  
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  

class CashBookViewSet(BaseCompanyViewSet):
    queryset = CashBook.objects.all()
    serializer_class = CashBookSerializer

class CurrencyViewSet(BaseCompanyViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
class PaymentMethodViewSet(BaseCompanyViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class TransactionTypeViewSet(BaseCompanyViewSet):
    queryset = TransactionType.objects.all()
    serializer_class = TransactionTypeSerializer

def detailed_general_ledger(request):
    return inertia_render(request, "Client/Accounting/DetailedGeneralLedgerAccount")

def cash_books_list(request):
    return inertia_render(request, "Client/Accounting/CashBooksList")

def credit_note(request):
    return inertia_render(request, "Client/Accounting/CreditNote")

def creditor_invoice(request):
    return inertia_render(request, "Client/Accounting/CreditorInvoice")

def rate_audit_trail(request):
    return inertia_render(request, "Client/Accounting/RateAuditTrail")

def general_journal(request):
    return inertia_render(request, "Client/Accounting/GeneralJournal")