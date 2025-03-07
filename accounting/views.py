from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *

class BaseCompanyViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically assigns the requesting user's company.
    """
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, company=self.request.user.company)

    def perform_update(self, serializer):
        serializer.save(company=self.request.user.company)

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
