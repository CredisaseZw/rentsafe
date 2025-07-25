# users/signals.py

from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
import logging

audit_logger = logging.getLogger('security_audit')

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    extra_data = {
        'user_id': user.id,
        'ip_address': request.META.get('REMOTE_ADDR'),
        'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        'resource_type': 'Authentication',
        'resource_id': user.id,
        'success': True,
        'details': {'username': user.username}
    }
    audit_logger.info("User logged in successfully.", extra=extra_data)

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    extra_data = {
        'user_id': user.id,
        'ip_address': request.META.get('REMOTE_ADDR'),
        'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        'resource_type': 'Authentication',
        'resource_id': user.id,
        'success': True,
        'details': {'username': user.username}
    }
    audit_logger.info("User logged out.", extra=extra_data)

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    username_attempt = credentials.get('username', 'N/A') if credentials else 'N/A'
    extra_data = {
        'user_id': None, 
        'ip_address': request.META.get('REMOTE_ADDR'),
        'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        'resource_type': 'Authentication',
        'resource_id': None,
        'success': False,
        'details': {'username_attempt': username_attempt, 'reason': 'Invalid credentials'}
    }
    audit_logger.warning("User login failed.", extra=extra_data)