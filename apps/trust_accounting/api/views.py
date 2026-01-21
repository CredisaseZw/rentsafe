"""Views for Trust Accounting API."""

import logging
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum, Count, Q, Max
from django.utils import timezone
from django.utils.timezone import localdate
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message
from apps.trust_accounting.api.serializers import (
    PropertyExpenseSerializer,
    TrustGeneralLedgerSerializer,
    TrustInvoiceApproveSerializer,
    TrustInvoiceCreateSerializer,
    TrustInvoiceLineItemSerializer,
    TrustInvoiceListSerializer,
    TrustInvoicePaymentSerializer,
    TrustInvoiceSerializer,
)
from apps.trust_accounting.models.models import (
    PropertyExpense,
    TrustGeneralLedger,
    TrustInvoice,
    TrustInvoiceLineItem,
)

logger = logging.getLogger(__name__)


def log_trust_audit(
    user, action, entity, description, old_values=None, new_values=None, request=None
):
    """Helper function to create audit log entries"""
    try:
        TrustAuditLog.objects.create(
            user=user,
            user_ip_address=request.META.get("REMOTE_ADDR") if request else None,
            action=action,
            entity_type=entity.__class__.__name__,
            entity_id=str(entity.pk),
            entity_description=description,
            old_values=old_values,
            new_values=new_values,
        )
    except Exception as e:
        logger.error(f"Failed to create audit log: {e}")


# ==================== TRUST INVOICE VIEWSETS ====================


