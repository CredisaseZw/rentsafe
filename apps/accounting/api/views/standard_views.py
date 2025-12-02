# views/__init__.py
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
from apps.accounting.filters.general_ledgers_filter import (
    AccountSubTypeFilter,
    AccountTypeFilter,
    GeneralLedgerFilter,
)
from django.utils import timezone
from decimal import Decimal
from apps.accounting.models import *
from apps.accounting.api.serializers.standard_serializers import *
from apps.common.api.views import BaseViewSet
from apps.common.utils.helpers import extract_error_message

# ==================== CORE ACCOUNTING VIEWSETS ====================

logger = logging.getLogger(__name__)


class FinancialYearViewSet(viewsets.ModelViewSet):
    queryset = FinancialYear.objects.all()
    serializer_class = FinancialYearSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def close_year(self, request, pk=None):
        financial_year = self.get_object()
        try:
            with transaction.atomic():
                financial_year.is_closed = True
                financial_year.closed_at = timezone.now()
                financial_year.closed_by = request.user
                financial_year.save()

                # Close all periods in this year
                financial_year.periods.update(
                    is_open=False, closed_at=timezone.now(), closed_by=request.user
                )

            return Response({"status": "Financial year closed successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AccountingPeriodViewSet(viewsets.ModelViewSet):
    queryset = AccountingPeriod.objects.all()
    serializer_class = AccountingPeriodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = AccountingPeriod.objects.all()
        financial_year = self.request.query_params.get("financial_year")
        if financial_year:
            queryset = queryset.filter(financial_year_id=financial_year)
        return queryset

    @action(detail=True, methods=["post"])
    def close_period(self, request, pk=None):
        period = self.get_object()
        try:
            with transaction.atomic():
                period.is_open = False
                period.closed_at = timezone.now()
                period.closed_by = request.user
                period.save()
            return Response({"status": "Accounting period closed successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AccountTypeViewSet(BaseViewSet):
    """ViewSet for AccountType model."""

    queryset = AccountType.objects.all()
    serializer_class = AccountTypeSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = AccountTypeFilter

    def get_queryset(self):
        queryset = AccountType.objects.filter(
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
            logger.error(f"Error creating AccountType: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AccountSubTypeViewSet(BaseViewSet):
    """ViewSet for AccountSubType model."""

    queryset = AccountSubType.objects.all()
    serializer_class = AccountSubTypeSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = AccountSubTypeFilter

    def get_queryset(self):
        queryset = AccountSubType.objects.filter(
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


class GeneralLedgerAccountViewSet(BaseViewSet):
    queryset = GeneralLedgerAccount.objects.all()
    serializer_class = GeneralLedgerAccountSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = GeneralLedgerFilter

    def get_queryset(self):
        queryset = GeneralLedgerAccount.objects.filter(
            Q(created_by__isnull=True) | Q(created_by__client=self.request.user.client)
        )
        account_type = self.request.query_params.get("account_type")
        is_active = self.request.query_params.get("is_active")

        if account_type:
            queryset = queryset.filter(account_type_id=account_type)
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
            logger.error(f"Error creating GeneralLedgerAccount: {str(e)}")
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


class CostCenterViewSet(viewsets.ModelViewSet):
    queryset = CostCenter.objects.all()
    serializer_class = CostCenterSerializer
    permission_classes = [IsAuthenticated]


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = JournalEntry.objects.all()
        entry_type = self.request.query_params.get("entry_type")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        is_posted = self.request.query_params.get("is_posted")

        if entry_type:
            queryset = queryset.filter(entry_type=entry_type)
        if start_date:
            queryset = queryset.filter(entry_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(entry_date__lte=end_date)
        if is_posted is not None:
            queryset = queryset.filter(is_posted=is_posted.lower() == "true")

        return queryset.select_related(
            "accounting_period", "created_by"
        ).prefetch_related("transactions")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def post_entry(self, request, pk=None):
        journal_entry = self.get_object()
        serializer = JournalEntryPostSerializer(
            data=request.data, context={"journal_entry": journal_entry}
        )

        if serializer.is_valid():
            try:
                journal_entry.post_entry(user=request.user)
                return Response({"status": "Journal entry posted successfully"})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def reverse_entry(self, request, pk=None):
        journal_entry = self.get_object()
        reversal_date = request.data.get("reversal_date")
        description = request.data.get("description")

        try:
            reversal_entry = journal_entry.create_reversal(reversal_date, description)
            serializer = JournalEntrySerializer(reversal_entry)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ==================== SUBSIDIARY LEDGER VIEWSETS ====================


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Customer.objects.all()
        is_active = self.request.query_params.get("is_active")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset.select_related(
            "individual", "company", "accounts_receivable_account"
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def invoices(self, request, pk=None):
        customer = self.get_object()
        invoices = customer.invoices.all().order_by("-invoice_date")

        page = self.paginate_queryset(invoices)
        if page is not None:
            serializer = InvoiceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def balance_summary(self, request, pk=None):
        customer = self.get_object()
        current_balance = customer.current_balance
        available_credit = customer.available_credit

        # Get aging summary
        invoices = customer.invoices.exclude(status__in=["paid", "cancelled"])
        aging = {
            "current": Decimal("0.00"),
            "1-30": Decimal("0.00"),
            "31-60": Decimal("0.00"),
            "61-90": Decimal("0.00"),
            "over_90": Decimal("0.00"),
        }

        today = timezone.now().date()
        for invoice in invoices:
            days_overdue = (today - invoice.due_date).days
            balance = invoice.balance_due

            if days_overdue <= 0:
                aging["current"] += balance
            elif 1 <= days_overdue <= 30:
                aging["1-30"] += balance
            elif 31 <= days_overdue <= 60:
                aging["31-60"] += balance
            elif 61 <= days_overdue <= 90:
                aging["61-90"] += balance
            else:
                aging["over_90"] += balance

        return Response(
            {
                "customer": customer.display_name,
                "current_balance": current_balance,
                "available_credit": available_credit,
                "credit_limit": customer.credit_limit,
                "aging_summary": aging,
            }
        )


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ==================== TAX VIEWSETS ====================


class TaxTypeViewSet(viewsets.ModelViewSet):
    queryset = TaxType.objects.all()
    serializer_class = TaxTypeSerializer
    permission_classes = [IsAuthenticated]


# ==================== PRODUCT/SERVICE VIEWSETS ====================


class SalesCategoryViewSet(viewsets.ModelViewSet):
    queryset = SalesCategory.objects.all()
    serializer_class = SalesCategorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SalesItemViewSet(viewsets.ModelViewSet):
    queryset = SalesItem.objects.all()
    serializer_class = SalesItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = SalesItem.objects.all()
        category = self.request.query_params.get("category")
        is_active = self.request.query_params.get("is_active")

        if category:
            queryset = queryset.filter(category_id=category)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset.select_related("category", "tax_type", "income_account")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ==================== INVOICE VIEWSETS ====================


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.all()
        customer = self.request.query_params.get("customer")
        status = self.request.query_params.get("status")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if customer:
            queryset = queryset.filter(customer_id=customer)
        if status:
            queryset = queryset.filter(status=status)
        if start_date:
            queryset = queryset.filter(invoice_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(invoice_date__lte=end_date)

        return queryset.select_related(
            "customer", "currency", "journal_entry"
        ).prefetch_related("line_items")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def post_to_ledger(self, request, pk=None):
        invoice = self.get_object()
        serializer = InvoicePostSerializer(
            data=request.data, context={"invoice": invoice}
        )

        if serializer.is_valid():
            try:
                journal_entry = invoice.post_to_ledger()
                return Response(
                    {
                        "status": "Invoice posted to ledger successfully",
                        "journal_entry": JournalEntrySerializer(journal_entry).data,
                    }
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def apply_payment(self, request, pk=None):
        invoice = self.get_object()
        serializer = InvoicePaymentSerializer(
            data=request.data, context={"invoice": invoice}
        )

        if serializer.is_valid():
            try:
                payment = invoice.apply_payment(
                    amount=serializer.validated_data["amount"],
                    payment_date=serializer.validated_data.get("payment_date"),
                    created_by=request.user,
                )
                return Response(
                    {
                        "status": "Payment applied successfully",
                        "payment": PaymentSerializer(payment).data,
                        "invoice_balance": invoice.balance_due,
                    }
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def overdue(self, request):
        overdue_invoices = Invoice.objects.filter(
            due_date__lt=timezone.now().date(),
            status__in=["pending", "partially_paid"],
            balance_due__gt=0,
        ).select_related("customer")

        page = self.paginate_queryset(overdue_invoices)
        if page is not None:
            serializer = InvoiceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = InvoiceSerializer(overdue_invoices, many=True)
        return Response(serializer.data)


# ==================== PAYMENT VIEWSETS ====================


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.all()
        invoice = self.request.query_params.get("invoice")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if invoice:
            queryset = queryset.filter(invoice_id=invoice)
        if start_date:
            queryset = queryset.filter(payment_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(payment_date__lte=end_date)

        return queryset.select_related("invoice", "cash_account", "journal_entry")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ==================== CASH MANAGEMENT VIEWSETS ====================


class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def transactions(self, request, pk=None):
        bank_account = self.get_object()
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        transactions = LedgerTransaction.objects.filter(account=bank_account.gl_account)

        if start_date:
            transactions = transactions.filter(
                journal_entry__entry_date__gte=start_date
            )
        if end_date:
            transactions = transactions.filter(journal_entry__entry_date__lte=end_date)

        transactions = transactions.select_related("journal_entry").order_by(
            "-journal_entry__entry_date"
        )

        page = self.paginate_queryset(transactions)
        if page is not None:
            serializer = LedgerTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = LedgerTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class CashReceiptViewSet(viewsets.ModelViewSet):
    queryset = CashReceipt.objects.all()
    serializer_class = CashReceiptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CashReceipt.objects.all()
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(receipt_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(receipt_date__lte=end_date)

        return queryset.select_related(
            "bank_account", "income_account", "journal_entry"
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ==================== CURRENCY VIEWSETS ====================


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [IsAuthenticated]


class ExchangeRateViewSet(viewsets.ModelViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ExchangeRate.objects.all()
        base_currency = self.request.query_params.get("base_currency")
        target_currency = self.request.query_params.get("target_currency")
        is_active = self.request.query_params.get("is_active")

        if base_currency:
            queryset = queryset.filter(base_currency_id=base_currency)
        if target_currency:
            queryset = queryset.filter(target_currency_id=target_currency)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset


# ==================== REPORT VIEWSETS ====================


class TrialBalanceViewSet(viewsets.ModelViewSet):
    queryset = TrialBalance.objects.all()
    serializer_class = TrialBalanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])
    def generate(self, request):
        period_id = request.data.get("period")
        if not period_id:
            return Response(
                {"error": "Period ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            period = AccountingPeriod.objects.get(id=period_id)
            trial_balance = TrialBalance.objects.create(
                period=period, generated_by=request.user
            )

            # Generate trial balance items
            accounts = GeneralLedgerAccount.objects.filter(is_active=True)
            for account in accounts:
                balance = account.get_balance(as_of_date=period.end_date)

                if account.is_debit_balance and balance >= 0:
                    debit_balance = balance
                    credit_balance = Decimal("0.00")
                elif account.is_debit_balance and balance < 0:
                    debit_balance = Decimal("0.00")
                    credit_balance = abs(balance)
                elif account.is_credit_balance and balance >= 0:
                    debit_balance = Decimal("0.00")
                    credit_balance = balance
                else:
                    debit_balance = abs(balance)
                    credit_balance = Decimal("0.00")

                TrialBalanceItem.objects.create(
                    trial_balance=trial_balance,
                    account=account,
                    debit_balance=debit_balance,
                    credit_balance=credit_balance,
                )

            serializer = self.get_serializer(trial_balance)
            return Response(serializer.data)

        except AccountingPeriod.DoesNotExist:
            return Response(
                {"error": "Accounting period not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ==================== COMPATIBILITY VIEWSETS ====================


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]


class CashSaleViewSet(viewsets.ModelViewSet):
    queryset = CashSale.objects.all()
    serializer_class = CashSaleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
