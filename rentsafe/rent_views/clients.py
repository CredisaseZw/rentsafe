# pylint: disable=unused-wildcard-import, wildcard-import, wrong-import-order, ungrouped-imports
import calendar
import contextlib
import csv
import io
import json
import os
from datetime import date, datetime, timedelta

from dateutil.relativedelta import relativedelta
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.db.models import Q, CharField
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from inertia import render
from inertia.share import share
from marshmallow import ValidationError

from accounting.models import CurrencyRate
from rentsafe.decorators import clients_required
from rentsafe.helper import *
from rentsafe.models import *
from rentsafe.rent_views.company import generate_otp
from rentsafe.serializers import *
from django.db.models.functions import Cast

# Create your views here. views
@login_required
@clients_required
def clients_home(request):
    props = clients_credit_dashboard(request.user.company)
    return render(request, "Client/Dashboard", props or {})


def clients_credit_dashboard(id):
    client_id = int(id)
    client_credits_taken = Lease.objects.filter(reg_ID_Number=client_id, is_active=True)
    client_credits_given = Lease.objects.filter(lease_giver=client_id, is_active=True)
    taken_credits_color = []
    given_credits_color = []
    client_taken_credits = []
    client_given_credits = []
    given_credits_color_totals = {}
    taken_credits_color_totals = {}

    rate_ = 1
    if rate_obj := CurrencyRate.objects.filter(user__company = client_id).first():
        rate_ = float(rate_obj.current_rate)
    def get_credit_color(credit_status):
        """Maps credit status to a color."""
        color_mapping = {
            "NON-PAYER": "non-payer",
            "HIGH-HIGH": "high",
            "HIGH": "medium",
            "MEDIUM": "low",
            "SAFE": "safe",
        }
        return color_mapping.get(credit_status, "safe")

    if client_credits_taken or client_credits_given:
        if client_credits_given:
            total_sum =0
            color ="safe"
            for credit in client_credits_given:
                if total_sum_ob := LeaseReceiptBreakdown.objects.filter(lease_id=credit.lease_id).last():
                    total_sum += float(total_sum_ob.total_amount)
            client_credits = {
            "credit_id": 1,
            "amount_owing": total_sum if credit.currency.lower() == "usd" else round((total_sum / rate_),2),
            "color": color,
            }
            client_taken_credits.append(client_credits)
            if color in taken_credits_color_totals:
                taken_credits_color_totals[color] += float(
                    client_credits["amount_owing"]
                )
            else:
                taken_credits_color_totals[color] = float(
                    client_credits["amount_owing"]
                )

        for credit in client_credits_taken:
            opening_balance_record = Opening_balance.objects.filter(
                lease_id=credit.lease_id
            ).last()
            color = get_credit_color(credit.status_cache)

            existing_credit = next(
                (c for c in client_taken_credits if c["credit_id"] == credit.lease_id),
                None,
            )
            if existing_credit:
                existing_credit["amount_owing"] += (
                    float(opening_balance_record.outstanding_balance)
                    if opening_balance_record
                    else 0
                )
            else:
                amount_owing_ =float(opening_balance_record.outstanding_balance) if opening_balance_record else 0
                client_credits = {
                    "credit_id": credit.lease_id,
                    "amount_owing": amount_owing_ if credit.currency.lower() == "usd" else round((amount_owing_ / rate_),2),
                    "color": color,
                }
                client_taken_credits.append(client_credits)

            if color in taken_credits_color_totals:
                taken_credits_color_totals[color] += float(
                    client_credits["amount_owing"]
                )
            else:
                taken_credits_color_totals[color] = float(
                    client_credits["amount_owing"]
                )

    if client_credits_given:
        for credit in client_credits_given:
            # GOVERNMENT LEASES BLOCK
            if credit.is_government:
                ...
            else:
                opening_balance_record = Opening_balance.objects.filter(
                    lease_id=credit.lease_id
                ).last()
                color = get_credit_color(credit.status_cache)

                existing_credit = next(
                    (
                        c
                        for c in client_given_credits
                        if c["credit_id"] == credit.lease_id
                    ),
                    None,
                )
                if existing_credit:
                    existing_credit["amount_owing"] += (
                        float(opening_balance_record.outstanding_balance) *-1
                        if opening_balance_record
                        else 0
                    )
                else:
                    rate = 1
                    if rate_ob := CurrencyRate.objects.filter(user__company = client_id).first():
                        rate = float(rate_ob.current_rate)
                    amount_owing =float(opening_balance_record.outstanding_balance) if opening_balance_record else 0
                    client_credits = {
                        "credit_id": credit.lease_id,
                        "amount_owing": amount_owing if credit.currency.lower() == "usd" else round((amount_owing / rate),2),
                        "color": color,
                    }
                    client_given_credits.append(client_credits)

                if color in given_credits_color_totals:
                    given_credits_color_totals[color] += float(
                        client_credits["amount_owing"]
                    )
                else:
                    given_credits_color_totals[color] = float(
                        client_credits["amount_owing"]
                    )

    taken_credits_color = [
        {"status": color, "amount_owing": float(total)}
        for color, total in taken_credits_color_totals.items()
    ]
    given_credits_color = [
        {"status": color, "amount_owing": float(total)}
        for color, total in given_credits_color_totals.items()
    ]

    worst_credit_status = check_worst_credit_status(client_id)
    return {
        "client_credits_taken": taken_credits_color,
        "client_credits_given": given_credits_color,
        "worst_credit_status": worst_credit_status,
    }

def check_worst_credit_status(company_id):
    leases_taken = Lease.objects.filter(reg_ID_Number=company_id, is_government=False)
    color, score, score_level = "green", 420, "LLR"
    if not leases_taken:
        return {"color": color, "score_range": score, "score_level": score_level}
    taken_credits_ratings = []
    return worst_credit_check_helper(leases_taken, taken_credits_ratings)

def worst_credit_check_helper(leases_taken, taken_credits_ratings):
    for lease in leases_taken:
        lease_last_payment_history = Opening_balance.objects.filter(
            lease_id=lease.lease_id
        ).last()
        lease_status = lease.status_cache
        lease_giver = (
            Company.objects.filter(id=lease.lease_giver).first().registration_name
        )
        currency_type = lease.currency
        lease_giver_name = lease_giver or "N/A"
        payment_date = (
            lease_last_payment_history.date_updated.date()
            if lease_last_payment_history
            else datetime.now().date()
        )
        taken_credits_ratings.append(
            (
                lease_status,
                float(lease_last_payment_history.outstanding_balance if lease_last_payment_history else 0),
                lease_giver_name,
                payment_date,
                currency_type,
            )
        )

    lease_status_order = ["NON-PAYER", "HIGH-HIGH", "HIGH", "MEDIUM", "SAFE"]
    taken_credits_ratings.sort(key=lambda x: (lease_status_order.index(x[0]), -x[1]))
    sorted_balances = [
        (balance, lease_giver_name, payment_date, lease_status, currency_type)
        for lease_status, balance, lease_giver_name, payment_date, currency_type in taken_credits_ratings
    ]
    tuple_data = sorted_balances[0] if sorted_balances else None
    lease_worst_status = tuple_data[3]

    color, score, level, score_level = calculate_color_and_score(lease_worst_status)
    credit_and_score = sorted_balances[0] + (color, score, score_level)
    keys = [
        "balance",
        "lease_giver_name",
        "payment_date",
        "lease_status",
        "currency",
        "color",
        "score_range",
        "score_level",
    ]
    return dict(zip(keys, credit_and_score))

def rate_setup(request):
    if request.method == "GET" :
        currency_settings_objects = CurrencyRate.objects.filter(company_id=request.user.company)
        if currency_settings_objects.exists():         
            currency_settings = currency_settings_objects.last()   
            currency_settings = {
                "company_id": currency_settings.user.company,
                "current_rate": currency_settings.current_rate,
                "base_currency": currency_settings.base_currency,
                "currency": currency_settings.currency,
                "date_created": currency_settings.date_created,
                "updated_at": currency_settings.updated_at,
            }
            return JsonResponse({"currency_settings" : currency_settings})
        props = {"errors": "no currency settings found"}
        return JsonResponse(props)

    if request.method == "POST" :
        rate_schema = RateSchema()
        try:
            data = rate_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return JsonResponse(props, status=400)
        else:
            rates = CurrencyRate.objects.filter(user=request.user)
            if rates.exists():
                rate = rates.last()
                rate.base_currency=data.get("base_currency")
                rate.currency=data.get("currency")
                rate.current_rate=data.get("rate")
                rate.save()
                props = {"success": "Rate changed successfully!"}
                return JsonResponse(props)
            else:
                CurrencyRate.objects.create(
                    company_id=request.user.company,
                    base_currency=data.get("base_currency"),
                    currency=data.get("currency"),
                    current_rate=data.get("rate")
                )
                props = {"success": "Rate configured successfully!"}
                return JsonResponse(props)


