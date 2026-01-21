"""URLs for the Trust Accounting API.

Provides REST API endpoints for all Trust Accounting models following
Zimbabwe Estate Agents Trust Fund regulations and international standards.
"""

from typing import Any
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.trust_accounting.api.views import (
    PropertyExpenseViewSet,
    TrustGeneralLedgerViewSet,
    TrustInvoiceViewSet,
    TrustInvoiceLineItemViewSet,
)

router: Any = DefaultRouter()

# Configuration
router.register(
    r"property-expenses", PropertyExpenseViewSet, basename="property-expense"
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
