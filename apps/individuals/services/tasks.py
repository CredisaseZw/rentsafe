
# apps/companies/tasks.py
from celery import shared_task
from django.db import transaction
from django.conf import settings
from apps.common.services.tasks import send_notification
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
    
@shared_task    
def create_individual_background(self, individual_data: dict, user_id:int, request_path:str=None):
    """
    Create Individual in background after validation
    
    Args:
        individual_data: Validated individual data from serializer
        user_id: ID of the user creating the individual
        request_path: Request path for generating links
    """
    try:
        from apps.individuals.models.models import Individual, IndividualContactDetail,NextOfKin,EmploymentDetail
        from apps.common.models.models import Address
        from django.contrib.contenttypes.models import ContentType
        import secrets
        
        with transaction.atomic():
            address_data = individual_data.pop('addresses', [])
            employment_data = individual_data.pop('employment_details', [])
            kin_data = individual_data.pop('next_of_kin', [])
            contact_data= individual_data.pop('contact_details', [])
            
            individual = Individual.objects.create(**individual_data)
            
            logger.info(f"Created Individual {individual.id} in the background")
            
           # Create addresses
            for address_data in address_data:
                Address.objects.create(
                    content_object=individual,
                    **address_data
                )
            for emp_data in employment_data:
                EmploymentDetail.objects.create(
                    content_object = individual,
                    **emp_data
                )
                
            for kin in kin_data:
                NextOfKin.objects.create(
                    content_object = individual,
                    **kin
                )
            for contact in contact_data:
                IndividualContactDetail.objects.create(
                    content_object= individual,
                    **contact
                )
            
            otp_code = str(secrets.randbelow(999999)).zfill(6)
            individual_email= contact_data.email if contact_data else None

            if individual_email:
                # Send notification
                send_notification.delay(
                    recipient_type='individual',
                    recipient_id=individual.id,
                    notification_type=settings.ADD_INDIVIDUAL,
                    context={
                        'individual_name': f"{individual.first_name} {individual.last_name}",
                        'ID_number': individual.identification_number,
                        'user_id': user_id,
                    },
                    sender_id=user_id,
                    template_name='individual_registration',
                    subject='Individual Registration Successful - Fincheck',
                    include_otp=True,
                    otp_code=otp_code,
                    request_path=request_path,
                )
            return  {
                'success': True,
                'individual_id': individual.id,
                'message': 'Individual created successfully'
            }
    except Exception as exc:
        logger.error(f"Individual creation failed: {exc}")
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60, exc=exc)
        return {
            'success': False,
            'error': str(exc)
        }

@shared_task
def send_individual_notification(individual_id: int, notification_type: str, context: dict, sender_id: int = None):
    """
    Send notification to indivudal
    
    Args:
        individual_id: ID of the indivdual
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