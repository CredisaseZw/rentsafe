from rest_framework import serializers
from apps.legal.models.contracts import Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = [
            'id',
            'contract_type',
            'title',
            'reference_number',
            'effective_date',
            'expiration_date',
            'status'
        ]
        read_only_fields = ['reference_number', 'status']