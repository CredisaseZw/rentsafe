from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from apps.individuals.api.serializers import (
    IndividualSerializer , 
    IndividualUpdateSerializer,
    IndividualCreateSerializer, 
    IndividualSearchSerializer,
    IndividualMinimalSerializer
    )
from apps.individuals.models import Individual
from apps.common.api.views import BaseViewSet
from apps.common.utils import CacheService,extract_error_message
from apps.individuals.services.tasks import process_individuals_csv

import logging

logger = logging.getLogger("individuals")

class IndividualViewSet(BaseViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Individual.objects.filter(is_active=True, is_deleted=False).prefetch_related(
            'addresses','addresses__country', 'addresses__province', 
            'addresses__city', 'addresses__suburb', 'employment_details', 
            'next_of_kin', 'notes','documents','contact_details'
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return IndividualCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return IndividualUpdateSerializer
        elif self.action in [ 'search_individuals', 'details']:
            return IndividualSearchSerializer
        elif self.action == 'retrieve_full_individual_details':
            return IndividualSerializer
        elif self.action == 'list':
            return IndividualSearchSerializer
        return IndividualMinimalSerializer  # fallback

    
    def create(self, request, *args, **kwargs):
      
        try:
            
            serializer = IndividualCreateSerializer(data=request.data)

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            ) 
            
        except Exception as e:
            logger.error(f"Error creating individual: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = IndividualUpdateSerializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
        
            self.perform_update(serializer)

            return self._crete_rendered_response(serializer.data,status.HTTP_200_OK)
        
        except ValidationError as e:
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating individual: {extract_error_message(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @CacheService.cached(tag_prefix='individual:list')
    def list(self,*args, **kwargs):
        try:
            queryset= self.get_queryset()
            page = self.paginate_queryset(queryset)
            logger.info(f"Listing individuals, total count: {queryset.count()}")
            if page is not None:
                serializer = IndividualSearchSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing individuals: {str(e)}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @CacheService.cached(tag_prefix='individual:{pk}')
    def retrieve(self, request, *args, **kwargs):
        try:
            individual = self.get_object()
            serializer = IndividualMinimalSerializer(individual)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {id} Does not exist")
            return self._create_rendered_response({"error": "Individual does not exist"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Failed to retrieve individual: {str(e)} ")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def destroy(self, request, *args, **kwargs):
        logger.info(f"Soft deleting individual with ID: {kwargs.get('pk', 'unknown')}")
        try:
            instance = self.get_object()
            instance.is_deleted = True
            instance.is_active = False
            instance.save()
            logger.info(f"Individual {instance.pk} soft deleted by user {request.user}")
            return self._create_rendered_response({instance.data}, status.HTTP_200_OK)
        except Individual.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Individual not found'},
             status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error deleting individual: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )   

    @action(detail=True, methods=['PUT', 'PATCH'], url_path='verify')
    def verify_individual(self, request, pk=None):
        try:
            individual = Individual.objects.get(pk=pk)
            individual.is_verified = not individual.is_verified
            individual.save()
            return self._create_rendered_response({
                "message": f"Individual has been {'verified'  if individual.is_active else 'unverified'}"
            })
        except Individual.DoesNotExist:
            return self._create_rendered_response({"error": "Individual not found"}, status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Error verifying individual: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @action(detail=True, methods=['PUT','PATCH'], url_path='activate')
    def activate_individual(self, request, pk=None):
        try:
            individual = Individual.objects.get(pk=pk)
            individual.is_active= not individual.is_active
            individual.save()
            
            serializer = IndividualSearchSerializer(individual)
            return self._create_rendered_response({
                "message": f"Individual has been {'activated'  if individual.is_active else 'deactivated'}"
            })
        except Individual.DoesNotExist:
            return self._create_rendered_response({
                'error': 'Individual not found'},
              status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error activating individual: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @action(detail=True, methods=['PATCH'], url_path='un-delete')
    def un_delete(self, request, pk=None):
        try:
            if individual := Individual.objects.filter(id=pk).first():
                if individual.is_deleted == True:
                    individual.is_deleted= False
                    individual.is_active= True
                    individual.save()
                    logger.info(f"Individual {pk} has been un deleted")
                    return self._create_rendered_response("Individual has been activated successfully")
                else:
                    return self._create_rendered_response ("This Individual Is already active")
            else:
                return self._create_rendered_response("Individual does not exist")
        except Exception as e:
            logger.error(f"Error Deleting individual: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @action(detail=False, methods=['GET'], url_path='view-deleted')
    def view_deleted(self,request, pk=None):
        try:
            if individuals := Individual.objects.filter(is_deleted=True):
                serializer = IndividualSearchSerializer(individuals,many=True)
                return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
            else:
                return self._create_rendered_response({"message": "No deleted individuals found"}, status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching deleted individuals: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False, methods=['GET'], url_path='search')
    @CacheService.cached(tag_prefix= 'individual:search')
    def search_individuals(self, request):
        """Search Individuals Returning minimal information."""
        query = request.query_params.get('q', '').strip()
        if not query:
            return self._create_rendered_response({"error": "Search query cannot be empty"}, status.HTTP_400_BAD_REQUEST)
        try:
            search_fields = ['first_name', 'last_name', 'identification_number']
            filter_conditions = Q()
            
            for field in search_fields:
                filter_conditions |= Q(**{f"{field}__icontains": query})

            individuals = Individual.objects.filter(
                filter_conditions,is_active=True, is_deleted=False).prefetch_related(
                'addresses','employment_details', 'next_of_kin','contact_details','documents').distinct()
            
            serializer = IndividualSearchSerializer(individuals, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error searching individuals: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @CacheService.cached(tag_prefix='individual:{pk}:full-details')    
    @action(detail=True, methods=['GET'], url_path='full-details')
    def retrieve_full_individual_details(self, request, pk=None):
        """Retrieve full detailed information about an individual."""
        try:
            individual = self.get_queryset().get(pk=pk)
            serializer = IndividualSerializer(individual)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {pk} does not exist.")
            return self._create_rendered_response({"error": "Individual not found"}, status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error fetching individual full details: {e}")
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class BulkUpload(BaseViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='run')
    def post(self, request):
        file = request.FILES.get('file')
        import os
        import tempfile

        if not file:
            return self._create_rendered_response({'error': 'No file uploaded'}, status.HTTP_400_BAD_REQUEST)

        ext = file.name.split('.')[-1].lower()
        if ext != 'csv':
            return self._create_rendered_response({'error': 'Unsupported file type. Please upload .csv files'}, status.HTTP_400_BAD_REQUEST)

        try:
            # Save the uploaded file to a temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            process_individuals_csv.delay(tmp_path)
           
        except Exception as e:
            return self._create_rendered_response(
                {'error': extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return self._create_rendered_response({'message': 'File processing started successfully'}, status.HTTP_200_OK)
