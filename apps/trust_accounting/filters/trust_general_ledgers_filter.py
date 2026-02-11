"""
Filters for the trust general ledgers and account sectors/types and subtypes.
"""

import django_filters
from django.db.models import Q

from apps.trust_accounting.models import (
    TrustAccountSubType,
    TrustAccountType,
    TrustGeneralLedgerAccount,
)


class GeneralLedgerFilter(django_filters.FilterSet):
    """
    Filter for TrustGeneralLedgerAccount model.
    """

    account_number = django_filters.CharFilter(
        field_name="account_number",
        lookup_expr="iexact",
        label="Account Number",
    )

    account_name = django_filters.CharFilter(
        field_name="account_name",
        lookup_expr="icontains",
        label="Account Name",
    )

    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for GeneralLedgerFilter.
        """

        model = TrustGeneralLedgerAccount
        fields = ["account_number", "account_name", "search"]

    def filter_search(self, queryset, name, value):
        """
        Search across account number and account name.
        """
        return queryset.filter(
            Q(account_number__icontains=value) | Q(account_name__icontains=value)
        ).distinct()


class AccountTypeFilter(django_filters.FilterSet):
    """
    Filter for TrustAccountType model.
    """

    name = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains", label="Sector Name"
    )

    code = django_filters.CharFilter(
        field_name="code", lookup_expr="icontains", label="Sector Code"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for AccountSectorFilter.
        """

        model = TrustAccountType
        fields = ["name", "code", "search"]

    def filter_search(self, queryset, name, value):
        """
        Search across sector name and code.
        """
        return queryset.filter(
            Q(name__icontains=value) | Q(code__icontains=value)
        ).distinct()


class AccountSubTypeFilter(django_filters.FilterSet):
    """
    Filter for TrustAccountSubType model.
    """

    name = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains", label="SubType Name"
    )

    code_prefix = django_filters.CharFilter(
        field_name="code_prefix", lookup_expr="iexact", label="Code Prefix"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for AccountSubTypeFilter.
        """

        model = TrustAccountSubType
        fields = ["name", "code_prefix", "search"]

    def filter_search(self, queryset, name, value):
        """
        Search across subtype name and code prefix.
        """
        return queryset.filter(
            Q(name__icontains=value) | Q(code_prefix__icontains=value)
        ).distinct()
