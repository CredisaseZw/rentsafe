import json
from datetime import date, datetime

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from marshmallow import ValidationError
from django.core.exceptions import ObjectDoesNotExist
import ast
from authentication.models import CustomUser
from rentsafe.helper import send_otp
from rentsafe.models import *
from rentsafe.serializers import *


def human_readable_date(date: str) -> str:
    """
    Convert date string to human readable date format e.g. "2021-10-01" -> "October 01, 2021"
    """
    return date.strftime("%B %d, %Y")


@login_required
@require_http_methods(["GET"])
def get_client_details(request):
    # TODO: return aged analysis
    user_id = request.user.company
    reminder_type,user_name = None,None
    works_data,maintenance_data = None,None
    lease_id: str = request.GET.get("lease_id", None)
    opening_balance_record = Opening_balance.objects.filter(lease_id=lease_id).last()
    request_user_company = CompanyProfile.objects.filter(company=request.user.company).first()
    request_user_company_email = request_user_company.email if request_user_company else "admin"
    # get current date
    current_date = date.today()
    # initialize response_dict
    response_dict = {
        "aged_analysis": {
            "current": round(float(opening_balance_record.current_month), 2) if opening_balance_record else 0,
            "30_days": round(float(opening_balance_record.one_month_back), 2) if opening_balance_record else 0,
            "60_days": round(float(opening_balance_record.two_months_back), 2) if opening_balance_record else 0,
            "90_days": round(float(opening_balance_record.three_months_back), 2) if opening_balance_record else 0,
            "120_days_plus": round(float(opening_balance_record.three_months_plus), 2) if opening_balance_record else 0,
        },
        "debtor_intelligence": {},
        "communication_history": [],
        "forecast_inflows": {
            "0-7": 0,
            "8-14": 0,
            "14-21": 0,
            "21+": 0,
            "total": 0,
        },
        "payment_plans": [],
    }
    # get query params from request

    # get client
    lease = Lease.objects.filter(lease_id=lease_id).first()
    client = None
    client_address,name,surname,mobile,other_phone,email, = "","","","",[],""
    if lease:
        if lease.is_individual:
            client = Individual.objects.filter(
                identification_number=lease.reg_ID_Number.upper()
            ).first()

        elif lease.is_company:
            client = Company.objects.filter(id=lease.reg_ID_Number).first()

    if not client:
        return JsonResponse({"error": "Client not found"}, status=404)
    if contact_person := ContactPerson.objects.filter(
        lease_id=lease.lease_id
    ).first():
        name = contact_person.first_name
        surname = contact_person.surname
        client_address = contact_person.address 
        mobile = contact_person.phone
        email = contact_person.email
        other_phone_raw = contact_person.other_phone
        if isinstance(other_phone_raw, str):
            try:
                other_phone = ast.literal_eval(other_phone_raw)
            except (ValueError, SyntaxError):
                other_phone = []
        else:
            other_phone = other_phone_raw

    # if individual address is diff from lease address use lease address

    # add client details to response_dict
    response_dict["client"] = {
        "firstname": name,
        "surname": surname,
        "sms_number": mobile,
        "other_numbers":other_phone,
        "email": email,
        "address": client_address,
    }
    # print('resssssssss',response_dict,'other_phone',other_phone,'type',type(other_phone))
    # add payment plans to response_dict

    payment_plans = PaymentPlan.objects.filter(
        user_id=user_id,
        client_id=client.id,
    )
    if payment_plans:
        for payment_plan in payment_plans:
            if payment_plan.expected_pay_date < current_date:
                continue
            
            response_dict["payment_plans"].append(
                {
                    "id": payment_plan.id,
                    "spoke_with": payment_plan.spoke_with,
                    "expected_pay_date": payment_plan.expected_pay_date,
                    "amount":payment_plan.amount,
                    "is_creditor": payment_plan.is_creditor,
                }
            )

        # add payment plans to communication history in response_dict
        if payment_plans:
            for payment_plan in payment_plans:
                try:
                    if user_name_ob:= CustomUser.objects.filter(id=payment_plan.user).first():
                        user_name= Individual.objects.filter(id=user_name_ob.individual).first()
                except Exception as e:
                    ...
                response_dict["communication_history"].append(
                    {
                        "type": "PAYMENT_PLAN",
                        "user_name": user_name.firstname +"" + user_name.surname if user_name  else request_user_company_email,
                        "message": f"{payment_plan.spoke_with} promised to pay {lease.currency} {payment_plan.amount} on {human_readable_date(payment_plan.expected_pay_date)}",
                        "created_at": payment_plan.created_at,
                        "is_creditor": payment_plan.is_creditor,
                    }
                )

    # add communication history reminders to response_dict
    communication_history_reminders = CommunicationHistoryReminder.objects.filter(
        user_id=user_id,
        client_id=lease.reg_ID_Number if lease.is_company else client.id,
    )

    for reminder in communication_history_reminders:
        reminder_type = None
        if '#' in reminder.message:
            continue
        if reminder.is_sms:
            reminder_type = CommunicationHistoryReminderType.SMS.value
        elif reminder.is_email:
            reminder_type = CommunicationHistoryReminderType.EMAIL.value
        else:
            reminder_type = "NOTE"
        try:
            if user_name_ob:= CustomUser.objects.filter(id=reminder.user).first():
                user_name= Individual.objects.filter(id=user_name_ob.individual).first()
                
        except Exception as e:
            ...
        response_dict["communication_history"].append(
            {
                "type": reminder_type,
                "user_name": user_name.firstname +" " + user_name.surname if user_name and reminder.user else request_user_company_email,
                "action_done": reminder.action_date,
                "message": reminder.message,
                "created_at": reminder.created_at,
                "is_creditor": reminder.is_creditor,
            }
        )

    # add messages sent to comms hist response_dict
    comms_hist_messages = CommsHistMessage.objects.filter(
        user_id=user_id,
        client_id=lease.reg_ID_Number,
        is_creditor=False,
    )

    for message in comms_hist_messages:
        if 'Work schedule' in message.message:
            continue
            reminder_type = 'Works'
        elif 'Maintenance' in message.message:
            continue
            reminder_type = 'Maintenance'
           
        try:
            if user_name_ob:= CustomUser.objects.filter(id=message.user).first():
                user_name= Individual.objects.filter(id=user_name_ob.individual).first()
        except Exception as e:
            ...
        response_dict["communication_history"].append(
            {
                "type": f"auto-{reminder_type}",
                "user_name": user_name.firstname +" " + user_name.surname if user_name and message.user else request_user_company_email,
                "message": message.message,
                "created_at": message.created_at,
                "is_creditor": message.is_creditor,
            }
        )

    # sort communication history by created_at
    response_dict["communication_history"] = sorted(
        response_dict["communication_history"], key=lambda x: x["created_at"]
    )
    # add debtor intelligence note to response_dict
    debtor_intelligence_note = DebtorIntelligenceNote.objects.filter(
        user_id=user_id,
        client_id=lease.reg_ID_Number if lease.is_company else client.id,
    ).first()

    if debtor_intelligence_note is not None:
        try:
            if user_name_ob:= CustomUser.objects.filter(id=debtor_intelligence_note.user).first():
                user_name= Individual.objects.filter(id=user_name_ob.individual).first()
        except Exception as e:
            ...
        response_dict["debtor_intelligence"] = {
            "note": debtor_intelligence_note.note,
            "updated_at": debtor_intelligence_note.updated_at,
            "user_name":user_name.firstname +" " + user_name.surname if user_name and debtor_intelligence_note.user  else request_user_company_email,
        }

    # add forecast inflows to response_dict
    for payment_plan in payment_plans:
        if payment_plan.expected_pay_date < current_date:
            continue

        days_diff = (payment_plan.expected_pay_date - current_date).days

        if days_diff <= 7:
            response_dict["forecast_inflows"]["0-7"] += payment_plan.amount
        elif days_diff >= 8 and days_diff <= 14:
            response_dict["forecast_inflows"]["8-14"] += payment_plan.amount
        elif days_diff >= 15 and days_diff <= 21:
            response_dict["forecast_inflows"]["14-21"] += payment_plan.amount
        elif days_diff >= 22:
            response_dict["forecast_inflows"]["21+"] += payment_plan.amount

        response_dict["forecast_inflows"]["total"] += payment_plan.amount

    # add aged analysis to response_dict
    # refer to color coding in the UI
    company_works_schedules = WorkSchedule.objects.filter(company_id=request.user.company,lease_id=lease_id).values()
    works_data = [works for works in company_works_schedules]
    company_maintenance_schedules = MaintenanceSchedule.objects.filter(company_id=request.user.company,lease_id=lease_id).values()
    maintenance_data = [maintenance for maintenance in company_maintenance_schedules]
    response_dict['works_data'] = works_data
    response_dict['maintenance_data'] = maintenance_data
    
    return JsonResponse(response_dict, safe=False)

