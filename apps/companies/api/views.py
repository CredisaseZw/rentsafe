# apps/companies/api/views.py
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from apps.companies.models.models import Company, CompanyBranch, ContactPerson, CompanyProfile
from apps.companies.api.serializers import (
    CompanySerializer, CompanyBranchSerializer, ContactPersonSerializer,
    CompanyProfileSerializer
)
from apps.common.api.serializers import AddressSerializer, DocumentSerializer, NoteSerializer
# from apps.common.api.permissions import IsStaffOrReadOnly # Assuming you have this permission

class CompanyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows companies to be viewed or edited.
    Supports nested creation/update of addresses, documents, notes, and profile.
    """
    queryset = Company.objects.all().prefetch_related(
        'addresses', 'documents', 'notes', 'branches', 'profile__contact_person__individual'
    ).select_related(
        'profile'
    )
    serializer_class = CompanySerializer
    # permission_classes = [IsStaffOrReadOnly] # Example permission

    # Override get_serializer_context to pass request to nested serializers
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get', 'post'], serializer_class=AddressSerializer)
    def addresses(self, request, pk=None):
        company = self.get_object()
        if request.method == 'GET':
            addresses = company.addresses.all()
            serializer = AddressSerializer(addresses, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = AddressSerializer(data=request.data, context={
                    'content_type': ContentType.objects.get_for_model(company),
                    'object_id': company.pk
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], serializer_class=DocumentSerializer)
    def documents(self, request, pk=None):
        company = self.get_object()
        if request.method == 'GET':
            documents = company.documents.all()
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = DocumentSerializer(data=request.data, context={
                    'content_type': ContentType.objects.get_for_model(company),
                    'object_id': company.pk
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], serializer_class=NoteSerializer)
    def notes(self, request, pk=None):
        company = self.get_object()
        if request.method == 'GET':
            notes = company.notes.all()
            serializer = NoteSerializer(notes, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = NoteSerializer(data=request.data, context={
                    'content_type': ContentType.objects.get_for_model(company),
                    'object_id': company.pk,
                    'request': request
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)


class CompanyBranchViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows company branches to be viewed or edited.
    Supports nested creation/update of addresses.
    """
    queryset = CompanyBranch.objects.all().select_related('company').prefetch_related('addresses')
    serializer_class = CompanyBranchSerializer
    # permission_classes = [IsStaffOrReadOnly]

    # Override get_serializer_context to pass request to nested serializers
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get', 'post'], serializer_class=AddressSerializer)
    def addresses(self, request, pk=None):
        branch = self.get_object()
        if request.method == 'GET':
            addresses = branch.addresses.all()
            serializer = AddressSerializer(addresses, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = AddressSerializer(data=request.data, context={
                    'content_type': ContentType.objects.get_for_model(branch),
                    'object_id': branch.pk
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContactPersonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contact persons to be viewed or edited.
    Supports nested creation/update of the individual.
    """
    queryset = ContactPerson.objects.all().select_related('branch__company', 'individual')
    serializer_class = ContactPersonSerializer
    # permission_classes = [IsStaffOrReadOnly]

class CompanyProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    """
    API endpoint that allows company profiles to be retrieved, updated, or deleted.
    CompanyProfile is a OneToOneField, so creation is handled via CompanyViewSet.
    Supports nested creation/update of former_address, postal_address, and contact_person.
    """
    queryset = CompanyProfile.objects.all().select_related(
        'company', 'contact_person__individual'
    ).prefetch_related(
        'former_address', 'postal_address'
    )
    serializer_class = CompanyProfileSerializer
    # permission_classes = [IsStaffOrReadOnly]

    # Override get_serializer_context to pass request to nested serializers
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get', 'post'], serializer_class=AddressSerializer)
    def former_addresses(self, request, pk=None):
        profile = self.get_object()
        if request.method == 'GET':
            addresses = profile.addresses.filter(address_type='physical') # Assuming former address is physical
            serializer = AddressSerializer(addresses, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = AddressSerializer(data={**request.data, 'address_type': 'physical'}, context={
                    'content_type': ContentType.objects.get_for_model(profile),
                    'object_id': profile.pk
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], serializer_class=AddressSerializer)
    def postal_addresses(self, request, pk=None):
        profile = self.get_object()
        if request.method == 'GET':
            addresses = profile.addresses.filter(address_type='postal')
            serializer = AddressSerializer(addresses, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            with transaction.atomic():
                serializer = AddressSerializer(data={**request.data, 'address_type': 'postal'}, context={
                    'content_type': ContentType.objects.get_for_model(profile),
                    'object_id': profile.pk
                })
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)