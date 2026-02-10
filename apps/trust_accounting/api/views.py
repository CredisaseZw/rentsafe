"""Views for Trust Accounting API."""

import logging
from decimal import Decimal

from django.db import transaction
from django.db.models import Sum, Count, Q, Max
from django.http import Http404
from django.utils import timezone
from django.utils.timezone import localdate
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message
from apps.trust_accounting.filters.trust_general_ledgers_filter import (
    AccountSubTypeFilter,
    AccountTypeFilter,
    GeneralLedgerFilter,
)
from apps.trust_accounting.filters.trust_exchange_rate_filters import ExchangeRateFilter
from apps.trust_accounting.filters.trust_sales_items_filters import SalesItemFilter
from apps.trust_accounting.api.serializers import (
    TrustAccountSubTypeSerializer,
    TrustAccountTypeSerializer,
    TrustCurrencySerializer,
    TrustExchangeRateSerializer,
    TrustGeneralLedgerAccountSerializer,
    TrustPropertyExpenseSerializer,
    TrustSalesCategorySerializer,
    TrustSalesItemSerializer,
    TrustTaxTypeSerializer,
    TrustGeneralLedgerSerializer,
    TrustInvoiceApproveSerializer,
    TrustInvoiceCreateSerializer,
    TrustInvoiceLineItemSerializer,
    TrustInvoiceListSerializer,
    TrustInvoicePaymentSerializer,
    TrustInvoiceSerializer,
)
from apps.trust_accounting.models import (
    TrustAccountType,
    TrustAccountSubType,
    TrustCurrency,
    TrustExchangeRate,
    TrustGeneralLedgerAccount,
    TrustPropertyExpense,
    TrustSalesCategory,
    TrustTaxType,
    TrustInvoice,
    TrustGeneralLedger,
    TrustSalesItem,
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


# ==================== CURRENCY VIEWSETS ====================


class TrustCurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet for TrustCurrency model."""

    queryset = TrustCurrency.objects.all()
    serializer_class = TrustCurrencySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TrustCurrency.objects.all()
        is_active = self.request.query_params.get("is_active")
        is_base = self.request.query_params.get("is_base")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")
        if is_base is not None:
            queryset = queryset.filter(is_base_currency=is_base.lower() == "true")

        return queryset

    def delete(self, request, *args, **kwargs):
        return Response(
            {"error": "you cannot delete currencies."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class TrustExchangeRateViewSet(BaseViewSet):
    """ViewSet for TrustExchangeRate model."""

    queryset = TrustExchangeRate.objects.all()
    serializer_class = TrustExchangeRateSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ExchangeRateFilter

    def get_queryset(self):
        queryset = TrustExchangeRate.objects.filter(
            created_by__client=self.request.user.client
        )
        base_currency = self.request.query_params.get("base_currency")
        target_currency = self.request.query_params.get("target_currency")
        is_active = self.request.query_params.get("is_active")
        latest_rate = self.request.query_params.get("latest_rate")

        if base_currency:
            queryset = queryset.filter(base_currency_id=base_currency)
        if target_currency:
            queryset = queryset.filter(target_currency_id=target_currency)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")
        if latest_rate is not None and latest_rate.lower() == "true":
            queryset = queryset.order_by("-date_created")[:1]

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating ExchangeRate: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==================== TAX VIEWSETS ====================


class TrustTaxTypeViewSet(BaseViewSet):
    """ViewSet for TrustTaxType model."""

    queryset = TrustTaxType.objects.all()
    serializer_class = TrustTaxTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TrustTaxType.objects.filter(
            Q(created_by__isnull=True) | Q(created_by__client=self.request.user.client)
        )
        is_active = self.request.query_params.get("is_active")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset

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

            if invalid_data and valid_data:
                return self._create_rendered_response(
                    {"created": valid_data, "errors": invalid_data},
                    status.HTTP_207_MULTI_STATUS,
                )
            elif not invalid_data:
                return self._create_rendered_response(
                    valid_data, status.HTTP_201_CREATED
                )
            elif not valid_data:
                return self._create_rendered_response(
                    {"errors": invalid_data}, status.HTTP_400_BAD_REQUEST
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
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except ValidationError as ve:
            logger.error(f"Validation error updating VAT setting: {ve}")
            return self._create_rendered_response(
                {"error": extract_error_message(ve)},
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
            if instance.created_by is None:
                return self._create_rendered_response(
                    {"error": "You do not have permission to delete this VAT setting."},
                    status.HTTP_403_FORBIDDEN,
                )
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


# ==================== ACCOUNT TYPE VIEWSETS ====================


class TrustAccountTypeViewSet(BaseViewSet):
    """ViewSet for TrustAccountType model."""

    queryset = TrustAccountType.objects.all()
    serializer_class = TrustAccountTypeSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = AccountTypeFilter

    def get_queryset(self):
        queryset = TrustAccountType.objects.filter(
            Q(created_by__isnull=True) | Q(created_by__client=self.request.user.client)
        )

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating TrustAccountType: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TrustAccountSubTypeViewSet(BaseViewSet):
    """ViewSet for TrustAccountSubType model."""

    queryset = TrustAccountSubType.objects.all()
    serializer_class = TrustAccountSubTypeSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = AccountSubTypeFilter

    def get_queryset(self):
        queryset = TrustAccountSubType.objects.filter(
            created_by__client=self.request.user.client
        )
        account_type = self.request.query_params.get("account_type")

        if account_type:
            queryset = queryset.filter(account_type_id=account_type)

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating AccountSubType: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==================== GENERAL LEDGER ACCOUNT VIEWSETS ====================
class TrustGeneralLedgerAccountViewSet(BaseViewSet):
    """ViewSet for TrustGeneralLedgerAccount model."""

    queryset = TrustGeneralLedgerAccount.objects.all()
    serializer_class = TrustGeneralLedgerAccountSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = GeneralLedgerFilter

    def get_queryset(self):
        queryset = TrustGeneralLedgerAccount.objects.filter(
            Q(created_by__isnull=True) | Q(created_by__client=self.request.user.client)
        )
        account_type = self.request.query_params.get("account_type")
        is_active = self.request.query_params.get("is_active")

        if account_type:
            queryset = queryset.filter(account_type__account_type__iexact=account_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating TrustGeneralLedgerAccount: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["get"])
    def balance(self, request, pk=None):
        account = self.get_object()
        as_of_date = request.query_params.get("as_of_date")
        include_children = (
            request.query_params.get("include_children", "true").lower() == "true"
        )

        balance = account.get_balance(
            as_of_date=as_of_date, include_children=include_children
        )

        return Response(
            {
                "account": account.account_number,
                "account_name": account.account_name,
                "balance": balance,
                "as_of_date": as_of_date or timezone.now().date(),
                "include_children": include_children,
            }
        )

    @action(detail=True, methods=["get"])
    def transactions(self, request, pk=None):
        account = self.get_object()
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        transactions = LedgerTransaction.objects.filter(account=account)

        if start_date:
            transactions = transactions.filter(
                journal_entry__entry_date__gte=start_date
            )
        if end_date:
            transactions = transactions.filter(journal_entry__entry_date__lte=end_date)

        transactions = transactions.select_related("journal_entry").order_by(
            "-journal_entry__entry_date", "-id"
        )

        page = self.paginate_queryset(transactions)
        if page is not None:
            serializer = LedgerTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = LedgerTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


# ==================== PRODUCT/SERVICE VIEWSETS ====================


class TrustSalesCategoryViewSet(BaseViewSet):
    """ViewSet for TrustSalesCategory model."""

    queryset = TrustSalesCategory.objects.all()
    serializer_class = TrustSalesCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TrustSalesCategory.objects.filter(
            created_by__client=self.request.user.client
        )
        is_active = self.request.query_params.get("is_active")
        search_params = self.request.query_params.get("search")
        if search_params:
            queryset = queryset.filter(
                Q(name__icontains=search_params) | Q(code__iexact=search_params)
            )

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating TrustSalesCategory: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TrustSalesItemViewSet(BaseViewSet):
    """ViewSet for TrustSalesItem model."""

    queryset = TrustSalesItem.objects.all()
    serializer_class = TrustSalesItemSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = SalesItemFilter

    def get_queryset(self):
        queryset = TrustSalesItem.objects.filter(
            created_by__client=self.request.user.client
        ).select_related(
            "category",
            "tax_type",
            "income_account",
            "currency",
            "inventory_account",
            "cost_of_sales_account",
        )
        # category = self.request.query_params.get("category")
        is_active = self.request.query_params.get("is_active")

        # if category:
        #     queryset = queryset.filter(category_id=category)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")
        return queryset.select_related("category", "tax_type", "income_account")

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ve:
            print(str(ve))
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # logger.error(f"Error creating SalesItem: {str(e)}")
            print(str(e))
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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating SalesItem: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==================== TRUST INVOICE VIEWSETS ====================


class TrustInvoiceViewSet(BaseViewSet):
    """ViewSet for Trust Invoices"""

    queryset = TrustInvoice.objects.all()
    serializer_class = TrustInvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["invoice_type", "status"]
    search_fields = [
        "invoice_number",
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
            .select_related("tenant", "landlord", "currency", "approved_by")
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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a new trust invoice with line items"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            invoice = serializer.save(created_by=request.user)

            log_trust_audit(
                request.user,
                "create",
                invoice,
                f"Created trust invoice: {invoice.invoice_number}",
                request=request,
            )

            return self._create_rendered_response(
                serializer.data, status.HTTP_201_CREATED
            )

        except ValidationError as e:
            logger.error(f"Validation error creating invoice: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Error creating trust invoice: {e}", exc_info=True)
            return self._create_rendered_response(
                {"error": "Failed to create invoice"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def list(self, request, *args, **kwargs):
        """List invoices with enhanced filtering and error handling"""
        try:
            queryset = self.filter_queryset(self.get_queryset())

            # Additional query parameter filters
            tenant_id = request.query_params.get("tenant_id")
            landlord_id = request.query_params.get("landlord_id")
            lease_id = request.query_params.get("lease_id")
            start_date = request.query_params.get("start_date")
            end_date = request.query_params.get("end_date")
            min_amount = request.query_params.get("min_amount")
            max_amount = request.query_params.get("max_amount")
            is_overdue = request.query_params.get("is_overdue")
            is_posted = request.query_params.get("is_posted")

            if tenant_id:
                queryset = queryset.filter(tenant_id=tenant_id)
            if landlord_id:
                queryset = queryset.filter(landlord_id=landlord_id)
            if lease_id:
                queryset = queryset.filter(lease_id=lease_id)
            if start_date:
                queryset = queryset.filter(invoice_date__gte=start_date)
            if end_date:
                queryset = queryset.filter(invoice_date__lte=end_date)
            if min_amount:
                queryset = queryset.filter(total_amount__gte=Decimal(min_amount))
            if max_amount:
                queryset = queryset.filter(total_amount__lte=Decimal(max_amount))
            if is_overdue and is_overdue.lower() == "true":
                queryset = queryset.filter(
                    status__in=["pending", "approved", "partially_paid"],
                    due_date__lt=localdate(),
                    balance_due__gt=Decimal("0.00"),
                )
            if is_posted is not None:
                queryset = queryset.filter(
                    posted_date__isnull=(is_posted.lower() != "true")
                )

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error listing invoices: {e}", exc_info=True)
            return self._create_rendered_response(
                {"error": "Failed to retrieve invoices"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single invoice with full details"""
        try:
            instance = self.get_object()

            # Verify client isolation
            if instance.created_by.client != request.user.client:
                return self._create_rendered_response(
                    {"error": "You do not have permission to access this invoice"},
                    status.HTTP_403_FORBIDDEN,
                )

            serializer = self.get_serializer(instance)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except Http404:
            return self._create_rendered_response(
                {"error": "Invoice not found"},
                status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error retrieving invoice: {e}", exc_info=True)
            return self._create_rendered_response(
                {"error": "Failed to retrieve invoice"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update an invoice (only draft and pending invoices can be edited)"""
        partial = kwargs.pop("partial", False)
        try:
            instance = self.get_object()

            # Validate invoice is editable
            if instance.status in ["paid", "cancelled"]:
                return self._create_rendered_response(
                    {"error": "Cannot modify paid or cancelled invoices"},
                    status.HTTP_400_BAD_REQUEST,
                )

            if instance.status == "approved" and instance.posted_date is not None:
                return self._create_rendered_response(
                    {
                        "error": "Cannot modify posted invoices. Please reverse posting first."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )

            # Store old values for audit
            old_values = {
                "status": instance.status,
                "total_amount": str(instance.total_amount),
                "invoice_date": str(instance.invoice_date),
            }

            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            # New values for audit
            new_values = {
                "status": instance.status,
                "total_amount": str(instance.total_amount),
                "invoice_date": str(instance.invoice_date),
            }

            log_trust_audit(
                request.user,
                "update",
                instance,
                f"Updated trust invoice: {instance.invoice_number}",
                old_values=old_values,
                new_values=new_values,
                request=request,
            )

            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except ValidationError as e:
            logger.error(f"Validation error updating invoice: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)}, status.HTTP_400_BAD_REQUEST
            )
        except Http404:
            return self._create_rendered_response(
                {"error": "Invoice not found"},
                status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error updating invoice: {e}", exc_info=True)
            return self._create_rendered_response(
                {"error": "Failed to update invoice"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def partial_update(self, request, *args, **kwargs):
        """Partially update an invoice"""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """Delete or cancel an invoice (soft delete for posted/paid invoices)"""
        try:
            instance = self.get_object()

            # Business rules for deletion
            if instance.status == "paid":
                return self._create_rendered_response(
                    {"error": "Cannot delete paid invoices. Please cancel instead."},
                    status.HTTP_400_BAD_REQUEST,
                )

            if instance.posted_date is not None:
                return self._create_rendered_response(
                    {
                        "error": "Cannot delete posted invoices. Please reverse posting first."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )

            if instance.amount_paid > Decimal("0.00"):
                return self._create_rendered_response(
                    {
                        "error": "Cannot delete invoices with payments. Please cancel instead."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )

            # Only draft invoices can be hard deleted
            if instance.status == "draft":
                invoice_number = instance.invoice_number
                self.perform_destroy(instance)

                log_trust_audit(
                    request.user,
                    "delete",
                    instance,
                    f"Deleted draft invoice: {invoice_number}",
                    request=request,
                )

                return self._create_rendered_response(
                    {"message": f"Invoice {invoice_number} deleted successfully"},
                    status.HTTP_204_NO_CONTENT,
                )
            else:
                # Soft delete - change status to cancelled
                instance.status = "cancelled"
                instance.save()

                log_trust_audit(
                    request.user,
                    "cancel",
                    instance,
                    f"Cancelled invoice via delete: {instance.invoice_number}",
                    request=request,
                )

                return self._create_rendered_response(
                    {
                        "message": f"Invoice {instance.invoice_number} cancelled successfully"
                    },
                    status.HTTP_200_OK,
                )

        except Http404:
            return self._create_rendered_response(
                {"error": "Invoice not found"},
                status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error deleting invoice: {e}", exc_info=True)
            return self._create_rendered_response(
                {"error": "Failed to delete invoice"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def approve(self, request, pk=None):
        """Approve a trust invoice"""
        invoice = self.get_object()
        try:
            if invoice.status != "pending":
                return Response(
                    {"error": "Only pending invoices can be approved"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate invoice has line items
            if not invoice.line_items.exists():
                return Response(
                    {"error": "Cannot approve invoice without line items"},
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
                    "invoice_number": invoice.invoice_number,
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error approving invoice: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error approving invoice: {e}", exc_info=True)
            return Response(
                {"error": "Failed to approve invoice"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def submit_for_approval(self, request, pk=None):
        """Submit invoice for approval (change status from draft to pending)"""
        invoice = self.get_object()
        try:
            if invoice.status != "draft":
                return Response(
                    {"error": "Only draft invoices can be submitted for approval"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Comprehensive validation before submission
            validation_errors = []

            if invoice.total_amount <= Decimal("0.00"):
                validation_errors.append("Invoice amount must be positive")

            if not invoice.line_items.exists():
                validation_errors.append("Invoice must have at least one line item")

            if not invoice.tenant and not invoice.landlord:
                validation_errors.append(
                    "Invoice must have either a tenant or landlord"
                )

            if (
                invoice.due_date
                and invoice.invoice_date
                and invoice.due_date < invoice.invoice_date
            ):
                validation_errors.append("Due date cannot be before invoice date")

            if validation_errors:
                return Response(
                    {"error": "Validation failed", "details": validation_errors},
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
                    "invoice_number": invoice.invoice_number,
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error submitting invoice: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error submitting invoice: {e}", exc_info=True)
            return Response(
                {"error": "Failed to submit invoice"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def apply_payment(self, request, pk=None):
        """Apply payment to a trust invoice"""
        invoice = self.get_object()
        serializer = TrustInvoicePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            amount = serializer.validated_data["amount"]
            payment_date = serializer.validated_data.get("payment_date")
            payment_reference = serializer.validated_data.get("payment_reference", "")

            balance_remaining = invoice.apply_payment(amount, payment_date=payment_date)

            log_trust_audit(
                request.user,
                "payment",
                invoice,
                f"Applied payment of {amount} to invoice {invoice.invoice_number}. Reference: {payment_reference}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Payment of {amount} applied successfully",
                    "balance_remaining": str(balance_remaining),
                    "amount_paid": str(invoice.amount_paid),
                    "invoice_status": invoice.status,
                    "invoice_number": invoice.invoice_number,
                    "payment_reference": payment_reference,
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error applying payment: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error applying payment: {e}", exc_info=True)
            return Response(
                {"error": "Failed to apply payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def post_to_ledger(self, request, pk=None):
        """Post invoice to general ledger"""
        invoice = self.get_object()
        try:
            # Pre-validation
            if invoice.posted_date:
                return Response(
                    {"error": "Invoice already posted to ledger"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.status not in ["pending", "approved"]:
                return Response(
                    {"error": "Only pending or approved invoices can be posted"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not invoice.line_items.exists():
                return Response(
                    {"error": "Cannot post invoice without line items"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

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
                    "invoice_number": invoice.invoice_number,
                    "posted_date": str(invoice.posted_date),
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error posting to ledger: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error posting invoice to ledger: {e}", exc_info=True)
            return Response(
                {"error": "Failed to post invoice to ledger"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def cancel(self, request, pk=None):
        """Cancel a trust invoice"""
        invoice = self.get_object()
        try:
            if invoice.status in ["paid", "cancelled"]:
                return Response(
                    {"error": "Cannot cancel a paid or already cancelled invoice"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.posted_date:
                return Response(
                    {
                        "error": "Cannot cancel posted invoice. Please reverse posting first."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.amount_paid > Decimal("0.00"):
                return Response(
                    {"error": "Cannot cancel invoice with payments applied"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get cancellation reason from request
            reason = request.data.get("reason", "")
            if reason:
                # Append reason to notes
                invoice.notes = (
                    f"{invoice.notes}\n\nCancellation reason: {reason}"
                    if invoice.notes
                    else f"Cancellation reason: {reason}"
                )

            invoice.status = "cancelled"
            invoice.save()

            log_trust_audit(
                request.user,
                "cancel",
                invoice,
                f"Cancelled trust invoice: {invoice.invoice_number}. Reason: {reason}",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {invoice.invoice_number} cancelled",
                    "invoice_number": invoice.invoice_number,
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error cancelling invoice: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error cancelling invoice: {e}", exc_info=True)
            return Response(
                {"error": "Failed to cancel invoice"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def fiscalize(self, request, pk=None):
        """Convert proforma invoice to fiscal invoice"""
        invoice = self.get_object()
        try:
            if invoice.invoice_type != "proforma":
                return Response(
                    {"error": "Only proforma invoices can be fiscalized"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if invoice.status != "draft":
                return Response(
                    {"error": "Only draft invoices can be fiscalized"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            fiscal_invoice = invoice.fiscalize()

            log_trust_audit(
                request.user,
                "fiscalize",
                fiscal_invoice,
                f"Converted proforma to fiscal invoice: {fiscal_invoice.invoice_number}",
                request=request,
            )

            serializer = self.get_serializer(fiscal_invoice)
            return Response(
                {
                    "status": "success",
                    "message": f"Invoice {fiscal_invoice.invoice_number} converted to fiscal",
                    "invoice": serializer.data,
                }
            )
        except ValidationError as e:
            logger.error(f"Validation error fiscalizing invoice: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error fiscalizing invoice: {e}", exc_info=True)
            return Response(
                {"error": "Failed to fiscalize invoice"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    @transaction.atomic
    def bulk_approve(self, request):
        """Approve multiple invoices in batch"""
        try:
            invoice_ids = request.data.get("invoice_ids", [])
            notes = request.data.get("notes", "")

            if not invoice_ids:
                return Response(
                    {"error": "invoice_ids is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if len(invoice_ids) > 100:
                return Response(
                    {"error": "Cannot approve more than 100 invoices at once"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            queryset = self.get_queryset().filter(id__in=invoice_ids, status="pending")

            invalid_invoices = []
            approved_invoices = []

            for invoice in queryset:
                try:
                    if not invoice.line_items.exists():
                        invalid_invoices.append(
                            {
                                "id": invoice.id,
                                "invoice_number": invoice.invoice_number,
                                "reason": "No line items",
                            }
                        )
                        continue

                    invoice.approve(request.user)
                    if notes:
                        invoice.notes = (
                            f"{invoice.notes}\n\nBulk approval: {notes}"
                            if invoice.notes
                            else f"Bulk approval: {notes}"
                        )
                        invoice.save()

                    approved_invoices.append(invoice.invoice_number)

                except Exception as e:
                    invalid_invoices.append(
                        {
                            "id": invoice.id,
                            "invoice_number": invoice.invoice_number,
                            "reason": str(e),
                        }
                    )

            log_trust_audit(
                request.user,
                "bulk_approve",
                None,
                f"Bulk approved {len(approved_invoices)} invoices",
                request=request,
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Approved {len(approved_invoices)} of {len(invoice_ids)} invoices",
                    "approved_count": len(approved_invoices),
                    "approved_invoices": approved_invoices,
                    "failed_count": len(invalid_invoices),
                    "failed_invoices": invalid_invoices,
                }
            )

        except Exception as e:
            logger.error(f"Error bulk approving invoices: {e}", exc_info=True)
            return Response(
                {"error": "Failed to bulk approve invoices"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def by_tenant(self, request):
        """Get invoices filtered by tenant with summary totals"""
        try:
            tenant_id = request.query_params.get("tenant_id")

            if not tenant_id:
                return Response(
                    {"error": "tenant_id parameter is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            queryset = self.get_queryset().filter(tenant_id=tenant_id)

            # Calculate aggregates
            total_invoiced = queryset.aggregate(total=Sum("total_amount"))[
                "total"
            ] or Decimal("0.00")
            total_paid = queryset.aggregate(total=Sum("amount_paid"))[
                "total"
            ] or Decimal("0.00")
            total_outstanding = queryset.filter(
                status__in=["pending", "approved", "partially_paid"]
            ).aggregate(total=Sum("balance_due"))["total"] or Decimal("0.00")

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = TrustInvoiceListSerializer(page, many=True)
                response_data = self.get_paginated_response(serializer.data).data
                response_data["summary"] = {
                    "total_invoiced": str(total_invoiced),
                    "total_paid": str(total_paid),
                    "total_outstanding": str(total_outstanding),
                    "invoice_count": queryset.count(),
                }
                return Response(response_data)

            serializer = TrustInvoiceListSerializer(queryset, many=True)
            return Response(
                {
                    "invoices": serializer.data,
                    "summary": {
                        "total_invoiced": str(total_invoiced),
                        "total_paid": str(total_paid),
                        "total_outstanding": str(total_outstanding),
                        "invoice_count": queryset.count(),
                    },
                }
            )

        except Exception as e:
            logger.error(f"Error filtering invoices by tenant: {e}", exc_info=True)
            return Response(
                {"error": "Failed to retrieve tenant invoices"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def by_landlord(self, request):
        """Get invoices filtered by landlord with summary totals"""
        try:
            landlord_id = request.query_params.get("landlord_id")

            if not landlord_id:
                return Response(
                    {"error": "landlord_id parameter is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            queryset = self.get_queryset().filter(landlord_id=landlord_id)

            # Calculate aggregates
            total_invoiced = queryset.aggregate(total=Sum("total_amount"))[
                "total"
            ] or Decimal("0.00")
            total_paid = queryset.aggregate(total=Sum("amount_paid"))[
                "total"
            ] or Decimal("0.00")
            total_outstanding = queryset.filter(
                status__in=["pending", "approved", "partially_paid"]
            ).aggregate(total=Sum("balance_due"))["total"] or Decimal("0.00")

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = TrustInvoiceListSerializer(page, many=True)
                response_data = self.get_paginated_response(serializer.data).data
                response_data["summary"] = {
                    "total_invoiced": str(total_invoiced),
                    "total_paid": str(total_paid),
                    "total_outstanding": str(total_outstanding),
                    "invoice_count": queryset.count(),
                }
                return Response(response_data)

            serializer = TrustInvoiceListSerializer(queryset, many=True)
            return Response(
                {
                    "invoices": serializer.data,
                    "summary": {
                        "total_invoiced": str(total_invoiced),
                        "total_paid": str(total_paid),
                        "total_outstanding": str(total_outstanding),
                        "invoice_count": queryset.count(),
                    },
                }
            )

        except Exception as e:
            logger.error(f"Error filtering invoices by landlord: {e}", exc_info=True)
            return Response(
                {"error": "Failed to retrieve landlord invoices"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
        try:
            queryset = self.get_queryset()

            # Calculate summary stats
            total_invoiced = queryset.aggregate(total=Sum("total_amount"))[
                "total"
            ] or Decimal("0.00")
            total_paid = queryset.aggregate(total=Sum("amount_paid"))[
                "total"
            ] or Decimal("0.00")
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
        except Exception as e:
            logger.error(f"Error generating invoice summary: {e}", exc_info=True)
            return Response(
                {"error": "Failed to generate invoice summary"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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


class TrustPropertyExpenseViewSet(BaseViewSet):
    """ViewSet for Trust Property Expenses"""

    queryset = TrustPropertyExpense.objects.filter(created_by__client__isnull=True)
    serializer_class = TrustPropertyExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["expense"]
    search_fields = ["expense", "expense_account__account_name"]
    ordering_fields = ["expense", "date_created"]
    ordering = ["expense"]

    def get_queryset(self):
        queryset = TrustPropertyExpense.objects.filter(
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