def get_creditor_details(request):
    user_id = request.user.id
    creditor_id: str = request.GET.get("creditor_id", None)
    landlord_record = Landlord.objects.filter(landlord_id=creditor_id).last()
    request_user_company = CompanyProfile.objects.filter(company=request.user.company).first()
    request_user_company_email = request_user_company.email if request_user_company else "admin"
    # get current date
    current_date = date.today()
    total_balance = 0
    if landlord_record:
        total_balance_ob = LeaseReceiptBreakdown.objects.filter(landlord_id=creditor_id).last()
        balance_to_add = float(total_balance_ob.total_amount) if total_balance_ob else 0
        total_balance = balance_to_add  + float(landlord_record.opening_balance)
    # initialize response_dict
    response_dict = {
        "aged_analysis": {
            "current": round(total_balance, 2) or 0,
            "30_days": 0,
            "60_days": 0,
            "90_days": 0,
            "120_days_plus":  0,
        },
        "debtor_intelligence": {},
        "communication_history": [],
        "forecast_inflows": {
            "0-7": 0,
            "8-14": 0,
            "14-21": 0,
            "21+": 0,
            "total": 0,
        },
        "payment_plans": [],
    }
    # get query params from request

    # get client
    creditor_ob = None
    creditor_address = ""
    if landlord_record:
        if landlord_record.is_individual:
            creditor_ob = Individual.objects.filter(
                identification_number=landlord_record.reg_ID_Number.upper()
            ).first()
            name = creditor_ob.firstname
            surname = creditor_ob.surname
            creditor_address = creditor_ob.address 
            mobile = creditor_ob.mobile
            email = creditor_ob.email

        elif landlord_record.is_company:
            creditor_ob = Company.objects.filter(id=landlord_record.reg_ID_Number).first()
            name = creditor_ob.registration_name
            surname = ""
            email = mobile = ""
            if creditor_ob:
                creditor_details = CompanyProfile.objects.filter(
                    company=creditor_ob.id
                ).first()
            creditor_address = creditor_details.current_address if creditor_details else ""
            email = creditor_details.email if creditor_details else ""
            mobile = creditor_details.landline_phone if creditor_details else ""

    if not creditor_ob:
        return JsonResponse({"error": "Creditor not found"}, status=404)

    # if individual address is diff from lease address use lease address

    # add client details to response_dict
    response_dict["creditor"] = {
        "firstname": name,
        "surname": surname,
        "sms_number": '',
        "other_number":mobile,
        "email": email,
        "address": creditor_address,
    }

    # add payment plans to response_dict

    payment_plans = PaymentPlan.objects.filter(
        client_id=creditor_id,
        is_creditor=True,
    )
    if payment_plans:
        for payment_plan in payment_plans:
            if payment_plan.expected_pay_date < current_date:
                continue
            
            response_dict["payment_plans"].append(
                {
                    "id": payment_plan.id,
                    "spoke_with": payment_plan.spoke_with,
                    "expected_pay_date": payment_plan.expected_pay_date,
                    "amount": payment_plan.amount,
                    "is_creditor": payment_plan.is_creditor,
                }
            )

        # add payment plans to communication history in response_dict
        for payment_plan in payment_plans:
            response_dict["communication_history"].append(
                {
                    "type": "PAYMENT_PLAN",
                    "user_name": payment_plan.user if payment_plan.user else request_user_company_email,
                    "message": f"{payment_plan.spoke_with} promised to pay USD {payment_plan.amount} on {human_readable_date(payment_plan.expected_pay_date)}",
                    "created_at": payment_plan.created_at,
                    "is_creditor": payment_plan.is_creditor,
                }
            )

    # add communication history reminders to response_dict
    communication_history_reminders = CommunicationHistoryReminder.objects.filter(
        client_id=creditor_id,
        is_creditor=True,
    )

    for reminder in communication_history_reminders:
        reminder_type = None

        if reminder.is_sms:
            reminder_type = CommunicationHistoryReminderType.SMS.value
        elif reminder.is_email:
            reminder_type = CommunicationHistoryReminderType.EMAIL.value
        else:
            reminder_type = "NOTE"

        response_dict["communication_history"].append(
            {
                "type": reminder_type,
                "user_name":reminder.user if reminder.user else request_user_company_email,
                "action_done": reminder.action_date,
                "message": reminder.message,
                "created_at": reminder.created_at,
                "is_creditor": reminder.is_creditor,
            }
        )

    # add messages sent to comms hist response_dict
    comms_hist_messages = CommsHistMessage.objects.filter(
        client_id=creditor_id,
        is_creditor=True,
    )

    for message in comms_hist_messages:
        reminder_type = None

        response_dict["communication_history"].append(
            {
                "type": f"auto-{reminder_type}",
                "user_name":message.user if message.user else request_user_company_email,
                "message": message.message,
                "created_at": message.created_at,
                "is_creditor": message.is_creditor,
            }
        )

    # sort communication history by created_at
    response_dict["communication_history"] = sorted(
        response_dict["communication_history"], key=lambda x: x["created_at"]
    )
    # add debtor intelligence note to response_dict
    debtor_intelligence_note = DebtorIntelligenceNote.objects.filter(
        client_id=creditor_id,
    ).first()

    if debtor_intelligence_note is not None:
        response_dict["debtor_intelligence"] = {
            "note": debtor_intelligence_note.note,
            "updated_at": debtor_intelligence_note.updated_at,
            "user_name": debtor_intelligence_note.user if debtor_intelligence_note.user else request_user_company_email,
        }

    # add forecast inflows to response_dict
    for payment_plan in payment_plans:
        if payment_plan.expected_pay_date < current_date:
            continue

        days_diff = (payment_plan.expected_pay_date - current_date).days

        if days_diff <= 7:
            response_dict["forecast_inflows"]["0-7"] += payment_plan.amount
        elif days_diff >= 8 and days_diff <= 14:
            response_dict["forecast_inflows"]["8-14"] += payment_plan.amount
        elif days_diff >= 15 and days_diff <= 21:
            response_dict["forecast_inflows"]["14-21"] += payment_plan.amount
        elif days_diff >= 22:
            response_dict["forecast_inflows"]["21+"] += payment_plan.amount

        response_dict["forecast_inflows"]["total"] += payment_plan.amount

    # add aged analysis to response_dict
    # refer to color coding in the UI

    return JsonResponse(response_dict, safe=False)

