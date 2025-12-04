# apps/properties/views.py

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from apps.properties.models import Property, PropertyType, Unit
from rest_framework.response import Response
from rest_framework import status
from apps.common.utils import extract_error_message
from apps.common.api.views import BaseViewSet
from apps.properties.api.serializers import (
    PropertyDetailSerializer,
    PropertyListSerializer,
    UnitDetailSerializer,
    UnitListSerializer,
    PropertyTypeSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend


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

    def get_queryset(self):
        user_client = self.request.user.client
        queryset = (
            Property.objects.filter(managing_client=user_client)
            .prefetch_related("units", "landlords", "addresses", "documents", "notes")
            .all()
            .order_by("-date_created")
        )
        if search := self.request.query_params.get("search", None):
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(property_type__name__icontains=search)
                | Q(addresses__street_address__icontains=search)
                | Q(addresses__city__name__icontains=search)
                | Q(addresses__suburb__name__icontains=search)
                | Q(addresses__province__name__icontains=search)
                | Q(addresses__country__name__icontains=search)
                | Q(addresses__postal_code__icontains=search)
            ).distinct()

        return queryset

    def get_serializer_class(self):
        """
        Return the serializer class based on the action.
        - 'list' action gets the minimal ListSerializer.
        - Other actions ('retrieve', 'create', 'update') get the DetailSerializer.
        """
        if self.action == "list":
            return PropertyListSerializer
        return PropertyDetailSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["partial"] = self.request.method == "PATCH"
        return super().get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        try:
            property_data = request.data
            if (
                property_data.get("total_area") == ""
                or property_data.get("total_area") is None
            ):
                property_data["total_area"] = 0
            if (
                property_data.get("total_number_of_units") == ""
                or property_data.get("total_number_of_units") is None
            ):
                property_data["total_number_of_units"] = 0
            serializer = self.get_serializer(data=property_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        except Exception as e:
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
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
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["get", "post"], url_path="units")
    def get_units(self, request, pk=None):
        try:
            if request.method == "POST":
                serializer = UnitDetailSerializer(
                    data=request.data, context={"property": self.get_object()}
                )
                serializer.is_valid(raise_exception=True)
                serializer.save(property=self.get_object())
                return Response(serializer.data, status=201)
            property = self.get_object()
            units = property.units.all()
            serializer = UnitListSerializer(units, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in get_units action: {e}")
            return Response(
                {"error": extract_error_message(e)}, status=status.HTTP_400_BAD_REQUEST
            )


class UnitViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Units nested under a Property.
    Supports search, ordering, and filtering.
    """

    permission_classes = [permissions.IsAuthenticated]

    # filtering, ordering, search
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]

    search_fields = ["name", "unit_number", "description"]

    # fields users can order by: ?ordering=unit_number or ?ordering=-unit_number
    ordering_fields = [
        "unit_number",
        "unit_type",
        "number_of_rooms",
        "status",
        "created_at",
    ]
    ordering = ["unit_number"]

    # fields users can filter by: ?status=vacant&unit_type=apartment
    filterset_fields = [
        "status",
        "unit_type",
        "number_of_rooms",
        "property",
    ]

    def get_serializer_class(self):
        return (
            UnitListSerializer
            if self.action in ["list", "retrieve"]
            else UnitDetailSerializer
        )

    def get_queryset(self):
        """
        Return units only for the user's client and
        only inside the property from the URL.
        """
        user = self.request.user
        user_client = getattr(user, "client", None)

        queryset = Unit.objects.filter(created_by__client=user_client).select_related(
            "property", "created_by"
        )

        property_id = self.kwargs.get("property_pk")
        if property_id:
            queryset = queryset.filter(property_id=property_id)

        return queryset

    def perform_create(self, serializer):
        """
        Ensure created unit is attached to the correct property + user.
        """
        property_instance = get_object_or_404(Property, pk=self.kwargs["property_pk"])
        serializer.save(user=self.request.user, property=property_instance)

    def perform_update(self, serializer):
        """
        Ensure updates do not accidentally detach units from their property.
        """
        property_instance = get_object_or_404(Property, pk=self.kwargs["property_pk"])
        serializer.save(property=property_instance)
