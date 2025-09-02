# apps/leases/utils/commission_utils.py
from decimal import Decimal
from apps.accounting.models import PaymentMethod
from apps.accounting.models.disbursements import Disbursement
from apps.clients.models import Client
import logging

logger = logging.getLogger('leases')

class CommissionHandler:
    @staticmethod
    def calculate_landlord_commission(lease, payment_amount):
        """
        Calculate landlord commission based on lease terms
        Returns: (commission_amount, net_amount)
        """
        if not lease.landlord:
            return Decimal('0.00'), payment_amount
        
        # Get commission percentage from landlord opening balance
        opening_balance = lease.landlord.opening_balances.first()
        if not opening_balance:
            return Decimal('0.00'), payment_amount
        
        commission_percentage = opening_balance.commission_percentage or Decimal('0.00')

        if commission_percentage <= 0:
            return Decimal('0.00'), payment_amount
        
        commission_amount = (payment_amount * commission_percentage / Decimal('100.00')).quantize(Decimal('0.00'))
        net_amount = payment_amount - commission_amount
        
        return commission_amount, net_amount

    @staticmethod
    def get_payee_for_disbursement(lease, request):
        """
        Get the appropriate payee client for disbursement
        """
        try:
            # Try to get from request user's client
            if request and hasattr(request, 'user') and hasattr(request.user, 'client'):
                return request.user.client
            
            # Fallback: get the first client (you might want to adjust this)
            return lease.managing_client
            
        except Exception as e:
            logger.error(f"Error getting payee for disbursement: {e}")
            return None

    @staticmethod
    def handle_payment_commission(lease, payment_amount, payment_date, payment_reference, request=None):
        """
        Handle commission calculation and create disbursement record
        """
        if not lease.landlord:
            return None
        
        commission_amount, net_amount = CommissionHandler.calculate_landlord_commission(lease, payment_amount)
        
        if commission_amount <= 0:
            return None
        
        # Get the payee client
        payee = CommissionHandler.get_payee_for_disbursement(lease, request)
        if not payee:
            logger.error("No payee found for disbursement")
            return None
        
        # Create disbursement record
        try:
            disbursement = Disbursement.objects.create(
                landlord=lease.landlord,
                payee=payee,
                amount=net_amount,
                currency=lease.currency,
                payment_method=PaymentMethod.objects.get_or_create(
                    payment_method_name='Commission Hold',
                    defaults={'payment_method_name': 'Commission Hold'}
                )[0],
                reference=f"Commission for payment {payment_reference}",
                status='pending',
                payment_date=payment_date,
                created_by=request.user if request and hasattr(request, 'user') else None
            )
            
            logger.info(f"Created commission disbursement {disbursement.id} for landlord {lease.landlord.id}")
            return disbursement
            
        except Exception as e:
            logger.error(f"Failed to create commission disbursement: {e}")
            return None

    @staticmethod
    def get_landlord_balance(landlord):
        """
        Get current balance for a landlord (total disbursements - total payments)
        """
        from django.db.models import Sum
        
        # Total disbursements to landlord
        total_disbursements = Disbursement.objects.filter(
            landlord=landlord,
            status__in=['processed', 'approved']
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_commission = Decimal('0.00')
        
        return total_disbursements - total_commission

    @staticmethod
    def get_landlord_statement(landlord, start_date=None, end_date=None):
        """
        Get statement for a landlord
        """
        disbursements = Disbursement.objects.filter(landlord=landlord)
        
        if start_date:
            disbursements = disbursements.filter(payment_date__gte=start_date)
        if end_date:
            disbursements = disbursements.filter(payment_date__lte=end_date)
        
        return disbursements.order_by('-payment_date')