@login_required
@require_http_methods(["POST"])
def post_communication_history(request):
    user_id = request.user.id
    user_id = user_id if int(request.user.individual)  != 0 else 0
    company_id = request.user.company
    user_name = None
    # validate data
    try:
        schema = CreateCommunicationHistoryReminderSchema()
        data = schema.loads(request.body)
    except ValidationError as e:
        props = {"errors": e.messages}

        return JsonResponse(props, status=400, safe=False)

    # get data from request
    data = json.loads(request.body.decode("utf-8"))
    client_id =data.get("client_id", data.get("creditor_id", None))
    # create and save communication history reminder
    new_communication_history = CommunicationHistoryReminder(
        user_id=company_id,
        user=user_id,
        client_id=client_id,
        message=data.get("message", None) + "#REMINDER" if data.get("reminder_type") == "REMINDER" else data.get("message", None),
        action_date=data.get("action_date", None),
        is_sms=CommunicationHistoryReminderType.SMS == data.get("reminder_type"),
        is_email=CommunicationHistoryReminderType.EMAIL == data.get("reminder_type"),
        is_creditor= True if data.get("creditor_id") else False,
    )
    new_communication_history.save()

    if str(new_communication_history.action_date) == str(date.today()) and not data.get("reminder_type") in ["NOTE","REMINDER"]:
        message = new_communication_history.message
        phone_or_email = None
        individual = Individual.objects.filter(id=client_id).first()
        if individual:
            phone_or_email = individual.mobile
            request_user_type = "individual"
        company = Company.objects.filter(id=client_id).first()
        if company:
            company_profile = CompanyProfile.objects.filter(company=company.id).first()
            phone_or_email = company_profile.email if company_profile else None
            request_user_type = "company"
        if phone_or_email:
            send_otp.delay(
                "",
                "",
                phone_or_email,
                company_id,
                client_id,
                request_user_type,
                settings.LEASE_STATUS,
                message,
            )
            new_communication_history.message_sent = True
            new_communication_history.save()
    else:
        ...

    # get communication history reminder type
    reminder_type = None

    if new_communication_history.is_sms:
        reminder_type = CommunicationHistoryReminderType.SMS
    elif new_communication_history.is_email:
        reminder_type = CommunicationHistoryReminderType.EMAIL
    elif new_communication_history.message.endswith("#REMINDER"):
        reminder_type = CommunicationHistoryReminderType.REMINDER
    else:
        reminder_type = CommunicationHistoryReminderType.NOTE
    try:
        if user_name_ob:= CustomUser.objects.filter(id=new_communication_history.user).first():
            user_name= Individual.objects.filter(id=user_name_ob.individual).first()
    except Exception as e:
        ...
    return JsonResponse(
        {
            "reminder_type": reminder_type,
            "user_name": user_name.firstname +" " + user_name.surname if user_name else 'admin',
            "action_done": new_communication_history.action_date,
            "message": new_communication_history.message,
            "created_at": new_communication_history.created_at,
        },
        safe=False,
        status=201,
    )
    

