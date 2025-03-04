import contextlib
import datetime
import random
import re
import string
from datetime import datetime
from urllib.parse import urlparse
import time
import requests as request
from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage
from django.db.models import Q
from django.http import JsonResponse
from twilio.rest import Client

from authentication.models import *
from core.celery import app
from core.settings import EMAIL_HOST_USER
from rentsafe.models import *

account_sid = settings.ACCOUNT_SID
auth_token = settings.AUTH_TOKEN

client = Client(account_sid, auth_token)


@shared_task
def send_otp(
    request_path,
    generated_otp,
    phone_or_email,
    request_user,
    requested_user,
    request_user_type,
    otp_type,
    registration_message,
    is_creditor=False,
):
    try:
        if int(request_user) == 152:
            return
    except Exception as e:
        ... 
    # Send OTP message

    otp = generated_otp
    parsed_url = urlparse(request_path)
    with contextlib.suppress(Exception):
        url_path = f"{parsed_url.scheme}://{parsed_url.netloc}"
    if request_user_type in ["individual", "agent"]:
        # with contextlib.suppress(Exception):
        url = "http://sms.vas.co.zw/client/api/sendmessage?"
        params = (
            {
                "apikey": settings.SMS_API_KEY,
                "mobiles": phone_or_email,
                "sms": {registration_message},
            }
            if otp_type in [settings.LEASE_STATUS, settings.ADD_IND_LEASE]
            else {
                "apikey": settings.SMS_API_KEY,
                "mobiles": phone_or_email,
                "sms": f"{registration_message}" + f" {otp}",
            }
        )
        response = request.get(url, params=params)
        # Save OTP to the OTP model
        if otp:
            otpFile = OTP.objects.create(
                otp_code=otp,
                otp_type=otp_type,
                request_user=request_user,
                requested_user=requested_user,
            )

        add_msg_to_comms_hist(
            user_id=request_user,
            client_id=requested_user,
            message=registration_message,
            is_sms=True,
            is_email=False,
            is_creditor=is_creditor,
        )

    elif request_user_type == "company" and otp_type == settings.ADD_COMPANY:
        # Save OTP to the OTP model
        otpFile = OTP.objects.create(
            otp_code=otp,
            otp_type=otp_type,
            request_user=request_user,
            requested_user=requested_user,
            requested_user_type="company",
        )
        otpFile.save()
        random_string = "".join(
            random.choices(string.ascii_letters + string.digits, k=10)
        )

        add_msg_to_comms_hist(
            user_id=request_user,
            client_id=requested_user,
            message=registration_message,
            is_sms=False,
            is_email=True,
            is_creditor=is_creditor,
        )

        # send email to company
        subject = "Login Credentials Link - credisafe."
        otp_link = f"{url_path}/clients/company-verify-otp/{random_string}T{generated_otp}L{random_string}!{requested_user}B/"
        message = f"{registration_message}\nClick here to enter your login details : {otp_link}"
        mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
        # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
        # creating a pdf reader object
        # mail.attach('manual.pdf', pdf, 'application/pdf')
        mail.send(fail_silently=False)
    elif (
        request_user_type == "company"
        and otp_type == settings.ADD_COMP_LEASE
        or otp_type == "bulk_leases"
    ):

        add_msg_to_comms_hist(
            user_id=request_user,
            client_id=requested_user,
            message=registration_message,
            is_sms=False,
            is_email=True,
            is_creditor=is_creditor,
        )
        if otp_type == "bulk_leases":
            if otp:
                otpFile = OTP.objects.create(
                    otp_code=otp,
                    otp_type=otp_type,
                    request_user=request_user,
                    requested_user=requested_user,
                    requested_user_type="company",
                )


            # send email to company
            subject = "New Lease - credisafe."
            message = registration_message
            mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
            # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
            # creating a pdf reader object
            # mail.attach('manual.pdf', pdf, 'application/pdf')
            mail.send(fail_silently=False)
        else:
            # Save OTP to the OTP model
            if otp:
                otpFile = OTP.objects.create(
                    otp_code=otp,
                    otp_type=otp_type,
                    request_user=request_user,
                    requested_user=requested_user,
                    requested_user_type="company",
                )

                add_msg_to_comms_hist(
                    user_id=request_user,
                    client_id=requested_user,
                    message=registration_message,
                    is_sms=False,
                    is_email=True,
                    is_creditor=is_creditor,
                )

                random_string = "".join(
                    random.choices(string.ascii_letters + string.digits, k=10)
                )
                otp_link = f"{url_path}/clients/cl-verify-lease/{random_string}T{generated_otp}L{random_string}!{requested_user}B/"
                # send email to company
                subject = "New Lease - credisafe."
                message = f"{registration_message}  "  # + otp_link
                mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
                # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
                # creating a pdf reader object
                # mail.attach('manual.pdf', pdf, 'application/pdf')
                mail.send(fail_silently=False)

    elif (
        request_user_type == "company"
        and otp_type == settings.PAYMENT_RECEIPT
        or otp_type == settings.LEASE_STATUS
    ):
        # Save OTP to the OTP model
        if otp_type == settings.LEASE_STATUS:
            otpFile = OTP(
                otp_code=otp,
                otp_type=otp_type,
                request_user=request_user,
                requested_user=requested_user,
                requested_user_type="company",
            )
            otpFile.save()


            subject = "Payment Status Update - credisafe."
        else:
            subject = "Payment Receipt - credisafe."
            
        add_msg_to_comms_hist(
            user_id=request_user,
            client_id=requested_user,
            message=registration_message,
            is_sms=False,
            is_email=True,
            is_creditor=is_creditor,
        )

        message = registration_message
        mail = EmailMessage(subject, message, EMAIL_HOST_USER, [phone_or_email])
        # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
        # creating a pdf reader object
        # mail.attach('manual.pdf', pdf, 'application/pdf')
        mail.send(fail_silently=False)


