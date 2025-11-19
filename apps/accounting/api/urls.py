from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.accounting.api.credit_notes.credit_notes_views import CreditNoteViewSet
from apps.accounting.api.vat_settings.vat_settings_views import VATSettingViewSet
from apps.accounting.api.views.views import (
    SalesCategoryViewSet,
    CashSaleViewSet,
    CashbookEntryViewSet,
    GeneralLedgerAccountViewSet,
    JournalEntryViewSet,
    LedgerTransactionViewSet,
    ItemViewSet,
    AccountSectorViewSet,
    InvoiceViewSet,
    PaymentViewSet,
    CurrencyRateViewSet,
    CashBookViewSet,
    CurrencyViewSet,
    PaymentMethodViewSet,
    TransactionTypeViewSet,
    ServiceSpecialPricingViewSet,
    ServiceStandardPricingViewSet,
)
from apps.accounting.api.views.customer_views import CustomersViewSet


router = DefaultRouter()
router.register(
    r"sales-categories", SalesCategoryViewSet, basename="sales_categories_list"
)
router.register(r"cash-sales", CashSaleViewSet, basename="cash_sales")
router.register(r"cashbook-entries", CashbookEntryViewSet, basename="cashbook_entries")
router.register(
    r"ledger-accounts", GeneralLedgerAccountViewSet, basename="ledger_accounts"
)
router.register(r"journal-entries", JournalEntryViewSet, basename="journal_entries")
router.register(
    r"ledger-transactions", LedgerTransactionViewSet, basename="ledger_transactions"
)
router.register(r"items", ItemViewSet, basename="items")
router.register(r"vat-settings", VATSettingViewSet, basename="vat_settings")
router.register(r"account-sectors", AccountSectorViewSet, basename="account_sectors")
router.register(r"invoices", InvoiceViewSet, basename="invoices")
# router.register(r'invoice-items', InvoiceItemViewSet, basename="invoice_items")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"currency-settings", CurrencyRateViewSet, basename="currency_rate")
router.register(r"cash-books", CashBookViewSet, basename="cash_books")
router.register(r"currency", CurrencyViewSet, basename="currency")
router.register(r"payment-methods", PaymentMethodViewSet, basename="payment_methods")
router.register(
    r"transaction-types", TransactionTypeViewSet, basename="transaction_type"
)
router.register(r"credit-notes", CreditNoteViewSet, basename="credit_notes")
router.register(
    r"service-special-pricing",
    ServiceSpecialPricingViewSet,
    basename="service_special_pricing",
)
router.register(
    r"service-standard-pricing",
    ServiceStandardPricingViewSet,
    basename="service_standard_pricing",
)
router.register(r"customers", CustomersViewSet, basename="customers")
urlpatterns = [
    path("", include(router.urls)),
]
