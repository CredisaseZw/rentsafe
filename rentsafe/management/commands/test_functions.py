
from django.core.management.base import BaseCommand
from rentsafe.helper import send_auth_email
from rentsafe.models import Lease, Company, CompanyProfile, Individual
import requests as request
from django.conf import settings
from django.core.mail import EmailMessage
from core.settings import EMAIL_HOST_USER




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
        # self.stdout.write(self.style.SUCCESS("Email sent successfully!")) .exclude(lease_giver='152')
        url = "http://sms.vas.co.zw/client/api/sendmessage?"
        registration_message = 'Please be adviced, CrediSafe has merged with Fincheck and all future communication will come under the name Fincheck.'
        notified_recepients = []
        contact_detail=None
        all_recepients = Lease.objects.filter(is_active=True).exclude(lease_giver='152')
        for recipient in all_recepients:
            
            if recipient.is_individual:
                individual= Individual.objects.filter(identification_number=recipient.reg_ID_Number).first()
                contact_detail = individual.mobile if individual else '263779586059'

                params = {
                        "apikey": settings.SMS_API_KEY,
                        "mobiles":contact_detail,
                        "sms": registration_message,
                    }
                try:
                    if contact_detail not in notified_recepients:
                        notified_recepients.append(contact_detail)
                        # response = request.get(url, params=params)
                    else:
                        continue
                except Exception:
                    ...
            else:
                company=Company.objects.filter(id=int(recipient.reg_ID_Number)).first()
                comp_prof =CompanyProfile.objects.filter(company=int(company.id)).first()
                self.stdout.write(self.style.SUCCESS(f"Company Profile: {comp_prof}"))
                contact_detail = comp_prof.email if comp_prof else 'gtkandeya@gmail.com'
                subject = "Change Of Communication Channel - Credisafe."
                mail = EmailMessage(subject, registration_message, EMAIL_HOST_USER, [contact_detail])
                # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
                # creating a pdf reader object
                # mail.attach('manual.pdf', pdf, 'application/pdf')
                if contact_detail not in notified_recepients:
                    notified_recepients.append(contact_detail)
                    # mail.send(fail_silently=False)
                else:
                    continue
        self.stdout.write(self.style.SUCCESS("SMS and Email notifications sent successfully!"))
        self.stdout.write(self.style.SUCCESS(f"Notified recipients: {notified_recepients}"))