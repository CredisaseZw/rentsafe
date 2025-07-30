from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.legal.models.contracts import Contract
from apps.legal.api.serializers.contract_serializers import ContractSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return super().get_queryset()