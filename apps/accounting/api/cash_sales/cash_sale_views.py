"""Views for Cash Sale API endpoints."""

from apps.accounting.api.cash_sales.cash_sale_serializers import CashSaleSerializer
from apps.accounting.api.views.views import BaseCompanyViewSet
from apps.accounting.models.models import CashSale


class CashSaleViewSet(BaseCompanyViewSet):
    queryset = CashSale.objects.all()
    serializer_class = CashSaleSerializer

    def get_queryset(self):
        """Override to filter cash sales by company."""
        queryset = (
            super()
            .get_queryset()
            .select_related(
                "customer", "created_by", "currency", "payment_type", "cashbook"
            )
            .prefetch_related("line_items")
        )
        print("CashSaleViewSet queryset called", queryset.query)
        return queryset
