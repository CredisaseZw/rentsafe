
from django.core.management.base import BaseCommand
from rentsafe.helper import send_auth_email


class Command(BaseCommand):
    help = "Test command to check the functions "

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Testing task queue..."))
        # Here you can add code to test your Celery tasks
        # For example, you can call a Celery task and check its result
        # self.stdout.write(self.style.SUCCESS("Celery task queue test completed!"))
        username = "testuser"
        password = "testpassword"
        email = "gtkandeya@gmail.com"
        firstname = "testuser <a href='mailto:clavachatt@gmail.com'>here</a>"
        send_auth_email(username, password, email, firstname)
        self.stdout.write(self.style.SUCCESS("Email sent successfully!"))