# apps/leases/tasks.py
from celery import shared_task
from django.utils import timezone
from apps.leases.services.invoice_service import LeaseInvoiceService

@shared_task
def generate_monthly_lease_invoices():
    """
    Celery task to generate monthly invoices for all active leases
    This should be scheduled to run on the 25th of each month
    """
    if timezone.now().date().day == 25:
        LeaseInvoiceService.generate_monthly_invoices()