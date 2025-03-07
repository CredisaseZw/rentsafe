from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'products', ProductServiceViewSet, basename="products")
router.register(r'sales-categories', SalesCategoryViewSet, basename="sales_categories")
router.register(r'sales-accounts', SalesAccountViewSet, basename="sales_accounts")
router.register(r'cash-sales', CashSaleViewSet, basename="cash_sales")
router.register(r'cashbook-entries', CashbookEntryViewSet, basename="cashbook_entries")
router.register(r'ledger-accounts', GeneralLedgerAccountViewSet, basename="ledger_accounts")
router.register(r'journal-entries', JournalEntryViewSet, basename="journal_entries")
router.register(r'ledger-transactions', LedgerTransactionViewSet, basename="ledger_transactions")

urlpatterns = [
    path("", include(router.urls)),
       
    
]
