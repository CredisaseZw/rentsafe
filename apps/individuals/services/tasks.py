
# apps/companies/tasks.py
from celery import shared_task
from django.db import transaction
from django.conf import settings
from apps.common.services.tasks import send_notification
from apps.individuals.api.serializers import IndividualCreateSerializer
import logging

logger = logging.getLogger('individuals')


@shared_task
def send_individual_notification(individual_id: int, notification_type: str, context: dict, sender_id: int = None):
    """
    Send notification to individual
    
    Args:
        individual_id: ID of the individual
        notification_type: Type of notification
        context: Template context
        sender_id: ID of the sender
    """
    send_notification.delay(
        recipient_type='individual',
        recipient_id=individual_id,
        notification_type=notification_type,
        context=context,
        sender_id=sender_id,
    )
    
def create(data):
    try:
        serializer = IndividualCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        detail_serializer = IndividualCreateSerializer(serializer.instance)
        return True
    except Exception as e:
        logger.error(f"Error creating individual: {str(e)}")
    return False