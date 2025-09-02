from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from apps.common.api.views import BaseViewSet
from apps.common.utils import CacheService,extract_error_message
from apps.subscriptions.api.serializers import SubscriptionCreateSerializer, SubscriptionViewSerializer
from apps.subscriptions.models.models import Subscription

import logging

logger = logging.getLogger('subscriptions')

class SubscriptionAdminViewSet(BaseViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Subscription.objects.filter(is_activated=True).select_related(
        'client', 'currency', 'payment_method', 'service', 'period'
    )

    def get_queryset(self):
        qs = Subscription.objects.filter(is_activated=True).select_related(
            'client', 'currency', 'payment_method', 'service', 'period'
        )
        search_key = self.request.query_params.get("search", "").strip()
        if search_key:
            return qs.filter(
                Q(name__icontains=search_key) |
                Q(description__icontains=search_key)
            )
        return qs

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SubscriptionCreateSerializer
        elif self.action in ['list', 'retrieve', 'deactivated']:
            return SubscriptionViewSerializer
        return SubscriptionViewSerializer


    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer_class()(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
        
        except ValidationError as e:
            logger.error(f"Validation error creating subscription: {e}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_400_BAD_REQUEST
            )
        
        except Exception as e:
            logger.error(f"Error creating subscription: {e}")
            return self._create_rendered_response(
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        try:
            subscription = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer_class()(subscription)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        except Subscription.DoesNotExist:
            return self._create_rendered_response(
                {"error": "Subscription not found"},
                status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error retrieving subscription: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def list(self, request):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer_class()(queryset, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error listing subscriptions: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False,methods=["GET"], url_path='deactivated')
    def deactivated(self, request):
        try:
            if queryset := Subscription.objects.filter(is_activated=False).exists():
                serializer = self.get_serializer_class()(queryset, many=True)
                return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
            else:
                return self._create_rendered_response('deactivated subscriptions not found', status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error listing deactivated subscriptions: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PUT','PATCH'], url_path='activation')
    def activation(self, request, pk=None):
        subscription = Subscription.objects.get(pk=pk)
        subscription.is_activated = not subscription.is_activated
        try:
            subscription.save()
            return self._create_rendered_response(
                {"detail": "Subscription activated successfully" if subscription.is_activated else "Subscription deactivated successfully"},
                status.HTTP_200_OK
            )
        
        except Subscription.DoesNotExist:
            return self._create_rendered_response(
                {"error": "Subscription not found"},
                status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            logger.error(f"Error {'activating' if subscription.is_activated else 'deactivating'} subscription: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": extract_error_message(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SubscriptionClientViewSet(BaseViewSet):
    permissions = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Subscription.objects.filter(
            is_activated=True,
            client_id=self.request.user.client.id
        ).select_related(
            'client', 'currency', 'payment_method', 'service', 'period'
        )
