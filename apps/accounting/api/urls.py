"""accounting urls"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from typing import Any
from apps.accounting.api.views.standard_views import (
    FinancialYearViewSet,
    AccountingPeriodViewSet,
    AccountTypeViewSet,
    AccountSubTypeViewSet,
    GeneralLedgerAccountViewSet,
    CostCenterViewSet,
    JournalEntryViewSet,
    CustomerViewSet,
    VendorViewSet,
    TaxTypeViewSet,
    SalesCategoryViewSet,
    SalesItemViewSet,
    InvoiceViewSet,
    PaymentViewSet,
    BankAccountViewSet,
    CashReceiptViewSet,
    CurrencyViewSet,
    ExchangeRateViewSet,
    TrialBalanceViewSet,
    PaymentMethodViewSet,
    CashSaleViewSet,
)

router: Any = DefaultRouter()

# Core Accounting
router.register("financial-years", FinancialYearViewSet)
router.register("accounting-periods", AccountingPeriodViewSet)
router.register("account-types", AccountTypeViewSet)
router.register("account-subtypes", AccountSubTypeViewSet)
router.register("accounts", GeneralLedgerAccountViewSet)
router.register("cost-centers", CostCenterViewSet)
router.register("journal-entries", JournalEntryViewSet)

# Subsidiary Ledgers
router.register("customers", CustomerViewSet)
router.register("vendors", VendorViewSet)

# Tax
router.register("tax-types", TaxTypeViewSet)

# Products/Services
router.register("sales-categories", SalesCategoryViewSet)
router.register("sales-items", SalesItemViewSet)

# Business Transactions
router.register("invoices", InvoiceViewSet)
router.register("payments", PaymentViewSet)

# Cash Management
router.register("bank-accounts", BankAccountViewSet)
router.register("cash-receipts", CashReceiptViewSet)

# Currency
router.register("currencies", CurrencyViewSet)
router.register("exchange-rates", ExchangeRateViewSet)

# Reports
router.register("trial-balances", TrialBalanceViewSet)

# Compatibility
router.register("payment-methods", PaymentMethodViewSet)
router.register("cash-sales", CashSaleViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