def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = "".join(random.choice(characters) for _ in range(length))
    return password


@shared_task
def send_auth_email(username, password, email, firstname):
    subject = "Account Created Successfully !!"
    message = (
        "Hello "
        + firstname
        + "! your CrediSafe account  has been created successfully You can now login at https://credi-safe.com/ .\n"
        + "Username : "
        + username
        + " \n "
        + "Password : "
        + password
    )
    mail = EmailMessage(subject, message, EMAIL_HOST_USER, [email])
    # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
    # # creating a pdf reader object
    # mail.attach('manual.pdf', pdf, 'application/pdf')
    mail.send(fail_silently=False)


@shared_task
def send_credit_check_email(
    otp, email, firstname, otp_type, request_user, requested_user
):
    if otp_type == settings.CREDIT_CHECK:
        otpFile = OTP.objects.create(
            otp_code=otp,
            otp_type=otp_type,
            request_user=request_user,
            requested_user=requested_user,
            requested_user_type="company",
        )
        otpFile.save()
        subject = "Credit Check Confirmation."
        message = (
            "Hello "
            + firstname
            + " Accept Credit Check on CrediSafe? Give OTP below as confirmation."
            + " \n "
            + "OTP code:"
            + otp
        )
        mail = EmailMessage(subject, message, EMAIL_HOST_USER, [email])
        # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
        # # creating a pdf reader object
        # mail.attach('manual.pdf', pdf, 'application/pdf')
        mail.send(fail_silently=False)
    else:
        subject = "New Subscription Update."
        message = otp
        mail = EmailMessage(subject, message, EMAIL_HOST_USER, [email])
        # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
        # # creating a pdf reader object
        # mail.attach('manual.pdf', pdf, 'application/pdf')
        mail.send(fail_silently=False)


def send_password_update_email(username, password, email, firstname):
    subject = "Account Password Updated Successfully !!"
    message = (
        "Hello "
        + firstname
        + " ! your CrediSafe account password  has been updated successfully credi-safe.com  .\n You can now login with  \n"
        + "Username : "
        + username
        + " \n "
        + "Password : "
        + password
    )
    mail = EmailMessage(subject, message, EMAIL_HOST_USER, [email])
    # pdf = open(MEDIA_ROOT + '/manuals/manual.pdf', 'rb').read()
    # # creating a pdf reader object
    # mail.attach('manual.pdf', pdf, 'application/pdf')
    mail.send(fail_silently=False)


def validate_subscriptions(company_id, sub_class):
    subscription = Subcsriptions.objects.filter(
        is_activated=True, subscriber_id=company_id, subscription_class=sub_class
    ).last()
    if subscription:
        active_leases = Lease.objects.filter(
            lease_giver=company_id, is_active=True, subscription=subscription.id
        ).count()
        return int(subscription.number_of_subscriptions) > active_leases
    return False


def generate_user_name(national_id):

    pattern = r"\d{7}"
    match = re.search(pattern, national_id)
    genarated_username = match.group()
    if match:
        while CustomUser.objects.filter(email=genarated_username).exists():
            return match.group()[:5] + str(random.randint(1, 9))
        return genarated_username
    return None


