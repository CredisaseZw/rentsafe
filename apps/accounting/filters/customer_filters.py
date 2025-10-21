"""
__Filters for Individual and Company customers
"""

import django_filters
from django.db.models import Q
from typing import Tuple, List, Optional
from django.contrib.contenttypes.models import ContentType
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual
from apps.leases.models.models import Lease


class IndividualCustomerFilter(django_filters.FilterSet):
    """
    Filter set for Individual customers
    """

    first_name = django_filters.CharFilter(
        field_name="first_name", lookup_expr="icontains"
    )
    last_name = django_filters.CharFilter(
        field_name="last_name", lookup_expr="icontains"
    )
    identification_number = django_filters.CharFilter(
        field_name="identification_number", lookup_expr="icontains"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Class Meta for IndividualCustomerFilter
        """

        model = Individual
        fields = ["first_name", "last_name", "identification_number", "search"]

    def filter_search(self, queryset, name, value):
        """
        Search across multiple fields: first_name, last_name, identification_number
        """
        return queryset.filter(
            Q(first_name__icontains=value)
            | Q(last_name__icontains=value)
            | Q(identification_number__icontains=value)
        ).distinct()


class CompanyCustomerFilter(django_filters.FilterSet):
    """
    Filter set for Company customers
    """

    branch_name = django_filters.CharFilter(
        field_name="branch_name", lookup_expr="icontains"
    )
    registration_name = django_filters.CharFilter(
        method="get_company_by_registration_name", label="registration_name"
    )
    trading_name = django_filters.CharFilter(
        method="get_company_by_trading_name", label="trading_name"
    )
    registration_number = django_filters.CharFilter(
        method="get_company_by_registration_number", label="registration_number"
    )
    search = django_filters.CharFilter(method="filter_search", label="search")

    class Meta:
        """
        Meta class for CompanyCustomerFilter
        """

        model = CompanyBranch
        fields = ["search"]

    def filter_search(self, queryset, name, value):
        """
        Search across multiple fields: branch_name, registration_name, trading_name, registration_number
        """
        return queryset.filter(
            Q(branch_name__icontains=value)
            | Q(company__registration_name__icontains=value)
            | Q(company__trading_name__icontains=value)
            | Q(company__registration_number__icontains=value)
        ).distinct()

    def get_company_by_registration_number(self, queryset, registration_number, value):
        """
        Get company by registration number
        """
        return queryset.filter(company__registration_number__icontains=value)

    def get_company_by_registration_name(self, queryset, registration_name, value):
        """
        Get company by registration name
        """
        return queryset.filter(company__registration_name__icontains=value)

    def get_company_by_trading_name(self, queryset, trading_name, value):
        """
        Get company by trading name
        """
        return queryset.filter(company__trading_name__icontains=value)


def search_tenants_for_client(client, search: Optional[str] = None) -> List[object]:
    """
    Return a deduplicated list of tenant model instances (Individual and CompanyBranch)
    for leases managed by the given client. Applies search if provided.
    """
    leases_qs = Lease.objects.filter(managing_client=client)

    individual_ct = ContentType.objects.get_for_model(Individual)
    branch_ct = ContentType.objects.get_for_model(CompanyBranch)

    individual_ids = leases_qs.filter(
        leasetenantassociation__tenant__content_type=individual_ct
    ).values_list("leasetenantassociation__tenant__object_id", flat=True)

    branch_ids = leases_qs.filter(
        leasetenantassociation__tenant__content_type=branch_ct
    ).values_list("leasetenantassociation__tenant__object_id", flat=True)

    ind_qs = Individual.objects.filter(id__in=individual_ids).distinct()
    br_qs = (
        CompanyBranch.objects.filter(id__in=branch_ids)
        .select_related("company")
        .distinct()
    )

    if search:
        s = search.strip()
        ind_qs = ind_qs.filter(
            Q(identification_number__icontains=s)
            | Q(first_name__icontains=s)
            | Q(last_name__icontains=s)
        )
        br_qs = br_qs.filter(
            Q(branch_name__icontains=s)
            | Q(company__registration_name__icontains=s)
            | Q(company__trading_name__icontains=s)
            | Q(company__registration_number__icontains=s)
        )

    tenants = list(ind_qs) + list(br_qs)
    seen = set()
    unique_tenants = []
    for tenant in tenants:
        key = (tenant.__class__, tenant.pk)
        if key not in seen:
            seen.add(key)
            unique_tenants.append(tenant)

    return unique_tenants


def get_tenant_by_type_and_id(tenant_type: str, tenant_id: int) -> Optional[object]:
    """
    Retrieve a single tenant by type (individual/company) and ID.
    Returns Individual or CompanyBranch instance, or None if not found.
    """
    if tenant_type == "individual":
        try:
            return Individual.objects.get(id=tenant_id)
        except Individual.DoesNotExist:
            return None
    elif tenant_type == "company":
        try:
            return CompanyBranch.objects.select_related("company").get(id=tenant_id)
        except CompanyBranch.DoesNotExist:
            return None
    return None
