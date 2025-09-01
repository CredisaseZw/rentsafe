# apps/leases/services/invoice_service.py
from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal
from django.db import transaction
from apps.accounting.models.models import Invoice, TransactionLineItem, SalesItem, SalesCategory, VATSetting,SalesAccount
from apps.leases.models import Lease, LeaseCharge
from django.contrib.contenttypes.models import ContentType
from apps.leases.utils.helpers import get_opening_balance_oldest

class LeaseInvoiceService:
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
                
                return invoice

    @staticmethod
    def generate_initial_invoice_for_opening_balance(lease):
        """
        Generate an initial invoice for opening balance when a lease is created
        """
        if not hasattr(lease, 'opening_balance'):
            return None
        
        opening_balance = lease.opening_balance
        total_balance = opening_balance.outstanding_balance
        sales_account = SalesAccount.objects.first()

        if total_balance <= 0:
            return None
        
        with transaction.atomic():
            primary_tenant = lease.get_primary_tenant()
            tenant_object = primary_tenant.tenant_object if primary_tenant else None
            
            invoice = Invoice.objects.create(
                invoice_type="fiscal",
                status="pending",
                lease=lease,
                currency=lease.currency,
                customer=primary_tenant,
                sale_date= get_opening_balance_oldest(opening_balance)
            )
            
            # Get or create required related models
            sales_category, _ = SalesCategory.objects.get_or_create(
                name="Opening Balances",
                defaults={'code': 'OPENBAL'}
            )
            
            vat_setting, _ = VATSetting.objects.get_or_create(
                rate=Decimal('0.00'),
                defaults={
                    'description': 'No VAT for opening balances',
                    'vat_applicable': False
                }
            )
            
            # Create or get sales item for opening balance
            sales_item, created = SalesItem.objects.get_or_create(
                name="Opening Balance",
                defaults={
                    'category': sales_category,
                    'item_id': f"OPENBAL_{lease.lease_id}",
                    'unit_price_currency': lease.currency,
                    'price': total_balance,
                    'unit_name': 'Balance',
                    'tax_configuration': vat_setting,
                    'sales_account': sales_account, 
                }
            )
            
            # If the sales item already exists, update the price
            if not created:
                sales_item.price = total_balance
                sales_item.unit_price_currency = lease.currency
                sales_item.save()
            
            TransactionLineItem.objects.create(
                content_type=ContentType.objects.get_for_model(Invoice),
                object_id=invoice.id,
                sales_item=sales_item,
                quantity=1,
                unit_price=total_balance,
                vat_amount=Decimal('0.00'),
                total_price=total_balance,
            )
            
            return invoice