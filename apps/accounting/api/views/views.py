import logging
from django.utils.timezone import now
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError, NotFound
from django.db.models import F, Q, Sum, Prefetch
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated
from apps.accounting.filters.filters import CurrencyRateFilter
from apps.accounting.models.models import (
    SalesItem,
    SalesCategory,
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
    TransactionLineItem,
)
from apps.accounting.api.serializers.serializers import (
    SalesItemSerializer,
    ServiceSpecialPricingSerializer,
    ServiceStandardPricingSerializer,
    SalesCategorySerializer,
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
    InvoiceDetailSerializer,
    CurrencySerializer,
    DisbursementSerializer,
)
from apps.accounting.models.pricing import ServiceSpecialPricing, ServiceStandardPricing
from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message
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
        if self.request.user.is_authenticated and hasattr(self.request.user, "client"):
            return self.queryset.filter(created_by__client=self.request.user.client)
        return (
            self.queryset.none()
        )  # Return empty queryset if no company or not authenticated

    def create(self, request, *args, **kwargs):
        """Automatically assign the user when creating objects."""
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.error(f"Validation error creating object: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating object: {e}")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def list(self, request, *args, **kwargs):
        """List objects filtered by the user's company."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error retrieving objects: {e}")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, *args, **kwargs):
        """Update objects belonging to the user's company."""
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValidationError as e:
            logger.error(f"Validation error updating object: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating object: {e}")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ItemViewSet(BaseCompanyViewSet):
    serializer_class = SalesItemSerializer
    queryset = SalesItem.objects.all()
    search_fields = ["name", "^unit_name", "=item_id"]


class SalesCategoryViewSet(BaseCompanyViewSet):
    serializer_class = SalesCategorySerializer
    queryset = SalesCategory.objects.all().order_by("-id")


