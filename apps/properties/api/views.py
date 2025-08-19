# apps/properties/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from apps.properties.models import Property, PropertyType, Unit
from rest_framework.response import Response
from rest_framework import status
from apps.common.utils import extract_error_message
from apps.common.api.views import BaseViewSet
from apps.properties.api.serializers import (
    PropertyDetailSerializer, PropertyListSerializer,
    UnitDetailSerializer, UnitListSerializer,
    PropertyTypeSerializer
)

class PropertyTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Property Types.
    """
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [permissions.IsAuthenticated] 

class PropertyViewSet(BaseViewSet):
    """
    API endpoint that allows properties to be viewed or edited.
    Provides list (minimal) and detail (full) views.
    """
    permission_classes = [permissions.IsAuthenticated]

    # Optimize database queries to prevent N+1 issues
    queryset = Property.objects.select_related('property_type').prefetch_related(
        'units', 'landlords', 'addresses', 'documents', 'notes'
    ).all().order_by('-date_created')

    def get_serializer_class(self):
        """
        Return the serializer class based on the action.
        - 'list' action gets the minimal ListSerializer.
        - Other actions ('retrieve', 'create', 'update') get the DetailSerializer.
        """
        if self.action == 'list':
            return PropertyListSerializer
        return PropertyDetailSerializer
    
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = self.request.method == 'PATCH'
        return super().get_serializer(*args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"Error creating property: {e}")
            return Response(
                {"error": extract_error_message(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object() 
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error updating property: {e}")
            return Response(
                {"error": extract_error_message(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=True, methods=['get', 'post'], url_path='units')
    def get_units(self, request, pk=None):
        if request.method == 'POST':
            serializer = UnitDetailSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(property=self.get_object())
                return Response(serializer.data, status=201)
        property = self.get_object()
        units = property.units.all()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)


class UnitViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Units, nested under a specific Property.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Unit.objects.all()

    def get_serializer_class(self):
        """
        Return the serializer class based on the action.
        """
        return UnitListSerializer if self.action == 'list' else UnitDetailSerializer

    def get_queryset(self):
        """
        This view should only return units for the property
        specified in the URL.
        """
        return self.queryset.filter(property_id=self.kwargs['property_pk'])

    def perform_create(self, serializer):
        """
        Automatically associate the unit with the property from the URL
        and the logged-in user.
        """
        property_instance = get_object_or_404(Property, pk=self.kwargs['property_pk'])
        serializer.save(user=self.request.user, property=property_instance)