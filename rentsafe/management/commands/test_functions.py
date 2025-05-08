
from django.core.management.base import BaseCommand
from rentsafe.helper import send_auth_email
from authentication.models import CustomUser
from authentication.manager import CustomUserManager


class Command(BaseCommand):
    help = "Test command to check the functions "

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Testing task queue..."))
        # Here you can add code to test your Celery tasks
        # For example, you can call a Celery task and check its result
        # self.stdout.write(self.style.SUCCESS("Celery task queue test completed!"))
        username = "testuser"
        password = "client"
        email = "client@client.com"
        firstname = "testuser <a href='mailto:clavachatt@gmail.com'>here</a>"
        user=CustomUserManager._create_user(
            self=CustomUserManager,
            email=email,
            individual=0,
            company=0,
            password=password,
        )
        self.stdout.write(self.style.SUCCESS("Email sent successfully!"))