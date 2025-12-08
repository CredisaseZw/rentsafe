"""Filterset class for SalesItem model"""

import django_filters
from django.db.models import Q
from apps.accounting.models.models import SalesItem


class SalesItemFilter(django_filters.FilterSet):
    """
    Filter for SalesItem model.
    """

    category = django_filters.CharFilter(
        method="get_category",
        label="Category",
    )
    item_code = django_filters.CharFilter(
        field_name="item_code", label="Item ID", lookup_expr="iexact"
    )
    name = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains", label="Name"
    )

    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for SalesItemFilter.
        """

        model = SalesItem
        fields = ["search", "category", "name", "item_code"]

    def filter_search(self, queryset, name, value):
        """
        Search across name and description.
        """
        return queryset.filter(
            Q(name__icontains=value)
            | Q(description__icontains=value)
            | Q(item_code__icontains=value)
        ).distinct()

    def get_category(self, queryset, name, value):
        """
        Filter by category name.
        """
        return queryset.filter(category__name__icontains=value)
