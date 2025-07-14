from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from apps.individuals.api.serializers import IndividualSerializer
from apps.individuals.models import Individual
from apps.common.api.serializers import AddressSerializer, DocumentSerializer, NoteSerializer


class IndividualViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Individual.objects.all().prefetch_related(
        'addresses', 'employment_details', 'next_of_kin', 'notes','documents'
    )
    serializer_class = IndividualSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        
        return context
    
    # def create (self,request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     individual = serializer.save()

    #     # Handle nested creation of addresses, documents, notes, employment details, and next of kin
    #     context = {
    #         'content_type': ContentType.objects.get_for_model(individual),
    #         'object_id': individual.pk,
    #         'request': request,
    #     }
    #     self.handle_nested_creation(individual, context)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # @action(detail=True, methods=['GET', 'POST'], serializer_class=AddressSerializer)
    # def addresses(self, request, pk=None):
    #     individual = self.get_object()
    #     if request.method == 'GET':
    #         addresses = individual.addresses.all()
    #         serializer = self.get_serializer(addresses, many=True)
    #         return Response(serializer.data)
    #     elif request.method == 'POST':
    #         with transaction.atomic():
    #             serializer = self.get_serializer(data=request.data, context={
    #                 'content_type': ContentType.objects.get_for_model(individual),
    #                 'object_id': individual.pk
    #             })
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)

    # @action(detail=True, methods=['GET', 'POST'], serializer_class=DocumentSerializer)
    # def documents(self, request, pk=None):
    #     individual = self.get_object()
    #     if request.method == 'GET':
    #         documents = individual.documents.all()
    #         serializer = self.get_serializer(documents, many=True)
    #         return Response(serializer.data)
    #     elif request.method == 'POST':
    #         with transaction.atomic():
    #             serializer = self.get_serializer(data=request.data, context={
    #                 'content_type': ContentType.objects.get_for_model(individual),
    #                 'object_id': individual.pk
    #             })
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)

    # @action(detail=True, methods=['get', 'post'], serializer_class=NoteSerializer)
    # def notes(self, request, pk=None):
    #     individual = self.get_object()
    #     if request.method == 'GET':
    #         notes = individual.notes.all()
    #         serializer = self.get_serializer(notes, many=True)
    #         return Response(serializer.data)
    #     elif request.method == 'POST':
    #         with transaction.atomic():
    #             serializer = self.get_serializer(data=request.data, context={
    #                 'content_type': ContentType.objects.get_for_model(individual),
    #                 'object_id': individual.pk,
    #                 'request': request
    #             })
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)