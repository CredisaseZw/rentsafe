"""
Signals for Trust Accounting
"""

from django.db.models.signals import post_save, post_delete, pre_delete
from django.dispatch import receiver
from apps.trust_accounting.models import TrustInvoiceLineItem, TrustInvoice


@receiver(post_save, sender=TrustInvoiceLineItem)
def update_invoice_totals_on_line_item_save(sender, instance, created, **kwargs):
    """
    Update invoice totals when a line item is created or updated.

    Args:
        sender: The model class (TrustInvoiceLineItem)
        instance: The actual line item instance being saved
        created: Boolean indicating if this is a new record
        **kwargs: Additional keyword arguments
    """
    if instance.invoice:
        # Use update_fields to prevent recursive saves
        instance.invoice.update_totals()


@receiver(post_delete, sender=TrustInvoiceLineItem)
def update_invoice_totals_on_line_item_delete(sender, instance, **kwargs):
    """
    Update invoice totals when a line item is deleted.

    Args:
        sender: The model class (TrustInvoiceLineItem)
        instance: The line item instance being deleted
        **kwargs: Additional keyword arguments
    """
    if instance.invoice:
        instance.invoice.update_totals()


@receiver(post_save, sender=TrustInvoice)
def recalculate_totals_on_discount_change(
    sender, instance, created, update_fields, **kwargs
):
    """
    Recalculate invoice totals when discount_percentage or discount_amount changes.

    Args:
        sender: The model class (TrustInvoice)
        instance: The invoice instance being saved
        created: Boolean indicating if this is a new record
        update_fields: Set of field names being updated
        **kwargs: Additional keyword arguments
    """
    # Only recalculate if discount fields changed and it's not from update_totals()
    if not created and update_fields:
        discount_fields = {"discount_percentage", "discount_amount"}
        total_fields = {"subtotal", "tax_total", "total_amount", "balance_due"}

        # If discount changed but totals didn't (means user updated discount manually)
        if discount_fields.intersection(
            update_fields
        ) and not total_fields.intersection(update_fields):
            instance.update_totals()
