"""Utility helper functions for the accounting app."""

import uuid


def generate_invoice_document_number():
    return f"INV-{uuid.uuid4().hex[:6].upper()}"


def generate_credit_note_document_number(client):
    from apps.accounting.models.models import CreditNote

    lastnumber = CreditNote.objects.filter(created_by__client=client).last()
    if lastnumber:
        newnumber = int(lastnumber.document_number[3:]) + 1
    else:
        newnumber = 1
    return f"C{newnumber:06}"
