from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal
from django.db import transaction
from dateutil.relativedelta import relativedelta
from apps.accounting.models.models import Invoice, TransactionLineItem, SalesItem, SalesCategory, VATSetting, SalesAccount
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
        if hasattr(lease, 'grace_period_days') and today.day > lease.grace_period_days and opening_balance.current_month_balance > 0:
            opening_balance.three_months_plus_balance += opening_balance.three_months_back_balance
            opening_balance.three_months_back_balance = opening_balance.two_months_back_balance
            opening_balance.two_months_back_balance = opening_balance.one_month_back_balance
            opening_balance.one_month_back_balance = opening_balance.current_month_balance
            opening_balance.current_month_balance = Decimal('0.00')
            opening_balance.save()

    @staticmethod
    def generate_monthly_invoices():
        """
        Generate invoices for all active leases on the 25th of each month
        """
        today = timezone.now().date()
        
        if today.day != 25:
            return
        
        active_leases = Lease.objects.filter(status='ACTIVE')
        
        for lease in active_leases:
            with transaction.atomic():
                # Create the invoice
                primary_tenant = lease.get_primary_tenant()
                sales_account =SalesAccount.objects.first()
                tenant_object = primary_tenant.tenant_object if primary_tenant else None
                
                invoice = Invoice.objects.create(
                    invoice_type="fiscal",
                    status="pending",
                    lease=lease,
                    currency=lease.currency,
                    sale_date=today,
                    customer=primary_tenant
                )
                
                # Get or create a default sales category for lease items
                sales_category, _ = SalesCategory.objects.get_or_create(
                    name="Lease Charges",
                    defaults={'code': 'LEASE'}
                )
                
                # Get or create a default VAT setting (0% for now)
                vat_setting, _ = VATSetting.objects.get_or_create(
                    rate=Decimal('0.00'),
                    defaults={
                        'description': 'No VAT',
                        'vat_applicable': False
                    }
                )
                
                # Get or create a default sales account (you might need to create this model)
                # For now, we'll set sales_account to None or use a default if required
                
                # Add line items for each active charge
                for charge in lease.charges.filter(is_active=True, effective_date__lte=today):
                    if charge.end_date and charge.end_date < today:
                        continue
                    
                    # Create or get sales item for this charge type
                    sales_item_name = f"{charge.get_charge_type_display()} - {charge.description or 'Lease Charge'}"
                    sales_item, created = SalesItem.objects.get_or_create(
                        name=sales_item_name[:255],
                        defaults={
                            'category': sales_category,
                            'item_id': f"LEASE_{charge.charge_type}_{charge.id}",
                            'unit_price_currency': lease.currency,
                            'price': charge.amount,
                            'unit_name': 'Unit',
                            'tax_configuration': vat_setting,
                            'sales_account': sales_account,  # You'll need to set this properly
                        }
                    )
                    
                    # Create line item
                    TransactionLineItem.objects.create(
                        content_type=ContentType.objects.get_for_model(Invoice),
                        object_id=invoice.id,
                        sales_item=sales_item,
                        quantity=1,
                        unit_price=charge.amount,
                        vat_amount=Decimal('0.00'),
                        total_price=charge.amount,
                    )
                # This call assumes you have the update_totals() method on your Invoice model as discussed previously.
                invoice.update_totals()
                return invoice

    @staticmethod
    def generate_initial_invoice_for_opening_balance(lease):
        """
        Generates invoices for each aged balance in the lease's opening balance.
        If the outstanding balance is zero or less, a single paid invoice is created.
        """
        if not hasattr(lease, 'opening_balance'):
            return []
            
        # First, check if balances need to be shifted based on grace period
        LeaseInvoiceService._shift_opening_balances(lease)
        opening_balance = lease.opening_balance
        created_invoices = []
        
        with transaction.atomic():
            primary_tenant = lease.get_primary_tenant()
            sales_account = SalesAccount.objects.first()
            
            # Get or create required related models once
            sales_category, _ = SalesCategory.objects.get_or_create(
                name="Opening Balances",
                defaults={'code': 'OPENBAL'}
            )
            vat_setting, _ = VATSetting.objects.get_or_create(
                rate=Decimal('0.00'),
                defaults={'description': 'No VAT for opening balances', 'vat_applicable': False}
            )

            sales_item, created = SalesItem.objects.get_or_create(
                name="Opening Balance",
                defaults={
                    'category': sales_category,
                    'item_id': f"OPENBAL_{lease.lease_id}",
                    'unit_price_currency': lease.currency,
                    'price': Decimal('0.00'),
                    'unit_name': 'Balance',
                    'tax_configuration': vat_setting,
                    'sales_account': sales_account,
                }
            )

            if opening_balance.outstanding_balance <= Decimal('0.00'):
                # Create a single paid invoice for the non-positive outstanding balance
                invoice = Invoice.objects.create(
                    invoice_type="fiscal",
                    status="paid",
                    lease=lease,
                    currency=lease.currency,
                    customer=primary_tenant,
                    sale_date=get_opening_balance_oldest_date(lease),
                )
                
                TransactionLineItem.objects.create(
                    content_type=ContentType.objects.get_for_model(Invoice),
                    object_id=invoice.id,
                    sales_item=sales_item,
                    quantity=1,
                    unit_price=opening_balance.outstanding_balance,
                    vat_amount=Decimal('0.00'),
                    total_price=opening_balance.outstanding_balance,
                )
                
                invoice.update_totals()
                created_invoices.append(invoice)
            else:
                balance_fields = [
                    ('three_months_plus_balance', 4),
                    ('three_months_back_balance', 3),
                    ('two_months_back_balance', 2),
                    ('one_month_back_balance', 1),
                    ('current_month_balance', 0)
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
                    
                    if balance_amount > Decimal('0.00'):
                        sale_date = base_date - relativedelta(months=months_ago)

                        # Create the invoice
                        invoice = Invoice.objects.create(
                            invoice_type="fiscal",
                            status="pending",
                            lease=lease,
                            currency=lease.currency,
                            customer=primary_tenant,
                            sale_date=sale_date,
                        )
                        
                        # Create a single line item for this specific balance
                        TransactionLineItem.objects.create(
                            content_type=ContentType.objects.get_for_model(Invoice),
                            object_id=invoice.id,
                            sales_item=sales_item,
                            quantity=1,
                            unit_price=balance_amount,
                            vat_amount=Decimal('0.00'),
                            total_price=balance_amount,
                        )
                        
                        # Update the invoice totals
                        invoice.update_totals()
                        
                        created_invoices.append(invoice)
        
        return created_invoices
