
# apps/common/tasks.py
from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from urllib.parse import urlparse
import requests
import logging
from typing import Union, Dict, Any, Optional
import contextlib
from django.core import serializers
from django.contrib.contenttypes.models import ContentType
from django.apps import apps
from importlib import import_module


logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_notification(
    self,
    recipient_type: str,
    recipient_id: int,
    notification_type: str,
    context: Dict[str, Any],
    sender_id: Optional[int] = None,
    template_name: Optional[str] = None,
    subject: Optional[str] = None,
    message: Optional[str] = None,
    include_otp: bool = False,
    otp_code: Optional[str] = None,
    request_path: Optional[str] = None,
    is_creditor: bool = False,
):
    """
    Unified notification service for both SMS and Email
    
    Args:
        recipient_type: 'individual' or 'company'
        recipient_id: ID of the recipient
        notification_type: Type of notification (ADD_COMPANY, ADD_INDIVIDUAL, etc.)
        context: Template context data
        sender_id: ID of the user sending the notification
        template_name: Email template name (optional)
        subject: Email subject (optional)
        message: Direct message (optional)
        include_otp: Whether to include OTP in the message
        otp_code: OTP code if applicable
        request_path: Request path for generating links
        is_creditor: Whether the sender is a creditor
    """
    try:
        # Get recipient details
        if recipient_type == 'individual':
            from apps.individuals.models.models import Individual
            recipient = Individual.objects.get(id=recipient_id)
            contact_method = recipient.mobile_phone
            use_sms = True
        else:  # company
            from apps.companies.models.models import CompanyBranch
            recipient = CompanyBranch.objects.get(id=recipient_id)
            # Get primary contact email from company profile
            contact_method = getattr(recipient.contacts, 'email', None) if recipient.contacts else None
            if not contact_method:
                # Fallback to first contact person's email
                contact_person = recipient.contacts.first() if recipient.contacts else None
                if contact_person and contact_person.individual:
                    contact_method = contact_person.individual.email
            use_sms = False

        if not contact_method:
            raise ValueError(f"No contact method found for {recipient_type} {recipient_id}")

        # Prepare message content
        if template_name:
            # Use template
            email_content = render_to_string(f'emails/{template_name}.html', context)
            sms_content = render_to_string(f'sms/{template_name}.txt', context)
        else:
            # Use direct message
            email_content = message
            sms_content = message

        if include_otp and otp_code:
            if use_sms:
                sms_content = f"{sms_content} {otp_code}"
            elif request_path:
                parsed_url = urlparse(request_path)
                url_path = f"{parsed_url.scheme}://{parsed_url.netloc}"
                if otp_link := _generate_otp_link(
                    url_path, otp_code, recipient_id, notification_type
                ):
                    email_content += f"\n\nClick here to verify: {otp_link}"

        # Send notification
        if use_sms:
            success = send_sms(contact_method, sms_content)
        else:
            success = send_email(
                contact_method, 
                subject or _get_default_subject(notification_type),
                email_content,
                is_html=bool(template_name)
            )

        if not success:
            raise Exception(f"Failed to send {('SMS' if use_sms else 'Email')} notification")

        # Save OTP if provided
        if include_otp and otp_code:
            _save_otp(
                otp_code=otp_code,
                otp_type=notification_type,
                request_user=sender_id,
                requested_user=recipient_id,
                requested_user_type=recipient_type
            )

        # Log to communication history
        _add_to_communication_history(
            user_id=sender_id,
            client_id=recipient_id,
            message=sms_content if use_sms else email_content,
            is_sms=use_sms,
            is_email=not use_sms,
            is_creditor=is_creditor
        )

        return {"success": True, "method": "SMS" if use_sms else "Email"}

    except Exception as exc:
        logger.error(f"Notification failed: {exc}")
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60, exc=exc) from exc
        return {"success": False, "error": str(exc)}


def send_sms(phone_number: str, message: str) -> bool:
    """Send SMS using the configured SMS service"""
    try:
        url = "http://sms.vas.co.zw/client/api/sendmessage?"
        params = {
            "apikey": settings.SMS_API_KEY,
            "mobiles": phone_number,
            "sms": message,
        }
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"SMS sending failed: {e}")
        return False


def send_email(email: str, subject: str, message: str, is_html: bool = False) -> bool:
    """Send email using Django's email backend"""
    try:
        mail = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.EMAIL_HOST_USER,
            to=[email]
        )
        if is_html:
            mail.content_subtype = "html"
        mail.send(fail_silently=False)
        return True
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
        return False