class TrustInvoiceViewSet(BaseViewSet):
    """ViewSet for Trust Invoices"""

    queryset = TrustInvoice.objects.all()
    serializer_class = TrustInvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["invoice_type", "status", "beneficiary", "trust_bank_account"]
    search_fields = [
        "invoice_number",
        "beneficiary__display_name",
        "property_reference",
        "reference",
    ]
    ordering_fields = [
        "invoice_number",
        "invoice_date",
        "due_date",
        "total_amount",
        "status",
    ]
    ordering = ["-invoice_date", "-invoice_number"]

    def get_queryset(self):
        queryset = (
            TrustInvoice.objects.filter(created_by__client=self.request.user.client)
            .select_related(
                "beneficiary", "trust_bank_account", "currency", "approved_by"
            )
            .prefetch_related("line_items")
        )
        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return TrustInvoiceListSerializer
        if self.action == "create":
            return TrustInvoiceCreateSerializer
        if self.action == "approve":
            return TrustInvoiceApproveSerializer
        if self.action == "apply_payment":
            return TrustInvoicePaymentSerializer
        return TrustInvoiceSerializer

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        log_trust_audit(
            self.request.user,
            "create",
            instance,
            f"Created trust invoice: {instance.invoice_number}",
            request=self.request,
        )

    def perform_update(self, serializer):
        instance = serializer.save(updated_by=self.request.user)
        log_trust_audit(
            self.request.user,
            "update",
            instance,
            f"Updated trust invoice: {instance.invoice_number}",
            request=self.request,
        )

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """Approve a trust invoice"""
        invoice = self.get_object()
        try:
            if invoice.status != "pending":
                return Response(
                    {"error": "Only pending invoices can be approved"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            invoice.approve(request.user)

            log_trust_audit(
                request.user,
                "approve",
                invoice,
                f"Approved trust invoice: {invoice.invoice_number}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {invoice.invoice_number} approved",
                    "invoice_status": invoice.status,
                }
            )
        except ValidationError as e:
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def submit_for_approval(self, request, pk=None):
        """Submit invoice for approval (change status from draft to pending)"""
        invoice = self.get_object()
        try:
            if invoice.status != "draft":
                return Response(
                    {"error": "Only draft invoices can be submitted for approval"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.total_amount <= Decimal("0.00"):
                return Response(
                    {"error": "Cannot submit invoice with zero or negative amount"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            invoice.status = "pending"
            invoice.save()

            log_trust_audit(
                request.user,
                "submit",
                invoice,
                f"Submitted trust invoice for approval: {invoice.invoice_number}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {invoice.invoice_number} submitted for approval",
                }
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def apply_payment(self, request, pk=None):
        """Apply payment to a trust invoice"""
        invoice = self.get_object()
        serializer = TrustInvoicePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            amount = serializer.validated_data["amount"]
            balance_remaining = invoice.apply_payment(amount)

            log_trust_audit(
                request.user,
                "payment",
                invoice,
                f"Applied payment of {amount} to invoice {invoice.invoice_number}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Payment of {amount} applied",
                    "balance_remaining": str(balance_remaining),
                    "invoice_status": invoice.status,
                }
            )
        except ValidationError as e:
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def post_to_ledger(self, request, pk=None):
        """Post invoice to general ledger"""
        invoice = self.get_object()
        try:
            journal_entry = invoice.post_to_ledger()

            log_trust_audit(
                request.user,
                "post",
                invoice,
                f"Posted trust invoice to ledger: {invoice.invoice_number}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {invoice.invoice_number} posted to ledger",
                    "journal_entry_id": journal_entry.id,
                }
            )
        except ValidationError as e:
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """Cancel a trust invoice"""
        invoice = self.get_object()
        try:
            if invoice.status in ["paid", "cancelled"]:
                return Response(
                    {"error": "Cannot cancel a paid or already cancelled invoice"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.amount_paid > Decimal("0.00"):
                return Response(
                    {"error": "Cannot cancel invoice with payments applied"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            invoice.status = "cancelled"
            invoice.save()

            log_trust_audit(
                request.user,
                "cancel",
                invoice,
                f"Cancelled trust invoice: {invoice.invoice_number}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {invoice.invoice_number} cancelled",
                }
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def overdue(self, request):
        """Get all overdue invoices"""
        queryset = self.get_queryset().filter(
            status__in=["pending", "approved", "partially_paid"],
            due_date__lt=localdate(),
            balance_due__gt=Decimal("0.00"),
        )
        serializer = TrustInvoiceListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Get invoice summary statistics"""
        queryset = self.get_queryset()

        # Calculate summary stats
        total_invoiced = queryset.aggregate(total=Sum("total_amount"))[
            "total"
        ] or Decimal("0.00")
        total_paid = queryset.aggregate(total=Sum("amount_paid"))["total"] or Decimal(
            "0.00"
        )
        total_outstanding = queryset.filter(
            status__in=["pending", "approved", "partially_paid"]
        ).aggregate(total=Sum("balance_due"))["total"] or Decimal("0.00")

        overdue_count = queryset.filter(
            status__in=["pending", "approved", "partially_paid"],
            due_date__lt=localdate(),
            balance_due__gt=Decimal("0.00"),
        ).count()

        by_status = queryset.values("status").annotate(
            count=Count("id"),
            total=Sum("total_amount"),
        )

        by_type = queryset.values("invoice_type").annotate(
            count=Count("id"),
            total=Sum("total_amount"),
        )

        return Response(
            {
                "total_invoiced": str(total_invoiced),
                "total_paid": str(total_paid),
                "total_outstanding": str(total_outstanding),
                "overdue_count": overdue_count,
                "by_status": list(by_status),
                "by_type": list(by_type),
            }
        )


class TrustInvoiceLineItemViewSet(BaseViewSet):
    """ViewSet for Trust Invoice Line Items"""

    queryset = TrustInvoiceLineItem.objects.all()
    serializer_class = TrustInvoiceLineItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["invoice", "trust_gl_account"]
    search_fields = ["description", "property_reference"]
    ordering_fields = ["id", "line_total"]
    ordering = ["id"]

    def get_queryset(self):
        queryset = TrustInvoiceLineItem.objects.filter(
            invoice__created_by__client=self.request.user.client
        ).select_related("invoice", "trust_gl_account")
        return queryset


# +===================== TRUST GENERAL LEDGER VIEWSETS ====================


class TrustGeneralLedgerViewSet(BaseViewSet):
    """ViewSet for Trust General Ledger Accounts"""

    queryset = TrustGeneralLedger.objects.all()
    serializer_class = TrustGeneralLedgerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["account_number", "account_name"]
    search_fields = ["account_number", "account_name"]
    ordering_fields = ["account_number", "account_name"]
    ordering = ["account_number"]

    def get_queryset(self):
        queryset = TrustGeneralLedger.objects.filter(
            Q(created_by__client=self.request.user.client) | Q(is_system_account=True)
        )
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)
            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )

        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Error creating Trust ledger: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(updated_by=request.user)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Error updating Trust ledger: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ===================== PROPERTY EXPENSE VIEWSETS ====================


class PropertyExpenseViewSet(BaseViewSet):
    """ViewSet for Property Expenses"""

    queryset = PropertyExpense.objects.filter(created_by__client__isnull=True)
    serializer_class = PropertyExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["expense"]
    search_fields = ["expense", "expense_account__account_name"]
    ordering_fields = ["expense", "date_created"]
    ordering = ["expense"]

    def get_queryset(self):
        queryset = PropertyExpense.objects.filter(
            created_by__client=self.request.user.client
        )
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        log_trust_audit(
            self.request.user,
            "create",
            instance,
            f"Created property expense: {instance.expense}",
            request=self.request,
        )
