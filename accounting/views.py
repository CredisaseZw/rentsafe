from django.http import JsonResponse
from marshmallow import ValidationError
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
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
    queryset = Item.objects.all()
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

class ProductServiceViewSet(BaseCompanyViewSet):
    queryset = ProductService.objects.all()
    serializer_class = ProductServiceSerializer

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

    @action(detail=True, methods=["POST"])
    def mark_paid(self, request, pk=None):
        """Mark an invoice as paid."""
        invoice = self.get_object()
        invoice.status = "paid"
        invoice.save()
        return Response({"success": True, "message": "Invoice marked as paid."})

# class InvoiceItemViewSet(viewsets.ModelViewSet):
#     queryset = InvoiceItem.objects.all()
#     serializer_class = InvoiceItemSerializer

class PaymentViewSet(BaseCompanyViewSet):
    """Handles payments related to invoices."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def perform_create(self, serializer):
        """Automatically assign the user's company when creating objects."""
        print("--------Testing--------")
        serializer.save(user=self.request.user)

class RecurringInvoiceViewSet(viewsets.ModelViewSet):
    queryset = RecurringInvoice.objects.all()
    serializer_class = RecurringInvoiceSerializer

    @action(detail=True, methods=["POST"])
    def generate_invoice(self, request, pk=None):
        """Manually triggers the next invoice generation."""
        recurring_invoice = self.get_object()
        invoice = recurring_invoice.generate_next_invoice()
        return Response({"success": True, "message": "New invoice created.", "invoice_id": invoice.id})

class ProformaInvoiceViewSet(viewsets.ModelViewSet):
    queryset = ProformaInvoice.objects.all()
    serializer_class = ProformaInvoiceSerializer

    @action(detail=True, methods=["POST"])
    def convert_to_invoice(self, request, pk=None):
        """Converts a proforma invoice into a finalized invoice."""
        proforma_invoice = self.get_object()
        invoice = proforma_invoice.convert_to_invoice()
        return Response({"success": True, "message": "Proforma invoice converted.", "invoice_id": invoice.id})
    
class CurrencyRateViewSet(BaseCompanyViewSet):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer
    
    @action(detail=False, methods=["GET", "POST", "PUT", "PATCH"], url_path="rate-setup")
    def rate_setup(self, request, pk=None):
        if request.method == "GET":
            currency_settings_objects = CurrencyRate.objects.filter(user__company=self.request.user.company)
            if currency_settings_objects.exists():
                currency_settings = currency_settings_objects.last()
                serializer = CurrencyRateSerializer(currency_settings)
                
                # currency_settings={
                #     "user": currency_settings.user,
                #     "current_rate": currency_settings.current_rate,
                #     "base_currency": currency_settings.base_currency,
                #     "currency": currency_settings.currency,
                #     "date_created": currency_settings.date_created,
                #     "updated_at": currency_settings.updated_at,
                # }
                return JsonResponse({"currency_settings": serializer.data})
            props =  {"errors": "No currency settings found"}
            return JsonResponse(props)
        
        if request.method == "POST" or request.method == "PUT":
            rate_schema = RateSchema()
            try:
                data= rate_schema.load(request.data)
            except ValidationError as err:
                props = {"errors": err.messages}
                return JsonResponse(props, status=400)
            else:
                rates = CurrencyRate.objects.filter(user__company=self.request.user.company)
                if rates.exists():
                    rate= rates.last()
                    rate.base_currency= data.get("base_currency")
                    rate.currency= data.get("currency")
                    rate.current_rate= data.get("current_rate")
                    rate.updated_at= now()
                    rate.save()
                    props = {"success": "Rate updated successfully"}
                    return JsonResponse(props)
                else:
                    CurrencyRate.objects.create(
                        user= request.user,
                        base_currency= data.get("base_currency"),
                        currency= data.get("currency"),
                        current_rate= data.get("current_rate"),
                        updated_at= now(),
                        date_created= now(),
                    )
                    props = {"success": "Rate created successfully"}
                    return JsonResponse(props)

    
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