from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.individuals.api.serializers import IndividualSerializer
from apps.individuals.models import Individual

class IndividualViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Individual.objects.all()
    serializer_class = IndividualSerializer

    @action(detail=False, methods=['POST'], url_path='create-individual')
    def create_individual(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if serializer.data.get('identification_number'):
            existing_individual = Individual.objects.filter(
                identification_number=serializer.data['identification_number']
            ).exists()
            
            if existing_individual:
                return Response(
                    {"error": "An individual with this identification number already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    