@login_required
@require_http_methods(["POST"])
def post_payment_plans(request):
    user_id = request.user.id
    user_id = user_id if int(request.user.individual)  != 0 else 0
    company_id = request.user.company

    # validate data
    try:
        schema = CreatePaymentPlansSchema()
        data = schema.loads(request.body)
    except ValidationError as e:
        props = {"errors": e.messages}

        return JsonResponse(props, status=400, safe=False)

    # get data from request
    data = json.loads(request.body.decode("utf-8"))

    # intialize response_dict
    response_dict = {
        "plans": [],
    }

    # create and save payment plans
    for plan in data.get("plans", []):
        client_id=plan.get("client_id", plan.get("creditor_id", None))
        is_creditor = True if plan.get("creditor_id") else False
        new_plan = PaymentPlan(
            lease_id=plan.get("lease_id", None),
            client_id=client_id,
            user=user_id,
            user_id=company_id,
            spoke_with=plan.get("spoke_with", None),
            expected_pay_date=plan.get("expected_pay_date", None),
            amount=plan.get("amount", None),
            is_creditor=is_creditor,
        )
        new_plan.save()
        if isinstance(new_plan.expected_pay_date, str):
            new_plan.expected_pay_date = datetime.strptime(
                new_plan.expected_pay_date, "%Y-%m-%d"
            )
        individual = Individual.objects.filter(id=client_id).first()
        # message = f"{new_plan.spoke_with} promised to pay USD {new_plan.amount} on {new_plan.expected_pay_date.strftime('%d %B %Y')}"
        message = 'You have agreed on a payment plan to pay a total of $400'
        phone_or_email = None
        if individual:
            phone_or_email = individual.mobile
            request_user_type = "individual"
        company = Company.objects.filter(id=client_id).first()
        if company:
            company_profile = CompanyProfile.objects.filter(company=company.id).first()
            phone_or_email = company_profile.email if company_profile else None
            request_user_type = "company"
        if phone_or_email:
            ...
            # send_otp.delay(
            #     "",
            #     "",
            #     phone_or_email,
            #     company_id,
            #     client_id,
            #     request_user_type,
            #     settings.LEASE_STATUS,
            #     message,
            # )

        response_dict["plans"].append(
            {
                "id": new_plan.id,
                "spoke_with": new_plan.spoke_with,
                "expected_pay_date": new_plan.expected_pay_date,
                "amount": new_plan.amount,
            }
        )

    return JsonResponse(response_dict, safe=False, status=201)

