import logging
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError, NotFound
from django.db.models import Q, Sum
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from apps.accounting.filters.filters import CurrencyRateFilter
from apps.accounting.models.models import (
    SalesItem,
    VATSetting,
    SalesCategory,
    SalesAccount,
    CashSale,
    CashbookEntry,
    GeneralLedgerAccount,
    JournalEntry,
    LedgerTransaction,
    AccountSector,
    Invoice,
    Payment,
    CurrencyRate,
    PaymentMethod,
    TransactionType,
    CashBook,
    Currency,
    CreditNote,
)
from apps.accounting.api.serializers.serializers import (
    CustomersSearchSerializer,
    SalesItemSerializer,
    ServiceSpecialPricingSerializer,
    ServiceStandardPricingSerializer,
    VATSettingSerializer,
    SalesCategorySerializer,
    SalesAccountSerializer,
    CashSaleSerializer,
    CashbookEntrySerializer,
    GeneralLedgerAccountSerializer,
    JournalEntrySerializer,
    LedgerTransactionSerializer,
    AccountSectorSerializer,
    InvoiceSerializer,
    PaymentSerializer,
    CurrencyRateSerializer,
    PaymentMethodSerializer,
    TransactionTypeSerializer,
    CashBookSerializer,
    CurrencySerializer,
    CreditNoteSerializer,
    DisbursementSerializer,
)
from apps.accounting.filters.customer_filters import (
    IndividualCustomerFilter,
    CompanyCustomerFilter,
    get_tenant_by_type_and_id,
    search_tenants_for_client,
)
from apps.accounting.models.pricing import ServiceSpecialPricing, ServiceStandardPricing
from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual
from apps.leases.models import Landlord
from apps.clients.models import Client
from apps.accounting.models.disbursements import Disbursement

logger = logging.getLogger("accounting")


class BaseCompanyViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically filters data for the requesting user's company
    and assigns the user to new objects.
    """

    permission_classes = [IsAuthenticated]  # Ensure users are authenticated

    def get_queryset(self):
        """Ensure users only access objects belonging to their company."""
        # Ensure user and company attributes exist before filtering
        if self.request.user.is_authenticated and hasattr(self.request.user, "company"):
            return self.queryset.filter(user__company=self.request.user.company)
        return (
            self.queryset.none()
        )  # Return empty queryset if no company or not authenticated

    def perform_create(self, serializer):
        """Automatically assign the user when creating objects."""
        serializer.save(user=self.request.user)


class ItemViewSet(BaseCompanyViewSet):
    queryset = SalesItem.objects.all()
    serializer_class = SalesItemSerializer


class VATSettingViewSet(BaseViewSet):
    """ViewSet for managing VAT settings.

    Allows creation, retrieval, updating, and deletion of VAT settings.
    Ensures that VAT settings are unique per company based on description.

    """

    queryset = VATSetting.objects.all()
    serializer_class = VATSettingSerializer

    def get_queryset(self):
        return self.queryset.filter(created_by__client=self.request.user.client)

    def create(self, request, *args, **kwargs):
        data = request.data
        invalid_data = []
        valid_data = []
        try:
            for item in data:
                serializer = self.get_serializer(data=item)
                if serializer.is_valid():
                    serializer.save()
                    valid_data.append(serializer.data)
                else:
                    invalid_data.append(extract_error_message(serializer.errors))
            return self._create_rendered_response(
                {"created": valid_data, "errors": invalid_data},
                status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError as e:
            logger.error(f"Validation error creating VAT setting: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Error creating VAT setting: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving VAT setting: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def list(self, request, *args, **kwargs):
        try:
            vat = self.get_queryset()
            page = self.paginate_queryset(vat)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(vat, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving VAT settings: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop("partial", False)
            instance = VATSetting.objects.get(
                pk=kwargs.get("pk"), created_by__client=request.user.client
            )
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except ValidationError as e:
            logger.error(f"Validation error updating VAT setting: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Error updating VAT setting: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return self._create_rendered_response(
                {"success": "VAT setting deleted successfully"},
                status.HTTP_204_NO_CONTENT,
            )

        except Http404:
            return self._create_rendered_response(
                {"error": "VAT not found"},
                status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error deleting VAT setting: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SalesCategoryViewSet(BaseCompanyViewSet):
    queryset = SalesCategory.objects.all()
    serializer_class = SalesCategorySerializer


class SalesAccountViewSet(BaseCompanyViewSet):
    queryset = SalesAccount.objects.all()
    serializer_class = SalesAccountSerializer


class CashSaleViewSet(BaseCompanyViewSet):
    queryset = CashSale.objects.all()
    serializer_class = CashSaleSerializer


class CashbookEntryViewSet(BaseCompanyViewSet):
    queryset = CashbookEntry.objects.all()
    serializer_class = CashbookEntrySerializer


class GeneralLedgerAccountViewSet(BaseCompanyViewSet):
    queryset = GeneralLedgerAccount.objects.all()
    serializer_class = GeneralLedgerAccountSerializer


class JournalEntryViewSet(BaseCompanyViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer


class LedgerTransactionViewSet(BaseCompanyViewSet):
    queryset = LedgerTransaction.objects.all()
    serializer_class = LedgerTransactionSerializer


class AccountSectorViewSet(BaseCompanyViewSet):
    queryset = AccountSector.objects.all()
    serializer_class = AccountSectorSerializer


class InvoiceViewSet(BaseCompanyViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = "paid"
        invoice.save()
        return Response(self.get_serializer(invoice).data)

    @action(detail=True, methods=["post"], url_path="convert-to-fiscal")
    def convert_to_fiscal(self, request, pk=None):
        """Convert proforma to fiscal invoice"""
        invoice = self.get_object()
        try:
            invoice.convert_to_fiscal()
            return Response(self.get_serializer(invoice).data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="generate-recurring")
    def generate_recurring(self, request, pk=None):
        """Generate next recurring invoice from a recurring template invoice."""
        invoice = self.get_object()
        try:
            new_invoice = invoice.generate_recurring_invoice()
            serializer = self.get_serializer(new_invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False, methods=["get"], url_path="get-pending-invoices"
    )  # Changed to False as it's a list operation
    def get_pending_invoices(self, request):
        """Get all pending invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="pending")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False, methods=["get"], url_path="get-paid-invoices"
    )  # Changed to False
    def get_paid_invoices(self, request):
        """Get all paid invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="paid")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="get-cancelled-invoices")
    def get_cancelled_invoices(self, request):
        """Get all cancelled invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="cancelled")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="cancel-invoice")
    def cancel_invoice(self, request, pk=None):
        """Cancel an invoice"""
        invoice = self.get_object()
        invoice.status = "cancelled"
        invoice.save()
        return Response(self.get_serializer(invoice).data)

    @action(detail=False, methods=["get"], url_path="proforma-invoices")
    def proforma_invoices(self, request):
        """Get all proforma invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type="proforma")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="fiscal-invoices")
    def fiscal_invoices(self, request):
        """Get all fiscal invoices for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type="fiscal")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="recurring-invoices")
    def recurring(self, request):
        """Get all recurring invoice templates for the user's company"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type="recurring")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CreditNoteViewSet(BaseCompanyViewSet):
    queryset = CreditNote.objects.all()
    serializer_class = CreditNoteSerializer


class PaymentViewSet(BaseCompanyViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class CurrencyRateViewSet(BaseViewSet):
    queryset = CurrencyRate.objects.select_related("currency", "base_currency").all()
    serializer_class = CurrencyRateSerializer
    filterset_class = CurrencyRateFilter
    ordering_fields = ["date_created", "current_rate"]
    ordering = ["-date_created"]

    def get_queryset(self):
        queryset = self.queryset.filter(created_by__client=self.request.user.client)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving rate history: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except CurrencyRate.DoesNotExist as exc:
            raise NotFound("Currency rate not found.") from exc

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except ValidationError as e:
            logger.error(f"Validation error updating currency rate: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating currency rate: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return self._create_rendered_response(
                {"message": "Currency rate deleted successfully"},
                status.HTTP_204_NO_CONTENT,
            )
        except CurrencyRate.DoesNotExist:
            raise NotFound({"error": "Currency rate not found."})

    @action(detail=False, methods=["get"], url_path="latest-rate")
    def latest_rate(self, request):
        """Get the latest currency rate for a given currency code."""
        try:
            latest_rate = self.get_queryset().latest("date_created")
            serializer = self.get_serializer(latest_rate)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except CurrencyRate.DoesNotExist:
            return self._create_rendered_response(
                {"error": "No rates found for the specified currency code."},
                status.HTTP_404_NOT_FOUND,
            )


class CashBookViewSet(BaseCompanyViewSet):
    queryset = CashBook.objects.all()
    serializer_class = CashBookSerializer


class CurrencyViewSet(BaseViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    pagination_class = None

    # override the base get queryset
    def get_queryset(self):
        return self.queryset.all()


class PaymentMethodViewSet(BaseCompanyViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    pagination_class = None

    def get_queryset(self):
        return self.queryset.all()

    def create(self, request, *args, **kwargs):
        company = request.user.company
        name = request.data.get("payment_method_name")

        if PaymentMethod.objects.filter(
            user__company=company, payment_method_name=name
        ).exists():
            return Response(
                {"error!": "This Payment Method Already Exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TransactionTypeViewSet(BaseCompanyViewSet):
    queryset = TransactionType.objects.all()
    serializer_class = TransactionTypeSerializer


class DisbursementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A ViewSet for viewing disbursement history and generating creditor statements.
    """

    queryset = Disbursement.objects.all().select_related(
        "landlord", "payee", "currency", "payment_method"
    )
    serializer_class = DisbursementSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "landlord", "payee", "payment_method"]
    search_fields = ["reference", "payee__client_name"]
    ordering_fields = ["payment_date", "amount"]
    ordering = ["-payment_date"]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if not user.is_staff and not user.is_superuser:
            if hasattr(user, "client"):
                # Assumes the user is an agent and can only see disbursements
                # made to landlords or to their own agency (the payee).
                return queryset.filter(Q(landlord__isnull=False) | Q(payee=user.client))
            else:
                return queryset.none()
        return queryset

    @action(detail=False, methods=["get"], url_path="creditor-statements")
    def get_creditor_statement(self, request):
        """
        Generates a statement for a specific creditor (Landlord or other Client).
        Expects a `creditor_id` and an optional `creditor_type` (e.g., 'landlord', 'agency').
        """
        creditor_id = request.query_params.get("creditor_id")
        creditor_type = request.query_params.get("creditor_type")

        if not creditor_id:
            return Response(
                {"error": "creditor_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Handle landlord statements separately for a clear link
        if creditor_type == "landlord":
            landlord = get_object_or_404(Landlord, id=creditor_id)
            disbursements = (
                self.get_queryset().filter(landlord=landlord).order_by("payment_date")
            )
            creditor_name = landlord.landlord_name
        else:
            # Handle all other clients (e.g., the agency itself)
            payee_client = get_object_or_404(Client, id=creditor_id)
            disbursements = (
                self.get_queryset().filter(payee=payee_client).order_by("payment_date")
            )
            creditor_name = payee_client.client_name

        # Calculate totals
        totals = disbursements.aggregate(
            total_processed=Sum("amount", filter=Q(status="processed")),
            total_pending=Sum("amount", filter=Q(status="pending")),
        )
        total_paid = totals["total_processed"] or 0
        total_pending = totals["total_pending"] or 0

        serializer = self.get_serializer(disbursements, many=True)

        return Response(
            {
                "creditor_name": creditor_name,
                "total_paid": total_paid,
                "total_pending": total_pending,
                "transactions": serializer.data,
            }
        )


class ServiceSpecialPricingViewSet(BaseViewSet):
    queryset = ServiceSpecialPricing.objects.select_related(
        "service", "client_customer", "currency"
    ).all()
    serializer_class = ServiceSpecialPricingSerializer
    lookup_field = "client_customer"

    def get_queryset(self):
        if search := self.request.query_params.get("search"):
            return (
                super()
                .get_queryset()
                .filter(
                    Q(service__service_name__icontains=search)
                    | Q(client_customer__name__icontains=search)
                    | Q(currency__currency_code__icontains=search)
                )
            )
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating special pricing: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, client_customer=None, *args, **kwargs):
        try:
            instance = Client.objects.get(id=client_customer)
            instance = self.get_queryset().filter(client_customer=instance)
            serializer = self.get_serializer(instance, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving special pricing: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ServiceStandardPricingViewSet(BaseViewSet):
    queryset = ServiceStandardPricing.objects.select_related(
        "service", "currency"
    ).all()
    serializer_class = ServiceStandardPricingSerializer

    def get_queryset(self):
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating standard pricing: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating standard pricing: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
            return search_tenants_for_client(user.client, search=search_key)

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
                return self._create_rendered_response(
                    serializer.data, status.HTTP_200_OK
                )

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
