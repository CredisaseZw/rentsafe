from django.db.models import Q
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from apps.individuals.api.serializers import (IndividualSerializer , IndividualUpdateSerializer,
                                              IndividualCreateSerializer, IndividualSearchSerializer,
                                              IndividualMinimalSerializer)
from apps.individuals.models import Individual
from apps.common.api.views import BaseViewSet
from apps.common.utils.caching import CacheService
import logging

logger = logging.getLogger('file_individuals')

class IndividualViewSet(BaseViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Individual.objects.filter(is_active=True).prefetch_related(
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
            return IndividualMinimalSerializer
        return IndividualMinimalSerializer  # fallback

    
    def create(self, request, *args, **kwargs):
        try:
            if Individual.objects.filter(identification_number=request.data.get('identification_number')).exists():
                return Response({"error": "Individual already exists"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = IndividualCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(self,serializer)

            detail_serializer = IndividualCreateSerializer(serializer.instance)
            return Response(detail_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating individual: {str(e)}")
            return Response({"error": "Failed to create individual"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = IndividualUpdateSerializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(detail_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.warning(f"Error updating individual: {str(e)}")
            return Response({"error": "Failed to update individual"}, status=status.HTTP_400_BAD_REQUEST)
            
    @CacheService.cached(tag_prefix='individuals:list')
    def list(self, request,*arg, **kwarg):
        try:
            queryset= self.get_queryset()
            page = self.paginate_queryset(queryset)
            logger.info(f"Listing individuals, total count: {queryset.count()}")
            if page is not None:
                serializer = IndividualMinimalSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = IndividualMinimalSerializer(queryset, many=True)
            return self._create_rendered_response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing individuals: {str(e)}")
            return self._create_rendered_response(
                {"error": "failed to list individuals", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
    
    @CacheService.cached(tag_prefix='individual:{pk}')
    def retrieve(self, request, *args, **kwargs):
        try:
            Individual = self.get_queryset()
            serializer = IndividualMinimalSerializer(Individual)
            return self._create_rendered_response(serializer.data, status=status.HTTP_200_OK)
        except Individual.DoesNotExist:
            return self._create_rendered_response(
                {'error': 'Individual not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return self._create_rendered_response({"error": "Failed to retrieve individual details"}, status=status.HTTP_400_BAD_REQUEST)
            
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
            logger.error(f"Individual with ID {kwargs.get('pk','unkown')} not found")
            return self._create_rendered_response(
                {'error': 'Individual not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error deleting individual: {e}")
            return Response({"error": "Failed to delete individual"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """Partial update company (PATCH request)"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    

    @action(detail=True, methods=['PUT', 'PATCH'], url_path='verify')
    def verify_individual(self, request, pk=None):
        try:
            individual = Individual.objects.get(pk=pk)
            individual.is_verified = not individual.is_verified
            individual.save()

            serializer = self.get_serializer(individual)
            return self._create_rendered_response({
                "message": f"Individual has been {'verified'  if individual.is_active else 'unverified'}"
            })
        except Individual.DoesNotExist:
            logger.warning(f"Individual with ID {pk} does not exist.")
            return Response({"error": "Individual not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return self._create_rendered_response({
                'error': 'Indivudal not found'},
                status= status.HTTP_404_NOT_FOUND
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
                'error': 'Indivudal not found'},
                status= status.HTTP_404_NOT_FOUND
            )
            
    @action(detail=False, methods=['GET'], url_path='search')
    @CacheService.cached(tag_prefix= 'individual:search')
    def search_individuals(self, request):
        """Search Individuals Returning minimal information."""
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Search query cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            search_fields = ['first_name', 'last_name', 'identification_number']
            filter_conditions = Q()
            
            for field in search_fields:
                filter_conditions |= Q(**{f"{field}__icontains": query})

            individuals = Individual.objects.filter(filter_conditions).prefetch_related('addresses','employment_details', 'next_of_kin',).distinct()

            serializer = IndividualSearchSerializer(individuals, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error searching individuals: {e}")
            return Response({"error": "Failed to search individuals"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['GET'], url_path='full-details')
    def retrieve_full_individual_details(self, request, pk=None):
        """Retrieve full detailed information about an individual."""
        try:
            individual = self.get_queryset().get(pk=pk)
            serializer = IndividualSerializer(individual)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Individual.DoesNotExist:
            logger.warning(f"Individual with ID {pk} does not exist.")
            return Response({"error": "Individual not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error retrieving individual details {pk}: {e}")
            return Response({"error": "Failed to retrieve individual details"}, status=status.HTTP_400_BAD_REQUEST)
              