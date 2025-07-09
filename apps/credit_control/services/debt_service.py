# In credit_control/services/debt_service.py
from communications.models.models import Communication, Reminder
from django.utils import timezone
from datetime import timedelta

class DebtCollectionService:
    @staticmethod
    def send_payment_reminder(debt_case):
        Communication.objects.create(
            content_object=debt_case,
            communication_type='email',
            direction='outbound',
            subject=f"Payment Reminder for Debt Case {debt_case.id}",
            content=f"Please be reminded of your outstanding balance of {debt_case.outstanding_amount}",
            sent_to=debt_case.debtor.email,
            related_lease=debt_case.lease
        )
        
        Reminder.objects.create(
            content_object=debt_case,
            reminder_type='payment',
            due_date=timezone.now() + timedelta(days=7),
            message="Follow up on payment reminder",
            user=debt_case.assigned_to
        )