@shared_task(bind=True)
def create_object_task(self, serializer_class_path, model_name, data, context):
    """
    Async object creation with proper serializer/model loading
    """
    try:
        module_path, class_name = serializer_class_path.rsplit('.', 1)
        module = import_module(module_path)
        serializer_class = getattr(module, class_name)
        
        model = apps.get_model(model_name)
        
        user = apps.get_model('users.User').objects.get(pk=context['user_id'])
        context = {'request': context.get('request', {}), 'user': user}
        
        serializer = serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        
        if hasattr(model, 'user'):
            instance = serializer.save(user=user)
        else:
            instance = serializer.save()
            
        return {
            'status': 'SUCCESS',
            'instance_id': instance.id,
            'content_type_id': ContentType.objects.get_for_model(model).id
        }
    except Exception as e:
        logger.error(f"Async create failed: {str(e)}")
        return {
            'status': 'FAILURE',
            'error': str(e)
        }

@shared_task(bind=True)
def update_object_task(self, serializer_class_path, model_name, instance_id, data, context):
    """
    Async object update with proper serializer/model loading
    """
    try:
        module_path, class_name = serializer_class_path.rsplit('.', 1)
        module = import_module(module_path)
        serializer_class = getattr(module, class_name)
        
        model = apps.get_model(model_name)
        instance = model.objects.get(pk=instance_id)
        
        user = apps.get_model('users.User').objects.get(pk=context['user_id'])
        context = {'request': context.get('request', {}), 'user': user}
        
        serializer = serializer_class(instance, data=data, context=context, partial=True)
        serializer.is_valid(raise_exception=True)
        
        if hasattr(model, 'user'):
            serializer.save(user=user)
        else:
            serializer.save()
            
        return {
            'status': 'SUCCESS',
            'instance_id': instance_id
        }
    except Exception as e:
        logger.error(f"Async update failed: {str(e)}")
        return {
            'status': 'FAILURE',
            'error': str(e)
        }

def _generate_otp_link(url_path: str, otp_code: str, recipient_id: int, notification_type: str) -> Optional[str]:
    """Generate OTP verification link based on notification type"""
    import random
    import string
    
    random_string = "".join(random.choices(string.ascii_letters + string.digits, k=10))
    
    link_patterns = {
        settings.ADD_COMPANY: f"{url_path}/clients/company-verify-otp/{random_string}T{otp_code}L{random_string}!{recipient_id}B/",
        settings.ADD_COMP_LEASE: f"{url_path}/clients/cl-verify-lease/{random_string}T{otp_code}L{random_string}!{recipient_id}B/",
    }
    
    return link_patterns.get(notification_type)


def _get_default_subject(notification_type: str) -> str:
    """Get default email subject based on notification type"""
    subjects = {
        settings.ADD_COMPANY: "Company Registration - Fincheck",
        settings.ADD_INDIVIDUAL: "Individual Registration - Fincheck",
        settings.ADD_COMP_LEASE: "New Lease - Fincheck",
        settings.PAYMENT_RECEIPT: "Payment Receipt - Fincheck",
        settings.LEASE_STATUS: "Payment Status Update - Fincheck",
        settings.CREDIT_CHECK: "Credit Check - Fincheck",
    }
    return subjects.get(notification_type, "Notification - Fincheck")


def _save_otp(otp_code: str, otp_type: str, request_user: int, requested_user: int, requested_user_type: str):
    """Save OTP to database"""
    try:
        from apps.communications.models.models import OTP 
        OTP.objects.create(
            otp_code=otp_code,
            otp_type=otp_type,
            request_user=request_user,
            requested_user=requested_user,
            requested_user_type=requested_user_type,
        )
    except Exception as e:
        logger.error(f"Failed to save OTP: {e}")


def _add_to_communication_history(user_id: int, client_id: int, message: str, is_sms: bool, is_email: bool, is_creditor: bool):
    """Add message to communication history"""
    try:
        from apps.communications.utils import add_msg_to_comms_hist 
        add_msg_to_comms_hist(
            user_id=user_id,
            client_id=client_id,
            message=message,
            is_sms=is_sms,
            is_email=is_email,
            is_creditor=is_creditor,
        )
    except Exception as e:
        logger.error(f"Failed to add to communication history: {e}")


@shared_task
def cleanup_expired_otps():
    """Clean up expired OTP records"""
    try:
        from apps.common.models.models import OTP
        from django.utils import timezone
        from datetime import timedelta
        
        expired_time = timezone.now() - timedelta(hours=24)
        deleted_count = OTP.objects.filter(created_at__lt=expired_time).delete()[0]
        logger.info(f"Cleaned up {deleted_count} expired OTP records")
        return deleted_count
    except Exception as e:
        logger.error(f"Failed to clean up expired OTPs: {e}")
        return 0

