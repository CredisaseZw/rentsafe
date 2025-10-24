from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from django.db.models import Q, Sum
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from urllib import request
from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
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
    RecurringToFiscalSerializer,
    CurrencySerializer,
    CreditNoteSerializer,
    DisbursementSerializer,
)
from apps.accounting.models.pricing import ServiceSpecialPricing, ServiceStandardPricing
from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message
from apps.companies.models.models import CompanyBranch
from apps.individuals.models.models import Individual
from apps.leases.models import Landlord
from apps.clients.models import Client
from apps.accounting.models.disbursements import Disbursement
import logging

from apps.leases.models.models import Lease

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


class VATSettingViewSet(BaseCompanyViewSet):
    queryset = VATSetting.objects.all()
    serializer_class = VATSettingSerializer

    def create(self, request, *args, **kwargs):
        """
        Allows bulk creation of VAT settings and prevents duplicate descriptions per company.
        """
        data = request.data
        if not isinstance(data, list):
            # If not a list, proceed with standard single object creation
            return super().create(request, *args, **kwargs)

        company = self.request.user.company

        # Get descriptions of existing VAT settings for the user's company
        existing_descriptions = set(
            VATSetting.objects.filter(user__company=company).values_list(
                "description", flat=True
            )
        )

        # Filter out data for VAT settings that already exist
        valid_data = [
            item
            for item in data
            if item.get("description") not in existing_descriptions
        ]

        if not valid_data:
            return Response(
                {"error": "All provided VAT settings already exist for your company."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # The perform_create in BaseCompanyViewSet handles assigning the user.
        # So we just need to pass the valid_data to the serializer.
        serializer = self.get_serializer(data=valid_data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(
            serializer
        )  # This will call serializer.save(user=self.request.user) for each object

        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == "convert_recurring_to_fiscal":
            return RecurringToFiscalSerializer
        return super().get_serializer_class()

    @action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        try:
            with transaction.atomic():
                invoice.status = "paid"
                invoice.save()

                # Log the payment action
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

                # Log the conversion action
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
        Convert recurring invoice template to fiscal invoice.
        Allows modification of line items before conversion.
        """
        invoice = self.get_object()

        # Validate that this is a recurring invoice that can be converted
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
                # Convert to fiscal invoice with optional modifications
                fiscal_invoice = invoice.convert_recurring_to_fiscal(
                    serializer.validated_data
                )

                # Log the conversion action
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

                # Return the newly created fiscal invoice
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
        """Generate next recurring invoice from a recurring template invoice."""
        invoice = self.get_object()
        try:
            with transaction.atomic():
                new_invoice = invoice.generate_recurring_invoice()

                # Log the generation action
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

        # Validate that invoice can be cancelled
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
        """Get all recurring invoice templates that can be converted to fiscal"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(
            invoice_type="recurring", is_invoiced=False, status="draft"
        ).order_by("-date_created")

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="pending-fiscal")
    def pending_fiscal_invoices(self, request):
        """Get all pending fiscal invoices"""
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(
            invoice_type="fiscal", status="pending", is_invoiced=True
        ).order_by("-date_created")

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

            print(f"Invoice Action Log: {details}")

        except Exception as e:
            # Don't let logging errors break the main transaction
            print(f"Failed to log invoice action: {str(e)}")

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


class CurrencyRateViewSet(BaseCompanyViewSet):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer

    @action(
        detail=False, methods=["GET", "POST", "PUT", "PATCH"], url_path="rate-setup"
    )
    def rate_setup(self, request, pk=None):
        """
        Endpoint to get or set currency rate settings for the user's company.
        There should ideally be only one CurrencyRate instance per company (or a system-wide rate).
        """
        currency_rate_query = self.queryset.filter(user__company=request.user.company)
        instance = currency_rate_query.last()

        if request.method == "GET":
            if instance:
                serializer = self.get_serializer(instance)
                return Response({"currency_rate_settings": serializer.data})
            return Response(
                {"errors": "No currency rate settings found for your company."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.method in ["POST", "PUT", "PATCH"]:
            serializer = self.get_serializer(instance, data=request.data, partial=True)

            base_currency = request.data.get("base_currency")
            target_currency = request.data.get("currency")

            current_rate = request.data.get("current_rate")
            try:
                current_rate = float(current_rate)
            except (TypeError, ValueError):
                return Response(
                    {"error": "Current rate must be a valid number"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if current_rate <= 0:
                return Response(
                    {"error": "Current rate must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if serializer.is_valid(
                raise_exception=True
            ):  # raise_exception=True handles errors automatically
                if base_currency == target_currency:
                    return Response(
                        {
                            "error": "Base currency and Target currency cannot be the same"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                serializer.save(
                    user=request.user
                )  # Assign user during save via perform_create/update
                message = (
                    "Rate updated successfully"
                    if instance
                    else "Rate created successfully"
                )
                return Response(
                    {
                        "Success ": message,
                    },
                    status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED,
                )
            # If serializer.is_valid() was False, errors would be raised by raise_exception=True
            # and handled by DRF's exception handler.


class CashBookViewSet(BaseCompanyViewSet):
    queryset = CashBook.objects.all()
    serializer_class = CashBookSerializer


class CurrencyViewSet(BaseCompanyViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    pagination_class = None

    # overide the base get queryset
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
    """ViewSet to retrieve customers (tenants) associated with leases managed by the user's client."""

    queryset = Lease.objects.none()
    serializer_class = CustomersSearchSerializer

    def get_queryset(self):
        user = getattr(self.request, "user", None)
        search_key = self.request.query_params.get("search", None)

        if not user or not hasattr(user, "client"):
            return []

        leases_qs = Lease.objects.filter(managing_client=user.client)

        individual_ct = ContentType.objects.get_for_model(Individual)
        branch_ct = ContentType.objects.get_for_model(CompanyBranch)

        individual_ids = leases_qs.filter(
            leasetenantassociation__tenant__content_type=individual_ct
        ).values_list("leasetenantassociation__tenant__object_id", flat=True)

        branch_ids = leases_qs.filter(
            leasetenantassociation__tenant__content_type=branch_ct
        ).values_list("leasetenantassociation__tenant__object_id", flat=True)

        ind_qs = Individual.objects.filter(id__in=individual_ids).distinct()
        br_qs = CompanyBranch.objects.filter(id__in=branch_ids).distinct()

        if search_key:
            s = search_key.strip()
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

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving customers: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )
