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
    
    @action(detail=False, methods=["PUT","PATCH", "POST"],url_path="update-rate")
    def update_rate(self, request, pk=None):
        """Updates the currency rate for a specific currency."""
        currency= request.data.get("currency")
        base_currency = request.data.get("base_currency")
        new_rate = request.data.get("current_rate")

        if currency == base_currency:
            return Response({"error": "Base currency and Target currency can not be the same"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            exchange_rate, created = CurrencyRate.objects.update_or_create(user=self.request.user,currency=currency, base_currency=base_currency, current_rate= new_rate)
            exchange_rate.save()
            return Response({"success": True, "message": "Currency rate updated successfully."}, status=status.HTTP_200_OK)
        except CurrencyRate.DoesNotExist:
            return Response({"error": "Currency rate not found"}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=["GET"], url_path="exchange-rate")
    def exchange_rate(self, request, pk=None):
        # Get the latest updated_at for each currency/base_currency pair
        from django.db.models import Max
        latest_rates = (
            CurrencyRate.objects
            .values("currency", "base_currency")
            .annotate(latest_updated=Max("updated_at"))
        )

        # Fetch the actual CurrencyRate objects for those latest rates
        rates = []
        for entry in latest_rates:
            rate = CurrencyRate.objects.filter(
                currency=entry["currency"],
                base_currency=entry["base_currency"],
                updated_at=entry["latest_updated"]
            ).first()
            if rate:
                rates.append({
                    "currency": rate.currency,
                    "base_currency": rate.base_currency,
                    "current_rate": rate.current_rate,
                    "updated_at": rate.updated_at,
                })

        if not rates:
            return Response({
                "success": False,
                "message": "No exchange rates found.",
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "message": "Latest exchange rates fetched successfully.",
            "rates": rates,
        })
    
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