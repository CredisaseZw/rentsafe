from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal
from django.db import transaction
from dateutil.relativedelta import relativedelta
from apps.accounting.models.models import (
    Invoice,
    TransactionLineItem,
    SalesItem,
    SalesCategory,
    VATSetting,
    SalesAccount,
    Customer,
)
from apps.leases.models import Lease
from django.contrib.contenttypes.models import ContentType
from apps.leases.utils.helpers import get_opening_balance_oldest_date


class LeaseInvoiceService:
    @staticmethod
    def _shift_opening_balances(lease):
        """
        Shifts the opening balances back one month if the grace period has passed.
        """
        opening_balance = lease.opening_balance
        today = timezone.now().date()
        if (
            hasattr(lease, "grace_period_days")
            and today.day > lease.grace_period_days
            and opening_balance.current_month_balance > 0
        ):
            opening_balance.three_months_plus_balance += (
                opening_balance.three_months_back_balance
            )
            opening_balance.three_months_back_balance = (
                opening_balance.two_months_back_balance
            )
            opening_balance.two_months_back_balance = (
                opening_balance.one_month_back_balance
            )
            opening_balance.one_month_back_balance = (
                opening_balance.current_month_balance
            )
            opening_balance.current_month_balance = Decimal("0.00")
            opening_balance.save()

    @staticmethod
    def generate_monthly_invoices():
        """
        Generate invoices for all active leases on the 25th of each month
        Fixed rent (is_rent_variable=False): invoice_type='fiscal', status='pending', is_invoiced=True
        Variable rent (is_rent_variable=True): invoice_type='recurring', status='draft', is_invoiced=False
        """
        today = timezone.now().date()

        # Only run on the 25th of each month
        if today.day != 25:
            return []

        active_leases = Lease.objects.filter(status="ACTIVE")
        created_invoices = []

        for lease in active_leases:
            try:
                with transaction.atomic():
                    # Create the invoice based on rent type
                    primary_tenant = lease.get_primary_tenant()
                    sales_account = SalesAccount.objects.first()
                    tenant_object = (
                        primary_tenant.tenant_object if primary_tenant else None
                    )

                    # Determine invoice type and status based on rent variability
                    if lease.is_rent_variable:
                        # Variable rent - create recurring invoice template
                        invoice_type = "recurring"
                        status = "draft"
                        is_invoiced = False
                    else:
                        # Fixed rent - create fiscal invoice
                        invoice_type = "fiscal"
                        status = "pending"
                        is_invoiced = True

                    Customer_obj, created = Customer.objects.get_or_create(
                        is_individual=tenant_object.__class__.__name__ == "Individual",
                        individual=(
                            tenant_object
                            if tenant_object.__class__.__name__ == "Individual"
                            else None
                        ),
                        company=(
                            tenant_object
                            if tenant_object.__class__.__name__ == "Company"
                            else None
                        ),
                    )

                    invoice = Invoice.objects.create(
                        invoice_type=invoice_type,
                        status=status,
                        lease=lease,
                        currency=lease.currency,
                        sale_date=today,
                        customer=Customer_obj,
                        is_invoiced=is_invoiced,
                        created_by=lease.created_by,
                    )

                    # Get or create a default sales category for lease items
                    sales_category, _ = SalesCategory.objects.get_or_create(
                        name="Lease Charges", defaults={"code": "LEASE"}
                    )

                    # Get or create a default VAT setting (0% for now)
                    vat_setting, _ = VATSetting.objects.get_or_create(
                        rate=Decimal("0.00"),
                        defaults={"description": "No VAT", "vat_applicable": False},
                    )

                    # Add line items for each active charge
                    for charge in lease.charges.filter(
                        is_active=True, effective_date__lte=today
                    ):
                        if charge.end_date and charge.end_date < today:
                            continue

                        # Create or get sales item for this charge type
                        sales_item_name = f"{charge.get_charge_type_display()} - {charge.description or 'Lease Charge'}"
                        sales_item, created = SalesItem.objects.get_or_create(
                            name=sales_item_name[:255],
                            defaults={
                                "category": sales_category,
                                "item_id": f"LEASE_{charge.charge_type}_{charge.id}",
                                "unit_price_currency": lease.currency,
                                "price": charge.amount,
                                "unit_name": "Unit",
                                "tax_configuration": vat_setting,
                                "sales_account": sales_account,
                            },
                        )

                        # Create line item
                        TransactionLineItem.objects.create(
                            content_type=ContentType.objects.get_for_model(Invoice),
                            object_id=invoice.id,
                            sales_item=sales_item,
                            quantity=1,
                            unit_price=charge.amount,
                            vat_amount=Decimal("0.00"),
                            total_price=charge.amount,
                        )

                    # Update invoice totals
                    invoice.update_totals()
                    created_invoices.append(invoice)

                    print(
                        f"Created {invoice_type} invoice {invoice.document_number} for lease {lease.lease_id} (Rent variable: {lease.is_rent_variable})"
                    )

            except Exception as e:
                print(f"Error generating invoice for lease {lease.lease_id}: {str(e)}")
                continue

        print(f"Successfully generated {len(created_invoices)} invoices")
        return created_invoices

    @staticmethod
    def generate_initial_invoice_for_opening_balance(lease):
        """
        Generates invoices for each aged balance in the lease's opening balance.
        If the outstanding balance is zero or less, a single paid invoice is created.
        """
        if not hasattr(lease, "opening_balance"):
            return []

        # First, check if balances need to be shifted based on grace period
        LeaseInvoiceService._shift_opening_balances(lease)
        opening_balance = lease.opening_balance
        created_invoices = []

        with transaction.atomic():
            primary_tenant = lease.get_primary_tenant()
            sales_account = SalesAccount.objects.first()
            tenant_object = primary_tenant.tenant_object if primary_tenant else None
            # Get or create required related models once
            sales_category, _ = SalesCategory.objects.get_or_create(
                name="Opening Balances", defaults={"code": "OPENBAL"}
            )
            vat_setting, _ = VATSetting.objects.get_or_create(
                rate=Decimal("0.00"),
                defaults={
                    "description": "No VAT for opening balances",
                    "vat_applicable": False,
                },
            )

            sales_item, created = SalesItem.objects.get_or_create(
                name="Opening Balance",
                defaults={
                    "category": sales_category,
                    "item_id": f"OPENBAL_{lease.lease_id}",
                    "unit_price_currency": lease.currency,
                    "price": Decimal("0.00"),
                    "unit_name": "Balance",
                    "tax_configuration": vat_setting,
                    "sales_account": sales_account,
                },
            )
            Customer_obj, created = Customer.objects.get_or_create(
                is_individual=tenant_object.__class__.__name__ == "Individual",
                individual=(
                    tenant_object
                    if tenant_object.__class__.__name__ == "Individual"
                    else None
                ),
                company=(
                    tenant_object
                    if tenant_object.__class__.__name__ == "Company"
                    else None
                ),
            )

            if opening_balance.outstanding_balance <= Decimal("0.00"):
                # Create a single paid invoice for the non-positive outstanding balance
                invoice = Invoice.objects.create(
                    invoice_type="fiscal",
                    status="paid",
                    lease=lease,
                    currency=lease.currency,
                    customer=Customer_obj,
                    sale_date=get_opening_balance_oldest_date(lease),
                    is_invoiced=True,
                    created_by=lease.created_by,
                )

                TransactionLineItem.objects.create(
                    content_type=ContentType.objects.get_for_model(Invoice),
                    object_id=invoice.id,
                    sales_item=sales_item,
                    quantity=1,
                    unit_price=opening_balance.outstanding_balance,
                    vat_amount=Decimal("0.00"),
                    total_price=opening_balance.outstanding_balance,
                )

                invoice.update_totals()
                created_invoices.append(invoice)
            else:
                balance_fields = [
                    ("three_months_plus_balance", 4),
                    ("three_months_back_balance", 3),
                    ("two_months_back_balance", 2),
                    ("one_month_back_balance", 1),
                    ("current_month_balance", 0),
                ]

                # Determine the base date for sales dates
                today = timezone.now().date()
                if today.day < 25:
                    base_date = today - relativedelta(months=1)
                    base_date = base_date.replace(day=25)
                else:
                    base_date = today

                for field_name, months_ago in balance_fields:
                    balance_amount = getattr(opening_balance, field_name)

                    if balance_amount > Decimal("0.00"):
                        sale_date = base_date - relativedelta(months=months_ago)

                        # Create the invoice
                        invoice = Invoice.objects.create(
                            invoice_type="fiscal",
                            status="pending",
                            lease=lease,
                            currency=lease.currency,
                            customer=Customer_obj,
                            sale_date=sale_date,
                            is_invoiced=True,
                            created_by=lease.created_by,
                        )

                        # Create a single line item for this specific balance
                        TransactionLineItem.objects.create(
                            content_type=ContentType.objects.get_for_model(Invoice),
                            object_id=invoice.id,
                            sales_item=sales_item,
                            quantity=1,
                            unit_price=balance_amount,
                            vat_amount=Decimal("0.00"),
                            total_price=balance_amount,
                        )

                        # Update the invoice totals
                        invoice.update_totals()

                        created_invoices.append(invoice)

        return created_invoices