def convert_to_django_date(date_str):
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return date_str
    except ValueError:
        pass
    # Convert the date to the correct format
    formats = ["%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d", "%Y/%m/%d"]
    for fmt in formats:
        try:
            date_obj = datetime.strptime(date_str, fmt)
            return date_obj.strftime("%Y-%m-%d")
        except ValueError:
            pass

    return None


def validate_bulk_email_addresses(value):

    # Check if the email already exists in the database
    email_exists = "false"
    if value:
        user = CustomUser.objects.filter(email=value).first()
        company_email = CompanyProfile.objects.filter(email=value).first()
        if company_email:
            email_exists = "true"
        elif user:
            email_exists = "true"
        else:
            email_regex = r"^[\w]+@[a-zA-Z0-9]+\.[a-zA-Z]+[a-zA-Z]$"
            if not "@" in value:
                email_exists = "invalid"
            else:
                email_exists = "valid"
        return email_exists
    else:
        pass


def get_creditor_helper(data, request, creditors_data):
    searchValue = data["searchValue"].upper()
    first_name = searchValue.split()[0]
    surname  = searchValue.split()[1] if len(searchValue.split()) > 1 else first_name 
    if searchValue[:4].isdigit():
        result = Landlord.objects.filter(
            Q(reg_ID_Number__icontains=searchValue)
        ).first()
    elif surname != first_name:
        result = Landlord.objects.filter(
            landlord_name__icontains=first_name).first()

    creditor_opening_balance = LeaseReceiptBreakdown.objects.filter(landlord_id=result.id)
    # individual_invoice = Invoicing.objects.filter(lease_id=individual_lease.lease_id).last()
    creditors_data = {
        "opening_balance": creditor_opening_balance.last().total_amount if creditor_opening_balance else 0,
        "opening_balance_date": creditor_opening_balance.first().created_at if creditor_opening_balance else None,
        "full_name": f"{result.first().landlord_name}",
        "lease_id": creditor_opening_balance.first().lease_id,
    }
    creditors_data.append(creditors_data)
    return JsonResponse(creditors_data, safe=False)




def get_individual_journals_helper(data, request, individual_data):
    searchValue = data["searchValue"].upper()
    first_name = searchValue.split()[0]
    surname  = searchValue.split()[1] if len(searchValue.split()) > 1 else first_name 
    if searchValue[:4].isdigit():
        result = Individual.objects.filter(
            Q(identification_number__icontains=searchValue)
        ).first()
    elif surname != first_name:
        result = Individual.objects.filter(
            firstname__icontains=first_name,surname__icontains=surname).first()
    else:
        result = Individual.objects.filter(
            Q(firstname__icontains=first_name)
            | Q(surname__icontains=surname)
        ).first()
    individual_lease = Lease.objects.filter(
        reg_ID_Number=result.identification_number,
        is_individual=True,
        is_active=True,
        lease_giver=request.user.company,
    ).last()
    individual_opening_balance = Opening_balance.objects.filter(
        lease_id=individual_lease.lease_id
    )
    # individual_invoice = Invoicing.objects.filter(lease_id=individual_lease.lease_id).last()
    individuls_data = {
        "opening_balance": individual_opening_balance.last().outstanding_balance if individual_opening_balance else 0,
        "opening_balance_date": individual_opening_balance.first().date_created if individual_opening_balance else None,
        "full_name": f"{result.firstname} {result.surname}",
        "lease_id": individual_lease.lease_id,
    }
    individual_data.append(individuls_data)
    return JsonResponse(individual_data, safe=False)


def get_company_journals_helper(data, request, company_data):
    searchValue = data["searchValue"].upper()
    result = Company.objects.filter(
        Q(registration_name__icontains=searchValue)
        | Q(registration_number__icontains=searchValue)
    ).first()
    # if result is None:
    #     return JsonResponse(company_data, safe=False)
    company_lease = Lease.objects.filter(
        reg_ID_Number=result.id,
        is_company=True,
        is_active=True,
        lease_giver=request.user.company,
    ).last()
    company_opening_balance = Opening_balance.objects.filter(
        lease_id=company_lease.lease_id
    )
    # company_invoice = Invoicing.objects.filter(lease_id=company_lease.lease_id).last()
    companies_data = {
        "company_opening_balance": company_opening_balance.last().outstanding_balance if company_opening_balance else 0,
        "company_opening_balance_date": company_opening_balance.first().date_created if company_opening_balance else None,
        "company_name": result.registration_name,
        "lease_id": company_lease.lease_id,
    }
    company_data.append(companies_data)
    return JsonResponse(company_data, safe=False)