@login_required
@clients_required
def get_user(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed", "props": {}}, safe=False)
    get_user_schema = GetUserSchema()
    try:
        data = get_user_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return JsonResponse({"status": "failed", "props": props}, safe=False)
    else:
        if individual := Individual.objects.filter(
            identification_number=data.get("identificationNumber").upper()
        ).first():
            props = {
                "name": f"{individual.firstname} {individual.surname}",
                "phone": individual.mobile,
                "address": "",
                "identification_type": individual.identification_type,
            }
            return JsonResponse({"status": "success", "props": props}, safe=False)
        else:
            return JsonResponse(
                {"status": "failed", "props": {"errors": "Individual not found."}},
                safe=False,
            )

@login_required
@clients_required
def agents(request):
    if request.method == "POST":
        search_schema = SearchSchema()
        agents_list = []
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            # #err.messages)
            return redirect("cl-search-agents")
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip().upper()
            if searchParam == "fullname" and len(searchValue) > 0:
                searchWords = searchValue.split(" ")

                if len(searchWords) >= 2:
                    firstname = searchWords[0]
                    surname = searchWords[1]
                    result = Individual.objects.filter(
                        firstname__iexact=firstname, surname__iexact=surname
                    )
                    agent = CustomUser.objects.filter(individual=result.id, user_type=3)
                    agents_list.extend(iter(agent))
                    result = agents_list
                else:
                    result = ""

            elif searchParam:
                agent = Individual.objects.filter(national_id=searchValue.upper())
                result = CustomUser.objects.filter(individual=agent.id, user_type=3)
            agent_schema = AgentSchema()
            agent = agent_schema.dump(result)

            props = {"result": agent}
            return render(request, "Client/Search/SearchAgent", props)

    else:
        props = {}
        return render(request, "Client/Search/SearchAgent", props)

def create_agent_user(request):
    if request.method == "POST":
        create_agent_schema = CreateAgentSchema()
        try:
            data = create_agent_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Client/Users/Index", props)
        else:
            create_agent_user_helper.dela(request, data)
            # send email
        props = {
            "success": "success",
        }
    return redirect("cl-search-agents")

def create_agent_user_helper(request, data):
    # create agent
    individual = Individual(
        individual_adder=request.user.id,
        national_id=data.get("identificationNumber").upper(),
        firstname=data.get("firstName").upper(),
        surname=data.get("lastName").upper(),
        gender=data.get("gender"),
        mobile=data.get("mobileNumber"),
        address=data.get("address"),
        email=data.get("userEmail"),
        identification_type=data.get("identificationType"),
        identification_number=data.get("identificationNumber").upper(),
        is_user=True,
    )
    individual.save()
    # send otp
    request_user_company = Company.objects.filter(id=request.user.company).first()
    name = request_user_company.trading_name if request_user_company else "N/A"
    new_message = f"Accept registration on CrediSafe from {name} ? Give OTP below as confirmation."
    with contextlib.suppress(Exception):
        if request.user.can_send_email:
            send_otp.delay(
                request.build_absolute_uri(),
                generate_otp(),
                data.get("mobile"),
                request.user.company,
                individual.id,
                "agent",
                settings.ADD_AGENT_USER,
                new_message,
            )
    individual_employement_details = EmployementDetails(
        individual=individual.id,
        date_of_employment=data.get("dateOfEmployment"),
        job_title=data.get("currentJobTitle"),
        employer_name=data.get("currentEmployer"),
        marital_status=data.get("maritalStatus"),
    )
    individual_employement_details.save()

def is_agent_verified(request):
    return JsonResponse({"status": 200}, safe=False)

@login_required
@clients_required
def update_agent(request):
    if request.method != "PUT":
        return redirect("cl-search-agents")
    update_agent_schema = UpdateAgentSchema()
    try:
        data = update_agent_schema.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Users/Index", props)
    else:
        if check_user := CustomUser.objects.filter(id=data.get("userId")).first():
            check_user.is_superuser = data.get("accessLevel") == "admin"

            check_user.save()

        return redirect("cl-search-agents")


def destroy_agent(request):
    if request.method == "POST":
        check_userschema = CheckUserSchema()
        try:
            data = check_userschema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return redirect("client-users")
        else:
            user = CustomUser.objects.filter(id=data.get("userId"))
            user.delete()

    return redirect("cl-search-agents")


@login_required
@clients_required
def get_company(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed"}, safe=False)
    get_company_schema = GetCompanySchema()
    props = {}

    try:
        data = get_company_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return JsonResponse({"status": "failed", "props": props}, safe=False)
    if company := Company.objects.filter(
        registration_number=data.get("identificationNumber")
    ).first():
        if company_profile := CompanyProfile.objects.filter(company=company.id).first():
            return JsonResponse(
                {
                    "status": "success",
                    "name": company.registration_name,
                    "mobile": company_profile.mobile_phone,
                    "address": company_profile.current_address,
                    "email": company_profile.email,
                    "contact_name": company_profile.contact_person,
                },
                safe=False,
            )
    return JsonResponse(
        {"status": "failed", "props": {"errors": "Company not found."}}, safe=False
    )


@login_required
@clients_required
def credit_check(request):
    search_key = ""
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "CreditCheck/Index", props)
        search_value = data.get("searchValue")
        search_key = data.get("searchParam")
        # #"Search Key:", search_key)
        if search_key == "identification_number":
            result = Individual.objects.filter(
                identification_number=search_value.upper()
            )
            # #result)
            if result is None:
                props = {"userExist": False}
                return render(request, "CreditCheck/Individual", props)
            props = {"userExist": True}
            return render(request, "CreditCheck/Individual", props)
        if search_key == "registration_number":
            result = Company.objects.filter(registration_number=search_value.upper())
        else:
            result = Company.objects.filter(
                registration_name__icontains=search_value
            ).first()
        # #"Result:", result)
        if result is None:
            props = {"userExist": False}
            return render(request, "CreditCheck/Company", props)

        props = {"userExist": True}
        return render(request, "CreditCheck/Company", props)
    props = {}
    if search_key == "identification_number":
        return render(request, "CreditCheck/Individual", props)
    if search_key in ("registration_number", "registration_name"):
        return render(request, "CreditCheck/Company", props)
    return render(request, "CreditCheck/Index", props)


# @login_required
# @clients_required
def company_verify_otp(request, url_link):
    url_pattern = r"T(\d{4})L"
    matches = re.search(url_pattern, url_link)
    if request.method != "GET":
        return company_verify_otp_helper(request)
    if matches:
        otp = matches.group(1)
        user_id_match = re.findall(r"(?<=!)\d+(?=B)", url_link)
        added_company = user_id_match[0]
    else:
        props = {"errors": "this user is already verified!"}
        return JsonResponse({"status": "failed", "props": props}, safe=False)
    try:
        check_otp = OTP.objects.filter(
            otp_code=otp, requested_user=added_company
        ).first()
    except UnboundLocalError:
        props = {"errors": "No confirmation link clicked!"}
        return JsonResponse({"status": "failed", "props": props}, safe=False)
    if check_otp and check_otp.requested_user_type == "company":
        if req_user := Company.objects.filter(id=check_otp.requested_user).first():
            company_email = (
                CompanyProfile.objects.filter(company=req_user.id).first().email
            )
            email = company_email or None
            company_name = req_user.registration_name if req_user else None
        return render(
            request,
            "Auth/ClientCompanyVerify",
            props={"company_email": email, "company_name": company_name},
        )

    return JsonResponse({"status": "ok"})

def company_verify_otp_helper(request):
    user_schema = CreateAccountSchema()
    try:
        data = user_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return render(request, "CreditCheck/Company", props)
    req_user_email = CompanyProfile.objects.filter(email=data.get("username")).first()
    if req_user := Company.objects.filter(id=req_user_email.company).first():
        req_user.is_verified = True
        req_user.save()
        if data.get("password") == data.get("confirmPassword"):
            user_password = data.get("confirmPassword")
            new_user_password = make_password(user_password)
            user = CustomUser(
                email=data.get("username"),
                user_id=data.get("username"),
                is_superuser=True,
                password=new_user_password,
                company=req_user.id,
                user_type=1,
            )
            user.save()
            # send_auth_email.delay(
            #     req_user_email.email,
            #     user_password,
            #     req_user_email.email,
            #     req_user.registration_name,
            # )
            props = {
                "success": "Account created successfully,login credentials have been sent to your email!."
            }
        else:
            props = {"errors": "Passwords do not match"}
            return JsonResponse({"status": "failed", "props": props}, safe=False)
    props = {"is_verified": True}
    messages.success(
        request,
        "Your account has been created successfully!.",
        extra_tags="account_created",
    )
    return redirect("login")

@login_required
@clients_required
def individual_verify_otp(request):
    if request.method == "POST":
        otp_schema = OTPSchema()
        try:
            data = otp_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            if request.path != "/clients/individual-verify-otp/":
                return render(request, "CreditCheck/Individual", props)
            else:
                return render(request, "Leases/Index", props)
        if check_otp := OTP.objects.filter(otp_code=data.get("otp")).first():
            if check_otp.otp_type == settings.ADD_IND_LEASE:
                lease_receiver = (
                    Individual.objects.filter(id=check_otp.requested_user)
                    .first()
                    .identification_number
                )
                if lease := Lease.objects.filter(
                    reg_ID_Number=lease_receiver, is_active=False
                ).last():
                    lease.is_active = True
                    lease.save()
                    props = {"success": "Lease Verified Successfully!"}
                    return redirect("client-leases")
                return render(request, "Leases/Index", props)
            elif (
                check_otp.requested_user_type == "individual"
                and check_otp.otp_type == settings.CREDIT_CHECK
            ):
                if req_user := Individual.objects.filter(
                    id=check_otp.requested_user
                ).first():
                    req_user.is_verified = True
                    req_user.save()
                    (
                        check_otp.delete()
                        if check_otp.otp_type != "ADD_INDIVIDUAL"
                        else None
                    )
                else:
                    check_otp.delete()
                props = {"is_verified": True}
                return render(request, "CreditCheck/Individual", props)
    return redirect("client-leases")

def is_individual_verified(request):
    return JsonResponse({"status": 200}, safe=False)

@login_required
@clients_required
def credit_check_confirmation(request):
    search_schema = OTPSchema()
    try:
        data = search_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        # #props)
        return render(request, "CreditCheck/Index", props)
    else:
        otp = data.get("otp")
        result = None
        if check_otp := OTP.objects.filter(otp_code=otp).first():
            # #check_otp.requested_user_type)
            if check_otp.requested_user_type == "individual":
                result = Individual.objects.filter(id=check_otp.requested_user).first()
                lease = Lease.objects.filter(
                    reg_ID_Number=result.identification_number, is_active=True
                )
                result_data = {
                    "credit_status": 0,
                    "national_id": result.identification_number,
                    "name": f"{result.firstname} {result.surname}",
                    "active_loan": lease.count(),
                    "arrears": 0,
                    "arrears_balance": 0,
                    "is_company": "False",
                }
                props = {"user": result_data}
                return render(request, "CreditCheck/Individual", props)
            if check_otp.requested_user_type == "company":
                result = Company.objects.filter(id=check_otp.requested_user).first()
                result_data = {
                    "credit_status": 0,
                    "registration_number": result.registration_number,
                    "registration_name": result.registration_name,
                    "active_loan": 0,
                    "arrears": 0,
                    "arrears_balance": 0,
                    "is_company": "True",
                }
                props = {"user": result_data}
                return render(request, "CreditCheck/Company", props)
            # delete OTP
            check_otp.delete()
        else:
            return redirect("client-credit-check")


@login_required
@clients_required
def credit_check_individuals(request):
    return render(request, "CreditCheck/Individual")


@login_required
@clients_required
def credit_check_companies(request):
    return render(request, "CreditCheck/Company")

def switch_colors(lease, old_payment_end, new_payment_end, today, lease_status):
    opening_balance_record = Opening_balance.objects.filter(
        lease_id=lease.lease_id
    ).last()
    if old_payment_end < new_payment_end >= today and lease_status == "medium":
        lease.status = "SAFE"
        opening_balance_record.current_month = float(
            opening_balance_record.one_month_back
        ) + float(opening_balance_record.current_month)
        opening_balance_record.one_month_back = 0
        lease.status_cache = "SAFE"
        opening_balance_record.save()

    elif old_payment_end > new_payment_end < today and lease_status == "safe":
        opening_balance_record.one_month_back = opening_balance_record.current_month
        opening_balance_record.current_month = 0
        opening_balance_record.save()
        lease.status = "MEDIUM"
        lease.status_cache = "MEDIUM"

@login_required
@clients_required
def edit_lease(request):
    data = json.loads(request.body.decode("utf-8"))
    lease_id = data.get("leaseId")
    lease = Lease.objects.filter(lease_id=lease_id).first()
    agent_details = Landlord.objects.filter(lease_id=lease_id).first()
    if request.method == "POST":
        date_string1, date_string2 = data.get("leaseStartDate"), data.get(
            "leaseEndDate"
        )
        date_only1 = date_string1.split("T")[0]
        date_only2 = date_string2.split("T")[0]
        datetime_obj1 = datetime.strptime(date_only1, "%Y-%m-%d")
        datetime_obj2 = datetime.strptime(date_only2, "%Y-%m-%d")
        new_payment_end = int(data.get("paymentPeriodEnd"))
        old_payment_end = int(lease.payment_period_end)
        today = datetime.now().date().day
        lease_status = lease.status_cache.lower() or None

        opening_balance_record = Opening_balance.objects.filter(
            lease_id=lease.lease_id
        ).last()
        if old_payment_end != new_payment_end:
            if (
                opening_balance_record
                and float(opening_balance_record.outstanding_balance) > 0
                and lease_status
                in [
                    "medium",
                    "safe",
                ]
            ):
                switch_colors(
                    lease, old_payment_end, new_payment_end, today, lease_status
                )
        if data.get('landlordType').lower() == "company":
            if not data.get("regIdNumber") == "":
                landlord_ob = Company.objects.filter(registration_number=data.get("regIdNumber")).first()
            else:
                landlord_ob = Company.objects.filter(registration_name__iexact=data.get("landlordName")).first()
        else:
            if not data.get("regIdNumber") == "":
                landlord_ob = Individual.objects.filter(identification_number=data.get("regIdNumber")).first()
            else:
                landlord_ob = None
        if agent_details:
            agent_details.agent_commission = data.get("commission")
            agent_details.landlord_id = landlord_ob.id if landlord_ob else None
            agent_details.reg_ID_Number = data.get("regIdNumber")
            agent_details.opening_balance = data.get("openingBalance")
            agent_details.landlord_name = data.get("landlordName")
            agent_details.is_individual = (
                data.get("landlordType").upper() == LandLordType.INDIVIDUAL
            )
            agent_details.is_company = (
                data.get("landlordType").upper() == LandLordType.COMPANY
            )
            agent_details.save()
            opening_balance_ob = LeaseReceiptBreakdown.objects.filter(lease_id=lease_id).first()
            if opening_balance_ob:
                opening_balance_ob.total_amount = data.get("openingBalance")
                opening_balance_ob.base_amount = data.get("openingBalance")
                opening_balance_ob.receipt_number = "Opening Balance"
                opening_balance_ob.save()
        else:
            landlord = Landlord(
                user_id=request.user.id,
                lease_id=lease_id,
                landlord_id=landlord_ob.id if landlord_ob else None,
                reg_ID_Number=data.get("regIdNumber"),
                opening_balance=data.get('openingBalance'),
                landlord_name=data.get("landlordName"),
                is_individual=data.get("landlordType").upper()
                == LandLordType.INDIVIDUAL,
                is_company=data.get("landlordType").upper() == LandLordType.COMPANY,
                agent_commission=float(data.get("commission")),
            )
            landlord.save()
            
            LeaseReceiptBreakdown.objects.create(
                lease_id=lease_id,
                landlord_id=landlord.id,
                total_amount=data.get('openingBalance'),
                base_amount=data.get('openingBalance'),
                receipt_number='Opening Balance',
            )

        if lease:
            if str(lease.leasee_mobile) != str(data.get("lesseePhone")) :
                from ..validators import validate_phone_number
                mobile_number_owner = Individual.objects.filter(identification_number=lease.reg_ID_Number).first()
                if mobile_number_owner and validate_phone_number(data.get("lesseePhone")):
                    mobile_number_owner.mobile = data.get("lesseePhone")
                    mobile_number_owner.save()
            lease.lease_details = data.get("leaseDetails")
            lease.deposit_amount = data.get("depositAmount")
            lease.deposit_period = data.get("depositPeriod")
            lease.monthly_rentals = data.get("monthlyRental")
            lease.currency = data.get("leaseCurrency")
            lease.address = data.get("lesseeAddress")
            lease.start_date = datetime_obj1
            lease.end_date = datetime_obj2
            lease.rent_guarantor_id = data.get("rentGuarantorId") or "N/A"
            lease.leasee_mobile = data.get("lesseePhone")
            lease.lease_period = data.get("leasePeriod")
            lease.payment_period_start = data.get("paymentPeriodStart")
            lease.payment_period_end = new_payment_end
            lease.rent_variables = data.get("rentVariable")
            lease.save()
            messages.success(request, "successfully updated lease")
            share(request, messages=messages)
            lease_giver = Company.objects.filter(id=lease.lease_giver).first()
            lease_giver_name = (
                lease_giver.registration_name if lease_giver else "Creditor"
            )
            if lease.is_company:
                requested_user_ob = "company"
                lease_receiver = Company.objects.filter(id=lease.reg_ID_Number).first()
                lease_receiver_name = (
                    lease_receiver.trading_name if lease_receiver else "Creditor"
                )
                if lease_receiver:
                    company_email = CompanyProfile.objects.filter(
                        company=lease_receiver.id
                    ).first()
                    contact_detail = company_email.email if company_email else None
                else:
                    contact_detail = "info@credi-safe.com"
            else:
                requested_user_ob = "individual"
                lease_receiver = Individual.objects.filter(
                    national_id=lease.reg_ID_Number
                ).first()
                lease_receiver_name = (
                    f"{lease_receiver.firstname} {lease_receiver.surname}"
                    if lease_receiver
                    else "Creditor"
                )
                contact_detail = lease_receiver.mobile
            if old_payment_end != new_payment_end:
                if lease.status == "NON-PAYER":
                    registration_message = f" Hi {lease_receiver_name },Your Payment status to {lease_giver_name} has downgraded to NON-PAYER. Please pay your balance of {lease.currency} {opening_balance_record.outstanding_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                elif lease.status in ["HIGH", "HIGH-HIGH"]:
                    registration_message = f"Hi {lease_receiver_name}, Your Payment status to {lease_giver_name} has downgraded to HIGH RISK. Please pay your balance of {lease.currency} {opening_balance_record.outstanding_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                elif lease.status == "MEDIUM":
                    registration_message = f"Hi {lease_receiver_name}, Your Payment status to {lease_giver_name} has downgraded to MEDIUM RISK. Please pay your balance of {lease.currency} {opening_balance_record.outstanding_balance}0 to upgrade your payment status.\nLease ID: {lease_id}"
                else:
                    registration_message = None
                if registration_message and request.user.can_send_email:
                    send_otp.delay(
                        "",
                        lease_id,
                        contact_detail,
                        request.user.company,
                        lease_receiver.id,
                        requested_user_ob,
                        settings.LEASE_STATUS,
                        registration_message,
                    )
                    if requested_user_ob == "company":
                        if rent_guarantor_mobile := Individual.objects.filter(
                            identification_number=lease.rent_guarantor_id
                        ).first():
                            send_otp.delay(
                                "",
                                lease_id,
                                rent_guarantor_mobile.mobile,
                                request.user.company,
                                lease_receiver.id,
                                "individual",
                                settings.LEASE_STATUS,
                                registration_message,
                            )
            return redirect("client-leases")
    elif lease.is_company:
        if lease_receiver_company := Company.objects.filter(
            id=lease.reg_ID_Number
        ).first():
            trading_name = lease_receiver_company.trading_name
            registration_number = lease_receiver_company.registration_name
            if comapany_profile := CompanyProfile.objects.filter(
                company=lease_receiver_company.id
            ).first():
                mobile = comapany_profile.mobile_phone
                email = comapany_profile.email
                address = comapany_profile.current_address
                contact_person = comapany_profile.contact_person
            else:
                mobile = ""
                email = ""
                address = ""
                contact_person = ""
        else:
            trading_name = ""
            registration_number = ""
        return JsonResponse(
            {
                "status": "success",
                "trading_name": trading_name,
                "registration_number": registration_number,
                "mobile": mobile,
                "email": email,
                "address": address,
                "contact_person": contact_person,
            },
            safe=False,
        )

    return redirect("client-leases")

@login_required
@clients_required
def create_individual_lease(request):
    return create_individual_lease_helper(request)

@shared_task
def create_individual_lease_helper(request):
    if request.method == "POST":
        create_lease_schema = CreateIndividualLeaseSchema()

        try:
            data = create_lease_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Leases/Index", props)
        identificationNumber = data.get("identificationNumber").upper()
        request_user_comp_id = (
            Company.objects.filter(id=request.user.company).first().id
        )
        if is_eligible := validate_subscriptions(request.user.company, "combined"):
            sub_id = Subcsriptions.objects.filter(
                is_activated=True,
                subscriber_id=request_user_comp_id,
                subscription_class="combined",
            ).last()
            balance_amount = float(data.get("outStandingBalance"))
            ind_lease = True
            # add landlord to lease
            landlord_id = None
            if data.get("landlordType"):
                if data.get("landlordType").upper() == LandLordType.INDIVIDUAL:
                    individual = Individual.objects.filter(
                        identification_number__iexact=identificationNumber
                    ).first()
                    landlord_id = individual.id if individual else 0
                elif data.get("landlordType").upper() == LandLordType.COMPANY:
                    company = Company.objects.filter(
                        registration_number=data.get("regIdNumber")
                    ).first()
                    landlord_id = company.id if company else 0
            lease = Lease(
                reg_ID_Number=identificationNumber.upper(),
                lease_giver=request.user.company,
                lease_activator=request.user.id,
                address=data.get("lesseeAddress"),
                leasee_mobile=data.get("lesseePhone"),
                is_individual=ind_lease,
                is_active=True,
                landlord_id =landlord_id if data.get("landlordType") else None,
                lease_details=data.get("leaseDetails"),
                start_date=data.get("leaseStartDate"),
                rent_guarantor_id=data.get("rentGuarantorId",identificationNumber).upper(),
                end_date=data.get("leaseEndDate"),
                currency=data.get("leaseCurrency"),
                deposit_amount=data.get("depositAmount"),
                deposit_period=data.get("depositPeriod"),
                lease_period=data.get("leasePeriod"),
                monthly_rentals=data.get("monthlyRental"),
                subscription=int(sub_id.id),
                rent_variables=True if data.get("rentVariable") else False,
                payment_period_start=data.get("paymentPeriodStart"),
                payment_period_end=data.get("paymentPeriodEnd"),
            )
            lease.save()

            try:
                if landlord_id:
                    landlord = Landlord(
                        user_id=request.user.id,
                        lease_id=lease.lease_id,
                        landlord_id=landlord_id,
                        reg_ID_Number=data.get("regIdNumber"),
                        opening_balance=data.get('openingBalance'),
                        landlord_name=data.get("landlordName"),
                        is_individual=data.get("landlordType").upper()
                        == LandLordType.INDIVIDUAL,
                        is_company=data.get("landlordType").upper() == LandLordType.COMPANY,
                        agent_commission=float(data.get("commission")),
                    )
                    landlord.save()
                    
                    LeaseReceiptBreakdown.objects.create(
                        lease_id=lease.lease_id,
                        landlord_id=landlord_id,
                        total_amount=data.get('openingBalance'),
                        base_amount=data.get('openingBalance'),
                        receipt_number='Opening Balance',
                        
                    )
            except Exception as e:
                ...
            

            opening_balance = Opening_balance(
                lease_id=lease.lease_id,
                current_month=data.get("currentBalance"),
                one_month_back=data.get("monthOneBalance"),
                two_months_back=data.get("monthTwoBalance"),
                three_months_back=data.get("monthThreeBalance"),
                three_months_plus=data.get("moreThanThreeMonthsBalance"),
                outstanding_balance=data.get("outStandingBalance"),
            )
            opening_balance.save()
            if opening_balance.three_months_plus > 0:
                lease.status = "NON-PAYER"
                lease.status_cache = "NON-PAYER"
            elif opening_balance.three_months_back > 0:
                lease.status = "HIGH-HIGH"
                lease.status_cache = "HIGH-HIGH"
            elif opening_balance.two_months_back > 0:
                lease.status = "HIGH"
                lease.status_cache = "HIGH"
            elif opening_balance.one_month_back > 0:
                lease.status = "MEDIUM"
                lease.status_cache = "MEDIUM"
            else:
                pass
            lease.save()
            lease_year, lease_month, lease_day = data.get("leaseStartDate").split("-")
            month_name = (
                str(calendar.month_name[int(lease_month)]) + " " + str(lease_year)
            )
            balance_amount = data.get("outStandingBalance")

            reference = "Opening Balance"
            lease_payment = LeasePayments(
                lease_id=lease.lease_id,
                payment_amount=0,
                date=data.get("leaseStartDate"),
                month=month_name,
                payment_reference=reference,
                owing_amount=balance_amount,
                balance_amount=balance_amount,
                is_balance_checked=True,
            )
            lease_payment.save()
            lease_receiver = Individual.objects.filter(
                national_id=identificationNumber
            ).first()
            request_user_company = Company.objects.filter(
                id=request.user.company
            ).first()
            name = request_user_company.trading_name if request_user_company else "N/A"

            if lease_receiver:
                full_name = lease_receiver.firstname + " " + lease_receiver.surname

            rent_variables = "Yes" if data.get("rentVariable") else "No"
            remarks = "Please pay your rental arrears to improve your payment status."
            if lease.status_cache == "SAFE":
                payment_status = "Low Risk"
                remarks = ""
            elif lease.status_cache == "HIGH-HIGH" or lease.status_cache == "HIGH":
                payment_status = "High Risk"
            else:
                payment_status = lease.status_cache
            message = f"Your current lease details with {name} .\nLessee : {full_name}\nMonthly Rental : {lease.currency} {lease.monthly_rentals}0\nMonthly rent variable : {rent_variables}\nMonthly Payment Period : {lease.payment_period_start}th day of every month to {lease.payment_period_end}th.\nYour Opening Balance: USD {opening_balance.outstanding_balance}0\nYour Payment Status: {payment_status}\n {remarks}"
            message_preview = f"Your current lease details with {name}: Lessee - {full_name}; Monthly Rental - {lease.currency} {lease.monthly_rentals}0; Monthly rent variable - {rent_variables}; Monthly Payment Period - {lease.payment_period_start}th day of every month to {lease.payment_period_end}th; Your Opening Balance - USD {opening_balance.outstanding_balance}0; Your Payment Status - {payment_status}\n {remarks}"

            try:
                if request.user.can_send_email:
                    send_otp.delay(
                        request.build_absolute_uri(),
                        generate_otp(),
                        lease_receiver.mobile,
                        request.user.company,
                        lease_receiver.id,
                        "individual",
                        settings.ADD_IND_LEASE,
                        message,
                    )
            except Exception as e:
                pass
            messages.success(request, message_preview)
            share(request, messages=messages)
            return redirect("client-leases")

        else:
            props = {"error": "You are not eligible for this subscription"}

    return redirect("client-leases")

def create_individual_bulk_leases(request):
    return create_individual_bulk_leases_helper(request)

@shared_task
def create_individual_bulk_leases_helper(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed"}, safe=False)
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8-sig")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string)
    skipped_rows = []
    created_rows = []
    next(reader)
    # Identification Number	Account Number	Lease Mobile Number	Lease Address	Lease Details	Lease Currency	Monthly Rental	Is Variable	Deposit Period (Months)	Deposit Amount	Lease Start Date	Payment Period End	Current Month	1 - 30 days outstanding	31 - 60 days outstanding	61 - 90 days outstanding	+90 days outstanding
    if validate_subscriptions(request.user.company, "combined"):
        sub_id = Subcsriptions.objects.filter(
                is_activated=True,
                subscriber_id=request.user.company,
                subscription_class="combined",
            ).last()
        for i, row in enumerate(reader):

            identificationNumber = row[0].upper()
            accountNumber = row[1]
            leaseMobileNumber = row[2]
            leaseAddress = row[3]
            leaseDetails = row[4]
            leaseCurrency = row[5]
            monthlyRental = row[6]
            isVariable = row[7]
            depositPeriod = row[8]
            depositAmount = row[9]
            leaseStartDate = row[10]
            paymentPeriodEnd = row[11]
            current_month = row[12]
            one_month_back = row[13]
            two_months_back = row[14]
            three_months_back = row[15]
            more_than_three_months_back = row[16]

            errors = []
            current_month = float(current_month) if current_month != "" else 0
            one_month_back = float(one_month_back) if one_month_back != "" else 0
            two_months_back = float(two_months_back) if two_months_back != "" else 0
            three_months_back = float(three_months_back) if three_months_back != "" else 0
            more_than_three_months_back = (
                float(more_than_three_months_back)
                if more_than_three_months_back != ""
                else 0
            )

            if leaseStartDate:
                dob_object = convert_to_django_date(leaseStartDate)
                if dob_object is not None:
                    leaseStartDate = dob_object
                    date_object = datetime.strptime(leaseStartDate, "%Y-%m-%d")
                    payment_month = date_object.strftime("%B %Y")
                    if len(paymentPeriodEnd) > 2:
                        errors.append("Payment Period End must be a day from 1 - 30")
                    else:
                        receiver_individual_object = Individual.objects.filter(
                            identification_number=identificationNumber
                        ).first()
                        if (
                            receiver_individual_object
                            and not identificationNumber.startswith("00")
                        ):
                            lease = Lease(
                                reg_ID_Number=identificationNumber,
                                lease_giver=request.user.company,
                                lease_activator=request.user.id,
                                address=leaseAddress,
                                rent_guarantor_id=identificationNumber,
                                is_individual=True,
                                lease_details=leaseDetails,
                                start_date=leaseStartDate,
                                end_date=datetime.now().date() + timedelta(days=6 * 30),
                                currency=leaseCurrency,
                                deposit_amount=(
                                    depositAmount if depositAmount != "" else 0
                                ),
                                deposit_period=depositPeriod,
                                subscription=int(sub_id.id),
                                lease_period=6,
                                monthly_rentals=monthlyRental,
                                rent_variables=isVariable.lower() == "yes",
                                payment_period_start=25,
                                is_active=True,
                                payment_period_end=paymentPeriodEnd,
                            )
                            lease.save()
                            out_standing_balance = float(
                                current_month
                                + one_month_back
                                + two_months_back
                                + three_months_back
                                + more_than_three_months_back
                            )

                            opening_balance = Opening_balance(
                                lease_id=lease.lease_id,
                                current_month=current_month,
                                one_month_back=one_month_back,
                                two_months_back=two_months_back,
                                three_months_back=three_months_back,
                                three_months_plus=more_than_three_months_back,
                                outstanding_balance=out_standing_balance,
                            )
                            opening_balance.save()
                            if opening_balance.three_months_plus > 0:
                                lease.status = "NON-PAYER"
                                lease.status_cache = "NON-PAYER"
                            elif opening_balance.three_months_back > 0:
                                lease.status = "HIGH-HIGH"
                                lease.status_cache = "HIGH-HIGH"
                            elif opening_balance.two_months_back > 0:
                                lease.status = "HIGH"
                                lease.status_cache = "HIGH"
                            elif opening_balance.one_month_back > 0:
                                lease.status = "MEDIUM"
                                lease.status_cache = "MEDIUM"
                            lease.save()
                            balance_amount = out_standing_balance
                            reference = "Opening Balance"
                            lease_payment = LeasePayments(
                                lease_id=lease.lease_id,
                                payment_amount=0,
                                date=leaseStartDate,
                                month=payment_month,
                                payment_reference=reference,
                                owing_amount=balance_amount,
                                balance_amount=balance_amount,
                                is_balance_checked=True,
                            )
                            lease_payment.save()
                            rent_variables = "Yes" if isVariable else "No"
                            remarks = "Please pay your rental arrears to improve your payment status."
                            if lease.status_cache == "SAFE":
                                payment_status = "Low Risk"
                                remarks = ""
                            elif lease.status_cache in ["HIGH-HIGH", "HIGH"]:
                                payment_status = "High Risk"
                            else:
                                payment_status = lease.status_cache
                            (
                                leeseeName,
                                leaseDetails,
                                lease_start_date,
                                currency,
                                end_date,
                                deposit_amount,
                                rent_variable,
                                monthly_rental,
                                payment_start,
                                payment_end,
                            ) = (
                                receiver_individual_object.firstname
                                + " "
                                + receiver_individual_object.surname,
                                leaseDetails,
                                leaseStartDate,
                                leaseCurrency,
                                datetime.now().date() + timedelta(days=6 * 30),
                                depositAmount,
                                isVariable,
                                monthlyRental,
                                "25",
                                paymentPeriodEnd,
                            )

                            request_user_company = Company.objects.filter(
                                id=request.user.company
                            ).first()
                            name = (
                                request_user_company.trading_name
                                if request_user_company
                                else "N/A"
                            )
                            # message = f"Hi {leeseeName}\n {name} gave you a lease with the following details:\n Leasee:{leeseeName}\n Identification Number: {identificationNumber}\n Lease Details: {leaseDetails}\n Monthly Rentals: {currency} {monthly_rental}\n Rent Variable : {rent_variable_status}\n Deposited Amount: {currency} {deposit_amount} \n Lease Start Date :{lease_start_date}\n Lease End Date: {end_date}\n Payment Start Date {payment_start}th day of every month to {payment_end}th.\n Your Opening Balance is {balance_amount}  \nterms and conditions apply."
                            message = f"Your current lease details with {name}.\nLessee : {leeseeName}\nMonthly Rental : {lease.currency} {lease.monthly_rentals}0\nMonthly rent variable : {rent_variables}\nMonthly Payment Period : {lease.payment_period_start}th day of every month to {lease.payment_period_end}th.\nYour Opening Balance: USD {opening_balance.outstanding_balance}0\nYour Payment Status: {payment_status}\n {remarks}"

                            with contextlib.suppress(Exception):
                                if request.user.can_send_email:
                                    send_otp.delay(
                                        request.build_absolute_uri(),
                                        "",
                                        receiver_individual_object.mobile,
                                        request.user.company,
                                        receiver_individual_object.id,
                                        "individual",
                                        "bulk_leases",
                                        message,
                                    )
                                created_rows.append(row)
                        else:
                            if not identificationNumber.startswith("000"):
                                errors.append("Individual does not exist")
                else:
                    errors.append(
                        "Invalid Lease Start date format, use yyyy-mm-dd or dd/mm/yyyy date format"
                    )
            else:
                errors.append("Lease Start Date is required")
            if errors:
                row.append(", ".join(errors))
                skipped_rows.append(row)
        if skipped_rows:
            return return_skipped_rows(skipped_rows, request)
        response_data = {
            "status": "success",
            "message": "Leases created successfully",
        }
        return JsonResponse(response_data, safe=False)
    return HttpResponse("Subscription not active or not found")

def return_skipped_rows(skipped_rows, request):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "Identification Number",
            "Account Number",
            "Lease Mobile Number",
            "Lease Address",
            "Lease Details",
            "Lease Currency",
            "Monthly Rental",
            "Is Variable",
            "Deposit Period (Months)",
            "Deposit Amount",
            "Lease Start Date",
            "Payment Period End",
            "Current Month",
            "1 - 30 days outstanding",
            "31 - 60 days outstanding",
            "61 - 90 days outstanding",
            "+90 days outstanding",
            "Errors",
        ]
    )
    writer.writerow(
        [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]
    )
    writer.writerows(skipped_rows)
    output.seek(0)  # Reset the file pointer
    folder_path = os.path.join("data_upload", "templates")
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(
        folder_path, f"invalid_individual_leases_data-{request.user.id}.csv"
    )

    with open(file_path, "w", newline="") as file:
        file.write(output.getvalue())
    return JsonResponse(
        {"status": "failed", "file_path": os.path.basename(file_path)},
        safe=False,
    )

@login_required
@clients_required
def create_company_lease(request):
    return create_company_lease_helper(request)

