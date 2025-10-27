import django_filters
from django.db.models import Q
from apps.leases.models.models import LeaseTenant
from apps.accounting.models.models import Invoice
from django.contrib.contenttypes.models import ContentType
from individuals.models import Individual
from companies.models import Company


class InvoiceFilter(django_filters.FilterSet):
    # Basic filters
    invoice_type = django_filters.ChoiceFilter(choices=Invoice.INVOICE_TYPE_CHOICES)
    status = django_filters.ChoiceFilter(choices=Invoice.STATUS_CHOICES)
    is_invoiced = django_filters.BooleanFilter()
    is_recurring = django_filters.BooleanFilter()

    # Date range filters
    date_created = django_filters.DateFromToRangeFilter()
    sale_date = django_filters.DateFromToRangeFilter()
    due_date = django_filters.DateFromToRangeFilter()

    # Customer search (by name)
    customer_name = django_filters.CharFilter(method="filter_customer_name")

    # Document number search
    document_number = django_filters.CharFilter(lookup_expr="icontains")

    # Reference number search
    reference_number = django_filters.CharFilter(lookup_expr="icontains")

    # Lease-related filters
    lease_id = django_filters.CharFilter(
        field_name="lease__lease_id", lookup_expr="icontains"
    )
    unit_name = django_filters.CharFilter(
        field_name="lease__unit__name", lookup_expr="icontains"
    )

    # Amount filters
    total_inclusive_min = django_filters.NumberFilter(
        field_name="total_inclusive", lookup_expr="gte"
    )
    total_inclusive_max = django_filters.NumberFilter(
        field_name="total_inclusive", lookup_expr="lte"
    )

    # Currency filter
    currency = django_filters.CharFilter(
        field_name="currency__currency_code", lookup_expr="iexact"
    )

    # Combined status and type filters
    status_in = django_filters.BaseInFilter(field_name="status", lookup_expr="in")
    type_in = django_filters.BaseInFilter(field_name="invoice_type", lookup_expr="in")

    class Meta:
        model = Invoice
        fields = {
            "invoice_type": ["exact"],
            "status": ["exact"],
            "is_invoiced": ["exact"],
            "is_recurring": ["exact"],
        }

    def filter_customer_name(self, queryset, name, value):
        """
        Filter by customer name (searches both Individual and Company names)
        """
        if not value:
            return queryset

        # Get content types for Individual and CompanyBranch
        individual_content_type = ContentType.objects.get_for_model(Individual)
        company_content_type = ContentType.objects.get_for_model(Company)

        # Find LeaseTenant objects that match the search
        matching_tenants = LeaseTenant.objects.filter(
            Q(
                content_type=individual_content_type,
                tenant_object__full_name__icontains=value,
            )
            | Q(
                content_type=company_content_type,
                tenant_object__company__registration_name__icontains=value,
            )
            | Q(
                content_type=company_content_type,
                tenant_object__branch_name__icontains=value,
            )
        )

        return queryset.filter(customer__in=matching_tenants)


class InvoiceSearchFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search")

    def filter_search(self, queryset, name, value):
        """
        Comprehensive search across multiple fields
        """
        if not value:
            return queryset

        # Search in document_number, reference_number, and customer names
        individual_content_type = ContentType.objects.get_for_model(Individual)
        company_content_type = ContentType.objects.get_for_model(Company)

        matching_tenants = LeaseTenant.objects.filter(
            Q(
                content_type=individual_content_type,
                tenant_object__full_name__icontains=value,
            )
            | Q(
                content_type=company_content_type,
                tenant_object__company__registration_name__icontains=value,
            )
            | Q(
                content_type=company_content_type,
                tenant_object__branch_name__icontains=value,
            )
        )

        return queryset.filter(
            Q(document_number__icontains=value)
            | Q(reference_number__icontains=value)
            | Q(lease__lease_id__icontains=value)
            | Q(lease__unit__name__icontains=value)
            | Q(customer__in=matching_tenants)
        )
