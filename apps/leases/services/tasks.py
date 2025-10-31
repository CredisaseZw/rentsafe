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


@shared_task
def generate_monthly_invoices_task():
    """
    Celery task to generate monthly invoices on the 25th of each month
    """
    try:
        print(f"Starting monthly invoice generation at {timezone.now()}")
        created_invoices = LeaseInvoiceService.generate_monthly_invoices()
        print(
            f"Monthly invoice generation completed. Created {len(created_invoices)} invoices."
        )
        return {
            "status": "success",
            "invoices_created": len(created_invoices),
            "timestamp": timezone.now().isoformat(),
        }
    except Exception as e:
        print(f"Error in monthly invoice generation: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": timezone.now().isoformat(),
        }