@shared_task
def create_company_lease_helper(request):
    props = {}
    if request.method == "POST":
        create_lease_schema = CreateCompanyLeaseSchema()
        try:
            data = create_lease_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Leases/Index", props)
        identificationNumber = data.get("identificationNumber")
        request_user_comp_id = (
            Company.objects.filter(id=request.user.company).first().id
        )
        try:
            if int(request.user.company) == int(identificationNumber):
                props = {'errors':'Blocked, a company cannot create a lease on itself.'}
                return render(request, "Leases/Index", props)
        except ValueError:
            ...
        is_eligible = validate_subscriptions(request.user.company, "combined")
        lease_receiver_company = Company.objects.filter(id=identificationNumber).first()
        if is_eligible:
            sub_id = Subcsriptions.objects.filter(
                is_activated=True,
                subscriber_id=request_user_comp_id,
                subscription_class="combined",
            ).last()
            balance_amount = float(data.get("outStandingBalance"))
            comp_lease = True
            landlord_id = None

            if data.get("landlordType").upper() == LandLordType.INDIVIDUAL:
                individual = Individual.objects.filter(
                    identification_number=data.get("regIdNumber")
                ).first()
                landlord_id = individual.id if individual else 0
            elif data.get("landlordType").upper() == LandLordType.COMPANY:
                company = Company.objects.filter(
                    registration_number=data.get("regIdNumber")
                ).first()
                landlord_id = company.id if company else 0
            lease = Lease(
                reg_ID_Number=identificationNumber,
                lease_giver=request.user.company,
                address=data.get("lesseeAddress"),
                leasee_mobile=(data.get("lesseePhone") or None),
                rent_guarantor_id=data.get("rentGuarantorId").upper(),
                is_company=comp_lease,
                landlord_id=landlord_id,
                is_active=True,
                lease_details=data.get("leaseDetails"),
                start_date=data.get("leaseStartDate"),
                end_date=data.get("leaseEndDate"),
                currency=data.get("leaseCurrency"),
                lease_activator=request.user.id,
                deposit_amount=data.get("depositAmount"),
                deposit_period=data.get("depositPeriod"),
                lease_period=data.get("leasePeriod"),
                monthly_rentals=data.get("monthlyRental"),
                subscription=int(sub_id.id),
                account_number=data.get("accountNumber"),
                rent_variables=bool(data.get("rentVariable")),
                payment_period_start=data.get("paymentPeriodStart"),
                payment_period_end=data.get("paymentPeriodEnd"),
                is_government=bool(data.get("isGovernment")),
            )
            if identificationNumber == request.user.company:
                props = {"errors": "Cannot lease to self !!!"}
                return render(request, "Leases/Index", props)
            lease.save()

            # add agent to lease
            if data.get("regIdNumber"):
                landlord = Landlord(
                    user_id=request.user.id,
                    lease_id=lease.lease_id,
                    landlord_id=landlord_id,
                    opening_balance=data.get('openingBalance'),
                    reg_ID_Number=data.get("regIdNumber"),
                    landlord_name=data.get("landlordName"),
                    is_individual=data.get("landlordType").upper()
                    == LandLordType.INDIVIDUAL,
                    is_company=data.get("landlordType").upper() == LandLordType.COMPANY,
                    agent_commission=float(data.get("commission")),
                )
                landlord.save()

            opening_balance = Opening_balance(
                lease_id=lease.lease_id,
                current_month=data.get("currentBalance"),
                one_month_back=data.get("monthOneBalance"),
                two_months_back=data.get("monthTwoBalance"),
                three_months_back=data.get("monthThreeBalance"),
                three_months_plus=data.get("moreThanThreeMonthsBalance"),
                outstanding_balance=data.get("outStandingBalance"),
            )
            opening_balance.save()
            if opening_balance.three_months_plus > 0:
                lease.status = "NON-PAYER"
                lease.status_cache = "NON-PAYER"
            elif opening_balance.three_months_back > 0:
                lease.status = "HIGH-HIGH"
                lease.status_cache = "HIGH-HIGH"
            elif opening_balance.two_months_back > 0:
                lease.status = "HIGH"
                lease.status_cache = "HIGH"
            elif opening_balance.one_month_back > 0:
                lease.status = "MEDIUM"
                lease.status_cache = "MEDIUM"
            lease.save()

            lease_year, lease_month, lease_day = data.get("leaseStartDate").split("-")
            month_name = (
                f"{str(calendar.month_name[int(lease_month)])} {str(lease_year)}"
            )
            balance_amount = data.get("outStandingBalance")
            reference = "Opening Balance"
            lease_payment = LeasePayments(
                lease_id=lease.lease_id,
                payment_amount=0,
                date=data.get("leaseStartDate"),
                month=month_name,
                payment_reference=reference,
                owing_amount=balance_amount,
                balance_amount=balance_amount,
                is_balance_checked=True,
            )
            lease_payment.save()

            (
                leeseeName,
                leaseDetails,
                lease_start_date,
                currency,
                end_date,
                deposit_amount,
                rent_variable,
                monthly_rental,
                payment_start,
                payment_end,
            ) = (
                data.get("lesseeName"),
                data.get("leaseDetails"),
                data.get("leaseStartDate"),
                data.get("leaseCurrency"),
                data.get("leaseEndDate"),
                data.get("depositAmount"),
                data.get("rentVariable"),
                data.get("monthlyRental"),
                data.get("paymentPeriodStart"),
                data.get("paymentPeriodEnd"),
            )

            lease_receiver = Company.objects.filter(id=identificationNumber).first()
            remarks = "Please pay your rental arrears to improve your payment status."
            rent_variable_status = "Yes" if rent_variable else "No"
            if lease.status_cache == "SAFE":
                remarks = ""
                payment_status = "Low Risk"
            elif lease.status_cache in ["HIGH-HIGH", "HIGH"]:
                payment_status = "High Risk"
            else:
                payment_status = lease.status_cache
            request_user_company = Company.objects.filter(
                id=request.user.company
            ).first()
            name = request_user_company.trading_name if request_user_company else "N/A"
            # message = f"Accept New Lease on CrediSafe from {name} ?\n Leasee:{leeseeName}\n Trading Name: {lease_receiver.trading_name}\n Lease Details: {leaseDetails}\n Monthly Rentals: {currency} {monthly_rental}\n Rent Variable : {rent_variable_status}\n Deposited Amount: {currency} {deposit_amount} \n Lease Start Date :{lease_start_date}\n Lease End Date: {end_date}\n Payment Start Date {payment_start}th day of every month to {payment_end}th.\n Your Opening Balance is {balance_amount}  \n  Click this link to confirm."
            message = f"Your current lease details with {name} .\nLessee : {leeseeName}\nMonthly Rental : {lease.currency} {lease.monthly_rentals}0\nMonthly rent variable : {rent_variable_status}\nMonthly Payment Period : {payment_start}th day of every month to {payment_end}th.\nYour Opening Balance: USD {balance_amount}0\nYour Payment Status: {payment_status}\n {remarks}"
            message_preview = f"Your current lease details with {name}: Lessee - {leeseeName}; Monthly Rental  - {lease.currency} {lease.monthly_rentals}0; Monthly rent variable  - {rent_variable_status}; Monthly Payment Period  - {payment_start}th day of every month to {payment_end}th; Your Opening Balance - USD {balance_amount}0; Your Payment Status - {payment_status};  {remarks}"

            try:
                if request.user.can_send_email:
                    send_otp.delay(
                        request.build_absolute_uri(),
                        generate_otp(),
                        data.get("email"),
                        request.user.company,
                        lease_receiver.id,
                        "company",
                        settings.ADD_COMP_LEASE,
                        message,
                    )
                props = {
                    "success": "Email has been sent to the lessee to confirm the lease"
                }

            except Exception as e:
                props = {"errors": "Failed to send email"}
            messages.success(request, message_preview)
            share(request, messages=messages)
            return redirect("client-leases")

    return redirect("client-leases")

def calculate_opening_balance_dates(payment_end):
    today_date = datetime.now().date()
    if today_date.day < int(payment_end):
        today_date = today_date
    else:
        today_date = today_date + timedelta(days=30)

    three_months_plus_balance = today_date - timedelta(days=124)
    three_months_back_date = today_date - timedelta(days=90)
    two_months_back_date = today_date - timedelta(days=60)
    one_month_back_date = today_date - timedelta(days=30)
    current_month_date = today_date
    return (
        current_month_date,
        one_month_back_date,
        two_months_back_date,
        three_months_back_date,
        three_months_plus_balance,
    )

def create_company_bulk_leases(request):
    return create_bulk_company_leases_helper(request)

