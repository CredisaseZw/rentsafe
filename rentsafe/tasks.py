# from __future__ import absolute_import, unicode_literals
# from celery import shared_task
# from urllib.parse import urlparse
# from authentication.models import *
# from django.conf import settings
# from django.core.mail import send_mail
# from django.core.mail import EmailMessage
# from core.settings import EMAIL_HOST_USER
# import random
# import requests as request
# import string
# from rentsafe.models import *
# from urllib.parse import urlparse

# account_sid = settings.ACCOUNT_SID
# auth_token = settings.AUTH_TOKEN

# @shared_task
# def send_otp(
#     request_path,
#     generated_otp,
#     phone_or_email,
#     request_user,
#     requested_user,
#     request_user_type,
#     otp_type,
#     registration_message,
# ):
#     # Send OTP message
#     otp = generated_otp
#     parsed_url = urlparse(request_path)
#     try:
#         url_path = parsed_url.scheme + "://" + parsed_url.netloc
#     except Exception as e:
#         pass
#     if request_user_type == "individual" or request_user_type == "agent":
#         # https://smsportal.vas.co.zw/teleoss/sendsms.jsp?user=Credisaf&password=Cdf190@&mobiles=263775686926&sms=Test%20message
#         # http://sms.vas.co.zw/client/api/sendmessage?apikey=968dfdbc80b5fa1c&mobiles=263775686926&sms=test
#         try:
#             url = "http://sms.vas.co.zw/client/api/sendmessage?"
#             params = {
#                 "apikey": settings.SMS_API_KEY,
#                 "mobiles": phone_or_email,
#                 "sms": f"{registration_message}" + " {}".format(otp),
#             }
#             response = request.get(url, params=params)
#             # Save OTP to the OTP model
#             if otp:
#                 otpFile = OTP.objects.create(
#                     otp_code=otp,
#                     otp_type=otp_type,
#                     request_user=request_user,
#                     requested_user=requested_user,
#                 )
#                 otpFile.save()
#         except Exception as e:
#             pass
#     elif request_user_type == "company" and otp_type == settings.ADD_COMPANY:
#         # Save OTP to the OTP model
#         otpFile = OTP.objects.create(
#             otp_code=otp,
#             otp_type=otp_type,
#             request_user=request_user,
#             requested_user=requested_user,
#             requested_user_type="company",
#         )
#         otpFile.save()

#         random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
#         otp_link = f"{url_path}/clients/company-verify-otp/{random_string}T{generated_otp}L{random_string}!{requested_user}B/"
#         # send email to company
#         subject = "Confirmation Link - credisafe."
#         message = "Click this link to verify : " + otp_link
#         mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
#         # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
#         # creating a pdf reader object
#         # mail.attach('manual.pdf', pdf, 'application/pdf')
#         mail.send(fail_silently=False)
#     elif request_user_type == "company" and otp_type == settings.ADD_COMP_LEASE or otp_type == "bulk_leases":

#         if otp_type == "bulk_leases":
#             if otp:
#                 otpFile = OTP.objects.create(
#                     otp_code=otp,
#                     otp_type=otp_type,
#                     request_user=request_user,
#                     requested_user=requested_user,
#                     requested_user_type="company",
#                 )
#                 otpFile.save()
#             # send email to company
#             subject = "New Lease - credisafe."
#             message = registration_message
#             mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
#             # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
#             # creating a pdf reader object
#             # mail.attach('manual.pdf', pdf, 'application/pdf')
#             mail.send(fail_silently=False)
#         else:
#             # Save OTP to the OTP model
#             if otp:
#                 otpFile = OTP.objects.create(
#                     otp_code=otp,
#                     otp_type=otp_type,
#                     request_user=request_user,
#                     requested_user=requested_user,
#                     requested_user_type="company",
#                 )
#                 otpFile.save()
#                 random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
#                 otp_link = f"{url_path}/clients/cl-verify-lease/{random_string}T{generated_otp}L{random_string}!{requested_user}B/"
#                 # send email to company
#                 subject = "Lease Verify - credisafe."
#                 message = f"{registration_message}" + otp_link
#                 mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
#                 # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
#                 # creating a pdf reader object
#                 # mail.attach('manual.pdf', pdf, 'application/pdf')
#                 mail.send(fail_silently=False)

#     elif request_user_type == "company" and otp_type == settings.PAYMENT_RECEIPT:
#         # Save OTP to the OTP model
#         # otpFile = OTP.objects.create(
#         #     otp_code=otp,
#         #     otp_type=otp_type,
#         #     request_user=request_user,
#         #     requested_user=requested_user,
#         #     requested_user_type="company",
#         # )
#         # otpFile.save()
#         random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
#         otp_link = f"{url_path}/clients/cl-verify-lease/{random_string}T{generated_otp}L{random_string}!{requested_user}B/"
#         # send email to company
#         subject = "Payment Receipt - credisafe."
#         message = registration_message
#         mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
#         # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
#         # creating a pdf reader object
#         # mail.attach('manual.pdf', pdf, 'application/pdf')
#         mail.send(fail_silently=False)