class GeneralLedgerAccountViewSet(BaseViewSet):
    serializer_class = GeneralLedgerAccountSerializer

    def get_queryset(self):
        queryset = GeneralLedgerAccount.objects.select_related("account_sector").filter(
            Q(created_by__client=self.request.user.client) | Q(created_by__isnull=True)
        )
        return queryset.order_by("-account_number")

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
            logger.error(f"Error updating sales account: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CashbookEntryViewSet(BaseCompanyViewSet):
    queryset = CashbookEntry.objects.all().order_by("-id")
    serializer_class = CashbookEntrySerializer


class JournalEntryViewSet(BaseCompanyViewSet):
    queryset = JournalEntry.objects.all().order_by("-id")
    serializer_class = JournalEntrySerializer


class LedgerTransactionViewSet(BaseCompanyViewSet):
    queryset = LedgerTransaction.objects.all()
    serializer_class = LedgerTransactionSerializer


class AccountSectorViewSet(BaseViewSet):
    serializer_class = AccountSectorSerializer

    def get_queryset(self):
        queryset = AccountSector.objects.all()
        if search := self.request.query_params.get("search"):
            return queryset.filter(
                Q(name__icontains=search) | Q(code__icontains=search)
            )
        return queryset.order_by("-id")

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
            logger.error(f"Error creating account sector: {e}")
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
            logger.error(f"Error updating account sector: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["get"], url_path="search-with-sectors")
    def search_with_sectors(self, request):
        """
        Search Account Sectors and with their related sales accounts.
        """
        try:
            sectors = self.get_queryset().prefetch_related("accounts")
            result = []
            for sector in sectors:
                sector_data = self.get_serializer(sector).data
                accounts_qs = sector.accounts.all()
                sector_data["accounts"] = GeneralLedgerAccountSerializer(
                    accounts_qs, many=True
                ).data
                result.append(sector_data)

            return self._create_rendered_response(result, status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error retrieving sectors with accounts: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    # Search configuration
    search_fields = [
        "document_number",
        "reference_number",
        "lease__lease_id",
        "lease__unit__unit_number",
    ]

    # Ordering configuration
    ordering_fields = [
        "document_number",
        "date_created",
        "sale_date",
        "due_date",
        "total_inclusive",
        "status",
        "invoice_type",
    ]
    ordering = ["-date_created"]  # Default ordering

    # Filter configuration
    filterset_fields = {
        "invoice_type": ["exact", "in"],
        "status": ["exact", "in"],
        "is_invoiced": ["exact"],
        "is_recurring": ["exact"],
        "currency__currency_code": ["exact"],
        "lease__lease_id": ["exact", "icontains"],
        "date_created": ["gte", "lte", "exact"],
        "sale_date": ["gte", "lte", "exact"],
        "due_date": ["gte", "lte", "exact"],
        "total_inclusive": ["gte", "lte"],
    }

    def get_queryset(self):
        """
        Optimized queryset with select_related and prefetch_related for performance
        """
        queryset = Invoice.objects.filter(created_by__client=self.request.user.client)
        queryset = queryset.exclude(sale_date=F("next_invoice_date"))
        # Optimize database queries
        queryset = queryset.select_related(
            "currency",
            "lease",
            "lease__unit",
            "customer",
        ).prefetch_related(
            Prefetch(
                "line_items",
                queryset=TransactionLineItem.objects.select_related(
                    "sales_item",
                    "sales_item__category",
                    "sales_item__tax_configuration",
                ),
            )
        )
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return InvoiceDetailSerializer
        return InvoiceSerializer

    def filter_queryset(self, queryset):
        """
        Apply custom filtering logic for enhanced search and filtering
        """
        queryset = super().filter_queryset(queryset)
        request = self.request

        if search_query := request.query_params.get("search", None):
            queryset = self._apply_custom_search(queryset, search_query)

        if customer_name := request.query_params.get("customer_name", None):
            queryset = self._filter_by_customer_name(queryset, customer_name)

        if status_in := request.query_params.get("status_in", None):
            status_list = [s.strip() for s in status_in.split(",")]
            queryset = queryset.filter(status__in=status_list)

        if type_in := request.query_params.get("type_in", None):
            type_list = [t.strip() for t in type_in.split(",")]
            queryset = queryset.filter(invoice_type__in=type_list)

        return queryset

    def _apply_custom_search(self, queryset, search_query):
        """
        Apply comprehensive search across multiple fields including
        document, lease, unit, and customer info.
        """
        return queryset.filter(
            Q(document_number__iexact=search_query)
            | Q(reference_number__iexact=search_query)
            | Q(lease__lease_id__iexact=search_query)
            | Q(lease__unit__unit_number__icontains=search_query)
            | Q(customer__individual__first_name__icontains=search_query)
            | Q(customer__individual__last_name__icontains=search_query)
            | Q(customer__company__branch_name__icontains=search_query)
        )

    def _filter_by_customer_name(self, queryset, customer_name):
        """
        Filter by customer name (individual or company branch).
        Matches individual's first or last name,
        or company's branch/trading name.
        """
        return queryset.filter(
            Q(customer__individual__first_name__icontains=customer_name)
            | Q(customer__individual__last_name__icontains=customer_name)
            | Q(customer__company__branch_name__icontains=customer_name)
        )

    def create(self, request, *args, **kwargs):
        """
        Handle manual invoice creation with robust validation
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                invoice = serializer.save(created_by=request.user)
                invoice.update_totals()
                headers = self.get_success_headers(serializer.data)

                # Log creation
                self._log_invoice_action(invoice, "created", request.user)

                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )

        except ValidationError as e:
            print(f"Validation error creating invoice: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Unexpected error creating invoice: {e}")
            return Response(
                {"error": f"Failed to create invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        """
        Handle invoice updates with robust validation
        """
        try:
            with transaction.atomic():
                instance = self.get_object()

                # Validate update data
                serializer = self.get_serializer(
                    instance, data=request.data, partial=False
                )
                serializer.is_valid(raise_exception=True)

                # Perform update
                invoice = serializer.save()

                # Log update
                self._log_invoice_action(invoice, "updated", request.user)

                return Response(serializer.data)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to update invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # FILTERING AND SEARCH ACTIONS
    @action(detail=False, methods=["get"], url_path="filter-options")
    def filter_options(self, request):
        """
        Return available filter options for frontend
        """
        queryset = self.filter_queryset(self.get_queryset())

        options = {
            "invoice_types": dict(Invoice.INVOICE_TYPE_CHOICES),
            "statuses": dict(Invoice.STATUS_CHOICES),
            "currencies": list(
                queryset.values_list("currency__currency_code", flat=True).distinct()
            ),
            "lease_ids": list(
                queryset.values_list("lease__lease_id", flat=True).distinct()
            ),
        }

        return Response(options)

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """
        Return summary statistics for filtered invoices
        """
        queryset = self.filter_queryset(self.get_queryset())

        from django.db.models import Count, Sum, Q

        summary = queryset.aggregate(
            total_count=Count("id"),
            pending_count=Count("id", filter=Q(status="pending")),
            paid_count=Count("id", filter=Q(status="paid")),
            draft_count=Count("id", filter=Q(status="draft")),
            cancelled_count=Count("id", filter=Q(status="cancelled")),
            total_amount=Sum("total_inclusive"),
            pending_amount=Sum("total_inclusive", filter=Q(status="pending")),
            paid_amount=Sum("total_inclusive", filter=Q(status="paid")),
        )

        # Type breakdown
        type_breakdown = (
            queryset.values("invoice_type")
            .annotate(count=Count("id"), amount=Sum("total_inclusive"))
            .order_by("invoice_type")
        )

        # Status breakdown
        status_breakdown = (
            queryset.values("status")
            .annotate(count=Count("id"), amount=Sum("total_inclusive"))
            .order_by("status")
        )

        return Response(
            {
                "summary": summary,
                "type_breakdown": list(type_breakdown),
                "status_breakdown": list(status_breakdown),
            }
        )

    @action(detail=False, methods=["get"], url_path="search-suggestions")
    def search_suggestions(self, request):
        """
        Return search suggestions for autocomplete
        """
        search_query = request.query_params.get("q", "")
        if not search_query or len(search_query) < 2:
            return Response([])

        queryset = self.filter_queryset(self.get_queryset())

        # Get matching document numbers
        document_numbers = queryset.filter(
            document_number__icontains=search_query
        ).values_list("document_number", flat=True)[:10]

        # Get matching customer names
        customer_names = queryset.filter(
            Q(customer__full_name__icontains=search_query)
            | Q(customer__identification_number__icontains=search_query)
        ).values_list(
            "customer__full_name",
            "customer__company__registration_name",
        )[
            :10
        ]

        suggestions = {
            "document_numbers": list(document_numbers),
            "customer_names": [
                name[0] or name[1] for name in customer_names if any(name)
            ],
        }

        return Response(suggestions)

    # INVOICE MANAGEMENT ACTIONS
    @action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        try:
            with transaction.atomic():
                invoice.status = "paid"
                invoice.save()

                self._log_invoice_action(invoice, "marked_paid", request.user)
                return Response(self.get_serializer(invoice).data)

        except Exception as e:
            return Response(
                {"error": f"Failed to mark invoice as paid: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"], url_path="convert-to-fiscal")
    def convert_to_fiscal(self, request, pk=None):
        """Convert proforma to fiscal invoice"""
        invoice = self.get_object()
        try:
            with transaction.atomic():
                invoice.convert_to_fiscal()
                self._log_invoice_action(invoice, "converted_to_fiscal", request.user)
                return Response(self.get_serializer(invoice).data)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to convert invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"], url_path="convert-recurring-to-fiscal")
    def convert_recurring_to_fiscal(self, request, pk=None):
        """
        Convert recurring invoice template to fiscal invoice with modifications
        """
        invoice = self.get_object()

        if not invoice.can_generate_fiscal():
            return Response(
                {
                    "error": "This invoice cannot be converted to fiscal. It may already be invoiced or not a recurring template."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                fiscal_invoice = invoice.convert_recurring_to_fiscal(
                    serializer.validated_data
                )

                self._log_invoice_action(
                    invoice,
                    "recurring_converted_to_fiscal",
                    request.user,
                    {
                        "fiscal_invoice_id": fiscal_invoice.id,
                        "fiscal_invoice_number": fiscal_invoice.document_number,
                        "items_modified": "items" in serializer.validated_data,
                    },
                )

                response_serializer = InvoiceSerializer(
                    fiscal_invoice, context={"request": request}
                )
                return Response(
                    response_serializer.data, status=status.HTTP_201_CREATED
                )

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to convert recurring invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"], url_path="generate-recurring")
    def generate_recurring(self, request, pk=None):
        """Generate next recurring invoice from template"""
        invoice = self.get_object()
        try:
            with transaction.atomic():
                new_invoice = invoice.generate_recurring_invoice()

                self._log_invoice_action(
                    invoice,
                    "recurring_invoice_generated",
                    request.user,
                    {
                        "new_invoice_id": new_invoice.id,
                        "new_invoice_number": new_invoice.document_number,
                    },
                )

                serializer = self.get_serializer(new_invoice)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to generate recurring invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"], url_path="cancel-invoice")
    def cancel_invoice(self, request, pk=None):
        """Cancel an invoice with validation"""
        invoice = self.get_object()

        if invoice.status == "cancelled":
            return Response(
                {"error": "Invoice is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if invoice.status == "paid":
            return Response(
                {
                    "error": "Cannot cancel a paid invoice. Consider creating a credit note instead."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                invoice.status = "cancelled"
                invoice.save()
                self._log_invoice_action(invoice, "cancelled", request.user)
                return Response(self.get_serializer(invoice).data)

        except Exception as e:
            return Response(
                {"error": f"Failed to cancel invoice: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["get"], url_path="recurring-templates")
    def recurring_templates(self, request):
        """Get recurring invoice templates"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(
            invoice_type="recurring", is_invoiced=False, status="draft"
        ).order_by("-date_created")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="pending-fiscal")
    def pending_fiscal_invoices(self, request):
        """Get pending fiscal invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(
            invoice_type="fiscal", status="pending", is_invoiced=True
        ).order_by("-date_created")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="get-pending-invoices")
    def get_pending_invoices(self, request):
        """Get all pending invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="pending")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="get-paid-invoices")
    def get_paid_invoices(self, request):
        """Get all paid invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="paid")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="get-cancelled-invoices")
    def get_cancelled_invoices(self, request):
        """Get all cancelled invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(status="cancelled")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="proforma-invoices")
    def proforma_invoices(self, request):
        """Get all proforma invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type="proforma")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="fiscal-invoices")
    def fiscal_invoices(self, request):
        """Get all fiscal invoices"""
        print("Fetching fiscal invoices", self.get_queryset().count())
        queryset = self.filter_queryset(self.get_queryset())
        print("Filtering for fiscal invoices", queryset.count())
        queryset = queryset.filter(invoice_type="fiscal")
        return self._paginated_response(queryset)

    @action(detail=False, methods=["get"], url_path="recurring-invoices")
    def recurring_invoices(self, request):
        """Get all recurring invoice templates"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(invoice_type="recurring")
        return self._paginated_response(queryset)

    # HELPER METHODS
    def _paginated_response(self, queryset):
        """Return paginated response for queryset"""
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def _log_invoice_action(self, invoice, action, user, extra_details=None):
        """Helper method to log invoice actions"""
        try:
            details = {
                "invoice_id": invoice.id,
                "invoice_number": invoice.document_number,
                "invoice_type": invoice.invoice_type,
                "status": invoice.status,
                "action": action,
            }
            if extra_details:
                details.update(extra_details)

            # Replace with your actual logging system
            print(f"Invoice Action Log: {details}")

        except Exception as e:
            # Don't let logging errors break the main transaction
            print(f"Failed to log invoice action: {str(e)}")


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
    queryset = CashBook.objects.all().order_by("-id")
    serializer_class = CashBookSerializer


class CurrencyViewSet(BaseViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    pagination_class = None

    # override the base get queryset
    def get_queryset(self):
        return self.queryset.all()


class PaymentMethodViewSet(BaseCompanyViewSet):
    queryset = PaymentMethod.objects.all().order_by("-id")
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
