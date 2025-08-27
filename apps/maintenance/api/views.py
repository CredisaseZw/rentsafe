from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action

from apps.maintenance.api.serializers import (
    IndustrySerializer, 
    ContractorSerializer,
    MaintenanceRequestSerializer,
    WorkScheduleSerializer,
    MaintenanceScheduleSerializer
)
from apps.maintenance.models.models import(
    Industry,
    Contractor,
    MaintenanceRequest,
    WorkSchedule,
    MaintenanceSchedule,
)
from apps.common.api.views import BaseViewSet
from apps.common.utils import CacheService,extract_error_message


import logging
logger = logging.getLogger('maintenance')

class ContractorView(BaseViewSet):
    permission_classes= [IsAuthenticated]

    queryset = Contractor.objects.all().select_related('industry', 'charge_currency')
    serializer_class = ContractorSerializer

    def create(self, request, *args, **kwargs):
        try:
            
            serializer = self.get_serializer(data=request.data)

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            ) 
            
        except Exception as e:
            logger.error(f"Error creating contractor: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def list(self, request, *args, **kwargs):
        logger.info("listing contractors")
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['PUT','PATCH'], url_path='activate')
    def activate_contractor(self, request, pk=None):
        try:
            contractor = self.get_object()
            contractor.is_active = not contractor.is_active
            contractor.save()
            return self._create_rendered_response({f"Contractor {'activated' if contractor.is_active else 'deactivated'} successfully"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error activating contractor: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class IndustryView(BaseViewSet):
    permission_classes= [IsAuthenticated]

    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer

class MaintenanceScheduleView(BaseViewSet):
    permission_classes= [IsAuthenticated]

    queryset = MaintenanceSchedule.objects.all().select_related('contractor')
    serializer_class = MaintenanceScheduleSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
        
        except ValidationError as e:
            logger.error('Validation error: %s', e)
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            ) 
            
        except Exception as e:
            logger.error(f"Error creating maintenance schedule: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating maintenance schedule: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing maintenance schedules: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def retrieve(self, request,*args,**kwargs):
        try:
            ms = self.get_object()
            serializer = self.get_serializer(ms)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error retrieving maintenance schedule: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def destroy(self, request, pk=None):
        try:
            ms = self.get_object()
            ms.delete()
            return self._create_rendered_response({"Maintenance schedule deleted successfully"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error deleting maintenance schedule: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PATCH', 'PUT'], url_path='mark-pending')
    def mark_as_pending(self, request, pk=None):
        try:
            ms = MaintenanceSchedule.objects.filter(pk=pk)
            ms.update(status='PENDING')
            return self._create_rendered_response({"Maintenance schedule marked as pending"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking maintenance schedule as pending: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=True, methods=['PATCH', 'PUT'], url_path='mark-completed')
    def mark_as_completed(self, request, pk=None):
        try:
            ms = MaintenanceSchedule.objects.filter(pk=pk)
            ms.update(status='COMPLETED')
            return self._create_rendered_response({"Maintenance schedule marked as completed"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking maintenance schedule as completed: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=True, methods=['PATCH', 'PUT'], url_path='mark-cancelled')
    def mark_as_cancelled(self, request, pk=None):
        try:
            ms = MaintenanceSchedule.objects.filter(pk=pk)
            ms.update(status='CANCELLED')
            return self._create_rendered_response({"Maintenance schedule marked as cancelled"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking maintenance schedule as cancelled: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @action(detail=True, methods=['PATCH', 'PUT'], url_path='mark-scheduled')
    def mark_as_scheduled(self, request, pk=None):
        try:
            ms = MaintenanceSchedule.objects.filter(pk=pk)
            ms.update(status='SCHEDULED')
            return self._create_rendered_response({"Maintenance schedule marked as scheduled"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking maintenance schedule as scheduled: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=True, methods=['PATCH', 'PUT'], url_path='mark-overdue')
    def mark_as_unscheduled(self, request, pk=None):
        try:
            ms = MaintenanceSchedule.objects.filter(pk=pk)
            ms.update(status='OVERDUE')
            return self._create_rendered_response({"Maintenance schedule marked as overdue"}, status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error marking maintenance schedule as overdue: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )