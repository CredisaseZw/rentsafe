"""Filters for exchange rates in the trust accounting app."""

import django_filters
from apps.trust_accounting.models import TrustExchangeRate


class ExchangeRateFilter(django_filters.FilterSet):
    """filter class for TrustExchangeRate model."""

    year = django_filters.NumberFilter(
        field_name="effective_date", lookup_expr="year", label="Year"
    )
    month = django_filters.NumberFilter(
        field_name="effective_date", lookup_expr="month", label="Month"
    )
    date_from = django_filters.DateFilter(
        field_name="effective_date", lookup_expr="gte", label="Date From"
    )

    date_to = django_filters.DateFilter(
        field_name="effective_date", lookup_expr="lte", label="Date To"
    )

    class Meta:
        """Meta class for ExchangeRateFilter."""

        model = TrustExchangeRate
        fields = ["date_from", "date_to", "year", "month"]