@app.task
def run_tasks():
    try:
        send_message()
    except Exception as e:
        pass
    # try:
    #     track_lease_end_date()
    # except Exception as e:
    #     ...
    try:
        track_lease_balances()
    except Exception as e:
        pass


def track_lease_balances():
    leases = Lease.objects.filter(is_active=True, is_government=False).all()
    today = date.today()
    count = 0
    MAX_MESSAGES_PER_SECOND = 90
    if leases:
        for lease in leases:
            lease_id = lease.lease_id
            can_send_message =True
            lease_giver = Company.objects.filter(id=lease.lease_giver).first()
            lease_giver_name = (
                lease_giver.registration_name if lease_giver else "Creditor"
            )
            custom_day = today.replace(day=int(lease.payment_period_end))
            limit_day = today.replace(day=int(lease.payment_period_end) + 1)
            if custom_day < today <= limit_day:
                if opening_balance_object := Opening_balance.objects.filter(
                    lease_id=lease_id
                ).last():
                    current_month = float(opening_balance_object.current_month)
                    one_months_ago = float(opening_balance_object.one_month_back)
                    two_months_ago = float(opening_balance_object.two_months_back)
                    three_months_ago = float(opening_balance_object.three_months_back)
                    four_months_ago = float(opening_balance_object.three_months_plus)
                    outstanding_balance = float(
                        opening_balance_object.outstanding_balance
                    )
                    if (
                        lease.status == lease.status_cache
                        and float(opening_balance_object.outstanding_balance) > 0
                    ):
                        try:
                            opening_balance_object.three_months_plus = (    
                                four_months_ago + three_months_ago
                            )
                            opening_balance_object.three_months_back = two_months_ago
                            opening_balance_object.two_months_back = one_months_ago
                            opening_balance_object.one_month_back = current_month
                            opening_balance_object.current_month = 0
                            opening_balance_object.outstanding_balance = (
                                outstanding_balance
                            )
                            opening_balance_object.save()

                            if float(opening_balance_object.three_months_plus) > 0:
                                lease.status = "NON-PAYER"
                            elif float(opening_balance_object.three_months_back) > 0:
                                lease.status = "HIGH-HIGH"
                            elif float(opening_balance_object.two_months_back) > 0:
                                lease.status = "HIGH"
                            elif float(opening_balance_object.one_month_back) > 0:
                                lease.status = "MEDIUM"
                            lease.save()
                        except Exception as e:
                            pass
                    lease.status = lease.status_cache
                    lease.save()

                    if lease.is_company:
                        requested_user_ob = "company"
                        lease_receiver = Company.objects.filter(
                            id=lease.reg_ID_Number
                        ).first()
                        lease_receiver_name = (
                            lease_receiver.trading_name
                            if lease_receiver
                            else "Creditor"
                        )
                        if lease_receiver:
                            company_email = CompanyProfile.objects.filter(
                                company=lease_receiver.id
                            ).first()
                            contact_detail = company_email.email
                        else:
                            contact_detail = "gtkandeya@gmail.com"
                    else:
                        requested_user_ob = "individual"
                        lease_receiver = Individual.objects.filter(
                            identification_number=lease.reg_ID_Number
                        ).first()
                        lease_receiver_name = (
                            lease_receiver.firstname + " " + lease_receiver.surname
                            if lease_receiver
                            else "Creditor"
                        )
                        contact_detail = lease_receiver.mobile if lease_receiver else None
                    if float(opening_balance_object.outstanding_balance) > 0:
                        left_balance = round(float(opening_balance_object.outstanding_balance), 2)
                    else:
                        left_balance = 0

                    if lease.status == "NON-PAYER":
                        registration_message = f" Hi {lease_receiver_name },Your Payment status to {lease_giver_name} has downgraded to NON-PAYER. Please pay your balance of {lease.currency} {left_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                    elif lease.status in ["HIGH", "HIGH-HIGH"]:
                        registration_message = f"Hi {lease_receiver_name}, Your Payment status to {lease_giver_name} has downgraded to HIGH RISK. Please pay your balance of {lease.currency} {left_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                    elif lease.status == "MEDIUM":
                        registration_message = f"Hi {lease_receiver_name}, Your Payment status to {lease_giver_name} has downgraded to MEDIUM RISK. Please pay your balance of {lease.currency} {left_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                    else:
                        registration_message = None
                    if float(opening_balance_object.outstanding_balance) <= 0:
                        registration_message = None
                    otp_object = OTP.objects.filter(otp_code=lease_id).last()
                    if not otp_object or otp_object.created_at.strftime(
                        "%B"
                    ) != today.strftime("%B"):
                        try:
                            can_send_message_ob = CustomUser.objects.filter(company=lease.lease_giver,can_send_email=False).first()
                        except Exception as e:
                            ...
                        can_send_message = False if can_send_message_ob else True
                        if registration_message and  can_send_message:
                            count += 1
                            if count % MAX_MESSAGES_PER_SECOND == 0:
                                time.sleep(1)
                            send_otp.delay(
                                "",
                                lease_id,
                                contact_detail,
                                lease.lease_giver,
                                lease.reg_ID_Number,
                                requested_user_ob,
                                settings.LEASE_STATUS,
                                registration_message,
                            )
                            if requested_user_ob == "company" and lease.status_cache not in ["SAFE", "MEDIUM"]:
                                if rent_guarantor_mobile := Individual.objects.filter(
                                    identification_number=lease.rent_guarantor_id
                                ).first():
                                    send_otp.delay(
                                        "",
                                        lease_id,
                                        rent_guarantor_mobile.mobile,
                                        lease.lease_giver,
                                        lease.reg_ID_Number,
                                        "individual",
                                        settings.LEASE_STATUS,
                                        registration_message,
                                    )
                        else:
                            ...
                


