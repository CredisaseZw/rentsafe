from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from apps.individuals.api.serializers import (
    IndividualSerializer , 
    IndividualUpdateSerializer,
    IndividualCreateSerializer, 
    IndividualSearchSerializer,
    IndividualMinimalSerializer
    )
from apps.individuals.models import Individual
from apps.common.api.views import BaseViewSet
from apps.common.utils.caching import CacheService
from apps.individuals.services.tasks import process_individuals_excel, process_individuals_csv
from apps.individuals.services.validators import validate_national_id
from rest_framework.exceptions import ValidationError
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
                {"error": "Validation failed", "details": e.detail},
                status.HTTP_400_BAD_REQUEST
            )     
        except Exception as e:
            logger.error(f"Error creating individual: {e}")
            return self._create_rendered_response(
                {'error': 'Failed to create individual', 'details':str(e)},
                status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = IndividualUpdateSerializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
        
            self.perform_update(serializer)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error updating individual: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @CacheService.cached(tag_prefix='individual:list')
    def list(self,*args, **kwargs):
        try:
            queryset= self.get_queryset()
            page = self.paginate_queryset(queryset)
            logger.info(f"Listing individuals, total count: {queryset.count()}")
            if page is not None:
                serializer = IndividualSearchSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            return Response({serializer.data},status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing individuals: {str(e)}")
            return Response(
                {"error": "failed to list individuals", "details": str(e)}
            )
    @CacheService.cached(tag_prefix='individual:{pk}')
    def retrieve(self, request, *args, **kwargs):
        try:
            individual = self.get_object()
            serializer = IndividualMinimalSerializer(individual)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {id} Does not exist")
            return Response(
                {'error': 'Individual not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Failed to retrieve individual: {str(e)} ")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    def destroy(self, request, *args, **kwargs):
        logger.info(f"Soft deleting individual with ID: {kwargs.get('pk', 'unknown')}")
        try:
            instance = self.get_object()
            instance.is_deleted = True
            instance.is_active = False
            instance.save()
            logger.info(f"Individual {instance.pk} soft deleted by user {request.user}")
            return Response({"message": "Individual deleted successfully"}, status=status.HTTP_200_OK)
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {kwargs.get('pk','unknown')} not found")
            return Response(
                {'error': 'Individual not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error deleting individual: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)    

    @action(detail=True, methods=['PUT', 'PATCH'], url_path='verify')
    def verify_individual(self, request, pk=None):
        try:
            individual = Individual.objects.get(pk=pk)
            individual.is_verified = not individual.is_verified
            individual.save()
            return Response({
                "message": f"Individual has been {'verified'  if individual.is_active else 'unverified'}"
            })
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {pk} does not exist.")
            return Response({"error": "Individual not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'error': 'Individual not found'},
                status= status.HTTP_404_NOT_FOUND
            )
            
    @action(detail=True, methods=['PUT','PATCH'], url_path='activate')
    def activate_individual(self, request, pk=None):
        try:
            individual = Individual.objects.get(pk=pk)
            individual.is_active= not individual.is_active
            individual.save()
            
            serializer = IndividualSearchSerializer(individual)
            return Response({
                "message": f"Individual has been {'activated'  if individual.is_active else 'deactivated'}"
            })
        except Individual.DoesNotExist:
            return Response({
                'error': 'Individual not found'},
                status= status.HTTP_404_NOT_FOUND
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
                    return Response("Individual has been activated successfully")
                else:
                    return Response ("This Individual Is already active")
            else:
                return ("Individual does not exist")
        except Exception as e:
            return Response(f'An error occurred while un-deleting individual{e}')
                    
    @action(detail=False, methods=['GET'], url_path='view-deleted')
    def view_deleted(self,request, pk=None):
        try:
            individuals= Individual.objects.filter(is_deleted=True)
            serializer = IndividualSearchSerializer(individuals,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error retrieving deleted individuals{e}")
        
    @action(detail=False, methods=['GET'], url_path='search')
    @CacheService.cached(tag_prefix= 'individual:search')
    def search_individuals(self, request):
        """Search Individuals Returning minimal information."""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"error": "Search query cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            search_fields = ['first_name', 'last_name', 'identification_number']
            filter_conditions = Q()
            
            for field in search_fields:
                filter_conditions |= Q(**{f"{field}__icontains": query})

            individuals = Individual.objects.filter(filter_conditions,is_active=True, is_deleted=False).prefetch_related('addresses','employment_details', 'next_of_kin','contact_details','documents').distinct()
            
            serializer = IndividualSearchSerializer(individuals, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error searching individuals: {e}")
            return Response({"error": "Failed to search individuals"}, status=status.HTTP_400_BAD_REQUEST)
    
    @CacheService.cached(tag_prefix='individual:{pk}:full-details')    
    @action(detail=True, methods=['GET'], url_path='full-details')
    def retrieve_full_individual_details(self, request, pk=None):
        """Retrieve full detailed information about an individual."""
        try:
            individual = self.get_queryset().get(pk=pk)
            serializer = IndividualSerializer(individual)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Individual.DoesNotExist:
            logger.error(f"Individual with ID {pk} does not exist.")
            return Response({"error": "Individual not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error retrieving individual details {pk}: {e}")
            return Response({"error": "Failed to retrieve individual details"}, status=status.HTTP_400_BAD_REQUEST)


class BulkUpload(BaseViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='run')
    def post(self, request):
        file = request.FILES.get('file')
        import os
        import tempfile

        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        ext = file.name.split('.')[-1].lower()
        if ext != 'csv':
            return Response({'error': 'Unsupported file type. Please upload .csv files'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the uploaded file to a temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            process_individuals_csv.delay(tmp_path)
           
        except Exception as e:
            logger.error(f"Error processing file: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'File processing started successfully'}, status=status.HTTP_200_OK)
