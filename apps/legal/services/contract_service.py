from django.db import transaction
from apps.legal.models.contracts import Contract
from apps.communications.models.models import Communication

class ContractService:
    
    @classmethod
    def create_contract(cls, contract_data, parties_data):
        with transaction.atomic():
            return Contract.objects.create(**contract_data)
    
    @classmethod
    def send_contract_for_signature(cls, contract, recipient):
        Communication.objects.create(
            content_object=contract,
            communication_type='email',
            direction='outbound',
            subject=f"Contract for Signature: {contract.title}",
            content=f"Please review and sign the contract: {contract.title}",
            sent_to=recipient.email
        )