def send_message():
    reminders = CommunicationHistoryReminder.objects.filter(
        Q(is_sms=True) | Q(is_email=True) & Q(message_sent=False)
    )
    current_date = datetime.now().date()

    for reminder in reminders:
        if reminder.action_date == current_date:
            client_id = None
            contact_detail = None

            if reminder.is_sms:
                individual = Individual.objects.filter(id=reminder.client_id).first()
                client_id = individual.id if individual else None
                contact_detail = individual.mobile if individual else None

            elif reminder.is_email:
                company = Company.objects.filter(id=reminder.client_id).first()
                client_id = company.id if company else None

                if company:
                    company_profile = CompanyProfile.objects.filter(
                        company=company.id
                    ).first()
                    contact_detail = company_profile.email if company_profile else None

            send_otp.delay(
                request_path="",
                generated_otp="",
                phone_or_email=contact_detail,
                request_user=reminder.user_id,
                requested_user=client_id,
                request_user_type="individual" if reminder.is_sms else "company",
                otp_type=settings.LEASE_STATUS,
                registration_message=reminder.message,
            )

            # update reminder status
            reminder.message_sent = True
            reminder.save()


def track_lease_end_date():
    threshold_60_days = timezone.now().date() + timedelta(days=60)
    threshold_30_days = timezone.now().date() + timedelta(days=30)
    all_leases = Lease.objects.filter(is_active=True, is_government=False)

    for lease in all_leases:
        end_date = lease.end_date
       
        if (end_date == threshold_60_days or end_date == threshold_30_days) or (end_date == timezone.now().date()):
            if lease.is_company:
                lease_receiver = Company.objects.filter(id=lease.reg_ID_Number).first()
                lease_receiver_name = lease_receiver.trading_name if lease_receiver else None
                if lease.rent_guarantor_id:
                    rent_guarantor = Individual.objects.filter(
                        identification_number=lease.rent_guarantor_id
                    ).first()
                    contact_detail = rent_guarantor.mobile if rent_guarantor else None
                else:
                    contact_detail = None
            else:
                lease_receiver = Individual.objects.filter(
                    identification_number=lease.reg_ID_Number
                ).first()
                lease_receiver_name = (
                    lease_receiver.firstname + " " + lease_receiver.surname
                    if lease_receiver
                    else None
                )
                contact_detail = lease_receiver.mobile if lease_receiver else None

            if lease_receiver_name and contact_detail:
                if end_date == timezone.now().date():
                    registration_message = f"The Lease for {lease_receiver_name}, is ending today. Please renew if you have not done so."
                else:
                    registration_message = f"The  Lease for {lease_receiver_name}, is ending on {lease.end_date}.Please ensure you renew\nIf you already done so please ignore this message ."

                send_otp.delay(
                    "",
                    lease.lease_id,
                    contact_detail,
                    1,
                    lease_receiver.id,
                    "individual",
                    settings.LEASE_STATUS,
                    registration_message,
                )

def add_msg_to_comms_hist(
    user_id: str,
    client_id: str,
    message: str,
    is_sms: bool,
    is_email: bool,
    is_creditor: bool,
):
    new_message = CommsHistMessage(
        user_id=user_id,
        client_id=client_id,
        message=message,
        is_sms=is_sms,
        is_email=is_email,
        is_creditor =True if is_creditor else False
    )

    new_message.save()
