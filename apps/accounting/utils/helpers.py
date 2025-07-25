import uuid
def generate_invoice_document_number():
    return f"INV-{uuid.uuid4().hex[:6].upper()}"

def generate_credit_note_document_number():
    return f"CN-{uuid.uuid4().hex[:6].upper()}"