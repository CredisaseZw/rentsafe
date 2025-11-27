"""Filters for cash sale API endpoints."""

import django_filters
from django.db.models import Q
from apps.accounting.models.models import CashSale


class CashSaleFilter(django_filters.FilterSet):
    """
    Filter set for CashSale model.
    """

    sale_date_from = django_filters.DateFilter(
        field_name="sale_date", lookup_expr="gte", label="Sale Date From"
    )
    sale_date_to = django_filters.DateFilter(
        field_name="sale_date", lookup_expr="lte", label="Sale Date To"
    )
    sale_date_exact = django_filters.DateFilter(
        field_name="sale_date", lookup_expr="exact", label="Sale Date Exact"
    )
    customer_name = django_filters.CharFilter(
        method="filter_customer_name", label="Customer Name"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for CashSaleFilter.
        """

        model = CashSale
        fields = [
            "sale_date_from",
            "sale_date_to",
            "sale_date_exact",
            "customer_name",
            "search",
        ]

    def filter_customer_name(self, queryset, name, value):
        """
        Filter cash sales by customer name.
        """
        return queryset.filter(
            Q(customer__individual__first_name__icontains=value)
            | Q(customer__individual__last_name__icontains=value)
            | Q(customer__company__branch_name__icontains=value)
            | Q(customer__company__company__trading_name__icontains=value)
        ).distinct()

    def filter_search(self, queryset, name, value):
        """
        Search across multiple fields in CashSale.
        """
        return queryset.filter(
            Q(document_number__icontains=value)
            | Q(cashbook__cashbook_name__icontains=value)
        ).distinct()
