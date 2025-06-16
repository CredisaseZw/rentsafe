from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounting.api.views import (
    SalesCategoryViewSet,
    SalesAccountViewSet,
    CashSaleViewSet,
    CashbookEntryViewSet,
    GeneralLedgerAccountViewSet,
    JournalEntryViewSet,
    LedgerTransactionViewSet,
    ItemViewSet,
    VATSettingViewSet,
    AccountSectorViewSet,
    InvoiceViewSet,
    PaymentViewSet,
    CurrencyRateViewSet,
    CashBookViewSet,
    CurrencyViewSet,
    PaymentMethodViewSet,
    TransactionTypeViewSet,
    cash_books_list,
    detailed_general_ledger,
    credit_note,
    creditor_invoice,
    rate_audit_trail,
)

router = DefaultRouter()
router.register(r'sales-categories', SalesCategoryViewSet, basename="sales_categories_list")
router.register(r'sales-accounts', SalesAccountViewSet, basename="sales_accounts")
router.register(r'cash-sales', CashSaleViewSet, basename="cash_sales")
router.register(r'cashbook-entries', CashbookEntryViewSet, basename="cashbook_entries")
router.register(r'cashbook-entry-type', CashbookEntryTypeViewSet, basename="cashbook_entry_type")
router.register(r'ledger-accounts', GeneralLedgerAccountViewSet, basename="ledger_accounts")
router.register(r'journal-entries', JournalEntryViewSet, basename="journal_entries")
router.register(r'ledger-transactions', LedgerTransactionViewSet, basename="ledger_transactions")
router.register(r'items', ItemViewSet, basename="items") 
router.register(r'vat-settings', VATSettingViewSet, basename="vat_settings")
router.register(r'account-sectors', AccountSectorViewSet, basename="account_sectors")
router.register(r'invoices', InvoiceViewSet, basename="invoices")
# router.register(r'invoice-items', InvoiceItemViewSet, basename="invoice_items")
router.register(r'payments', PaymentViewSet, basename="payments")
router.register(r'currency-settings', CurrencyRateViewSet, basename="currency_rate")
router.register(r'cash-books', CashBookViewSet, basename="cash_books")
router.register(r'currency', CurrencyViewSet, basename="currency")
router.register(r'payment-methods', PaymentMethodViewSet, basename="payment_methods")
router.register(r'transaction-types', TransactionTypeViewSet, basename="credit_note")
urlpatterns = [
    path("", include(router.urls)),
    path("detailed-general-ledger/", detailed_general_ledger ,name="detailed_general_ledger"),
    path("cash-books-list/", cash_books_list ,name="cash_books_list"),
    path("credit-note/", credit_note ,name="credit_note"),
    path("creditor-invoice/", creditor_invoice ,name="creditor_invoice"),
    path("rate-audit-trail/", rate_audit_trail ,name="rate_audit_trail"),
]
