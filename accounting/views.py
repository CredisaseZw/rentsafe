from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


class BaseCompanyViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically filters data for the requesting user's company.
    """
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensure users only access objects belonging to their company."""
        return self.queryset.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        """Automatically assign the user's company when creating objects."""
        serializer.save(user=self.request.user, company=self.request.user.company)

    def perform_update(self, serializer):
        """Ensure the company is not changed during updates."""
        serializer.save(company=self.request.user.company)
class ItemViewSet(BaseCompanyViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class VATSettingViewSet(BaseCompanyViewSet):
    queryset = VATSetting.objects.all()
    serializer_class = VATSettingSerializer


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


