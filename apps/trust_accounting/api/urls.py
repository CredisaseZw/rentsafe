"""URLs for the Trust Accounting API.

Provides REST API endpoints for all Trust Accounting models following
Zimbabwe Estate Agents Trust Fund regulations and international standards.
"""

from typing import Any
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.trust_accounting.api.views import (
    TrustAccountSubTypeViewSet,
    TrustAccountTypeViewSet,
    TrustCurrencyViewSet,
    TrustExchangeRateViewSet,
    TrustGeneralLedgerAccountViewSet,
    TrustPropertyExpenseViewSet,
    TrustSalesCategoryViewSet,
    TrustSalesItemViewSet,
    TrustTaxTypeViewSet,
    TrustGeneralLedgerViewSet,
    TrustInvoiceViewSet,
    TrustInvoiceLineItemViewSet,
)

router: Any = DefaultRouter()

router.register(r"currencies", TrustCurrencyViewSet, basename="trust-currency")
router.register(
    r"exchange-rates", TrustExchangeRateViewSet, basename="trust-exchange-rate"
)
router.register(r"tax-rates", TrustTaxTypeViewSet, basename="trust-tax-rate")
router.register(
    r"account-types", TrustAccountTypeViewSet, basename="trust-account-type"
)
router.register(
    r"account-sub-types", TrustAccountSubTypeViewSet, basename="trust-account-sub-type"
)
router.register(
    r"general-ledger-accounts",
    TrustGeneralLedgerAccountViewSet,
    basename="trust-general-ledger-account",
)
router.register(
    r"sales-categories", TrustSalesCategoryViewSet, basename="trust-sales-category"
)
router.register(r"sales-items", TrustSalesItemViewSet, basename="trust-sales-item")
router.register(
    r"property-expenses", TrustPropertyExpenseViewSet, basename="trust-property-expense"
)
router.register(
    r"general-ledgers", TrustGeneralLedgerViewSet, basename="trust-general-ledger"
)

# Trust Invoices
router.register(r"invoices", TrustInvoiceViewSet, basename="trust-invoice")
router.register(
    r"invoice-line-items",
    TrustInvoiceLineItemViewSet,
    basename="trust-invoice-line-item",
)

urlpatterns = [
    path("", include(router.urls)),
]
