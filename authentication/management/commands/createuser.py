from django.core.management import BaseCommand
from django.contrib.auth import get_user_model
from authentication.models import CustomUser as User

class Command(BaseCommand):
    help = 'Create a superuser for the application'

    def handle(self, *args, **options):
        email = input("Email: ")
        individual = input("Individual: ")
        company = input("Company: ")
        password = input("Password: ")
        
        # Check if the user already exists
        user_ob = User.objects.filter(email=email).first()
        if user_ob:
            # If the user exists, delete it
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists. Deleting...'))
            # Delete the user
            user_ob.delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted user: {email}'))
        
        try:
            user = User.objects.create_superuser(email=email, individual=individual, company=company, password=password)
            user.use_id = email
            user.save() 
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {user.email}'))
        except ValueError as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
