from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'products', ProductServiceViewSet, basename="products")
router.register(r'sales-categories', SalesCategoryViewSet, basename="sales_categories_list")
router.register(r'sales-accounts', SalesAccountViewSet, basename="sales_accounts")
router.register(r'cash-sales', CashSaleViewSet, basename="cash_sales")
router.register(r'cashbook-entries', CashbookEntryViewSet, basename="cashbook_entries")
router.register(r'ledger-accounts', GeneralLedgerAccountViewSet, basename="ledger_accounts")
router.register(r'journal-entries', JournalEntryViewSet, basename="journal_entries")
router.register(r'ledger-transactions', LedgerTransactionViewSet, basename="ledger_transactions")
router.register(r'items', ItemViewSet, basename="items") 
router.register(r'vat-settings', VATSettingViewSet, basename="vat_settings")
router.register(r'account-sectors', AccountSectorViewSet, basename="account_sectors")

urlpatterns = [
    path("", include(router.urls)),
       
    
]
