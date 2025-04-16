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
router.register(r'invoices', InvoiceViewSet, basename="invoices")
router.register(r'invoice-items', InvoiceItemViewSet, basename="invoice_items")
router.register(r'payments', PaymentViewSet, basename="payments")
router.register(r'recurring-invoices', RecurringInvoiceViewSet, basename="recurring_invoices")
router.register(r'proforma-invoices', ProformaInvoiceViewSet, basename="proforma_invoices")

urlpatterns = [
    path("", include(router.urls)),
    path("detailed-general-ledger/", detailed_general_ledger ,name="detailed_general_ledger"),
    path("cash-books-list/", cash_books_list ,name="cash_books_list"),
    path("credit-note/", credit_note ,name="credit_note"),
    path("creditor-invoice/", creditor_invoice ,name="creditor_invoice"),
]
