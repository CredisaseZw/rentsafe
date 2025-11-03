""" "
Filters for the accounting app.
"""

import django_filters
from django.db.models import Q
from apps.accounting.models.models import CurrencyRate


class CurrencyRateFilter(django_filters.FilterSet):
    """
    Filter for CurrencyRate model.
    """

    base_currency = django_filters.CharFilter(
        method="get_base_currency",
        lookup_expr="icontains",
        label="Base Currency Code",
    )
    target_currency = django_filters.CharFilter(
        method="get_target_currency",
        lookup_expr="icontains",
        label="Target Currency Code",
    )

    date_from = django_filters.DateFilter(
        field_name="date_created", lookup_expr="gte", label="Date From"
    )

    date_to = django_filters.DateFilter(
        field_name="date_created", lookup_expr="lte", label="Date To"
    )

    current_rate = django_filters.NumberFilter(
        field_name="current_rate", lookup_expr="exact", label="Current Rate"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for CurrencyRateFilter.
        """

        model = CurrencyRate
        fields = ["search"]

    def filter_search(self, queryset, name, value):
        """
        Search across base currency code and target currency code.
        """
        return queryset.filter(
            Q(base_currency__currency_code__icontains=value)
            | Q(currency__currency_code__icontains=value)
            | Q(base_currency__currency_name__icontains=value)
            | Q(currency__currency_name__icontains=value)
            | Q(current_rate__icontains=value)
        ).distinct()

    def get_base_currency(self, queryset, name, value):
        """
        Filter by base currency code.
        """
        return queryset.filter(base_currency__currency_code__icontains=value)

    def get_target_currency(self, queryset, name, value):
        """
        Filter by target currency code.
        """
        return queryset.filter(currency__currency_code__icontains=value)