@shared_task
def create_bulk_company_leases_helper(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed"}, safe=False)
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8-sig")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string)
    skipped_rows = []
    created_rows = []
    next(reader)
    errors = []
    if validate_subscriptions(request.user.company, "combined"):
        sub_id = Subcsriptions.objects.filter(
                is_activated=True,
                subscriber_id=request.user.company,
                subscription_class="combined",
            ).first()
        for i, row in enumerate(reader):
            registration_number = row[0].upper().upper()
            trading_name = row[1].upper()
            account_number = row[2].strip()
            rent_guarantor_registration_number = row[3].upper()
            rent_guarantor_position = row[4]
            government = row[5]
            lease_address = row[6]
            lease_details = row[7]
            lease_currency = row[8]
            monthly_rental = row[9]
            rent_variable = row[10]
            deposit_period = row[11]
            deposit_amount = row[12]
            lease_start_date = row[13]
            payment_period_end = row[14]
            current_month = row[15]
            one_month_back = row[16]
            two_months_back = row[17]
            three_months_back = row[18]
            more_than_three_months_back = row[19]

            current_month = float(current_month) if current_month != "" else 0
            one_month_back = float(one_month_back) if one_month_back != "" else 0
            two_months_back = float(two_months_back) if two_months_back != "" else 0
            three_months_back = float(three_months_back) if three_months_back != "" else 0
            more_than_three_months_back = (
                float(more_than_three_months_back)
                if more_than_three_months_back != ""
                else 0
            )
            if lease_start_date:
                start_date = convert_to_django_date(lease_start_date)
                if start_date is not None:
                    lease_start_date = start_date
                    date_object = datetime.strptime(lease_start_date, "%Y-%m-%d")
                    payment_month = date_object.strftime("%B %Y")
                    if len(payment_period_end) > 2:
                        errors.append("Payment Period End must be a day from 1 - 30")
                    else:
                        rent_variable = True if rent_variable.lower() == "yes" else False
                        out_standing_balance = float(
                            current_month
                            + one_month_back
                            + two_months_back
                            + three_months_back
                            + more_than_three_months_back
                        )
                        if registration_number != "":
                            receiver_company_object = Company.objects.filter(
                                registration_number=registration_number
                            ).first()
                        else:
                            receiver_company_object = Company.objects.filter(
                                trading_name=trading_name.strip()
                            ).first()
                        if receiver_company_object:
                            if rent_guarantor_ob := Individual.objects.filter(
                                national_id=rent_guarantor_registration_number
                            ).first():
                                lease = Lease(
                                    reg_ID_Number=receiver_company_object.id,
                                    lease_giver=request.user.company,
                                    lease_activator=request.user.id,
                                    address=lease_address,
                                    rent_guarantor_id=rent_guarantor_registration_number,
                                    is_company=True,
                                    is_government=(
                                        True
                                        if government.lower().strip() in ["true", "yes"]
                                        else False
                                    ),
                                    account_number=account_number,
                                    lease_details=lease_details,
                                    subscription=int(sub_id.id),
                                    start_date=lease_start_date,
                                    end_date=datetime.now().date() + timedelta(days=6 * 30),
                                    currency=lease_currency,
                                    deposit_amount=(
                                        deposit_amount if deposit_amount != "" else 0
                                    ),
                                    deposit_period=deposit_period,
                                    lease_period=6,
                                    monthly_rentals=monthly_rental,
                                    rent_variables=rent_variable,
                                    payment_period_start=25,
                                    is_active=True,
                                    payment_period_end=payment_period_end,
                                )
                                lease.save()
                                opening_balance = Opening_balance(
                                    lease_id=lease.lease_id,
                                    current_month=current_month,
                                    one_month_back=one_month_back,
                                    two_months_back=two_months_back,
                                    three_months_back=three_months_back,
                                    three_months_plus=more_than_three_months_back,
                                    outstanding_balance=out_standing_balance,
                                )
                                opening_balance.save()
                                if opening_balance.three_months_plus > 0:
                                    lease.status = "NON-PAYER"
                                    lease.status_cache = "NON-PAYER"
                                elif opening_balance.three_months_back > 0:
                                    lease.status = "HIGH-HIGH"
                                    lease.status_cache = "HIGH-HIGH"
                                elif opening_balance.two_months_back > 0:
                                    lease.status = "HIGH"
                                    lease.status_cache = "HIGH"
                                elif opening_balance.one_month_back > 0:
                                    lease.status = "MEDIUM"
                                    lease.status_cache = "MEDIUM"
                                lease.save()
                                balance_amount = out_standing_balance
                                reference = "Opening Balance"
                                lease_payment = LeasePayments(
                                    lease_id=lease.lease_id,
                                    payment_amount=0,
                                    date=lease_start_date,
                                    month=payment_month,
                                    payment_reference=reference,
                                    owing_amount=balance_amount,
                                    balance_amount=balance_amount,
                                    is_balance_checked=True,
                                )
                                lease_payment.save()

                                (
                                    leeseeName,
                                    leaseDetails,
                                    lease_start_date,
                                    currency,
                                    end_date,
                                    deposit_amount,
                                    rent_variable,
                                    monthly_rental,
                                    payment_start,
                                    payment_end,
                                ) = (
                                    receiver_company_object.trading_name,
                                    lease_details,
                                    lease_start_date,
                                    lease_currency,
                                    datetime.now().date() + timedelta(days=6 * 30),
                                    deposit_amount,
                                    rent_variable,
                                    monthly_rental,
                                    "25",
                                    payment_period_end,
                                )
                                if registration_number != "":
                                    lease_receiver = (
                                        Company.objects.filter(
                                            registration_number=registration_number
                                        )
                                        .first()
                                        .id
                                    )
                                else:
                                    lease_receiver = (
                                        Company.objects.filter(trading_name=trading_name)
                                        .first()
                                        .id
                                    )
                                rent_variable_status = "Yes" if rent_variable else "No"
                                remarks = "Please pay your rental arrears to improve your payment status."
                                if lease.status_cache == "SAFE":
                                    payment_status = "Low Risk"
                                    remarks = ""
                                elif (
                                    lease.status_cache == "HIGH-HIGH"
                                    or lease.status_cache == "HIGH"
                                ):
                                    payment_status = "High Risk"
                                else:
                                    payment_status = lease.status_cache
                                request_user_company = Company.objects.filter(
                                    id=request.user.company
                                ).first()
                                receiver_company_object_email = (
                                    CompanyProfile.objects.filter(
                                        company=receiver_company_object.id
                                    ).first()
                                )
                                name = (
                                    request_user_company.trading_name
                                    if request_user_company
                                    else "N/A"
                                )
                                # message = f"Hi {leeseeName}\n {name} gave you a lease with the following details:\n Leasee:{leeseeName}\n Trading Name: {receiver_company_object.trading_name}\n Lease Details: {leaseDetails}\n Monthly Rentals: {currency} {monthly_rental}\n Rent Variable : {rent_variable_status}\n Deposited Amount: {currency} {deposit_amount} \n Lease Start Date :{lease_start_date}\n Lease End Date: {end_date}\n Payment Start Date {payment_start}th day of every month to {payment_end}th.\n Your Opening Balance is {balance_amount}  \nterms and conditions apply."
                                message = f"Your current lease details with {name} .\nLessee : {leeseeName}\nMonthly Rental : {lease.currency} {lease.monthly_rentals}0\nMonthly rent variable : {rent_variable_status}\nMonthly Payment Period : {payment_start}th day of every month to {payment_end}th.\nYour Opening Balance: USD {balance_amount}0\nYour Payment Status: {payment_status}\n {remarks}"

                                try:
                                    if request.user.can_send_email:
                                        send_otp.delay(
                                            request.build_absolute_uri(),
                                            "",
                                            receiver_company_object_email.email,
                                            request.user.company,
                                            lease_receiver,
                                            "company",
                                            "bulk_leases",
                                            message,
                                        )
                                    created_rows.append(row)
                                except Exception as e:
                                    pass

                            else:
                                if not rent_guarantor_registration_number.startswith(
                                    "1222"
                                ):
                                    errors.append("Rent Guarantor does not exist")
                        else:
                            if not trading_name.lower().startswith("freelancer"):
                                errors.append("Company does not exist")
                else:
                    errors.append(
                        "Invalid Lease Start date format, use yyyy-mm-dd or dd/mm/yyyy date format"
                    )
            else:
                errors.append("Lease Start Date is required")
            if errors:
                row.append(", ".join(errors))
                skipped_rows.append(row)
        if skipped_rows:
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(
                [
                    "Company Registration Number",
                    "Trading Name",
                    "Rent Guarantor ID/Passport number",
                    "Rent Guarantor Position",
                    "Government",
                    "Lease Address",
                    "Lease Details",
                    "Lease Currency",
                    "Monthly Rental",
                    "Is Variable",
                    "Deposit Period (Months)",
                    "Deposit Amount",
                    "Lease Start Date",
                    "Payment Period End",
                    "Current Month",
                    "1 - 30 days outstanding",
                    "31 - 60 days outstanding",
                    "61 - 90 days outstanding",
                    "+90 days outstanding",
                    "Errors",
                ]
            )
            writer.writerow(
                [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                ]
            )
            writer.writerows(skipped_rows)
            output.seek(0)  # Reset the file pointer
            folder_path = os.path.join("data_upload", "templates")
            os.makedirs(folder_path, exist_ok=True)
            file_path = os.path.join(
                folder_path, f"invalid_company_leases_data-{request.user.id}.csv"
            )

            with open(file_path, "w", newline="") as file:
                file.write(output.getvalue())
            return JsonResponse(
                {"status": "failed", "file_path": os.path.basename(file_path)},
                safe=False,
            )

        response_data = {
        "status": "success",
        "message": "Leases created successfully",
    }
        return JsonResponse(response_data, safe=False)
    else:
        return HttpResponse("Subscriptions not activated or depleted!")

# @login_required
# @clients_required
def verify_company_lease(request, url_link):
    url_pattern = r"T(\d{4})L"
    matches = re.search(url_pattern, url_link)
    if request.method == "GET":
        if matches:
            otp = matches.group(1)
            requested_user_id = r"(?<=!)\d+(?=B)"
            user_id_match = re.findall(requested_user_id, url_link)
            lease_receiver = user_id_match[0]
        else:
            props = {"errors": "this user is already verified!"}
            return render(
                request, "Leases/ClientCompanyVerify", props={"is_verified": True}
            )
        try:
            check_otp = OTP.objects.filter(
                otp_code=otp, requested_user=lease_receiver
            ).first()
        except UnboundLocalError:
            props = {"errors": "No confirmation link clicked!"}
            return render(
                request, "Leases/ClientCompanyVerify", props={"is_verified": False}
            )
        if check_otp and check_otp.requested_user_type == "company":
            if req_user := Company.objects.filter(id=check_otp.requested_user).first():
                is_verified = True
                if lease := Lease.objects.filter(
                    reg_ID_Number=req_user.registration_number, is_active=False
                ).last():
                    lease.is_active = True
                    lease.save()
        else:
            is_verified = False
        return render(
            request, "Leases/ClientCompanyVerify", props={"is_verified": is_verified}
        )

    return JsonResponse({"status": "ok"})

@login_required
@clients_required
def create_lease_confirmation(request):
    return render(request, "Leases/CreateConfirmation")

@login_required
@clients_required
def create_individual(request):
    return create_individuals_helper(request)

@shared_task
def create_individuals_helper(request):
    if request.method != "POST":
        # return redirect("individuals")
        return render(request, "Client/Search/SearchIndividual", props={})
    create_individual_schema = CreateIndividualSchema()
    try:
        data = create_individual_schema.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Search/SearchIndividual", props)
    else:
        try:
            individual = Individual(
                individual_adder=request.user.company,
                national_id=data.get("identificationNumber").upper(),
                firstname=data.get("firstname").upper(),
                surname=data.get("surname").upper(),
                dob=data.get("dob") or None,
                gender=data.get("gender"),
                mobile=data.get("mobile"),
                address=data.get("address"),
                email=data.get("emailAddress"),
                land_line=data.get("landLine"),
                identification_type=data.get("identification_type"),
                identification_number=data.get("identificationNumber"),
            )
            individual.save()
            request_user_company = Company.objects.filter(
                id=request.user.company
            ).first()
            name = request_user_company.trading_name if request_user_company else "N/A"
            new_message = f"Accept registration on CrediSafe from {name} ? Give OTP below as confirmation."
            with contextlib.suppress(Exception):
                if request.user.can_send_email:
                    send_otp.delay(
                        request.build_absolute_uri(),
                        generate_otp(),
                        data.get("mobile"),
                        request.user.company,
                        individual.id,
                        "individual",
                        settings.ADD_INDIVIDUAL,
                        new_message,
                    )
            individual_employement_details = EmployementDetails(
                individual=individual.id,
                date_of_employment=data.get("date_of_employment"),
                job_title=data.get("job_title"),
                employer_name=data.get("employer_name"),
                employer_email=data.get("employer_email"),
                marital_status=data.get("marital_status"),
            )
            individual_employement_details.save()

            return redirect("individuals")

        except IntegrityError:
            err = "Individual already exists"
            props = {
                "errors": err.messages,
            }

            return render(request, "Client/Search/SearchIndividual", props)

def create_bulk_individuals(request):
    return create_bulk_individuals_helper(request)

@shared_task
def create_bulk_individuals_helper(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed"}, safe=False)
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8-sig")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string)
    skipped_rows = []
    created_rows = []
    valid_national_id = False
    next(reader)
    for i, row in enumerate(reader):
        first_name = row[0].upper()                                                     
        last_name = row[1].upper()
        identification_type = row[2].lower()
        identification_number = row[3].upper()
        gender = row[4].upper()
        dob = row[5]
        marital_status = row[6]
        address = row[7]
        mobile_number = row[8]
        landline = row[9]
        email = row[10]
        current_employer = row[11]
        job_title = row[12]
        date_of_employment = row[13]
        errors = []
        if dob:
            dob_object = convert_to_django_date(dob)
            dob = dob_object if dob_object is not None else None
        national_id_list = ["nationalid", "national id", "national_id"]
        if identification_type.lower().strip() in national_id_list:
            identification_type = "nationalid"
            if identification_number == "":
                errors.append("Missing identification number")
            else:
                valid_id_format = validate_national_id(identification_number)
                if valid_id_format:
                    valid_national_id = True
                else:
                    errors.append("Invalid national ID")
        elif identification_type.lower().strip() == "passport":
            identification_type = "passport"
            valid_national_id = True
        else:
            errors.append("Invalid identification type")

        if re.match(r"^7\d{8}$", mobile_number):
            mobile_number = f"2637{mobile_number[1:]}"
        elif mobile_number.startswith("263") and len(mobile_number) == 12:
            mobile_number = mobile_number
        else:
            errors.append("Invalid mobile number")
        if valid_national_id:
            individual = Individual(
                individual_adder=request.user.company,
                firstname=first_name,
                surname=last_name,
                identification_number=identification_number,
                national_id=identification_number,
                identification_type=identification_type,
                gender=gender,
                dob=dob,
                address=address,
                is_verified=True,
                mobile=mobile_number,
                land_line=landline,
                email=email,
            )
            if not Individual.objects.filter(
                ident=identification_number
            ).exists():
                individual.save()
                individual_employment_detail = EmployementDetails(
                    individual=individual.id,
                    date_of_employment=(date_of_employment or None),
                    job_title=job_title,
                    employer_name=current_employer,
                    employer_email="",
                    marital_status=marital_status or None,
                )
                individual_employment_detail.save()
                request_user_company = Company.objects.filter(
                    id=request.user.company
                ).first()
                # message = f"Hi {first_name} {last_name},\n You have been added to CrediSafe by {request_user_company.trading_name}."
                # with contextlib.suppress(Exception):
                    
                #     send_otp.delay(
                #         request.build_absolute_uri(),
                #         "",
                #         mobile_number,
                #         request.user.id,
                #         individual.id,
                #         "individual",
                #         settings.ADD_INDIVIDUAL,
                #         message,
                #     )
                created_rows.append(row)

        if errors:
            row.append(", ".join(errors))
            skipped_rows.append(row)

        # Return a CSV file with validation errors
    if skipped_rows:
        return _extracted_from_create_bulk_individuals_115(skipped_rows, request)
    response_data = {
        "status": "success",
        "message": "Individuals created successfully",
    }
    return JsonResponse(response_data, safe=False)

def _extracted_from_create_bulk_individuals_115(skipped_rows, request):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "First Name",
            "Surname",
            "Identification Type",
            "Identification Number",
            "Gender",
            "Date of Birth",
            "Marital Status",
            "Address",
            "Mobile Number",
            "Landline",
            "Email Address",
            "Current Employer",
            "Job Title",
            "Date of Employment",
            "Errors",
        ]
    )
    writer.writerow(["", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    writer.writerows(skipped_rows)
    output.seek(0)

    folder_path = os.path.join("data_upload", "templates")
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(
        folder_path, f"invalid_individual_data-{request.user.id}.csv"
    )

    with open(file_path, "w", newline="") as file:
        file.write(output.getvalue())
    return JsonResponse(
        {"status": "failed", "file_path": os.path.basename(file_path)},
        safe=False,
    )

@login_required
@clients_required
def create_company(request):
    return create_company_helper(request)

@shared_task
def create_company_helper(request):
    if request.method == "POST":
        create_company_schema = CreateCompanySchema()
        try:
            data = create_company_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Client/Search/SearchCompany", props)
        try:
            registration_number = data.get("companyRegistrationNumber") or None

            if registration_number:
                if existing_company := Company.objects.filter(
                    registration_number=registration_number
                ).first():
                    err = "Company already exists"
                    props = {
                        "errors": err,
                    }
                    return render(request, "Client/Search/SearchCompany", props)
            # Create the company
            company_ob = Company(
                registration_number=registration_number,
                registration_name=data.get("registeredName").upper(),
                trading_name=data.get("tradingName").upper(),
                industry=data.get("industry"),
                company_uploader=request.user.company,
                is_government=data.get("is_gvt"),
            )
            company_ob.save()

            # Create the company profile
            CompanyProfile.objects.create(
                company=company_ob.id,
                registration_date=(data.get("registrationDate") or None),
                vat_number=data.get("vatNumber"),
                current_address=data.get("currentAddress"),
                mobile_phone=data.get("mobileNumber"),
                email=data.get("emailAddress"),
                website=data.get("website"),
                note=data.get("note"),
                landline_phone=data.get("landLine"),
                branch=data.get("branch"),
            )
            email_ob = CompanyProfile.objects.filter(company=company_ob.id).first()
            # send email
            if email_ob:
                request_user_company = Company.objects.filter(
                    id=request.user.company
                ).first()
                name = (
                    request_user_company.trading_name if request_user_company else "N/A"
                )
                message = (
                    f"You have been uploaded to CrediSafe platform by {name.upper()}."
                )
                try:
                    user_password = generate_otp()
                    hash_password = make_password(user_password)
                    company_user = CustomUser(
                        email=email_ob.email,
                        user_id=email_ob.email,
                        company=company_ob.id,
                        user_type=1,
                        is_superuser=True,
                        password=hash_password,
                    )
                    company_user.save()
                    if request.user.id == 11:
                        send_otp.delay(
                            request.build_absolute_uri(),
                            generate_otp(),
                            email_ob.email,
                            request.user.company,
                            company_ob.id,
                            "company",
                            settings.ADD_COMPANY,
                            message,
                        )
                except Exception as e:
                    pass
                return render(
                    request,
                    "Client/Search/SearchCompany",
                    props={
                        # "success": "An account confirmation link has been sent to the company."
                        "success": "Company has been created."
                    },
                )
        except IntegrityError:
            err = "Company already exists"
            props = {
                "errors": err,
            }
            return render(request, "Client/Search/SearchCompany", props)

            # return redirect("cl-search-companies")
        # return render(request,'Individuals/Index',props={})
    return render(request, "Client/Search/SearchCompany", props={})

def create_bulk_companies(request):
    return create_bulk_companies_helper(request)

@shared_task
def create_bulk_companies_helper(request):
    if request.method != "POST":
        return JsonResponse({"status": "failed"}, safe=False)
    csv_file = request.FILES["csv_file"]
    decoded_file = csv_file.read().decode("utf-8-sig")
    io_string = io.StringIO(decoded_file)
    reader = csv.reader(io_string)
    skipped_rows = []
    created_rows = []
    next(reader)
    for i, row in enumerate(reader):
        registered_name = row[0].upper() + " " + row[2].upper()
        trading_name = row[1].upper()
        branch = row[2]
        registration_number = row[3].upper()
        registration_date = row[4]
        vat_number = row[5]
        current_address = row[6]
        landline = row[7]
        mobile_number = row[8]
        email = row[9]
        website = row[10]
        industry = row[11]
        is_government = row[12]
        note = row[13]
        errors = []
        if registration_date:
            registration_date_ob = convert_to_django_date(registration_date)
            if registration_date_ob is None:
                errors.append("Invalid registration date")
            else:
                registration_date = registration_date_ob

        if trading_name and registered_name:
            company = Company(
                registration_number=(registration_number or ""),
                registration_name=registered_name,
                trading_name=trading_name,
                industry=industry,
                company_uploader=request.user.company,
                is_government=True if "yes" in is_government.lower() else False,
            )
            if not Company.objects.filter(registration_name=registered_name).exists():
                if email:
                    validate_email_address = validate_bulk_email_addresses(email)
                    if validate_email_address == "true":
                        errors.append("This email is already in use")
                    elif (
                        validate_email_address == "invalid"
                        or validate_email_address != "valid"
                    ):
                        errors.append("Invalid email address")
                    else:
                        email = email.lower()
                        company.save()
                        CompanyProfile.objects.create(
                            company=company.id,
                            registration_date=(registration_date or None),
                            vat_number=vat_number,
                            current_address=current_address,
                            mobile_phone=mobile_number,
                            email=email,
                            website=website,
                            landline_phone=landline,
                            note=note,
                            branch=branch,
                        )
                        user_password = generate_otp()
                        hash_password = make_password(user_password)
                        with contextlib.suppress(IntegrityError):
                            company_user = CustomUser(
                                email=email,
                                user_id=email,
                                company=company.id,
                                user_type=1,
                                is_superuser=True,
                                password=hash_password,
                            )
                            company_user.save()
                            if request.user.id ==11:
                                send_auth_email.delay(
                                    email,
                                    user_password,
                                    email,
                                    registered_name,
                                )
                        created_rows.append(row)
                else:
                    errors.append("Missing email address")
        else:
            errors.append("Fill in trading name and registered name")
        if errors:
            row.append(", ".join(errors))
            skipped_rows.append(row)
    if skipped_rows:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            [
                "Registration Name",
                "Trading Name",
                "Branch",
                "Registration Number",
                "Registration Date",
                "VAT Number",
                "Current Address",
                "Landline Phone",
                "Mobile Number",
                "Email Address",
                "Website",
                "Industry",
                "Is Government",
                "Note",
                "Errors",
            ]
        )
        writer.writerow(["", "", "", "", "", "", "", "", "", "", "", "", "", "",""])
        writer.writerows(skipped_rows)
        output.seek(0)  # Reset the file pointer

        folder_path = os.path.join("data_upload", "templates")
        os.makedirs(folder_path, exist_ok=True)
        file_path = os.path.join(
            folder_path, f"invalid_company_data_{request.user.id}.csv"
        )

        with open(file_path, "w", newline="") as file:
            file.write(output.getvalue())
        return JsonResponse(
            {"status": "failed", "file_path": os.path.basename(file_path)},
            safe=False,
        )

    response_data = {
        "created_rows": created_rows,
    }
    return HttpResponse(response_data, content_type="application/json")

@login_required
@clients_required
def credit_given(request):
    return render(request, "CreditGiven/Index", props={})

@login_required
@clients_required
def credit_taken(request):
    return render(request, "CreditTaken/Index", props={})

@login_required
@clients_required
def create_user(request):
    if request.method != "POST":
        return redirect("client-users")
    if request.user.is_superuser:
        create_user_schema = CreateUserSchema()
        try:
            data = create_user_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Client/Users/Index", props)
        else:
            user_password = generate_otp()
            hash_password = make_password(user_password)

            if check_individual := Individual.objects.filter(
                identification_number=data.get("identificationNumber")
            ).first():
                # create user
                user = CustomUser(
                    email=data.get("userEmail"),
                    is_superuser=data.get("accessLevel") == "admin",
                    individual=int(check_individual.id),
                    company=request.user.company,
                    password=hash_password,
                )
                user.save()
                user_id =CustomUser.objects.get(email=data.get("userEmail")).user_id
                # send email with logins details
                if request.user.id ==11:
                    send_auth_email.delay(
                        user_id,
                        user_password,
                        data.get("userEmail"),
                        check_individual.firstname,
                    )
            else:
                # create individual and user
                individual = Individual(
                    national_id=data.get("identificationNumber").upper(),
                    firstname=data.get("firstName").upper(),
                    surname=data.get("lastName").upper(),
                    gender=data.get("gender"),
                    mobile=data.get("mobileNumber"),
                    address=data.get("address"),
                    identification_type=data.get("identificationType"),
                    identification_number=data.get("identificationNumber").upper(),
                )
                individual.save()
                individual_employment_details = EmployementDetails(
                    individual=individual.id,
                )
                individual_employment_details.save()

                # create user
                user = CustomUser(
                    email=data.get("userEmail"),
                    is_superuser=data.get("accessLevel") == "admin",
                    individual=int(individual.id),
                    company=request.user.company,
                    password=hash_password,
                )
                user.save()
                user_id =CustomUser.objects.get(email=data.get("userEmail")).user_id
                # send email
                if request.user.id ==11:
                    send_auth_email.delay(
                        user_id,
                        user_password,
                        data.get("userEmail"),
                        data.get("firstName"),
                    )

            props = {
                "success": "success",
            }
            return redirect("client-users")
    else:
        props = {
            "errors": "Only Admins can create a user.",
        }
        return render(request, "Client/Users/Index", props)

@login_required
@clients_required
def client_users(request):
    if request.method != "GET":
        return render(request, "Client/Users/Index", props={})
    if request.user.is_superuser:
        client_id = request.user.company
        users = CustomUser.objects.filter(company=int(client_id))
        user_list = []
        if users:
            user_dic = {}
            for user in users:
                if user.id not in user_dic.keys():
                    if individual := Individual.objects.filter(
                        id=user.individual
                    ).first():
                        user_dic[user.id] = {
                            "userId": user.id,
                            "firstName": individual.firstname,
                            "lastName": individual.surname,
                            "email": user.email,
                            "mobile": individual.mobile,
                            "address": individual.address,
                            "identificationNumber": individual.identification_number,
                            "identificationType": individual.identification_type,
                            "access_level": ("admin" if user.is_superuser else "user"),
                        }
            user_list.extend(iter(user_dic.values()))
        props = {"users": user_list}

    else:
        props = {"erros": "Only Admins can view users."}
    return render(request, "Client/Users/Index", props)

def destroy_user(request):
    if request.method == "POST":
        check_userschema = CheckUserSchema()
        try:
            data = check_userschema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            # #err.messages)
            return redirect("client-users")
        else:
            # delete user
            user = CustomUser.objects.filter(id=data.get("userId"))
            user.delete()

        return redirect("client-users")
    else:
        return redirect("client-users")

@login_required
@clients_required
def update_user(request):
    if request.method != "PUT":
        return redirect("client-users")
    update_user_schema = UpdateUserSchema()
    try:
        data = update_user_schema.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Users/Index", props)
    else:
        if check_user := CustomUser.objects.filter(id=data.get("userId")).first():
            # create user

            check_user.is_superuser = data.get("accessLevel") == "admin"

            check_user.save()

        return redirect("client-users")

# Active-Leases
@login_required
@clients_required
def client_active_leases(request):
    user = request.user.company
    active_leases = Lease.objects.filter(is_active=True, lease_giver=user)
    return render(request, "Leases/Index", {"active_leases": active_leases})

# Lease-Count
def check_subscription_and_lease_limit(request):
    user = request.user

    if subscription := Subcsriptions.objects.filter(
        user_id=user.id, is_activated=True
    ).first():
        lease_count = Lease.objects.filter(user=user).count()

        if lease_count < int(subscription.number_of_subscriptions):
            create_individual_lease(request)
            create_company_lease(request)
        else:
            return HttpResponse(
                "You have reached the maximum number of leases allowed."
            )
    else:
        return HttpResponse("You do not have any active subscriptions.")

# revised search indiv
@login_required
@clients_required
def individuals(request):
    if request.method == "POST":
        search_schema = SearchSchema()
        individuals_list = []
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:  # pylint: disable=unused-variable
            # #err.messages)
            return redirect("cl-search-individuals")
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip().upper()
            if searchParam == "fullname" and len(searchValue) > 0:
                searchWords = searchValue.split(" ")
                firstname = " ".join(searchWords[:-1]) if len(searchWords) > 1 else searchWords[0]
                surname = searchWords[-1] if len(searchWords) >= 2 else ""
                if surname:
                    print('surname',surname)
                    result = Individual.objects.filter(firstname__iexact=firstname ,surname__iexact=surname)
                else:
                    result = Individual.objects.filter(
                        Q(firstname__iexact=firstname) | Q(surname__iexact=firstname)
                    )
        
                    
                for i in result:
                    individuals_list.append(i)
                result = individuals_list

            elif searchParam:
                # #"search with natinalid")
                result = Individual.objects.filter(identification_number=searchValue.upper())
            individual_schema = IndividualSchema()
            individual = individual_schema.dump(result, many=True)
            props = {"result": individual}
            return render(request, "Client/Search/SearchIndividual", props)

    else:
        props = {}
        return render(request, "Client/Search/SearchIndividual", props)

@login_required 
@clients_required
def companies(request):
    if request.method != "POST":
        return render(request, "Client/Search/SearchCompany", props={})
    search_schema = SearchSchema()
    try:
        data = search_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return render(request, "Client/Search/SearchCompany", props)
    else:
        searchParam = data.get("searchParam")
        searchValue = data.get("searchValue", "").strip()
        if searchParam == "registration_name" and len(searchValue) > 0:
            result = Company.objects.filter(
                Q(registration_name__icontains=searchValue)
                | Q(trading_name__icontains=searchValue)
            ).values()
        elif searchParam == "registration_number" and len(searchValue) > 0:
            result = Company.objects.filter(
                Q(registration_number__iexact=searchValue)
            )
        company_schema = CompanySchema(many=True)
        companies = company_schema.dump(result)

        return render(
            request, "Client/Search/SearchCompany", props={"result": companies}
        )

@require_http_methods(["POST"])
def company_report(request):
    is_internal = Company.objects.filter(id=request.user.company).first()
    internal = is_internal.registration_name.lower() == "fincheck"
    require_otp = False
    is_eligible = True
    enquired_date = date.today()
    first_day_of_month = date(enquired_date.year, enquired_date.month, 1)
    _, last_day = calendar.monthrange(enquired_date.year, enquired_date.month)
    last_day_of_month = date(enquired_date.year, enquired_date.month, last_day)
    json_data = json.loads(request.body)
    try:
        company_ob = Company.objects.get(id=json_data["companyId"])
    except Exception:
        company_ob = None
    company_details, risk_data, score_range, historical_credit_accounts = {}, {}, {}, {}

    claims_list = tenant_claims(company_ob.id)
    historic_claims_list = historic_claims(company_ob.id)

    if company_ob:
        if company_profile := CompanyProfile.objects.filter(
            company=int(company_ob.id)
        ).first():
            registration_date = company_profile.registration_date or "N/A"
            trading_status = company_profile.trading_status or "N/A"
            website = company_profile.website or "N/A"
            telephone = company_profile.landline_phone or "N/A" ""
            current_address = company_profile.current_address
            mobile_phone = company_profile.mobile_phone
            email = company_profile.email
            current_address = company_profile.current_address or "N/A"
            mobile_phone = company_profile.mobile_phone or "N/A"
            email = company_profile.email or "N/A"
            if request.user.user_type == 1:

                number_of_enquiries = Enquiries.objects.filter(
                    enquiry_company_id=request.user.company
                ).count()
                enquiry_company = Company.objects.filter(
                    id=request.user.company
                ).first()
                if (
                    enquiry_company.is_client == False
                    and number_of_enquiries > 2
                    and first_day_of_month <= enquired_date <= last_day_of_month
                ):
                    is_eligible = False
                else:
                    is_eligible = True
                    require_otp = False
                    if email and enquiry_company.is_client == False:
                        require_otp = True
                        send_credit_check_email.delay(
                            generate_otp(),
                            email,
                            company_ob.trading_name,
                            settings.CREDIT_CHECK,
                            request.user.id,
                            company_ob.id,
                        )
            else:

                if json_data.get("enquirerId") != "" and request.user.user_type == 2:
                    enquirer_id = json_data.get("enquirerId")
                    if enquirer_company := CustomUser.objects.filter(
                        individual=enquirer_id
                    ).first():
                        enquirer_company_id = enquirer_company.company
                        enquiry_ob = Enquiries(
                            enquirer=enquirer_id,
                            enquiry_company_id=enquirer_company_id,
                            individual_company_id=company_ob.id,
                            date_of_enquiry=datetime.now(),
                            is_company_searched=True,
                            is_individual_searched=False,
                        )
                        enquiry_ob.save()
                    else:
                        enquirer_company_id = "N/A"
                is_eligible = True
        else:
            registration_date = trading_status = website = telephone = (
                current_address
            ) = mobile_phone = None
            mobile_phone = industry = trading_name = email = None

        registration_name = company_ob.registration_name
        registration_number = company_ob.registration_number
        trading_name = company_ob.trading_name
        industry = company_ob.industry

        company_details = {
            "registration_name": registration_name,
            "registration_number": registration_number,
            "trading_name": trading_name,
            "industry": industry,
            "registration_date": registration_date,
            "trading_status": trading_status,
            "website": website,
            "telephone": telephone,
            "current_address": current_address,
            "mobile_phone": mobile_phone,
            "email": email,
        }
        # Credit Type	Currency	Start Date	End Date	Principal Amount	Instalment Amount	Overdue Amount
        leases_list = active_credit_accounts(company_ob.id)
        color, score, level, score_level = check_credit_score(request, company_ob.id)
        risk_data = {
            "class": f"{level}",
            "color": f"{color}",
            "score": score,
        }  # low, medium, high
        score_range = {
            "class": f"{score_level}",  # Low Low Risk [LLR], Low Medium Risk [LMR], Low High Risk [LHR],High Low Risk [HLR], High Medium Risk [HMR], High High Risk [HHR]
            "index_range": score,
        }
        credit_details = leases_list

        historical_credit_accounts = {"list_of_historic_credit": []}
    internal_enquiry_details_list, external_enquiry_details_list = (
        request_user_company_company_enquiries(
            request, company_ob.id, json_data.get("enquirerId")
        )
    )
    return JsonResponse(
        {
            "is_eligible": is_eligible,
            "require_otp": require_otp,
            "company_details": company_details,
            "credit_details": credit_details,
            "risk_data": risk_data,
            "historical_credit_accounts": historical_credit_accounts,
            "score_range": score_range,
            "claims_list": claims_list,
            "historic_claims_list": historic_claims_list,
            "internal_enquiry_details_list": internal_enquiry_details_list,
            "external_enquiry_details_list": external_enquiry_details_list,
            "is_internal": internal,
        },
        safe=False,
    )

@require_http_methods(["POST"])
def individual_report(request):
    require_otp = False
    enquired_date = date.today()
    first_day_of_month = date(enquired_date.year, enquired_date.month, 1)
    _, last_day = calendar.monthrange(enquired_date.year, enquired_date.month)
    last_day_of_month = date(enquired_date.year, enquired_date.month, last_day)
    json_data = json.loads(request.body)
    try:
        individual_ob = Individual.objects.get(id=json_data["individualId"])
    except:
        individual_ob = None
    individual_details = risk_data = score_range = credit_details = (
        historical_credit_accounts
    ) = {}
    claims_list = tenant_claims(individual_ob.identification_number)
    historic_claims_list = historic_claims(individual_ob.identification_number)

    enquiry_company = Company.objects.filter(id=request.user.company).first()
    number_of_enquiries = Enquiries.objects.filter(
        enquiry_company_id=request.user.company
    ).count()
    if request.user.user_type == 2:
        if json_data.get("enquirerId"):
            enquirer_id = json_data.get("enquirerId")
            if enquirer_company := CustomUser.objects.filter(
                individual=enquirer_id
            ).first():
                enquirer_company_id = enquirer_company.company
                enquiry_ob = Enquiries(
                    enquirer=enquirer_id,
                    enquiry_company_id=enquirer_company_id,
                    individual_company_id=individual_ob.id,
                    date_of_enquiry=datetime.now(),
                    is_company_searched=False,
                    is_individual_searched=True,
                )
                enquiry_ob.save()
            else:
                enquirer_company_id = "N/A"
        if individual_ob:
            is_eligible = True
            if employment_detail := EmployementDetails.objects.filter(
                individual=individual_ob.id
            ).first():
                job_title = employment_detail.job_title
                employer_name = employment_detail.employer_name
                date_of_employment = employment_detail.date_of_employment
                marital_status = employment_detail.marital_status
            else:
                job_title = employer_name = date_of_employment = marital_status = ""

            national_id = individual_ob.identification_number
            firstname = individual_ob.firstname
            surname = individual_ob.surname
            mobile = individual_ob.mobile
            landline=individual_ob.land_line
            dob = individual_ob.dob
            gender = individual_ob.gender
            address = individual_ob.address
            email = individual_ob.email
            individual_details = {
                "national_id": national_id,
                "firstname": firstname,
                "surname": surname,
                "mobile": mobile,
                "landline": landline,
                "dob": dob,
                "gender": gender,
                "marital_status": marital_status,
                "email": email,
                "address": address,
                "job_title": job_title,
                "employer_name": employer_name,
                "date_of_employment": date_of_employment,
            }
            color, score, level, score_level = check_credit_score(request, national_id)
            risk_data = {
                "class": f"{level}",
                "color": f"{color}",
                "score": score,
            }  # low, medium, high
            score_range = {
                "class": f"{score_level}",  # Low Low Risk [LLR], Low Medium Risk [LMR], Low High Risk [LHR],High Low Risk [HLR], High Medium Risk [HMR], High High Risk [HHR]
                "index_range": score,
            }
            historical_credit_accounts = {"list_of_historic_credit": []}
    elif (
        number_of_enquiries >= 2
        and first_day_of_month <= enquired_date <= last_day_of_month
        and enquiry_company.is_client == False
    ):
        is_eligible = False
    else:
        is_eligible = True
        require_otp = False
        if individual_ob.mobile:
            mobile = individual_ob.mobile
            request_user_company = Company.objects.filter(
                id=request.user.company
            ).first()
            name = request_user_company.trading_name if request_user_company else "N/A"
            message = f"Accept Credit Check on CrediSafe from {name} ? Give OTP below as confirmation."
            otp = generate_otp()
            if enquiry_company.is_client == False:
                require_otp = True
                with contextlib.suppress(Exception):
                    if request.user.can_send_email:
                        send_otp.delay(
                            request.build_absolute_uri(),
                            otp,
                            mobile,
                            request.user.company,
                            individual_ob.id,
                            "individual",
                            settings.CREDIT_CHECK,
                            message,
                        )
            is_eligible = True
            if employment_detail := EmployementDetails.objects.filter(
                individual=individual_ob.id
            ).first():
                job_title = employment_detail.job_title
                employer_name = employment_detail.employer_name
                date_of_employment = employment_detail.date_of_employment
                marital_status = employment_detail.marital_status
            else:
                job_title = employer_name = date_of_employment = marital_status = ""

            national_id = individual_ob.identification_number
            firstname = individual_ob.firstname
            surname = individual_ob.surname
            mobile = individual_ob.mobile
            landline=individual_ob.land_line
            dob = individual_ob.dob
            gender = individual_ob.gender
            address = individual_ob.address
            email = individual_ob.email
            individual_details = {
                "national_id": national_id,
                "firstname": firstname,
                "surname": surname,
                "mobile": mobile,
                "landline":landline,
                "dob": dob,
                "gender": gender,
                "marital_status": marital_status,
                "email": email,
                "address": address,
                "job_title": job_title,
                "employer_name": employer_name,
                "date_of_employment": date_of_employment,
            }
            color, score, level, score_level = check_credit_score(request, national_id)
            risk_data = {
                "class": f"{level}",
                "color": f"{color}",
                "score": score,
            }  # low, medium, high
            score_range = {
                "class": f"{score_level}",  # Low Low Risk [LLR], Low Medium Risk [LMR], Low High Risk [LHR],High Low Risk [HLR], High Medium Risk [HMR], High High Risk [HHR]
                "index_range": score,
            }
    leases_list = active_credit_accounts(individual_ob.identification_number)
    credit_details = leases_list

    internal_enquiry_details_list, external_enquiry_details_list = (
        request_user_company_individual_enquiries(
            request, individual_ob.id, json_data.get("enquirerId")
        )
    )
    is_internal = Company.objects.filter(id=request.user.company).first()
    is_int = is_internal.registration_name.lower() == "fincheck"

    return JsonResponse(
        {
            "is_eligible": is_eligible,
            "require_otp": require_otp,
            "individual_details": individual_details,
            "risk_data": risk_data,
            "claims_list": claims_list,
            "historic_claims_list": historic_claims_list,
            "score_range": score_range,
            "credit_details": credit_details,
            "historical_credit_accounts": historical_credit_accounts,
            "internal_enquiry_details_list": internal_enquiry_details_list,
            "external_enquiry_details_list": external_enquiry_details_list,
            "is_internal": is_int,
        },
        safe=False,
    )

@login_required
@clients_required
def store_individual(request):
    if request.method != "POST":
        return render(request, "Client/Search/SearchIndividual", props={})
    create_individual_schema = CreateIndividualSchema()
    try:
        data = create_individual_schema.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Search/SearchIndividual", props)
    else:
        # try:
        individual = Individual(
            national_id=data.get("identificationNumber").upper(),
            individual_adder=request.user.id,
            firstname=data.get("firstname").upper(),
            surname=data.get("surname") or None,
            dob=data.get("dob") or None,
            gender=data.get("gender") or None,
            mobile=data.get("mobile"),
            email=data.get("email"),
            land_line=data.get("land_line"),
            address=data.get("address"),
            identification_type=data.get("identification_type"),
            identification_number=data.get("identificationNumber").upper(),
        )
        individual.save()
        individual_employement_details = EmployementDetails(
            individual=individual.id,
            date_of_employment=data.get("date_of_employment"),
            job_title=data.get("job_title"),
            employer_name=data.get("employer_name"),
            employer_email=data.get("employer_email"),
            marital_status=data.get("marital_status"),
        )
        individual_employement_details.save()
        request_user_company = Company.objects.filter(
            id=request.user.company
        ).first()
        name = request_user_company.trading_name if request_user_company else "N/A"
        new_message = f"Accept registration on CrediSafe from {name} ? Give OTP below as confirmation."
        # try:
        #     send_otp.delay(
        #     request.build_absolute_uri(),
        #     generate_otp(),
        #     data.get("mobile"),
        #     request.user.id,
        #     individual.id,
        #     "individual",
        #     settings.ADD_INDIVIDUAL,
        #     new_message,
        #     )
        # except Exception as e:
        #     pass

        # REPLACING THE ABOVE CODE WITH THE BELOW CODE
        user_password = generate_otp()
        hash_password = make_password(user_password)
        # create user
        user = CustomUser(
            email=individual.identification_number,
            is_superuser=False,
            company=0,
            individual=individual.id,
            user_type=4,
            password=hash_password,
        )
        user.save()

        return render(request, "Client/Search/SearchIndividual", props={})
        # except IntegrityError:
        #     props = {"errors": "Individual already exists"}
    return render(request, "Client/Search/SearchIndividual", props={})

@login_required
@clients_required
def store_individual_user(request):
    if request.method != "POST":
        # return redirect("individuals")
        return render(request, "Client/Search/SearchIndividual", props={})
    create_individual_schema = CreateIndividualSchema()
    try:
        data = create_individual_schema.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Search/SearchIndividual", props)
    else:
        try:
            individual = Individual(
                individual_adder=request.user.id,
                national_id=data.get("identificationNumber").upper(),
                firstname=data.get("firstname").upper(),
                surname=data.get("surname").upper(),
                dob=data.get("dob"),
                gender=data.get("gender"),
                mobile=data.get("mobile"),
                email=data.get("emailAddress"),
                land_line=data.get("landLine"),
                address=data.get("address"),
                identification_type=data.get("identification_type"),
                identification_number=data.get("identificationNumber").upper(),
                is_user=True,
            )
            individual.save()

            request_user_company = Company.objects.filter(
                id=request.user.company
            ).first()
            name = request_user_company.trading_name if request_user_company else "N/A"
            new_message = f"Accept registration on CrediSafe {name} ? Give OTP below as confirmation."
            # try:
            #     send_otp.delay(
            #     request.build_absolute_uri(),
            #     generate_otp(),
            #     data.get("mobile"),
            #     request.user.id,
            #     individual.id,
            #     "individual",
            #     settings.ADD_INDIVIDUAL_USER,
            #     new_message,
            #     )
            # except Exception as e:
            #     pass

            individual_employement_details = EmployementDetails(
                individual=individual.id,
                date_of_employment=data.get("date_of_employment"),
                job_title=data.get("job_title"),
                employer_name=data.get("employer_name"),
                employer_email=data.get("employer_email"),
                marital_status=data.get("marital_status"),
            )
            individual_employement_details.save()

            # REPLACING THE ABOVE OTP SENDING WITH CODE BELOW
            user_password = generate_otp()
            hash_password = make_password(user_password)
            # create user
            user = CustomUser(
                email=individual.identification_number,
                is_superuser=False,
                company=0,
                individual=individual.id,
                user_type=4,
                password=hash_password,
            )
            user.save()

            # return redirect("individuals")
            return render(request, "Client/Search/SearchIndividual", props={})
        except IntegrityError:
            props = {"errors": "Individual already exists"}
    return render(request, "Client/Search/SearchIndividual", props={})

@login_required
@clients_required
def verify_individual_otp(request):
    if request.method != "POST":
        return render(request, "Client/Search/SearchIndividual", props={})
    otp_schema = OTPSchema()
    try:
        data = otp_schema.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return render(request, "Client/Search/SearchIndividual", props)
    check_otp = OTP.objects.filter(otp_code=data.get("otp")).first()
    if (
        check_otp
        and check_otp.requested_user_type == "individual"
        or check_otp.requested_user_type == "agent"
        and check_otp.otp_type == settings.CREDIT_CHECK
    ):
        if req_user := Individual.objects.filter(id=check_otp.requested_user).first():
            req_user.is_verified = True
            req_user.save()
            check_otp.delete()
    if (
        check_otp
        and check_otp.requested_user_type == "individual"
        and check_otp.otp_type == settings.ADD_INDIVIDUAL
    ):
        req_user = Individual.objects.filter(id=check_otp.requested_user).first()
        if req_user:
            req_user.is_verified = True
            req_user.save()
            user_password = generate_otp()
            hash_password = make_password(user_password)
        if req_user and req_user.is_verified:
            # create user
            user = CustomUser(
                email=req_user.identification_number,
                is_superuser=False,
                company=int(request.user.company),
                individual=req_user.id,
                user_type=4,
                password=hash_password,
            )
            user.save()
            created_user = CustomUser.objects.filter(
                email=req_user.identification_number
            ).first()
            new_message = f"Hi {req_user.firstname}!, Your CrediSafe account has been created. Your login credentials are : \n User Pin: {created_user.user_id} \n Pincode: {user_password}"
            otp_code = ""

            # try:
            #    send_otp.delay(
            #     request.build_absolute_uri(),
            #     otp_code,
            #     req_user.mobile,
            #     request.user.id,
            #     req_user.id,
            #     "individual",
            #     settings.ADD_INDIVIDUAL,
            #     new_message,
            # )
            # except Exception as e:
            # pass
    props = {"is_verified": True}

    return render(request, "Client/Search/SearchIndividual", props)

@login_required
@clients_required
def store_company(request):
    if request.method == "POST":

        create_company_schema = CreateCompanySchema()
        try:
            data = create_company_schema.loads(request.body)
        except ValidationError as err:
            # #err.messages)
            props = {
                "errors": err.messages,
            }
            return render(request, "Client/Search/SearchCompany", props)
        try:
            company_ob = Company(
                registration_number=data.get("companyRegistrationNumber"),
                registration_name=data.get("registeredName").upper(),
                trading_name=data.get("tradingName").upper(),
                industry=data.get("industry"),
            )
            company_ob.save()
            CompanyProfile.objects.create(
                company=company_ob.id,
                registration_date=data.get("registrationDate"),
                vat_number=data.get("vatNumber"),
                current_address=data.get("currentAddress"),
                mobile_phone=data.get("mobileNumber"),
                email=data.get("emailAddress"),
                website=data.get("website"),
                branch=data.get("branch"),
            )
            email_ob = CompanyProfile.objects.filter(company=company_ob.id).first()
            user_password = generate_random_password(8)
            hash_password = make_password(user_password)
            if company_ob:
                # create user
                user = CustomUser(
                    email=data.get("emailAddress"),
                    is_superuser=True,
                    individual=int(company_ob.id),
                    company=request.user.company,
                    password=hash_password,
                )
                user.save()
                if request.user.id ==11:
                    send_auth_email.delay(
                        data.get("emailAddress"),
                        user_password,
                        data.get("emailAddress"),
                        company_ob.registration_name,
                    )

            if email_ob:
                message = " "
                try:
                    if request.user.can_send_email:
                        send_otp.delay(
                            request.build_absolute_uri(),
                            generate_otp(),
                            email_ob.email,
                            request.user.company,
                            company_ob.id,
                            "company",
                            settings.ADD_COMPANY,
                            message,
                        )
                except Exception as e:
                    pass
            return render(request, "Client/Search/SearchCompany", props={})

        except IntegrityError:
            err = "Company already exists"
            props = {
                "errors": err,
            }
            return render(request, "Companies/Client", props)
        # return render(request,'Individuals/Index',props={})
    return render(request, "Client/Search/SearchCompany", props={})

@login_required
@clients_required
def verify_company_otp(request):
    if request.method != "POST":
        return render(request, "Client/Search/SearchCompany", props={})
    otp_schema = OTPSchema()
    try:
        data = otp_schema.loads(request.body)

    except ValidationError as err:
        props = {"errors": err.messages}
        return render(request, "Client/Search/SearchCompany", props)
    if check_otp := OTP.objects.filter(otp_code=data.get("otp")).first():
        props = {"is_verified": True}
        check_otp.delete()

    return render(request, "Client/Search/SearchCompany", props)

def subscription_period_remaining(request, type):
    user_company = Company.objects.filter(id=request.user.company).first()
    if type == "individual":
        sub = Subcsriptions.objects.filter(
            subscriber_id=user_company.id,
            is_activated=True,
            subscription_class="individual",
        ).last()
    else:
        sub = Subcsriptions.objects.filter(
            subscriber_id=user_company.id,
            is_activated=True,
            subscription_class="company",
        ).last()
    sub_dic = {}
    sub_list = []
    months_remaining = 0
    if sub:
        period_ob = SubcsriptionPeriod.objects.filter(id=sub.period).first()
        period = period_ob.name
        if period == "Yearly":
            period_length = 12
        elif period == "Half-Yearly":
            period_length = 6
        elif period == "Quartely":
            period_length = 3
        else:
            period_length = "N/A"
        datetime_string = sub.start_date
        datetime_obj = datetime.fromisoformat(f"{datetime_string}")
        sub_start = datetime_obj.strftime("%Y-%m-%d")
        sub_start_date = datetime.strptime(sub_start, "%Y-%m-%d").date()
        sub_end = datetime_obj + relativedelta(months=period_length)
        datetime_ob = datetime.fromisoformat(f"{sub_end}")
        sub_end = datetime_ob.strftime("%d-%B-%Y")
        now = date.today()
        sub_end_date = datetime.strptime(sub_end, "%d-%B-%Y").date()
        if sub_start_date <= now:
            days_remaining = (sub_end_date - now).days
            if days_remaining > 0:
                months_remaining = days_remaining // 30
            else:
                months_remaining = 0

    return months_remaining

@require_http_methods(["POST"])
def open_subscription(request):
    user_company = Company.objects.filter(id=request.user.company).first()
    subscriptions = Subcsriptions.objects.filter(subscriber_id=user_company.id, subscription_class="combined")
    sub_dic = {}
    sub_list = []
    
    for sub in subscriptions:
        activated_leases = Lease.objects.filter(
            lease_giver=user_company.id, is_active=True, subscription=sub.id
        ).count()
        subscription_slots = int(sub.number_of_subscriptions) - int(activated_leases)
        if sub.id not in sub_dic.keys():
            service = Services.objects.filter(id=sub.service_id).first()
            period_ob = SubcsriptionPeriod.objects.filter(id=sub.period).first()
            period = period_ob.name
            if period == "Yearly":
                period_length = 12
            elif period == "Half-Yearly":
                period_length = 6
            elif period == "Quartely":
                period_length = 3
            else:
                period_length = "N/A"
            datetime_string = sub.start_date
            datetime_obj = datetime.fromisoformat(f"{datetime_string}")
            sub_start = datetime_obj.strftime("%Y-%m-%d")
            sub_start_date = datetime.strptime(sub_start, "%Y-%m-%d").date()
            sub_end = datetime_obj + relativedelta(months=period_length)
            datetime_ob = datetime.fromisoformat(f"{sub_end}")
            sub_end = datetime_ob.strftime("%d-%B-%Y")
            now = date.today()
            sub_end_date = datetime.strptime(sub_end, "%d-%B-%Y").date()
            if sub_start_date <= now:
                days_remaining = (sub_end_date - now).days
                if days_remaining > 0:
                    months_remaining = days_remaining // 30
                else:
                    months_remaining = 0

            start_date = sub.start_date.strftime("%d-%B-%Y")
            end_date = sub.end_date.strftime("%d-%B-%Y")
            if service and period_ob and int(months_remaining) > 0:
                sub_dic.update(
                    {
                        sub.id: {
                            "sub_id": sub.id,
                            "subscription_class": sub.subscription_class,
                            "service": service.service_name,
                            "period_left": months_remaining,
                            "period_length": period_length,
                            "open_slots": subscription_slots,
                            "start_date": start_date,
                            "end_date": end_date,
                        }
                    }
                )

    for key, value in sub_dic.items():
        sub_list.append(value)

    return JsonResponse(sub_list, safe=False)

@require_http_methods(["POST"])
def delete_lease(request):
    data = json.loads(request.body.decode("utf-8"))
    if lease := Lease.objects.filter(lease_id=data["leaseId"]).first():
        lease.is_active = False
        lease.is_terminated = True
        lease.termination_date = date.today()
        lease.save()

    return redirect("client-leases")

def create_lease_payments(
    lease_id,
    amount_paid,
    date,
    month,
    owing_amount,
    balance_amount,
    reference,
    description,
):

    if float(owing_amount) > float(amount_paid):
        balance = float(balance_amount) - float(amount_paid)
        balance_amount = balance

    elif float(owing_amount) < float(amount_paid):
        debited_amount = float(amount_paid) - float(balance_amount)
    elif float(balance_amount) == float(amount_paid):
        balance_amount = 0
    else:
        balance_amount = balance_amount

    lease_payment = LeasePayments(
        lease_id=lease_id,
        payment_amount=amount_paid,
        date=date,
        month=month,
        payment_reference=reference,
        description=description,
        owing_amount=owing_amount,
        balance_amount=owing_amount,
        is_balance_checked=True,
    )
    lease_payment.save()

def create_lease_receipts(lease_id, date, payment_id):
    lease_receipt = Receipt(lease_id=lease_id, date=date, payment_id=payment_id)
    lease_receipt.save()

# TODO: client leases
def filter_by_name(leases, name):
    return {
        key: value for key, value in leases.items() if name in value["name"].lower()
    }

def write_off(request):
    data= json.loads(request.body)
    lease_id = data.get('lease_id')
    return credit_journal(request,lease_id) if lease_id else JsonResponse({'error':'lease not found'},status=400)

def client_leases_new(request,leases_type=None):
    
    # get query parameters
    search_value = request.GET.get("name", "").lower()
    page_number = int(request.GET.get("page", 1))
    color_filter = request.GET.get("color")

    # pagination variables
    items_per_page = 200

    # initialize variables
    name, rent_guarantor, mobile, email, trading_name = "", "", "", "", ""
    owing_amount, color = 0, "success"
    
    # get all leases that match the query
    names_list = search_value.split()
    fname = names_list[0] if len(names_list) > 0 else ""
    sname = names_list[1] if len(names_list) > 1 else fname
    # get individual and company ids
    # individual_ids = Individual.objects.filter(
    #     Q(firstname__icontains=fname) | Q(surname__icontains=sname) | Q(identification_number__icontains=search_value)
    # ).values("identification_number")

    # company_ids = Company.objects.filter(
    #     Q(registration_name__icontains=search_value) | Q(trading_name__icontains=search_value) | Q(registration_number__icontains=search_value)
    # ).values("id")
    individual_ids = Individual.objects.filter(
        Q(firstname__icontains=fname) | Q(surname__icontains=sname) | Q(identification_number__icontains=search_value)
        ).annotate(id_str=Cast('identification_number', output_field=CharField())).values_list('id_str', flat=True)

    company_ids = Company.objects.filter(
            Q(registration_name__icontains=search_value) | Q(trading_name__icontains=search_value) | Q(registration_number__icontains=search_value)
        ).annotate(id_str=Cast('id', output_field=CharField())).values_list('id_str', flat=True)


    query_ids = individual_ids.union(company_ids)

    # get active leases for the superuser
    if leases_type == "individuals":
        base_lease_queryset = Lease.objects.filter(is_individual=True,lease_giver=request.user.company)
    elif leases_type == "companies":
        base_lease_queryset = Lease.objects.filter(is_company=True,lease_giver=request.user.company)
    elif leases_type == "combined":
        base_lease_queryset = Lease.objects.all(lease_giver=request.user.company)
    else:
        base_lease_queryset = Lease.objects.filter(
            lease_giver=request.user.company if request.user.is_superuser else request.user.company,
            reg_ID_Number__in=query_ids,
        )
    # Apply color filter if provided
    if color_filter:
        if color_filter == "black":
            new_status = 'NON-PAYER'
        elif color_filter == "orange":
            new_status = 'MEDIUM'
        elif "#991b1b" in color_filter:
            new_status = 'HIGH-HIGH'
        elif color_filter == "#f87171":
            new_status = 'HIGH'
        else:
            new_status = 'SAFE'
        base_lease_queryset = base_lease_queryset.filter(status_cache=new_status)
        

    paginator = Paginator(base_lease_queryset.order_by("created_date"), items_per_page)
    leases = paginator.get_page(page_number)

    lease_dict = {}
    
    for i in leases:
       
        opening_balance_date = Opening_balance.objects.filter(lease_id=i.lease_id).first()
        remaining_period = subscription_period_remaining(request, "company" if i.is_company else "individual")
        rent_guarantor = Individual.objects.filter(national_id=i.rent_guarantor_id).first() if i.is_company else None
        name, trading_name, mobile, email = "", "", "N/A", "N/A"
        company_id, individual_id = None, None
        
        # Determine lease color based on status_cache
        if i.status_cache == "NON-PAYER":
            color = "black"
        elif i.status_cache == "HIGH-HIGH":
            color = "danger"
        elif i.status_cache == "HIGH":
            color = "light-red"
        elif i.status_cache == "MEDIUM":
            color = "warning"
        else:
            color = "success"

        if i.is_company:
            if company_ob := Company.objects.filter(id=i.reg_ID_Number).first():
                name, trading_name = company_ob.registration_name, company_ob.trading_name
                if company_profile := CompanyProfile.objects.filter(company=company_ob.id).first():
                    mobile, email = company_profile.mobile_phone or "N/A", company_profile.email or "N/A"
                    company_id = company_ob.id
        else:
            if individual_ob := Individual.objects.filter(national_id=i.reg_ID_Number.upper()).first():
                name = f"{individual_ob.firstname} {individual_ob.surname}"
                mobile = individual_ob.mobile
                individual_id = individual_ob.id

        lease_payment_detail = LeasePayments.objects.filter(lease_id=i.lease_id).last()
        opening_balance_amount = Opening_balance.objects.filter(lease_id=i.lease_id).last()
        owing_amount = float(opening_balance_amount.outstanding_balance) if opening_balance_amount else 0

        agent_info = Landlord.objects.filter(lease_id=i.lease_id).first()
        hundred_days_ago = date.today() - timedelta(days=100)
        is_100_days_ago = True if i.termination_date and i.termination_date < hundred_days_ago else False
        is_terminated_lease_eligible = True if (i.is_terminated == True and owing_amount >= 0 and is_100_days_ago)  else False
        if i.lease_id not in lease_dict and not is_terminated_lease_eligible:
            lease_dict[i.lease_id] = {
                "id": individual_id if i.is_individual else company_id,
                "name": name,
                "trading_name": trading_name,
                "address": i.address,
                "email": email,
                "mobile": mobile,
                "rent_guarantor_name": f"{rent_guarantor.firstname} {rent_guarantor.surname}" if rent_guarantor else "N/A",
                "rent_guarantor_id": rent_guarantor.identification_number if rent_guarantor else "N/A",
                "customer_number": i.account_number,
                "lease_id": i.lease_id,
                "reg_ID_Number": i.reg_ID_Number,
                "is_company": i.is_company,
                "lease_details": i.lease_details,
                "deposit_amount": i.deposit_amount,
                "deposit_period": i.deposit_period,
                "monthly_rentals": round(float(i.monthly_rentals), 2),
                "owing_amount": round(owing_amount, 2),
                "currency": i.currency,
                "opening_balance_date": opening_balance_date.date_created.date() if opening_balance_date else None,
                "lease_period": remaining_period,
                "agent_reg_number": agent_info.reg_ID_Number if agent_info else "N/A",
                "agent_name": agent_info.landlord_name if agent_info else "N/A",
                "agent_id": agent_info.landlord_id if agent_info else "N/A",
                "commission_amount": agent_info.agent_commission if agent_info else "N/A",
                "agent_opening_balance": agent_info.opening_balance if agent_info else "N/A",
                "rent_variable": i.rent_variables,
                "status": i.status,
                "terminated": True if i.is_active == False else False,
                "color": color,
                "start_date": i.start_date,
                "end_date": i.end_date,
                "expired": True if date.today() > i.end_date else False,
                "payment_period_start": i.payment_period_start,
                "payment_period_end": i.payment_period_end,
            }

    is_debt_call = request.GET.get("is_debt_call", False)
    print('is_debt_call', is_debt_call, request.GET)
    if is_debt_call:
        data = {
            "total_pages": paginator.num_pages,
            "total_items": paginator.count,
            "current_page": page_number,
            "leases": list(lease_dict.values()),
            "queryParams": request.GET.dict(),
        },
        return JsonResponse(data, safe=False)

    return render(
        request,
        "Leases/Index",
        {
            "total_pages": paginator.num_pages,
            "total_items": paginator.count,
            "current_page": page_number,
            "leases": list(lease_dict.values()),
            "queryParams": request.GET.dict(),
        },
    )

@login_required
@clients_required
def client_leases(request):
    # return client_leases_old(request)
    return client_leases_new(request)
    
# TODO: all active lease on receipt
@require_http_methods(["GET"])
@shared_task
def get_all_active_leases(request):
    leases = receipt_leases(request)
    lease_dic = {}
    lease_list = []
    for i in leases:
        lease_payment_detail = LeasePayments.objects.filter(lease_id=i.lease_id).last()
        opening_balance_amount = Opening_balance.objects.filter(lease_id=i.lease_id)
        if lease_payment_detail or opening_balance_amount.last():
            balance_amount = float(opening_balance_amount.last().outstanding_balance)

        if i.status_cache == "NON-PAYER":
            color = "black"
        elif i.status_cache == "HIGH-HIGH":
            color = "danger"
        elif i.status_cache == "HIGH":
            color = "light-red"
        elif i.status_cache == "MEDIUM":
            color = "warning"
        else:
            color = "success"

        if i.is_individual:
            try:
                individual_ob = Individual.objects.filter(
                    national_id=i.reg_ID_Number.upper()
                ).first()
                tenant_name = individual_ob.firstname + " " + individual_ob.surname
            except:
                tenant_name = "N/A"
        elif i.is_company:
            try:
                company_ob = Company.objects.filter(id=i.reg_ID_Number).first()
                tenant_name = company_ob.registration_name
            except:
                tenant_name = "N/A"
        else:
            tenant_name = "N/A"
        if i.lease_id not in lease_dic.keys():
            lease_dic.update(
                {
                    i.lease_id: {
                        "lease_id": i.lease_id,
                        "is_variable": i.rent_variables,
                        "address": i.address,
                        "Currency": i.currency,
                        "rent_owing": round(float(balance_amount),2),
                        "balance_amount": round(float(balance_amount),2),
                        "tenant": tenant_name,
                        "color": color,
                        "opening_balance_date": (
                            opening_balance_amount.first().date_created
                            if opening_balance_amount.first()
                            else "N/A"
                        ),
                    }
                }
            )
    for key, value in lease_dic.items():
        lease_list.append(value)

    return JsonResponse({"result": lease_list}, safe=False)

def receipt_leases(request):

    search_value = request.GET.get("query")
    if not search_value or len(search_value) < 4:
        leases = Lease.objects.none()
        return leases

    firstname = search_value.split()[0] if len(search_value) > 0 else search_value
    try:
        surname = search_value.split()[1] if len(search_value) > 1 else firstname
    except:
        surname = firstname
    receiver_data_individual = Individual.objects.filter(
        Q(firstname__icontains=firstname)
        | Q(surname__icontains=surname)
        | Q(identification_number__icontains=firstname)
    )
    lease_id = [receiver.identification_number for receiver in receiver_data_individual]
    receiver_data_company = Company.objects.filter(
        Q(registration_name__icontains=firstname)
        | Q(trading_name__icontains=search_value)
        | Q(registration_number__icontains=firstname)
    )
    lease_id.extend([receiver.id for receiver in receiver_data_company])
    leases = Lease.objects.filter(
        lease_giver=request.user.company, reg_ID_Number__in=lease_id, is_active=True
    )
    return leases

    # query = request.GET.get('query', '')
    # if query:
    #         results = core_models.Insurance.objects.filter(Q(insurance_number__icontains=query))
    #         data = [{'id': insurance.id, 'name': insurance.insurance_number} for insurance in results]
    # else:
    #     data = []
    # return JsonResponse(data, safe=False)

def update_lease_status(lease_id):
    lease = Lease.objects.filter(lease_id=lease_id).first()
    lease_status = ""
    lease_payment_detail = LeasePayments.objects.filter(lease_id=lease.lease_id).last()
    previous_amounts = Opening_balance.objects.filter(lease_id=lease.lease_id).last()
        
    if lease_payment_detail or previous_amounts:
        three_months_plus = (
            float(previous_amounts.three_months_plus)
            if previous_amounts.three_months_plus != ""
            else 0
        )
        three_months_back = (
            float(previous_amounts.three_months_back)
            if previous_amounts.three_months_back != ""
            else 0
        )
        two_months_back = (
            float(previous_amounts.two_months_back)
            if previous_amounts.two_months_back != ""
            else 0
        )
        one_month_back = (
            float(previous_amounts.one_month_back)
            if previous_amounts.one_month_back != ""
            else 0
        )
        if float(previous_amounts.outstanding_balance) < 0:
            lease.status = "SAFE"
        elif three_months_plus > 0:
            lease.status = "NON-PAYER"
        elif three_months_back > 0 and three_months_plus <= 0:
            lease.status = "HIGH-HIGH"
        elif two_months_back > 0 and three_months_back + three_months_plus <= 0:
            lease.status = "HIGH"

        elif one_month_back > 0 and two_months_back + three_months_back <= 0:
            lease.status = "MEDIUM"
        else:
            lease.status = "SAFE"
        lease.save()
    lease_status = lease.status_cache
    return lease_status


def check_credit_score(request, indvidual_ob):

    score_status = "SAFE"
    if active_leases := Lease.objects.filter(
        reg_ID_Number=indvidual_ob
    ):
        ratings = [lease.status_cache for lease in active_leases]
        if "NON-PAYER" in ratings:
            score_status = "NON-PAYER"
        elif "HIGH-HIGH" in ratings:
            score_status = "HIGH-HIGH"
        elif "HIGH" in ratings:
            score_status = "HIGH"
        elif "MEDIUM" in ratings:
            score_status = "MEDIUM"
        else:
            score_status = "SAFE"
    elif active_leases := Lease.objects.filter(
        is_company=True, rent_guarantor_id=indvidual_ob
    ):
        
        ratings = [lease.status_cache for lease in active_leases]
        if "NON-PAYER" in ratings:
            score_status = "NON-PAYER"
        elif "HIGH-HIGH" in ratings:
            score_status = "HIGH-HIGH"
        elif "HIGH" in ratings:
            score_status = "HIGH"
        elif "MEDIUM" in ratings:
            score_status = "MEDIUM"
        else:
            score_status = "SAFE"
    color, score, level, score_level = calculate_color_and_score(score_status)
    return color, score, level, score_level

def calculate_color_and_score(score_status):
    color, score, level, score_level = "green", 420, "low", "LLR"
    if score_status == "SAFE":
        color = "green"
        level = "low"
        score_level = "LLR"
        score = random.randint(417, 500)
    elif score_status == "MEDIUM":
        color = "orange"
        score_level = "LMR"
        level = "medium"
        score = random.randint(250, 332)
    elif score_status == "HIGH":
        level = "high"
        score_level = "LHR"
        color = "#ff33cc"
        score = random.randint(83, 165)
    elif score_status == "HIGH-HIGH":
        level = "high-high"
        score_level = "HHR"
        color = "red"
        score = random.randint(0, 82)
    elif score_status == "NON-PAYER":
        score_level = "HHR"
        level = "non-payer"
        color = "black"
        score = random.randint(0, 70)
    return color, score, level, score_level

@login_required
@clients_required
def change_password(request):
    if request.method != "POST":
        return render(request, "Client/Profile/ResetPassword")
    user_password_change = PasswordChangeSchema()
    try:
        data = user_password_change.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Profile/ResetPassword", props)
    else:
        new_password = str(data.get("newPassword"))
        confirmed_password = str(data.get("confirmPassword"))
        old_password = data.get("oldPassword")

        if check_password(old_password, request.user.password):
            if confirmed_password == new_password:
                user_password = data.get("confirmPassword")
                hash_password = make_password(user_password)

                user = CustomUser.objects.filter(email=request.user.email).first()
                user.password = hash_password
                user.save()

                props = {"success": "Password Changed Successfully!"}
            else:
                props = {"error": "New Passwords don't match!"}

        else:
            props = {"error": "Wrong Old Password"}
        return render(request, "Client/Profile/ResetPassword", props)


@require_http_methods(["POST"])
def enquiry_count(request):
    data = json.loads(request.body.decode("utf-8"))
    today_date = date.today()
    if request.method == "POST":
        request_user_company = Company.objects.filter(id=request.user.company).first()
        enquired_comp_ind = (
            data["individualId"] if data["isIndividual"] == True else data["companyId"]
        )
        enquiry = Enquiries.objects.filter(
            enquirer=request.user.individual,
            individual_company_id=enquired_comp_ind,
            enquiry_company_id=request.user.company,
        ).last()
        if request_user_company.is_client == True:
            if enquiry:
                enquiry_ob = Enquiries(
                    enquirer=request.user.individual,
                    enquiry_company_id=request.user.company,
                    individual_company_id=(
                        data["individualId"]
                        if data["isIndividual"] == True
                        else data["companyId"]
                    ),
                    is_company_searched=True if data["isCompany"] == True else False,
                    is_individual_searched=(
                        True if data["isIndividual"] == True else False
                    ),
                )
                if today_date != enquiry.date_of_enquiry:
                    enquiry_ob.save()
                    return JsonResponse({"message": "Ok"}, safe=False)
            else:
                enquiry_ob = Enquiries(
                    enquirer=request.user.individual,
                    enquiry_company_id=request.user.company,
                    individual_company_id=(
                        data["individualId"]
                        if data["isIndividual"] == True
                        else data["companyId"]
                    ),
                    is_company_searched=True if data["isCompany"] == True else False,
                    is_individual_searched=(
                        True if data["isIndividual"] == True else False
                    ),
                )
                enquiry_ob.save()
                return JsonResponse({"message": "Ok"}, safe=False)

        elif request_user_company.is_client == False and request.user.user_type != 2:
            enquired_date = date.today()
            first_day_of_month = date(enquired_date.year, enquired_date.month, 1)
            _, last_day = calendar.monthrange(enquired_date.year, enquired_date.month)
            last_day_of_month = date(enquired_date.year, enquired_date.month, last_day)
            enquiries = Enquiries.objects.filter(
                enquiry_company_id=request.user.company
            ).count()
            if (
                enquiries <= 2
                and first_day_of_month <= enquired_date <= last_day_of_month
            ):
                if enquiry:
                    enquiry_ob = Enquiries(
                        enquirer=request.user.individual,
                        enquiry_company_id=request.user.company,
                        individual_company_id=(
                            data["individualId"]
                            if data["isIndividual"] == True
                            else data["companyId"]
                        ),
                        is_company_searched=(
                            True if data["isCompany"] == True else False
                        ),
                        is_individual_searched=(
                            True if data["isIndividual"] == True else False
                        ),
                    )
                    if today_date != enquiry.date_of_enquiry:
                        enquiry_ob.save()
                        return JsonResponse({"message": "Ok"}, safe=False)
                else:
                    enquiry_ob = Enquiries(
                        enquirer=request.user.individual,
                        enquiry_company_id=request.user.company,
                        individual_company_id=(
                            data["individualId"]
                            if data["isIndividual"] == True
                            else data["companyId"]
                        ),
                        is_company_searched=(
                            True if data["isCompany"] == True else False
                        ),
                        is_individual_searched=(
                            True if data["isIndividual"] == True else False
                        ),
                    )
                    enquiry_ob.save()
                    return JsonResponse({"message": "Ok"}, safe=False)
        else:
            if request.user.user_type == 2:
                if data.get("isInternal"):
                    if enquiry:
                        enquiry_ob = Enquiries(
                            enquirer=request.user.individual,
                            enquiry_company_id=request.user.company,
                            individual_company_id=(
                                data["individualId"]
                                if data["isIndividual"] == True
                                else data["companyId"]
                            ),
                            is_company_searched=(
                                True if data["isCompany"] == True else False
                            ),
                            is_individual_searched=(
                                True if data["isIndividual"] == True else False
                            ),
                        )
                        if today_date != enquiry.date_of_enquiry:
                            enquiry_ob.save()
                            return JsonResponse({"message": "Ok"}, safe=False)
                    else:
                        enquiry_ob = Enquiries(
                            enquirer=request.user.individual,
                            enquiry_company_id=request.user.company,
                            individual_company_id=(
                                data["individualId"]
                                if data["isIndividual"] == True
                                else data["companyId"]
                            ),
                            is_company_searched=(
                                True if data["isCompany"] == True else False
                            ),
                            is_individual_searched=(
                                True if data["isIndividual"] == True else False
                            ),
                        )
                        enquiry_ob.save()
                        return JsonResponse({"message": "Ok"}, safe=False)
    else:
        pass
        return JsonResponse({"message": "Not Ok"}, safe=False)
    return JsonResponse({"message": "Ok"}, safe=False)


def client_statements_new(request):
    if request.method == "POST":
        return render(request, "Client/Accounting/Statements")

    # query params
    page_number = int(request.GET.get("page", 1))
    search_value = request.GET.get("search", "")

    # pagination variables
    items_per_page = 50

    # get all leases that match the query
    names_list: list[str] = search_value.split()
    fname: str = names_list[0] if len(names_list) > 0 else ""
    sname: str = names_list[1] if len(names_list) > 1 else fname

    # get individual and company ids
    individual_ids = Individual.objects.filter(
        Q(firstname__icontains=fname)
        | Q(surname__icontains=sname)
        | Q(identification_number__icontains=search_value)
    ).values("identification_number")

    company_ids = Company.objects.filter(
        Q(registration_name__icontains=search_value)
        | Q(trading_name__icontains=search_value)
        | Q(registration_number__icontains=search_value)
    ).values("id")

    query_ids = individual_ids.union(company_ids)

    # get active leases for the superuser
    if request.user.is_superuser:
        paginator = Paginator(
            object_list=Lease.objects.filter(
                lease_giver=request.user.company,
                reg_ID_Number__in=query_ids,
            ).order_by("created_date"),
            per_page=items_per_page,
        )
        leases = paginator.get_page(page_number)

    # get active leases for the current client
    else:
        paginator = Paginator(
            object_list=Lease.objects.filter(
                lease_giver=request.user.company,
                lease_activator=request.user.id,
                reg_ID_Number__in=query_ids,
            ).order_by("created_date"),
            per_page=items_per_page,
        )

        leases = paginator.get_page(page_number)

    tenant_list = []
    tenant_individual_details = {}
    tenant_company_details = {}
    today = datetime.now().date()

    for i in leases:
        opening_balance_record = Opening_balance.objects.filter(
            lease_id=i.lease_id
        ).last()
        if i.status_cache == "HIGH":
            color = "light-red"
        elif i.status_cache == "HIGH-HIGH":
            color = "danger"
        elif i.status_cache == "MEDIUM":
            color = "warning"
        elif i.status_cache == "NON-PAYER":
            color = "black"
        else:
            color = "success"

        if i.is_individual:
            try:
                individual_ob = Individual.objects.filter(
                    national_id=i.reg_ID_Number
                ).first()
                lease_currency_type = i.currency
                tenant_individual_details = {
                    "id": i.lease_id,
                    "tenant_name": f"{individual_ob.firstname} "
                    + individual_ob.surname,
                    "address": individual_ob.address,
                    "is_company": False,
                    "color": color,
                    "owing_amount": round(float(opening_balance_record.outstanding_balance),2),
                    "lease_currency_type": lease_currency_type,
                }
                tenant_list.append(tenant_individual_details)
            except:
                tenant_name = "N/A"
        elif i.is_company:
            try:
                company_ob = Company.objects.filter(id=i.reg_ID_Number).first()
                company_ob_address = CompanyProfile.objects.filter(
                    company=company_ob.id
                ).first()
                lease_currency_type = i.currency
                tenant_company_details = {
                    "id": i.lease_id,
                    "tenant_name": company_ob.registration_name,
                    "address": (
                        company_ob_address.current_address
                        if company_ob_address
                        else "N/A"
                    ),
                    "is_company": True,
                    "color": color,
                    "owing_amount": round(float(opening_balance_record.outstanding_balance),2),
                    "lease_currency_type": lease_currency_type,
                }
                tenant_list.append(tenant_company_details)
            except:
                tenant_name = "N/A"
        else:
            tenant_name = "N/A"

    props = {
        "total_pages": paginator.num_pages,
        "total_items": paginator.count,
        "current_page": page_number,
        "tenant_list": tenant_list,
        "queryParams": request.GET.dict() if request.GET.dict() else None,
    }

    return render(request, "Client/Accounting/Statements", props)


# @login_required
# @clients_required
def client_statements_old(request):
    if request.method == "POST":
        return render(request, "Client/Accounting/Statements")
    if request.user.is_superuser:
        leases = Lease.objects.filter( lease_giver=request.user.company)
    else:
        leases = Lease.objects.filter(
            lease_giver=request.user.company,
            lease_activator=request.user.id,
        )

    tenant_list = []
    tenant_individual_details = {}
    tenant_company_details = {}
    today = datetime.now().date()

    for i in leases:
        opening_balance_record = Opening_balance.objects.filter(
            lease_id=i.lease_id
        ).last()
        if i.status_cache == "HIGH":
            color = "light-red"
        elif i.status_cache == "HIGH-HIGH":
            color = "danger"
        elif i.status_cache == "MEDIUM":
            color = "warning"
        elif i.status_cache == "NON-PAYER":
            color = "black"
        else:
            color = "success"

        if i.is_individual:
            try:
                individual_ob = Individual.objects.filter(
                    national_id=i.reg_ID_Number
                ).first()
                lease_currency_type = i.currency
                tenant_individual_details = {
                    "id": i.lease_id,
                    "tenant_name": f"{individual_ob.firstname} "
                    + individual_ob.surname,
                    "address": individual_ob.address,
                    "is_company": False,
                    "color": color,
                    "owing_amount": opening_balance_record.outstanding_balance,
                    "lease_currency_type": lease_currency_type,
                }
                tenant_list.append(tenant_individual_details)
            except:
                tenant_name = "N/A"
        elif i.is_company:
            try:
                company_ob = Company.objects.filter(id=i.reg_ID_Number).first()
                company_ob_address = CompanyProfile.objects.filter(
                    company=company_ob.id
                ).first()
                lease_currency_type = i.currency
                tenant_company_details = {
                    "id": i.lease_id,
                    "tenant_name": company_ob.registration_name,
                    "address": company_ob_address.current_address,
                    "is_company": True,
                    "color": color,
                    "owing_amount": opening_balance_record.outstanding_balance,
                    "lease_currency_type": lease_currency_type,
                }
                tenant_list.append(tenant_company_details)
            except:
                tenant_name = "N/A"
        else:
            tenant_name = "N/A"
    props = {"tenant_list": tenant_list}
    return render(request, "Client/Accounting/Statements", props)


@login_required
@clients_required
def client_statements(request):
    # return client_statements_old(request)
    return client_statements_new(request)


@login_required
@clients_required
def request_period_statement(request):
    if request.method != "POST":
        return
    period = RequestedPeriodSchema()
    try:
        data = period.loads(request.body)
    except ValidationError as err:
        props = {
            "errors": err.messages,
        }
        return render(request, "Client/Accounting/Statements", props)
    else:
        tenant_id = data.get("tenantId")
        start_date = data.get("startDate")
        end_date = data.get("endDate")
        if tenant_individual := Individual.objects.filter(id=tenant_id).first():
            tenant_lease_details = Lease.objects.filter(
                reg_ID_Number=tenant_individual.identification_number
            ).first()
        else:
            return JsonResponse({"result": "No tenant Found"}, safe=False)
        tenant_lease_payments = LeasePayments.objects.filter(
            lease_id=tenant_lease_details.lease_id
        )
        tenant_detailed_statement = {}
        if not tenant_lease_payments:
            return JsonResponse(
                {"status": "failed", "message": "no tenant found."}, safe=False
            )
        current_date = datetime.now().date()
        start_datetime = datetime.strptime(start_date, "%Y-%m-%d").date()
        six_months_ago = current_date - timedelta(days=180)
        end_datetime = datetime.strptime(end_date, "%Y-%m-%d").date()
        detailed_statement = []
        for i in tenant_lease_payments:
            payment_date = datetime.strptime(i.date, "%Y-%m-%d").date()
            if six_months_ago >= start_datetime:
                if payment_date <= end_datetime:
                    tenant_detailed_statement = {
                        "id": i.id,
                        "payment_date": i.date,
                        "payment_amount": i.payment_amount,
                        "owing_amount": i.balance_amount,
                        "payment_reference": i.payment_reference,
                        "description": tenant_lease_details.lease_details,
                    }
                    detailed_statement.append(tenant_detailed_statement)
            else:
                three_months_ago = current_date - timedelta(days=90)
                if three_months_ago <= payment_date >= end_datetime:
                    tenant_detailed_statement = {
                        "id": i.id,
                        "payment_date": i.date,
                        "payment_amount": i.payment_amount,
                        "owing_amount": i.balance_amount,
                        "payment_reference": i.payment_reference,
                        "description": tenant_lease_details.lease_details,
                    }
                    detailed_statement.append(tenant_detailed_statement)
        return JsonResponse(
            {"status": "ok", "message": "report genarated successfully!"},
            detailed_statement,
            safe=False,
        )

def client_invoicing(request):
    if request.method == "GET":
        return get_invoicing_details(request)
    today_date_obj = datetime.now()
    next_month = (today_date_obj.replace(day=1) + timedelta(days=32)).replace(day=1)
    next_month_name = next_month.strftime("%B %Y")
    correct_format = '%Y-%m-%d'
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as err:
        props = {
            "errors": {"_schema": ["Invalid input type."]},
        }
        return render(request, "Client/Accounting/Invoicing", props)
    for invoice_data in data:
        lease_id = invoice_data.get("leaseId")
        invoice_amount = invoice_data.get("baseRental")
        operation_costs = invoice_data.get("operationCosts") or 0
        invoice_date = invoice_data.get("invoiceDate", datetime.now().date())
        date_obj = datetime.strptime(invoice_date, correct_format)
        total_invoiced = float(invoice_amount) + float(operation_costs)
        formatted_date = date_obj.strftime("%Y-%m-%d")
        new_var = random.randint(100000, 999999)
        new_var1 = invoice_data.get("invoiceNumber")
        invoice_code = f"inv#{new_var1}" if invoice_data.get("invoiceNumber") else f"inv#{new_var}"
        
        try:
            invoice = Invoicing(
                lease_id=lease_id,
                amount=invoice_amount,
                operation_costs=operation_costs,
                invoice_date=formatted_date,
                description="terminated variable rental invoice" if invoice_data.get("terminated") else "variable rental invoice",
                invoice_number = invoice_code,
                account_number = invoice_data.get("tenantAccNumber"),
                is_invoiced=False if invoice_data.get("terminated") else True,
            )
            invoice.save()
            if invoice_data.get("terminated"):
                props = {
                    "result": "success",
                    "status": 200,
                    "message": "invoice removed successfully!",
                }
                return render(request, "Client/Accounting/Invoicing", props)
            opening_balance_history_record = Opening_balance.objects.filter(
                lease_id=lease_id
            )
            if opening_balance_history_record.count() < 2:
                if float(opening_balance_history_record.last().outstanding_balance) < 0:
                    opening_balance_ob = Opening_balance(
                        lease_id=lease_id,
                        three_months_plus=0,
                        three_months_back=0,
                        two_months_back=0,
                        one_month_back=0,
                        current_month=(total_invoiced+float(opening_balance_history_record.last().outstanding_balance)) +float(opening_balance_history_record.last().current_month),
                        outstanding_balance=total_invoiced+float(opening_balance_history_record.last().outstanding_balance),
                    )
                else:
                    opening_balance_ob = Opening_balance(
                        lease_id=lease_id,
                        three_months_plus=opening_balance_history_record.last().three_months_plus,
                        three_months_back=opening_balance_history_record.last().three_months_back,
                        two_months_back=opening_balance_history_record.last().two_months_back,
                        one_month_back=opening_balance_history_record.last().one_month_back,
                        current_month=opening_balance_history_record.last().current_month,
                        outstanding_balance=opening_balance_history_record.last().outstanding_balance,
                    )
                opening_balance_ob.save()
                opening_balance_history = opening_balance_ob
            else:
                opening_balance_history = opening_balance_history_record.last()

            invoice_amount_total = float(invoice_amount) + float(operation_costs)
            balance_amount = float(opening_balance_history.outstanding_balance) + float(
                invoice_amount_total
            )
            current_month_balance = float(opening_balance_history.current_month)
            one_months_ago = float(opening_balance_history.one_month_back)
            two_months_ago = float(opening_balance_history.two_months_back)
            three_months_ago = float(opening_balance_history.three_months_back)
            four_months_ago = float(opening_balance_history.three_months_plus)
            outstanding_balance = float(opening_balance_history.outstanding_balance)

            last_invoice_statement = LeasePayments.objects.filter(
                lease_id=lease_id, description="invoice"
            ).last()
            if last_invoice_statement:
                last_invoice_month_str = (
                    last_invoice_statement.month
                )  # Example: "September 2024"
                last_invoice_month = datetime.strptime(last_invoice_month_str, "%B %Y")
                next_month = (
                    last_invoice_month.replace(day=1) + timedelta(days=32)
                ).replace(day=1)
                next_month_name = next_month.strftime("%B %Y")
            else:
                ...
            lease_payment_balance_update = LeasePayments(
                lease_id=lease_id,
                payment_amount=0,
                date=formatted_date,
                month=next_month_name,
                payment_reference=invoice_code,
                description="invoice",
                owing_amount=invoice_amount_total,
                balance_amount=invoice_amount_total,
                is_balance_checked=True,
            )
            lease_payment_balance_update.save()
        except Exception as e:
            ...
        try:
            opening_balance_history.three_months_plus = (
                four_months_ago + three_months_ago
            )
            opening_balance_history.three_months_back = two_months_ago
            opening_balance_history.two_months_back = one_months_ago
            opening_balance_history.one_month_back = current_month_balance
            opening_balance_history.current_month = invoice_amount_total
            opening_balance_history.outstanding_balance = outstanding_balance + float(
                invoice_amount_total
            )
            opening_balance_history.save()
        except:
            pass
        update_lease_status(lease_id)
    props = {
        "result": "success",
        "status": 200,
        "message": "Invoices created successfully!",
    }
    return render(request, "Client/Accounting/Invoicing", props)

def get_invoicing_details(request):
    tenant = (
        Lease.objects.filter(
            is_active=True,
            lease_giver=request.user.company,
            rent_variables=True,
        )
        if request.user.is_superuser
        else Lease.objects.filter(
            is_active=True,
            lease_giver=request.user.company,
            rent_variables=True,
            # lease_activator=request.user.id,
        )
    )
    tenant_individual_details = {}
    tenant_company_details = {}
    today = date.today()
    current_month = today.month
    current_day = 25
    current_year = today.year
    custom_day = datetime(current_year, current_month, current_day).date()
    tenant_list = []
    today_date_check = timezone.now().date()
    count = 0
    for i in tenant:
        difference = relativedelta(today_date_check, i.created_date)
        try:
            next_month_end_day = today.replace(day=int(i.payment_period_end))
        except:
            next_month_end_day = today.replace(day=8)

        if (today >= custom_day) or (today < next_month_end_day):  # FIXME: SWITCH DATES comment
            if invoice_status := Invoicing.objects.filter(lease_id=i.lease_id).last():
                invoiced_month = invoice_status.invoice_date.strftime("%B") if invoice_status.invoice_date else invoice_status.date_updated.strftime("%B")
                invoice_year = invoice_status.invoice_date.strftime("%Y") if invoice_status.invoice_date else invoice_status.date_updated.strftime("%Y")
                invoice_month = f"{invoiced_month} {invoice_year}"
                current_month = datetime.now().strftime("%B")
                current_year = datetime.now().strftime("%Y")
                current_year_month = f"{current_month} {current_year}"
                if str(invoice_month) != str(current_year_month):  # FIXME: remove comment
                    if i.is_individual:
                        try:
                            if individual_ob := Individual.objects.filter(
                                national_id=i.reg_ID_Number
                            ).first():
                                lease_currency_type = i.currency
                                tenant_individual_details = {
                                    "id": i.lease_id,
                                    "payment_period_start": i.payment_period_start,
                                    "tenant_name": f"{individual_ob.firstname} {individual_ob.surname}",
                                    "reg_number": individual_ob.identification_number,
                                    "address": individual_ob.address,
                                    "is_company": False,
                                    "owing_amount": float(i.monthly_rentals),
                                    "lease_currency_type": lease_currency_type,
                                }
                                tenant_list.append(tenant_individual_details)
                        except:
                            pass
                    elif i.is_company:
                        try:
                            company_ob = Company.objects.filter(
                                id=i.reg_ID_Number
                            ).first()
                            company_ob_address = CompanyProfile.objects.filter(
                                company=company_ob.id
                            ).first()
                            lease_currency_type = i.currency
                            tenant_company_details = {
                                "id": i.lease_id,
                                "payment_period_start": i.payment_period_start,
                                "tenant_name": company_ob.registration_name,
                                "address": company_ob_address.current_address,
                                "reg_number": company_ob.registration_number,
                                "is_company": True,
                                "owing_amount": float(i.monthly_rentals),
                                "lease_currency_type": lease_currency_type,
                            }
                            tenant_list.append(tenant_company_details)
                        except Exception:
                            pass
                    props = {"tenant_list": tenant_list}
            else:
                if i.is_individual:
                    try:
                        if individual_ob := Individual.objects.filter(
                            national_id=i.reg_ID_Number
                        ).first():
                            lease_currency_type = i.currency
                            tenant_individual_details = {
                                "id": i.lease_id,
                                "payment_period_start": i.payment_period_start,
                                "tenant_name": f"{individual_ob.firstname} {individual_ob.surname}",
                                "reg_number": individual_ob.identification_number,
                                "address": individual_ob.address,
                                "is_company": False,
                                "owing_amount": float(i.monthly_rentals),
                                "lease_currency_type": lease_currency_type,
                            }
                            tenant_list.append(tenant_individual_details)
                    except Exception:
                        pass
                elif i.is_company:
                    try:
                        company_ob = Company.objects.filter(id=i.reg_ID_Number).first()
                        company_ob_address = CompanyProfile.objects.filter(
                            company=company_ob.id
                        ).first()
                        lease_currency_type = i.currency
                        tenant_company_details = {
                            "id": i.lease_id,
                            "payment_period_start": i.payment_period_start,
                            "tenant_name": company_ob.registration_name,
                            "address": company_ob_address.current_address,
                            "reg_number": company_ob.registration_number,
                            "is_company": True,
                            "owing_amount": float(i.monthly_rentals),
                            "lease_currency_type": lease_currency_type,
                        }
                        tenant_list.append(tenant_company_details)
                    except:
                        pass
            props = {"tenant_list": tenant_list}
    return render(
        request,
        "Client/Accounting/Invoicing",
        props={"tenant_list": tenant_list},
    )

def tenant_claims(tenant_id):
    tenant_leases = Lease.objects.filter(reg_ID_Number=tenant_id, status="NON-PAYER",is_active=False)
    claims_list = []
    tenant_claims_details = {}
    for i in tenant_leases:
        lease_payment_detail = Opening_balance.objects.filter(lease_id=i.lease_id).last()
        lease_balance = (
            float(lease_payment_detail.outstanding_balance) if lease_payment_detail else 0
        )
    
        lease_giver = i.lease_giver
        creditor = Company.objects.filter(id=lease_giver).first()
        tenant_claims_details = {
            "lease_id": i.lease_id,
            "color": "color",
            "claim_date": i.date_updated.date(),
            "owing_amount": lease_balance,
            "balance_amount": lease_balance,
            "currency": i.currency,
            "type": "Rent",
            "creditor":  creditor.registration_name if creditor else "N/A",
        }
        claims_list.append(tenant_claims_details)

    return claims_list

def historic_claims(tenant_id):
    claims_list = []
    individual_id = Individual.objects.filter(identification_number=tenant_id).first()
    other_claims = None

    if individual_id:
        other_claims = Claim.objects.filter(debtor_id=individual_id.id)
    if other_claims is None:
        other_claims = Claim.objects.filter(debtor_id=int(tenant_id))

    if other_claims:
        for claim in other_claims:
            creditor_info = Company.objects.filter(id=claim.creditor_id).first()
            claim_date = claim.created_at.date()
            claim_amount = claim.amount
            claim_currency = claim.currency
            claim_details = {
                "lease_id": claim.id,
                "color": "color",
                "claim_date": claim_date,
                "owing_amount": claim_amount,
                "balance_amount": claim_amount,
                "type":"Rent",
                "currency": claim_currency,
                "creditor":creditor_info.registration_name if creditor_info else "N/A",
            }
            claims_list.append(claim_details)

    return claims_list

def check_lease_status(lease_id):
    lease = Lease.objects.filter(lease_id=lease_id).first()
    lease_status = ""
    opening_balance_record = Opening_balance.objects.filter(
        lease_id=lease.lease_id
    ).last()
    if opening_balance_record:
        three_months_plus = (
            float(opening_balance_record.three_months_plus)
            if opening_balance_record.three_months_plus != ""
            else 0
        )
        three_months_back = (
            float(opening_balance_record.three_months_back)
            if opening_balance_record.three_months_back != ""
            else 0
        )
        two_months_back = (
            float(opening_balance_record.two_months_back)
            if opening_balance_record.two_months_back != ""
            else 0
        )
        one_month_back = (
            float(opening_balance_record.one_month_back)
            if opening_balance_record.one_month_back != ""
            else 0
        )

        lease_initial_status = lease.status
        if three_months_plus > 0:
            lease.status = "NON-PAYER"
        elif three_months_back > 0 and three_months_plus <= 0:
            lease.status = "HIGH-HIGH"
        elif two_months_back > 0 and three_months_back + three_months_plus <= 0:
            lease.status = "HIGH"

        elif one_month_back > 0 and two_months_back + three_months_back <= 0:
            lease.status = "MEDIUM"
        else:
            lease.status = "SAFE"
        lease.save()
        try:
            today = datetime.now().date()
            start_date = date(today.year, today.month, 25)
            next_month = today.month + 1
            next_year = today.year
            if next_month > 12:
                next_month = 1
                next_year += 1
            end_date = date(next_year, next_month, 11)

            if start_date <= today <= end_date:
                statuses = ["NON-PAYER", "HIGH-HIGH", "HIGH", "MEDIUM", "SAFE"][::-1]
                fetched_status = lease.status
                if fetched_status == "SAFE":
                    lease.status_cache = "SAFE"
                elif lease_initial_status == lease.status_cache:
                    lease.status_cache = lease.status
                else:
                    index = statuses.index(fetched_status)
                    lease.status_cache = statuses[index - 1]
            else:
                lease.status_cache = lease.status
            lease.save()
        except Exception as e:
            pass
    lease_status = lease.status_cache
    return lease_status

def request_user_company_individual_enquiries(
    request, searched_individual_id, json_data_ob
    ):
    internal_enquiry_details_list = external_enquiry_details_list = []
    today = datetime.now().date()
    first_day_of_month = today.replace(day=1).day
    _, last_day = calendar.monthrange(today.year, today.month)
    last_day_of_month = today.replace(day=last_day).day
    if request.user.user_type == 2:
        all_enquires = Enquiries.objects.filter(
            individual_company_id=searched_individual_id, is_individual_searched=True
        )
    else:
        all_enquires = Enquiries.objects.filter(
            individual_company_id=searched_individual_id,
            is_individual_searched=True,
            enquiry_company_id=request.user.company,
        )

    for enquiry in all_enquires:
        enquirer = CustomUser.objects.filter(company=enquiry.enquiry_company_id).first()
        request_company = request.user.company
        administrator_company_ob = Company.objects.filter(id=request_company).first()
        if administrator_company_ob:
            request_company_name = (
                administrator_company_ob.registration_name
                if administrator_company_ob
                else "N/A"
            )
            request_company_id = administrator_company_ob.id
        if (
            enquirer
            and enquiry.date_of_enquiry.day >= first_day_of_month
            and enquiry.date_of_enquiry.day <= last_day_of_month
        ):
            enquirer_ob = Individual.objects.filter(id=enquiry.enquirer).first()
            enquiry_date = enquiry.date_of_enquiry
            formatted_date = enquiry_date.strftime("%d %B %Y")
            enquirer_company = enquirer.company
            enquirer_company_name_ob = Company.objects.filter(
                id=enquirer_company
            ).first()
            enquirer_company_name = (
                enquirer_company_name_ob.registration_name
                if enquirer_company_name_ob
                else "N/A"
            )
            if request_company_name.lower() == "fincheck":
                enquirer_name = (
                    (enquirer_ob.firstname + " " + enquirer_ob.surname)
                    if enquirer_ob
                    else enquirer_company_name
                )
                if int(enquiry.enquiry_company_id) == int(request_company_id):
                    internal_enquiry_details_dic = {
                        "enquiry_id": enquiry.id,
                        "enquiry_date": formatted_date,
                        "enquirer": enquirer_name,
                        "company_name": (enquirer_company_name or "N/A"),
                    }
                    internal_enquiry_details_list.append(internal_enquiry_details_dic)
                elif json_data_ob:
                    enquiry_ob = Enquiries.objects.filter(enquirer=json_data_ob).last()
                    enquirer_company_name_ob = Company.objects.filter(
                        id=enquiry_ob.enquiry_company_id
                    ).first()
                    enquirer_company_name = (
                        enquirer_company_name_ob.registration_name
                        if enquirer_company_name_ob
                        else "N/A"
                    )
                    enquirer_name_ob = Individual.objects.filter(
                        id=json_data_ob
                    ).first()
                    enquirer_name = (
                        (enquirer_name_ob.firstname + " " + enquirer_name_ob.surname)
                        if enquirer_name_ob
                        else enquirer_company_name
                    )
                    external_enquiry_details_dic = {
                        "enquiry_id": enquiry_ob.id,
                        "enquiry_date": formatted_date,
                        "enquirer": enquirer_name,
                        "company_name": (enquirer_company_name or "N/A"),
                    }
                    if (
                        external_enquiry_details_dic
                        not in external_enquiry_details_list
                    ):
                        external_enquiry_details_list.append(
                            external_enquiry_details_dic
                        )
                else:
                    pass
            else:
                enquirer_ob = Individual.objects.filter(id=enquirer.individual).first()
                enquirer_name = (
                    (enquirer_ob.firstname + " " + enquirer_ob.surname)
                    if enquirer_ob
                    else request_company_name
                )
                enquiry_date = enquiry.date_of_enquiry
                formatted_date = enquiry_date.strftime("%d %B %Y")
                enquirer_company = enquirer.company
                enquirer_company_name = Company.objects.filter(
                    id=enquirer_company
                ).first()
                external_enquiry_details_dic = {
                    "enquiry_id": enquiry.id,
                    "enquiry_date": formatted_date,
                    "enquirer": enquirer_name,
                    "company_name": (
                        administrator_company_ob.registration_name
                        if administrator_company_ob
                        else "N/A"
                    ),
                }
                if external_enquiry_details_dic not in external_enquiry_details_list:
                    external_enquiry_details_list.append(external_enquiry_details_dic)
        else:
            enquirer_name = "N/A"
    return internal_enquiry_details_list, external_enquiry_details_list

def request_user_company_company_enquiries(request, searched_company_id, json_data_ob):
    internal_enquiry_details_dic = external_enquiry_details_dic = {}
    internal_enquiry_details_list = external_enquiry_details_list = []
    today = datetime.now().date()
    first_day_of_month = today.replace(day=1).day
    _, last_day = calendar.monthrange(today.year, today.month)
    last_day_of_month = today.replace(day=last_day).day
    if request.user.user_type == 2:
        all_enquires = Enquiries.objects.filter(
            individual_company_id=searched_company_id, is_company_searched=True
        )
    else:
        all_enquires = Enquiries.objects.filter(
            individual_company_id=searched_company_id,
            is_company_searched=True,
            enquiry_company_id=request.user.company,
        )
    if all_enquires:
        for enquiry in all_enquires:
            enquirer = CustomUser.objects.filter(
                company=enquiry.enquiry_company_id
            ).first()
            request_company = int(request.user.company)
            administrator_company_ob = Company.objects.filter(
                id=request_company
            ).first()
            if administrator_company_ob:
                request_company_name = administrator_company_ob.registration_name
                request_company_id = administrator_company_ob.id
            else:
                request_company_name = "N/A"
                request_company_id = "N/A"
            if (
                enquirer
                and enquiry.date_of_enquiry.day >= first_day_of_month
                and enquiry.date_of_enquiry.day <= last_day_of_month
            ):
                enquirer_ob = Individual.objects.filter(id=enquiry.enquirer).first()
                enquirer_name = (
                    (enquirer_ob.firstname + " " + enquirer_ob.surname)
                    if enquirer_ob
                    else request_company_name
                )
                enquiry_date = enquiry.date_of_enquiry
                formatted_date = enquiry_date.strftime("%d %B %Y")
                enquirer_company = enquirer.company
                enquirer_company_name = Company.objects.filter(
                    id=enquirer_company
                ).first()
                if request_company_name.lower() == "fincheck":
                    if int(enquiry.enquiry_company_id) == int(request_company_id):
                        internal_enquiry_details_dic = {
                            "enquiry_id": enquiry.id,
                            "enquiry_date": formatted_date,
                            "enquirer": enquirer_name,
                            "company_name": (
                                enquirer_company_name.registration_name
                                if enquirer_company_name
                                else "N/A"
                            ),
                        }
                        internal_enquiry_details_list.append(
                            internal_enquiry_details_dic
                        )
                    elif json_data_ob:
                        enquiry_ob = Enquiries.objects.filter(
                            enquirer=json_data_ob
                        ).last()
                        enquirer_company_name_ob = Company.objects.filter(
                            id=enquiry_ob.enquiry_company_id
                        ).first()
                        enquirer_company_name = (
                            enquirer_company_name_ob.registration_name
                            if enquirer_company_name_ob
                            else "N/A"
                        )
                        enquirer_name_ob = Individual.objects.filter(
                            id=json_data_ob
                        ).first()
                        enquirer_name = (
                            (
                                enquirer_name_ob.firstname
                                + " "
                                + enquirer_name_ob.surname
                            )
                            if enquirer_name_ob
                            else enquirer_company_name
                        )
                        external_enquiry_details_dic = {
                            "enquiry_id": enquiry_ob.id,
                            "enquiry_date": formatted_date,
                            "enquirer": enquirer_name,
                            "company_name": enquirer_company_name,
                        }
                        if (
                            external_enquiry_details_dic
                            not in external_enquiry_details_list
                        ):
                            external_enquiry_details_list.append(
                                external_enquiry_details_dic
                            )
                    else:
                        pass
                else:
                    enquirer_ob = Individual.objects.filter(id=enquiry.enquirer).first()
                    enquiry_date = enquiry.date_of_enquiry
                    formatted_date = enquiry_date.strftime("%d %B %Y")
                    enquirer_company = int(enquirer.company)
                    enquirer_company_name_ob = Company.objects.filter(
                        id=enquirer_company
                    ).first()
                    enquirer_company_name = (
                        enquirer_company_name_ob.registration_name
                        if enquirer_company_name_ob
                        else "N/A"
                    )
                    enquirer_name = (
                        (enquirer_ob.firstname + " " + enquirer_ob.surname)
                        if enquirer_ob
                        else enquirer_company_name
                    )
                    external_enquiry_details_dic = {
                        "enquiry_id": enquiry.id,
                        "enquiry_date": formatted_date,
                        "enquirer": enquirer_name,
                        "company_name": (
                            administrator_company_ob.registration_name
                            if administrator_company_ob
                            else "N/A"
                        ),
                    }
                    if (
                        external_enquiry_details_dic
                        not in external_enquiry_details_list
                    ):
                        external_enquiry_details_list.append(
                            external_enquiry_details_dic
                        )
            else:
                enquirer_name = "N/A"

    return internal_enquiry_details_list, external_enquiry_details_list

def active_credit_accounts(tenant_id):
    tenant_leases = Lease.objects.filter(reg_ID_Number=tenant_id, is_active=True)
    credit_accounts = []
    today = date.today()
    current_month_name = today.strftime("%B %Y")
    first_month_date = ""
    for i in tenant_leases:

        if i.status != "SAFE":
            lease_payment_detail = LeasePayments.objects.filter(lease_id=i.lease_id)
            next_month = today.replace(day=1).replace(month=today.month % 12 + 1)
            next_month_name = next_month.strftime("%B %Y")
            payment_period_start = int(i.payment_period_start)
            current_balance = Opening_balance.objects.filter(lease_id=i.lease_id).last()
            if float(current_balance.three_months_plus) > 0:
                month_to_remove = 4
            elif float(current_balance.three_months_back) > 0:
                month_to_remove = 3
            elif float(current_balance.two_months_back) > 0:
                month_to_remove = 2
            elif float(current_balance.one_month_back) > 0:
                month_to_remove = 1
            else:
                month_to_remove = 0
            new_date = datetime.now() - relativedelta(months=month_to_remove)
            month_name = new_date.strftime("%B %Y")

            if float(current_balance.outstanding_balance) >= 0 and not float(current_balance.current_month) == float(current_balance.outstanding_balance):
                creditor_information = Company.objects.filter(id=i.lease_giver).first()
                credit_account_details = {
                    "lease_id": i.lease_id,
                    "credit_type": creditor_information.registration_name if creditor_information else "N/A",
                    "currency": i.currency,
                    "start_date": f"{payment_period_start}-{month_name}",
                    "end_date": f"{i.payment_period_end}-{current_month_name if today.day < payment_period_start else next_month_name}",
                    "principal_amount": "N/A",
                    "type":"Rent",
                    "instalment_amount": i.monthly_rentals,
                    "overdue_amount": f"{round(float(current_balance.outstanding_balance),2)}",
                }   
                credit_accounts.append(credit_account_details)
    return credit_accounts

# TODO: tenant detailed statement
def detailed_statements(request, tenant_id):
    if request.method != "GET":
        return render(
            request,
            "Client/Accounting/DetailedStatement",
            props={"message": "No Payments Found"},
        )
    detailed_statement, tenant_details, last_three_months_statement = {}, {}, {}
    missed_payments, monthly_payments = [], []
    lease_receiver_name, lease_receiver_id, lease_receiver_address = "", "", ""
    today_date = datetime.now().date()
    balance_brought_forward = 0
    if tenant_id:
        lease = Lease.objects.filter(lease_id=tenant_id).first()
    else:
        return render(
            request,
            "Client/Accounting/DetailedStatement",
            props={"message": "Only admins can View this Statement!"},
        )
    if tenant_lease_opening_balance := Opening_balance.objects.filter(
        lease_id=lease.lease_id
    ).first():
        balance_brought_forward = tenant_lease_opening_balance.outstanding_balance
        last_three_months_statement = {
            "id": lease.lease_id,
            "date": lease.created_date,
            "description": "Opening Balance",
            "reference": "",
            "owing_amount": 0,
            "balance_amount": round(float(balance_brought_forward),2),
        }
        last_three_months_statement = last_three_months_statement
        detailed_statement.update(last_three_months_statement)
        # start_date = datetime.strptime(f"{lease.start_date}", "%Y-%m-%d").date()
        # end_date = datetime.strptime(f"{lease.end_date}", "%Y-%m-%d").date()

        # if start_date <= today_date <= end_date:
        lease_payments_history = (
            LeasePayments.objects.filter(lease_id=lease.lease_id)
            .exclude(payment_reference__iexact="Opening Balance")
            .order_by("date")
        )
        invoices = Invoicing.objects.filter(lease_id=lease.lease_id, is_invoiced=True).order_by('date_created')
        lease_receiver_ind = Individual.objects.filter(
            national_id=lease.reg_ID_Number
        ).first()
        lease_receiver_comp = None
        if lease_receiver_ind:
            lease_receiver = (
                f"{lease_receiver_ind.firstname} {lease_receiver_ind.surname}"
            )
        else:
            lease_receiver_comp = Company.objects.filter(
                id=lease.reg_ID_Number
            ).first()
            company_address_ob = CompanyProfile.objects.filter(
                company=lease_receiver_comp.id
            ).first()
            company_address = ""
            if company_address_ob:
                company_address = company_address_ob.current_address
        lease_receiver_name = (
            lease_receiver
            if lease_receiver_ind
            else lease_receiver_comp.registration_name
        )
        lease_receiver_id = (
            lease_receiver_ind.identification_number if lease_receiver_ind else ""
        )
        lease_receiver_address = (
            company_address if lease_receiver_comp else lease_receiver_ind.address
        )

        if lease_payments_history:
            current_balance, balance = float(balance_brought_forward), float(
                balance_brought_forward
            )
            payment_amount = description = ""
            invoice_index = 0
            for lease_payment in lease_payments_history:
                try:
                    int(lease_payment.payment_reference)
                    payment_reference_number = True
                except:
                    payment_reference_number = False
                if ((lease_payment.payment_reference[:6].lower() == "rental"
                    or payment_reference_number) and not lease_payment.payment_reference[:7].lower() =='opening'
                ):
                    if "#" in lease_payment.payment_reference:
                        payment_reference = lease_payment.payment_reference.split(
                            "#"
                        )[1]
                    elif payment_reference_number:
                        payment_reference = lease_payment.payment_reference
                    else:
                        payment_reference = ""
                    description = (
                        f"Cash receipt  -    {lease_payment.description}"
                        if lease_payment.description
                        else "Cash-receipt"
                    )
                    payment_amount = float(lease_payment.payment_amount) * -1
                    balance = current_balance - float(lease_payment.payment_amount)
                    

                elif lease_payment.payment_reference.upper()[:3] == "DBT":
                    description = (
                        "Debit -" + lease_payment.description
                        if lease_payment.description
                        else "Debit"
                    )
                    payment_reference = lease_payment.payment_reference
                    payment_amount = float(lease_payment.payment_amount)
                    balance = current_balance + float(lease_payment.payment_amount)
                    current_balance = balance

                elif lease_payment.payment_reference.upper()[:3] == "CRD":
                    description = (
                        "Credit -" + lease_payment.description
                        if lease_payment.description
                        else "Credit"
                    )
                    payment_reference = lease_payment.payment_reference
                    payment_amount = float(lease_payment.payment_amount) * -1
                    balance = current_balance - float(lease_payment.payment_amount)
                    current_balance = balance

                elif lease_payment.payment_reference.upper()[:3] == "INV":
                    description = "Rent for " + lease_payment.month
                    payment_reference = lease_payment.payment_reference 
                    payment_amount = float(lease_payment.balance_amount)
                    
                    if invoice_index < len(invoices):
                        
                        invoice = invoices[invoice_index]
                        invoiced_amount = float(invoice.amount) + float(invoice.operation_costs)
                        balance = current_balance + invoiced_amount
                        invoice_index += 1
                    else:
                        
                        balance = current_balance + float(lease_payment.balance_amount)

                    current_balance = balance
                else:
                    payment_reference = lease_payment.payment_reference
                lease_payment_dic = {
                    "lease_id": lease_payment.lease_id,
                    "payment_month": lease_payment.month,
                    "date": lease_payment.date,
                    "date_updated": lease_payment.date,
                    "description": description,
                    "reference": payment_reference,
                    "payment_amount": (float(lease_payment.payment_amount)),
                    "balance_amount": balance,
                    "owing_amount": payment_amount,
                }
                if (
                    lease_payment.payment_reference.upper()[:3] != "DBT"
                    and lease_payment.payment_reference.upper()[:3] != "CRD"
                ):
                    current_balance -= float(lease_payment_dic["payment_amount"])
                monthly_payment = lease_payment_dic
                monthly_payments.append(monthly_payment)

        tenant_detail = {
            "lease_receiver_name": lease_receiver_name,
            "currency": lease.currency,
            "lease_id": lease.lease_id,
            "lease_receiver_id": lease_receiver_id,
            "lease_receiver_address": lease_receiver_address,
        }
        tenant_details.update(tenant_detail)
        props = {
            "tenant_details": tenant_details,
            "detailed_statement": detailed_statement,
            "monthly_payments": monthly_payments,
            "missed_payments": missed_payments,
        }
        return render(request, "Client/Accounting/DetailedStatement", props)

# TODO: process payment
def process_payment(payment_amount, lease_id):
    opening_balance_record = Opening_balance.objects.filter(lease_id=lease_id)
    if opening_balance_record.count() < 2:
        opening_balance_last_record = opening_balance_record.first()
        opening_balance_record = Opening_balance.objects.create(
            lease_id=lease_id,
            current_month=opening_balance_last_record.current_month,
            one_month_back=opening_balance_last_record.one_month_back,
            two_months_back=opening_balance_last_record.two_months_back,
            three_months_back=opening_balance_last_record.three_months_back,
            three_months_plus=opening_balance_last_record.three_months_plus,
            outstanding_balance=opening_balance_last_record.outstanding_balance,
        )
    else:
        opening_balance_record = opening_balance_record.last()
    three_months_plus, three_months_ago = float(
        opening_balance_record.three_months_plus
    ), float(opening_balance_record.three_months_back)
    two_months_ago, one_month_ago = float(
        opening_balance_record.two_months_back
    ), float(opening_balance_record.one_month_back)
    current_month, outstanding_balance = float(
        opening_balance_record.current_month
    ), float(opening_balance_record.outstanding_balance)

    total_amount_paid = float(payment_amount)
    remaining_amount = total_amount_paid
    if remaining_amount > 0 and three_months_plus > 0:
        if remaining_amount > three_months_plus:
            remaining_amount = float(remaining_amount) - three_months_plus
            opening_balance_record.three_months_plus = 0
        else:
            opening_balance_record.three_months_plus = three_months_plus - float(
                remaining_amount
            )
            remaining_amount = (
                three_months_plus - float(remaining_amount)
                if three_months_plus - float(remaining_amount) <= 0
                else 0
            )

    if remaining_amount > 0 and three_months_ago > 0:
        if remaining_amount > three_months_ago > 0:
            remaining_amount = float(remaining_amount) - three_months_ago
            opening_balance_record.three_months_back = 0
        else:
            opening_balance_record.three_months_back = three_months_ago - float(
                remaining_amount
            )
            remaining_amount = (
                three_months_ago - float(remaining_amount)
                if three_months_ago - float(remaining_amount) <= 0
                else 0
            )

    if remaining_amount > 0 and two_months_ago > 0:
        if remaining_amount > two_months_ago > 0:
            remaining_amount = float(remaining_amount) - two_months_ago
            opening_balance_record.two_months_back = 0
        else:
            opening_balance_record.two_months_back = two_months_ago - float(
                remaining_amount
            )
            remaining_amount = (
                two_months_ago - float(remaining_amount)
                if two_months_ago - float(remaining_amount) <= 0
                else 0
            )

    if remaining_amount > 0 and one_month_ago > 0:
        if remaining_amount > one_month_ago > 0:
            remaining_amount = float(remaining_amount) - one_month_ago
            opening_balance_record.one_month_back = 0
        else:
            opening_balance_record.one_month_back = one_month_ago - float(
                remaining_amount
            )
            remaining_amount = (
                one_month_ago - float(remaining_amount)
                if one_month_ago - float(remaining_amount) <= 0
                else 0
            )

    if remaining_amount > 0 and current_month > 0:
        if remaining_amount > current_month > 0:
            opening_balance_record.current_month = 0
        else:
            opening_balance_record.current_month = current_month - float(
                remaining_amount
            )

    opening_balance_record.outstanding_balance = outstanding_balance - float(
        total_amount_paid
    )
    opening_balance_record.save()

# FIXME: create receipt and payment
@require_http_methods(["POST"])
def create_receipt_and_payments(request):
    data = json.loads(request.body.decode("utf-8"))
    key = data["myKey"]
    success = True
    for lease in data["rows"]:
        opening_balance_ob = Opening_balance.objects.filter(
            lease_id=lease["lease_id"]
        ).last()
        lease_id = lease.get("lease_id")
        is_variable = lease.get("isVariable")
        payment_amount = round(float(lease.get("paymentAmount")),2)
        base_amount_received = round(float(lease.get("baseAmount",0)),2) if is_variable else payment_amount
        payment_date = lease.get("paymentDate")
        receipt_number = (
            "Rental payment receipted #" + lease.get("receiptNumber")
            if lease.get("receiptNumber")
            else "Rental payment receipted"
        )
        description = lease.get("details")

        # create payment breakdown
        landlord = Landlord.objects.filter(lease_id=lease_id).first()

        op_balance_receipt_number = lease.get("receiptNumber")
        currency = lease.get("currency")

        commission = (landlord.agent_commission / 100) * base_amount_received if landlord else 0
        operating_costs = lease.get("operatingCost") if lease.get("operatingCost") else 0
        base_amount = base_amount_received - commission
        
        new_base_amount = base_amount
        total_amount_paid = base_amount
        if landlord:
            if lease_exists:= LeaseReceiptBreakdown.objects.filter(lease_id=lease_id).last():
                new_base_amount = lease_exists.base_amount+float(base_amount)
                total_amount_paid = lease_exists.total_amount+float(base_amount)
            payment_breakdown = LeaseReceiptBreakdown(
                landlord_id=landlord.landlord_id,
                lease_id=lease_id,
                receipt_number=op_balance_receipt_number,
                total_amount=total_amount_paid,
                base_amount=base_amount,
                date_received=payment_date,
                commission=commission,
                operating_costs=operating_costs,
            )

            payment_breakdown.save()

        if opening_balance_ob:
            balance_amount = opening_balance_ob.outstanding_balance

            new_balance = round(float(balance_amount) - float(lease.get("paymentAmount")),2)
            lease_year, lease_month, lease_day = lease.get("paymentDate").split("-")
            month_name = (
                f"{str(calendar.month_name[int(lease_month)])} {str(lease_year)}"
            )
            create_lease_payments(
                lease_id,
                payment_amount,
                payment_date,
                month_name,
                new_balance,
                new_balance,
                receipt_number,
                description,
            )
            total_amount_paid = float(lease.get("paymentAmount"))
            process_payment(total_amount_paid, lease_id)
            lease_status = check_lease_status(lease_id)

            lease_receiver = Lease.objects.filter(
                lease_id=opening_balance_ob.lease_id
            ).first()
            lease_receiver_ind = Individual.objects.filter(
                national_id=lease_receiver.reg_ID_Number
            ).first()
            lease_currency = lease_receiver.currency
            lease_giver = Company.objects.filter(id=lease_receiver.lease_giver).first()
            lease_giver_name = lease_giver.trading_name if lease_giver else "N/A"
            otp = ""
            if lease_status == "SAFE":
                remarks = ""
                lease_status = "Low Risk"
            elif lease_status == "HIGH-HIGH":
                lease_status = "HIGH"
                remarks = "Please pay balance to upgrade your risk status."
            else:
                remarks = "Please pay balance to upgrade your risk status."

            if lease_receiver_ind:
                full_name = (
                    f"{lease_receiver_ind.firstname} {lease_receiver_ind.surname}"
                )
                phone_number = lease_receiver_ind.mobile if lease_receiver_ind else "N/A"
                message = f"Hi {full_name}.\nConfirmed rent received by {lease_giver_name} of {lease_currency} {payment_amount}0 on {payment_date}. Balance left is {lease_currency} {new_balance}0. Your payment Risk Status is {lease_status}. {remarks}"
                if request.user.can_send_email:
                    send_otp.delay(
                        request.build_absolute_uri(),
                        otp,
                        phone_number,
                        request.user.company,
                        lease_receiver_ind.id,
                        "individual",
                        settings.PAYMENT_RECEIPT,
                        message,
                    )

            else:
                lease_receiver_comp = Company.objects.filter(
                    id=lease_receiver.reg_ID_Number
                ).first()
                full_name = lease_receiver_comp.registration_name
                email_ob = CompanyProfile.objects.filter(
                    company=lease_receiver_comp.id
                ).first()
                email = email_ob.email if email_ob else "gtkandeya@gmail.com"
                message = f"Hi {full_name}.\n This serves as confirmation of receipt by {lease_giver_name} of {lease_currency} {payment_amount}0 on {payment_date} for rent.\n Your rent balance is now {lease_currency} {new_balance}0 and your Payment Status is {lease_status}. {remarks}"
                if request.user.can_send_email:
                    send_otp.delay(
                        request.build_absolute_uri(),
                        otp,
                        email,
                        request.user.company,
                        lease_receiver_comp.id,
                        "company",
                        settings.PAYMENT_RECEIPT,
                        message,
                    )

        else:
            success = False
    if success:
        if key == "statements":
            tenant_id = data["rows"][0]["lease_id"]
            r = reverse("detailed_statement", args=(tenant_id,))
            return_url = request.build_absolute_uri(r)

            return redirect(return_url)
        return redirect("client-leases")
    return JsonResponse({"error": "no OB found"})

def get_client_company_journals(request):
    if request.method != "POST":
        return JsonResponse(
            {"result": "No companies found.", "status": "failed"}, safe=False
        )
    search_schema = SearchSchema()
    company_data = []
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError as err:
        props = {"errors": str(err)}
        return JsonResponse(props, status=400, safe=False)
    else:
        try:
            return get_company_journals_helper(data, request, company_data)
        except Exception as e:
            return JsonResponse(
                {"error": "company not found", "status": "failed"}, safe=False
            )

def get_client_individual_journals(request):
    if request.method != "POST":
        return JsonResponse(
            {"result": "No individuals found.", "status": "failed"}, safe=False
        )
    search_schema = SearchSchema()
    individual_data = []
    try:
        data = json.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return JsonResponse(props, safe=False)
    else:
        try:
            return get_individual_journals_helper(data, request, individual_data)
        except:
            ...
        return JsonResponse(
            {"result": "No individuals found.", "status": "failed"}, safe=False
        )

def debit_journal(request):

    if request.method == "POST":
        lease_id, account_balance, debit_amount, details, end_balance, date = (
            "",
            "",
            "",
            "",
            "",
            "",
        )
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse(
                {"error": "Error occured", "status": "failed"}, safe=False
            )
        if data:
            today = datetime.now().date()
            max_date = today + timedelta(days=1)
            date_error = op_balance_error = False
            for item in data["rows"]:
                lease_id = item.get("leaseId")
                debit_amount = item.get("debitAmount")
                details = item.get("details")
                end_balance = item.get("endBalance")
                date_ob = item.get("date")
                date = datetime.strptime(date_ob, "%Y-%m-%d").date()
                lease_opening_balance = Opening_balance.objects.filter(
                    lease_id=lease_id
                )
                if lease_opening_balance:
                    if lease_opening_balance.count() < 2:
                        Opening_balance.objects.create(
                            lease_id=lease_id,
                            current_month=lease_opening_balance.first().current_month,
                            one_month_back=lease_opening_balance.first().one_month_back,
                            two_months_back=lease_opening_balance.first().two_months_back,
                            three_months_back=lease_opening_balance.first().three_months_back,
                            three_months_plus=lease_opening_balance.first().three_months_plus,
                            outstanding_balance=lease_opening_balance.first().outstanding_balance,
                        )
                    last_ob = lease_opening_balance.last()
                    days_diff = (today - date).days 
                    lease_object = Lease.objects.filter(lease_id=lease_id).first()
                    # Categorize the date
                    print('days diff', days_diff)
                    print('check1', days_diff <= 30)
                    print('check2', 31 <= days_diff <= 60)
                    print('check3', 61 <= days_diff <= 90)
                    print('check4', 91 <= days_diff <= 120)
                    if int(today.day) > int(lease_object.payment_period_end):
                        payment_is_past= True
                    else:
                        payment_is_past= False
                    
                    visualize_statements_according_to_dates(last_ob, days_diff, payment_is_past,debit_amount)
                    
                    lease_debit_journal = LeasePayments(
                        lease_id=lease_id,
                        payment_amount=debit_amount,
                        date=date,
                        month=datetime.strptime(date_ob, "%Y-%m-%d")
                        .date()
                        .strftime("%B %Y"),
                        payment_reference="DBT#" + str(random.randint(1000, 9999)),
                        description=details if details else "Debit",
                        owing_amount=end_balance,
                        balance_amount=end_balance,
                        is_balance_checked=True,
                    )
                    lease_debit_journal.save()
                    update_debited_customer_status(lease_id)
                else:
                    date_error = True
            if date_error:
                return JsonResponse(
                    {
                        "error": "Debits before opening balances and after today are not allowed!",
                        "status": "failed",
                    },
                    safe=False,
                )
            if not lease_opening_balance.first():
                return JsonResponse({"error": "No Opening balance found"}, safe=False)
            return JsonResponse({"status": "success"}, safe=False)
    return render(request, "Client/Accounting/AccountAdjustment/DebitJournal")

def credit_journal(request,lease_no=None):
    if request.method == "POST":
        
        lease_id, account_balance, debit_amount, details, end_balance, date = (
            "",
            "",
            "",
            "",
            "",
            "",
        )
        
        if lease_no:
            last_balance = Opening_balance.objects.filter(lease_id=lease_no).last()
            data ={'rows': [{'id': 1, 'date': datetime.now().date(), 'customerType': 'individual', 'customerName': 'N/A', 'details': 'Cleared balance after termination', 'accountBalance': f'{last_balance.outstanding_balance}', 'creditAmount': f'{last_balance.outstanding_balance}', 'endBalance': '', 'leaseId': lease_no, 'endDate': timezone.now()}]}
        else:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError as e:
                return JsonResponse(
                    {"failed": "Error occured", "status": "failed"}, safe=False
                )
        if data:
            today = datetime.now().date()
            date_error = op_balance_error = False
            max_date = today + timedelta(days=1)
            for item in data["rows"]:
                if not lease_no:
                    lease_id = item.get("leaseId")
                    credit_amount = item.get("creditAmount")
                    details = item.get("details")
                    end_balance = item.get("endBalance")
                    date = item.get("date")
                else:
                    lease_id = lease_no
                    date = f"{today}"
                    credit_amount = last_balance.outstanding_balance
                    end_balance =0
                    
                lease_opening_balance = Opening_balance.objects.filter(
                    lease_id=lease_id
                )
                if lease_opening_balance.last():
                    if lease_opening_balance.count() < 2:
                        Opening_balance.objects.create(
                            lease_id=lease_id,
                            current_month=lease_opening_balance.first().current_month,
                            one_month_back=lease_opening_balance.first().one_month_back,
                            two_months_back=lease_opening_balance.first().two_months_back,
                            three_months_back=lease_opening_balance.first().three_months_back,
                            three_months_plus=lease_opening_balance.first().three_months_plus,
                            outstanding_balance=lease_opening_balance.first().outstanding_balance,
                        )
                    if (
                        lease_opening_balance.first().date_created.date()
                        <= datetime.strptime(date, "%Y-%m-%d").date()
                        < max_date
                    ):
                        process_payment(credit_amount, lease_id)
                        check_lease_status(lease_id)
                        lease_credit_journal = LeasePayments(
                            lease_id=lease_id,
                            payment_amount=credit_amount,
                            date=date,
                            month=datetime.strptime(date, "%Y-%m-%d")
                            .date()
                            .strftime("%B %Y"),
                            payment_reference="CRD#" + str(random.randint(1000, 9999)),
                            description=details or "Credit",
                            owing_amount=end_balance,
                            balance_amount=end_balance,
                            is_balance_checked=True,
                        )
                        lease_credit_journal.save()
                    else:
                        date_error = True
                else:
                    op_balance_error = True
            if date_error:
                return JsonResponse(
                    {
                        "error": "Credit journals before opening balance and after today are not allowed",
                        "status": "failed",
                    },
                    safe=False,
                )
            if op_balance_error:
                return JsonResponse({"error": "No Opening balance found"}, safe=False)
            return JsonResponse({"status": "success"}, safe=False)

    return render(request, "Client/Accounting/AccountAdjustment/CreditJournal")

def manual_send_otp(request):
    if request.method == "POST":
        return JsonResponse({"status": "failed!!"}, safe=False)
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
            limit_day = today.replace(day=int(lease.payment_period_end) +1)
            if custom_day < today <= limit_day:
                if opening_balance_object := Opening_balance.objects.filter(
                    lease_id=lease_id
                ).last():
                    current_month = float(opening_balance_object.current_month)
                    
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
                        count += 1
                        
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
               
                    otp_object = OTP.objects.filter(otp_code=lease_id).last()
                    if not otp_object or otp_object.created_at.strftime(
                        "%B"
                    ) == today.strftime("%B"):
                        try:
                            can_send_message_ob = CustomUser.objects.filter(company=lease.lease_giver,can_send_email=False).first()
                        except Exception as e:
                            ...
                        can_send_message = False if can_send_message_ob else True
                        # print('can send email check...',can_send_message)
                        if registration_message and  can_send_message:
                            if count % MAX_MESSAGES_PER_SECOND == 0:
                                print('sleeping...')
                                time.sleep(1)
                            # print(f'sending to {requested_user_ob}, #', lease.lease_id)
                            if requested_user_ob == "individual": #and int(lease.lease_giver) == 15:
                                print('sending on lease #', lease.lease_id,'..STATUS...',lease.status,contact_detail,'giver>>',lease_giver_name)
                                # continue
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

    return HttpResponse("otps were resend!")

def manual_color_update(request):
    
   
    leases = Lease.objects.filter(is_active=True).all()
   
    if leases:
        for lease in leases:
            lease_id = lease.lease_id
           
            if opening_balance_object := Opening_balance.objects.filter(
                lease_id=lease_id
            ).last():
                try:
                    if float(opening_balance_object.three_months_plus) > 0:
                        status = "NON-PAYER"
                    elif float(opening_balance_object.three_months_back) > 0:
                        status = "HIGH-HIGH"
                    elif float(opening_balance_object.two_months_back) > 0:
                        status = "HIGH"
                    elif float(opening_balance_object.one_month_back) > 0:
                        status = "MEDIUM"
                    lease.status = status
                    lease.save()
                except Exception as e:
                    pass
                lease.status_cache =lease.status
                lease.save()

    return JsonResponse(
        {"status": "success", "message": "Lease status updated successfully."},
        safe=False,
    )
                


from itertools import chain
from django.http import JsonResponse

def switch_history(request, company_id):
    try:
        history_record = PaymentPlan.objects.filter(user_id=request.user.id)
        history_record_2 = CommsHistMessage.objects.filter(user_id=request.user.id)
        history_record_3 = CommunicationHistoryReminder.objects.filter(user_id=request.user.id)
        history_record_4 = DebtorIntelligenceNote.objects.filter(user_id=request.user.id)
        history_records = chain(history_record, history_record_2, history_record_3,history_record_4)
        for record in history_records:
            record.user_id = company_id
            record.save()
            
        return JsonResponse({"message": "History records updated successfully", "status": "success"}, safe=False)
    except Exception as e:
        return JsonResponse({"error": f"Error occurred: {str(e)}", "status": "failed"}, safe=False)


def creditor_debit_journal(request):
   return render(request, "Client/Accounting/AccountAdjustment/CreditorDebitJournal")

def creditor_credit_journal(request):
    return render(request, "Client/Accounting/AccountAdjustment/CreditorCreditJournal")

def debt_call(request):
    if request.method =="POST":
        schema = DebtCallFilterDataSchema()
        try:
            serialized_data = schema.loads(request.body.decode('utf-8'))
        except ValidationError as err:
            return JsonResponse({"errors": err.messages}, status=400)
        message = ''
        balance_filter = float(serialized_data.get('balance_filter',0))
        current_month = 'SAFE' if 'current' in serialized_data.get('aging_filters') else None
        one_month_ago = 'MEDIUM' if '1-30days' in serialized_data.get('aging_filters') else None
        two_months_ago = 'HIGH' if '31-60days' in serialized_data.get('aging_filters') else None
        three_months_ago = 'HIGH-HIGH' if '61-90days' in serialized_data.get('aging_filters') else None
        three_months_plus = 'NON-PAYER' if '+90days' in serialized_data.get('aging_filters') else None
        
        statuses = list(filter(None, [current_month, one_month_ago, two_months_ago, three_months_ago, three_months_plus]))

        leases_obj = Lease.objects.filter(is_active=True,lease_giver=request.user.company,status_cache__in=statuses)
        for lease in leases_obj:
            if lease_balance := Opening_balance.objects.filter(lease_id=lease.lease_id).last():
                balance = float(lease_balance.outstanding_balance)
                if balance_filter <= balance:
                    if lease.is_company:
                        company_ob = Company.objects.filter(id=lease.reg_ID_Number).first()
                        target_id = company_ob.id if company_ob else 0
                        name = company_ob.registration_name if company_ob else "N/A"
                        contact_method = CompanyProfile.objects.filter(company=company_ob.id).first().email if company_ob else ""
                        receiver_type ='company'
                        message = serialized_data.get('email_message','credisafe auto')
                                            
                    else:
                        individual_ob = Individual.objects.filter(identification_number=lease.reg_ID_Number).first()
                        target_id = individual_ob.id if individual_ob else 0
                        name = f"{individual_ob.firstname} {individual_ob.surname}" if individual_ob else "N/A"
                        contact_method = individual_ob.mobile if individual_ob else ""
                        receiver_type ='individual'
                        message = serialized_data.get('sms_message','credisafe auto')
                        
                        
                    send_otp.delay(
                        "",
                        "",
                        contact_method,
                        request.user.company,
                        target_id,
                        receiver_type,
                        settings.PAYMENT_RECEIPT,
                        message,
                    )
    return render(request, "Client/Accounting/DebtCall", {"props": "Debt Call Sent Successfully!"})

@login_required
@clients_required
def sales_categories(request):
    return render(request, "Client/Accounting/Sales/SalesCategories")

@login_required
@clients_required
def products_and_services(request):
    return render(request, "Client/Accounting/Sales/ProductsAndServices")

@login_required
@clients_required
def vat_settings(request):
    return render(request, "Client/Accounting/Sales/VatSettings")

@login_required
@clients_required
def cash_sales(request):
    return render(request, "Client/Accounting/Sales/CashSales")

@login_required
def adverse_data(request):
    return render(request, "Client/AdverseData")

@login_required
@clients_required
def sales_reports(request):
    return render(request, "Client/Accounting/Sales/SalesReports")

@login_required
@clients_required
def cash_books(request):
    return render(request, "Client/Accounting/Sales/CashBooks")

@login_required
@clients_required
def general_ledger(request):
    return render(request, "Client/Accounting/Sales/GeneralLedger")

@login_required
@clients_required
def sales_invoicing(request):
    return render(request, "Client/Accounting/Sales/SalesInvoicing")

def accounts_list(request):

    return render(request, "Client/Accounting/AccountsList")

@login_required
@clients_required
def sales_accounts(request):
    return render(request, "Client/Accounting/Sales/SalesAccounts")

def rate_setup(request):
    return JsonResponse ({"status": "success"}, safe=False)