@login_required
@require_http_methods(["PUT"])
def update_debtor_intelligence(request):
    company_id = request.user.company
    user_id = request.user.id
    user_id = user_id if int(request.user.individual)  != 0 else 0

    # validate data
    try:
        schema = UpdateDebtorIntelSchema()
        data = schema.loads(request.body)
    except ValidationError as e:
        props = {"errors": e.messages}

        return JsonResponse(props, status=400, safe=False)

    # get data from request
    data = json.loads(request.body.decode("utf-8"))
    client_id =data.get("client_id", data.get("creditor_id", None))
    # get debtor intelligence note
    debtor_intelligence_note = DebtorIntelligenceNote.objects.filter(
        user_id=company_id, client_id=client_id
    ).first()

    # create debtor intelligence note if it does not exist
    if debtor_intelligence_note is None:
        debtor_intelligence_note = DebtorIntelligenceNote(
            user_id=company_id,
            user = user_id,
            client_id=client_id,
            note=data.get("note"),
        )
        debtor_intelligence_note.save()

    # update debtor intelligence note
    else:
        debtor_intelligence_note.note = data.get("note")
        debtor_intelligence_note.user_id = company_id
        debtor_intelligence_note.save()

    return JsonResponse(
        {
            "note": debtor_intelligence_note.note,
            "updated_at": debtor_intelligence_note.updated_at,
            "user_name": debtor_intelligence_note.user,
        },
        safe=False,
        status=200,
    )

