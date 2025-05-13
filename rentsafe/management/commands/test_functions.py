
from django.core.management.base import BaseCommand
from rentsafe.helper import send_auth_email
import requests as request



class Command(BaseCommand):
    help = "Test command to check the functions "

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Testing task queue..."))
        # Here you can add code to test your Celery tasks
        # For example, you can call a Celery task and check its result
        # self.stdout.write(self.style.SUCCESS("Celery task queue test completed!"))
        # username = "testuser"
        # password = "testpassword"
        # email = "gtkandeya@gmail.com"
        # firstname = "testuser <a href='mailto:clavachatt@gmail.com'>here</a>"
        # send_auth_email(username, password, email, firstname)
        # self.stdout.write(self.style.SUCCESS("Email sent successfully!"))
        url = "http://sms.vas.co.zw/client/api/sendmessage?"
        mobile_number = '263772765674'
        registration_message = """
Hi ROSEMARY MASHAYA,Your Payment status to TAO PROPERTY INVESTMENTS has downgraded to NON-PAYER. Please pay your balance of USD 1050.00 to upgrade your payment status. Lease ID: 127
"""
        params = {
                "apikey": '968dfdbc80b5fa1c',
                "mobiles":mobile_number,
                "sms": registration_message,
            }
                
        try:
            response = request.get(url, params=params)
        except :
            ...