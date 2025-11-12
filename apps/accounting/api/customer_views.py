from apps.common.api.views import BaseViewSet
from rest_framework import status
from apps.individuals.models.models import Individual
from apps.companies.models.models import CompanyBranch
from apps.accounting.api.serializers.serializers import CustomersSearchSerializer
from apps.accounting.filters.customer_filters import (
    IndividualCustomerFilter,
    CompanyCustomerFilter,
    get_tenant_by_type_and_id,
    search_tenants_for_client,
)
import logging

logger = logging.getLogger(__name__)


class CustomersViewSet(BaseViewSet):
    """
    ViewSet to retrieve customers (individuals, companies, tenants).

    Query params:
      - customer_type: 'individual', 'company', or 'tenant'
      - search: search string (optional)
      - tenant_type: 'individual' or 'company' (for retrieve when customer_type=tenant)
    """

    queryset = None
    serializer_class = CustomersSearchSerializer

    def get_queryset(self):
        """
        Return queryset or list based on customer_type:
          - individual: filtered Individual queryset
          - company: filtered CompanyBranch queryset
          - tenant: deduplicated list of tenant instances from leases
        """
        user = getattr(self.request, "user", None)
        if not user or not hasattr(user, "client"):
            return []

        customer_type = self.request.query_params.get("customer_type", "tenant")
        search_key = self.request.query_params.get("search")
        tenant_type = self.request.query_params.get("tenant_type")

        if customer_type == "individual":
            customers = Individual.objects.filter(is_active=True)
            filterset = IndividualCustomerFilter(
                self.request.query_params, queryset=customers
            )
            return filterset.qs

        elif customer_type == "company":
            customers = CompanyBranch.objects.filter(company__is_active=True)
            filterset = CompanyCustomerFilter(
                self.request.query_params, queryset=customers
            )
            return filterset.qs

        elif customer_type == "tenant":
            return search_tenants_for_client(
                user.client, search=search_key, type=tenant_type
            )

        return []

    def list(self, request, *args, **kwargs):
        """
        List customers based on customer_type query param.
        Supports pagination for all customer types.
        """
        try:
            customer_type = request.query_params.get("customer_type")
            if not customer_type:
                return self._create_rendered_response(
                    {
                        "error": "customer type is required. Use 'individual', 'company', or 'tenant'."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )

            if customer_type not in ["individual", "company", "tenant"]:
                return self._create_rendered_response(
                    {
                        "error": "Invalid customer type. Must be 'individual', 'company', or 'tenant'."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )

            queryset = self.get_queryset()
            # Paginate the results
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except Exception as e:
            logger.error("Error listing customers: %s", e, exc_info=True)
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, pk=None, *args, **kwargs):
        """
        Retrieve a single customer by ID and type.

        For customer_type=tenant, requires tenant_type ('individual' or 'company') query param.
        For customer_type=individual/company, uses standard DRF retrieve.
        """
        try:
            customer_type = request.query_params.get("customer_type")

            if not customer_type:
                return self._create_rendered_response(
                    {"error": "customer_type query parameter is required"},
                    status.HTTP_400_BAD_REQUEST,
                )

            if customer_type == "individual":
                try:
                    instance = Individual.objects.get(pk=pk, is_active=True)
                    serializer = self.get_serializer(instance)
                    return self._create_rendered_response(
                        serializer.data, status.HTTP_200_OK
                    )
                except Individual.DoesNotExist:
                    return self._create_rendered_response(
                        {"error": "Individual customer not found"},
                        status.HTTP_404_NOT_FOUND,
                    )

            elif customer_type == "company":
                try:
                    instance = CompanyBranch.objects.select_related("company").get(
                        pk=pk, company__is_active=True
                    )
                    serializer = self.get_serializer(instance)
                    return self._create_rendered_response(
                        serializer.data, status.HTTP_200_OK
                    )
                except CompanyBranch.DoesNotExist:
                    return self._create_rendered_response(
                        {"error": "Company customer not found"},
                        status.HTTP_404_NOT_FOUND,
                    )

            elif customer_type == "tenant":
                return self._extracted_from_retrieve_46(request, pk)
            else:
                return self._create_rendered_response(
                    {"error": "Invalid customer_type"},
                    status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error("Error retrieving customer: %s", e, exc_info=True)
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # TODO Rename this here and in `retrieve`
    def _extracted_from_retrieve_46(self, request, pk):
        tenant_type = request.query_params.get("tenant_type")
        if not tenant_type or tenant_type not in ["individual", "company"]:
            return self._create_rendered_response(
                {
                    "error": "tenant_type query parameter is required for tenants. Use 'individual' or 'company'."
                },
                status.HTTP_400_BAD_REQUEST,
            )

        instance = get_tenant_by_type_and_id(tenant_type, pk)
        if not instance:
            return self._create_rendered_response(
                {"error": "Tenant not found"},
                status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(instance)
        return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