@login_required
@require_http_methods(["PUT"])
def update_client_contact_details(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        client_id = data.get("client_id")

        if not client_id:
            return JsonResponse({"error": "client_id is required"}, status=400)

        def clean_field(value):
            # Ensure we only strip strings, leave other types unchanged
            return value.strip() if isinstance(value, str) else value

        # Retrieve or create a new contact person
        contact_person, created = ContactPerson.objects.get_or_create(
            client_id=client_id,
            defaults={
                "first_name": clean_field(data.get("firstname", "")),
                "surname": clean_field(data.get("surname", "")),
                "email": clean_field(data.get("email_address", "")),
                "address": clean_field(data.get("address", "")),
                "identification_number": clean_field(data.get("identification_number", "")),
                "lease_id": clean_field(data.get("lease_id", "")),
                "phone": clean_field(data.get("sms_number", "")),
                "other_phone": clean_field(data.get("other_numbers", "")),
            }
        )

        # Update fields if the contact person already exists
        if not created:
            fields_to_update = {
                "first_name": clean_field(data.get("firstname")),
                "surname": clean_field(data.get("surname")),
                "email": clean_field(data.get("email_address")),
                "address": clean_field(data.get("address")),
                "phone": clean_field(data.get("sms_number")),
                "other_phone": clean_field(data.get("other_numbers")),
            }

            for field, value in fields_to_update.items():
                setattr(contact_person, field, value)

            contact_person.save()

        # Build response data
        response_data = {
            "firstname": contact_person.first_name,
            "surname": contact_person.surname,
            "email_address": contact_person.email,
            "address": contact_person.address,
            "identification_number": contact_person.identification_number,
            "sms_number": contact_person.phone,
            "other_numbers": contact_person.other_phone,
        }

        return JsonResponse(response_data, safe=False, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
    except Exception as e:
        # Log the exception (optional)
        print(f"Error updating contact details: {e}")
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)


