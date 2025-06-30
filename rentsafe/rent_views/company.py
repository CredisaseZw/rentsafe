import json
from marshmallow import Schema, fields, validate, ValidationError
from django.contrib.auth.decorators import login_required
from inertia import render
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods
from rentsafe.decorators import admins_required, internal_required
from rentsafe.models import *
from datetime import datetime, date, time
from django.utils import timezone
from rentsafe.serializers import *
from marshmallow import ValidationError
from django.db.models import Q
from authentication.models import CustomUser
from rentsafe.models import Individual, EmployementDetails, OTP
from django.http import JsonResponse
from django.conf import settings
import random
from django.db import IntegrityError
import hashlib
from rentsafe.helper import *
from django.contrib.auth.hashers import make_password
from dateutil.relativedelta import relativedelta
from django.contrib.auth import authenticate


def generate_otp():
    return str(random.randint(1000, 9999))

@login_required
@admins_required
def admin_home(request):
    individual_users = Individual.objects.count()
    individual_customers, company_customers = get_customer_subs_info()
    
    company_users = Company.objects.count()
    all_users = int(individual_users + company_users)
    today = timezone.localdate() 
    start_of_day = timezone.make_aware(datetime.combine(today, datetime.min.time()))
    end_of_day = timezone.make_aware(datetime.combine(today, datetime.max.time()))

    new_subs_count = Subcsriptions.objects.filter(
        created_date__range=(start_of_day, end_of_day)
    ).count()
    new_indviduals_count = Individual.objects.filter(
        created_at__range=(start_of_day, end_of_day)
    ).count()
    new_companies_count = Company.objects.filter(
        created_at__range=(start_of_day, end_of_day)
    ).count()
    new_users = new_companies_count + new_indviduals_count
    earnedIncome = 0
    props = {
        "allUsers": all_users,
        "individual_customers": individual_customers,
        "company_customers": company_customers,
        "newSubsCount": new_subs_count,
        "newUsersCount": new_users,
        "earnedIncome": earnedIncome,
    }

    return render(request, "Admin/Dashboard", props)

@login_required
@admins_required
def agents(request):
    agents_list = []
    active_agents = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:  # pylint: disable=unused-variable
            # #err.messages)
            return render(
                request, "Admin/Users/SearchAgencyUsers", props={"errors": err.messages}
            )
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip()
            if searchParam == "fullname" and len(searchValue) > 0:
                searchWords = searchValue.split(" ")

                if len(searchWords) >= 2:
                    firstname = searchWords[0]
                    surname = searchWords[1]
                    result = Individual.objects.filter(
                        firstname__iexact=firstname, surname__iexact=surname
                    )
                else:
                    result = ""
            else:
                result = Individual.objects.filter(national_id=searchValue.upper()).first()
            for user in result:
                agent = CustomUser.objects.filter(individual=user.id).first()
                if agent:
                    employment_details = EmployementDetails.objects.filter(
                        individual=user.id
                    ).first()
                    agents_list.append(
                        {
                            "id": agent.id,
                            "firstname": user.firstname,
                            "surname": user.surname,
                            "national_id": user.national_id,
                            "mobile": user.mobile,
                            "landline": user.land_line,
                            "is_agent": True if agent.user_type == 3 else False,
                            "email": user.email,
                            "address": user.unit_number if user.unit_number else "N/A",
                            "identification_type": user.identification_type,
                            "identification_number": user.identification_number,
                            "dob": user.dob,
                            "gender": user.gender,
                            "date_of_employment": (
                                employment_details.date_of_employment
                                if employment_details
                                else "N/A"
                            ),
                            "employer_name": (
                                employment_details.employer_name
                                if employment_details
                                else "N/A"
                            ),
                            "job_title": (
                                employment_details.job_title
                                if employment_details
                                else "N/A"
                            ),
                        }
                    )
                result = agents_list
            agent_schema = AgentSchema()
            agent = agent_schema.dump(result, many=True)
            props = {"result": agent}
            return render(request, "Admin/Users/SearchAgencyUsers", props)

    else:
        all_agents = CustomUser.objects.filter(user_type=3)
        for agent in all_agents:
            if agent.user_type == 3:
                user = Individual.objects.filter(id=agent.individual).first()
                if user:
                    active_agents.append(
                        {
                            "id": agent.id,
                            "firstname": user.firstname,
                            "surname": user.surname,
                            "national_id": user.national_id,
                            "mobile": user.mobile,
                            "landline": user.land_line,
                            "email": user.email,
                            "is_agent": True if agent.user_type == 3 else False,
                            # "address": user.address,
                            "identification_type": user.identification_type,
                            "identification_number": user.identification_number,
                            "dob": user.dob,
                            "gender": user.gender,
                        }
                    )
            else:
                pass

        props = {"agents": active_agents}
        return render(request, "Admin/Users/SearchAgencyUsers", props)


@login_required
@admins_required
def create_agent_user(request):
    if request.method == "POST":
        create_agent_schema = CreateAgentSchema()
        try:
            data = create_agent_schema.loads(request.body)
            # data)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            # err.messages)
            return render(request, "Admin/Users/SearchAgencyUsers", props)
        else:
            # create individual and user
            individual = Individual(
                individual_adder=request.user.id,
                national_id=data.get("identificationNumber").upper(),
                firstname=data.get("firstName").upper(),
                surname=data.get("lastName").upper(),
                dob=data.get("dateOfBirth"),
                email=data.get("userEmail"),
                land_line=data.get("landline"),
                gender=data.get("gender"),
                mobile=data.get("mobileNumber"),
                # address=data.get("address"),
                identification_type=data.get("identificationType"),
                identification_number=data.get("identificationNumber").upper(),
                is_user=True,
                unit_number=data.get("unitNumber"),  ## Address Fields
                building_name=data.get("buildingName"),
                street_number=data.get("streetNumber"),
                street_name=data.get("streetName"),
                suburb=data.get("suburb"),
                city= data.get("city"),
                province=data.get("province"),
                country= data.get("country"),
                area_code=data.get("areaCode"), 
            )
            individual.save()
            new_message = "Accept Agent Account registration on CrediSafe? Give OTP below as confirmation."
            # is_agent = (
            #     CustomUser.objects.filter(individual=individual.id).first().user_type
            #     == 3
            # )
            # if not is_agent:
            
            EmployementDetails.objects.create(
                individual=individual.id,
                date_of_employment=data.get("dateOfEmployment"),
                employer_name=data.get("currentEmployer"),
                job_title=data.get("jobTitle"),
                marital_status=data.get("maritalStatus"),
                employer_email=data.get("employerEmail"),
            )
        props = {
            "success": "success",
        }
        return redirect("search-agents")

    else:
        return redirect("search-agents")


@login_required
@admins_required
def update_agent(request):
    if request.method == "POST":
        update_agent_schema = UpdateAgentSchema()
        try:
            data = update_agent_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            # err.messages)
            return render(request, "Admin/Users/SearchAgencyUsers", props)
        else:
            check_user = CustomUser.objects.filter(id=data.get("individualId")).first()
            is_agent = data.get("isAgent")
            if is_agent :
                check_user.is_superuser = True if is_agent else False
            else:
                check_user.delete()

            if check_user:
                check_user.save()
                props = {
                    "success": "success",
                }
                return redirect("search-agents")
            props = {
                "errors": "User not found",
            }
            return render(request, "Admin/Users/SearchAgencyUsers", props)

    else:
        return redirect("search-agents")


@login_required
@admins_required
def destroy_agent(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return redirect("client-users")
        else:
            user = CustomUser.objects.filter(id=data["individual_id"]).first()
            user.user_type = 4
            user.save()

        return redirect("client-users")
    else:
        return redirect("client-users")

@login_required
@internal_required
def companies(request):
    if request.method == "POST":
        # #"rapostwaa")
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "Admin/Search/SearchCompany", props)
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip().upper()
            if searchParam == "registration_name" and len(searchValue) > 0:
                result = Company.objects.filter(
                    registration_name__icontains=searchValue
                ).values()
            elif searchParam == "registration_number" and len(searchValue) > 0:
                result = Company.objects.filter(
                    Q(registration_number__startswith=searchValue)
                )
            else:
                pass

            company_schema = CompanySchema(many=True)
            companies = company_schema.dump(result)
            return render(
                request, "Admin/Search/SearchCompany", props={"result": companies}
            )
    else:
        return render(request, "Admin/Search/SearchCompany", props={})


@login_required
@internal_required
def individuals(request):
    individuals_list = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            return redirect("individuals")
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
            return render(request, "Admin/Search/SearchIndividual", props)

    else:
        props = {}
        return render(request, "Admin/Search/SearchIndividual", props)

@login_required
@internal_required
def create_individual(request):
    if request.method == "POST":
        create_individual_schema = CreateIndividualSchema()
        try:
            data = create_individual_schema.loads(request.body)
            # #data)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }

            # err.messages)
            return render(request, "Admin/Search/SearchIndividual", props)

        else:
            individual = Individual(
                individual_adder=request.user.company,
                national_id=data.get("identificationNumber").upper(),
                firstname=data.get("firstname").upper(),
                surname=data.get("surname").upper(),
                dob=data.get("dob") if data.get("dob") != "" else None,
                gender=data.get("gender"),
                mobile=data.get("mobile"),
                email=data.get("email"),
                land_line=data.get("land_line"),
                identification_type=data.get("identification_type"),
                identification_number=data.get("identificationNumber").upper(),
                is_verified=True,
                unit_number=data.get("unitNumber"),  ## Address Fields
                building_name=data.get("buildingName"),
                street_number=data.get("streetNumber"),
                street_name=data.get("streetName"),
                suburb=data.get("suburb"),
                city= data.get("city"),
                province=data.get("province"),
                country= data.get("country"),
                area_code=data.get("areaCode"), 
            )
            individual.save()
            # send OTP
            request_user_company = Company.objects.filter(id=request.user.company).first()
            name = request_user_company.registration_name if request_user_company else "N/A"
            individual_employement_details = EmployementDetails(
                individual=individual.id,
                date_of_employment=data.get("date_of_employment"),
                job_title=data.get("job_title"),
                employer_name=data.get("employer_name"),
                employer_email=data.get("employer_email"),
                marital_status=data.get("marital_status"),
            )
            individual_employement_details.save()
            user_password = generate_otp()
            hash_password = make_password(user_password)
            user_name = generate_user_name(individual.national_id)
            # create user
            user = CustomUser(
                email=individual.national_id,
                is_superuser=False,
                company="",
                individual=individual.id,
                password=hash_password,
                user_type=4,
            )
            user.save()
            created_user = CustomUser.objects.filter(
                email=individual.national_id
            ).first()
            new_message = f"Hi {individual.firstname}!, Your CrediSafe   account has been created. Your login credentials are : \n User Pin: {created_user.user_id} \n Pincode: {user_password}"
            otp_code = ""

            # try:
            #     send_otp.delay(
            #     request.build_absolute_uri(),
            #     otp_code,
            #     individual.mobile,
            #     request.user.id,
            #     individual.id,
            #     "agent",
            #     settings.ADD_AGENT_USER,
            #     new_message,
            #     )
            # except Exception as err:
            #     pass

            return render(request, "Admin/Search/SearchIndividual", props={})

            # return render(request,'Admin/Search/SearchIndividual',props={})
    else:
        return render(request, "Admin/Search/SearchIndividual", props={})

@login_required
@internal_required
def create_individual_user(request):
    if request.method == "POST":
        create_individual_schema = CreateIndividualSchema()
        try:
            data = create_individual_schema.loads(request.body)
            # #data)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }

            # err.messages)
            return render(request, "Admin/Users/SearchIndividualUser", props)
        else:
            individual = Individual(
                individual_adder=request.user.company,
                national_id=data.get("identificationNumber").upper(),
                firstname=data.get("firstname").upper(),
                surname=data.get("surname").upper(),
                dob=data.get("dob") if data.get("dob") != "" else None,
                gender=data.get("gender"),
                mobile=data.get("mobile"),
                email=data.get("email"),
                land_line=data.get("land_line"),
                # address=data.get("address"),
                identification_type=data.get("identification_type"),
                identification_number=data.get("identificationNumber").upper(),
                is_user=True,
                is_verified=True,
                unit_number=data.get("unitNumber"),  ## Address Fields
                building_name=data.get("buildingName"),
                street_number=data.get("streetNumber"),
                street_name=data.get("streetName"),
                suburb=data.get("suburb"),
                city= data.get("city"),
                province=data.get("province"),
                country= data.get("country"),
                area_code=data.get("areaCode"), 
                
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
            # send OTP
            request_user_company = Company.objects.filter(id=request.user.company).first()
            name = request_user_company.registration_name if request_user_company else "N/A"
            user_password = generate_otp()
            hash_password = make_password(user_password)
            user_name = individual.national_id
            user = CustomUser(
            email=user_name,
            is_superuser=False,
            company='',
            individual=individual.id,
            user_type=4,
            password=hash_password,
            )
            user.save()
            user_name = CustomUser.objects.filter(email=user_name).first().user_id
            new_message = f"Hi {individual.firstname}!, Your CrediSafe account has been created. Your login credentials are : \n User Pin: {user_name} \n PinCode: {user_password}"
            otp_code = ""

            # send_otp.delay(
            #     request.build_absolute_uri(),
            #     otp_code,
            #     individual.mobile,
            #     request.user.id,
            #     individual.id,
            #     "individual",
            #     settings.ADD_INDIVIDUAL,
            #     new_message,
            # )
                # return redirect("search_individual_users")
            return render(request, "Admin/Users/SearchIndividualUser", props={})
    else:
        return redirect("search_individual_users")

@login_required
def is_individual_verified(request):
    return None
    check_individual = Individual.objects.filter(
        individual_adder=request.user.id
    ).last()
    user_password = generate_otp()
    hash_password = make_password(user_password)
    user_name = check_individual.national_id
    if check_individual and check_individual.is_verified:
        # create user

        user = CustomUser(
            email=user_name,
            is_superuser=False,
            company='',
            individual=check_individual.id,
            user_type=4,
            password=hash_password,
        )
        user.save()
        user_name = CustomUser.objects.filter(email=user_name).first().user_id
        new_message = f"Hi {check_individual.firstname}!, Your CrediSafe account has been created. Your login credentials are : \n User Pin: {user_name} \n PinCode: {user_password}"
        otp_code = ""

        # send_otp.delay(
        #     request.build_absolute_uri(),
        #     otp_code,
        #     check_individual.mobile,
        #     request.user.id,
        #     check_individual.id,
        #     "individual",
        #     settings.ADD_INDIVIDUAL,
        #     new_message,
        # )
    else:
        pass
    return JsonResponse({"status": 200})

@login_required
def is_user_verified(request):
    pass

@login_required
@internal_required
def create_company(request):
    if request.method == "POST":
        create_company_schema = CreateCompanySchema()
        try:
            data = create_company_schema.loads(request.body)
        except ValidationError as err:
            # #err.messages)
            props = {
                "errors": err.messages,
            }
            if json.loads(request.body)["pageType"] == "dashboard":
                return render(request, "Admin/Search/SearchCompany", props)
            else:
                return render(request, "Admin/Users/SearchCompanyUser", props)
        try:
            registration_number = data.get("companyRegistrationNumber")
            # Create the company
            company_ob = Company(
                registration_number=registration_number,
                registration_name=data.get("registeredName").upper(),
                trading_name=data.get("tradingName").upper(),
                industry=data.get("industry"),is_client = True if data.get("is_contracted") else False,
                company_uploader=request.user.company,
                is_government=data.get("is_gvt"),    
            )
            company_ob.save()
            # Create the company profile
            CompanyProfile.objects.create(
                company=company_ob.id,
                registration_date=data.get("registrationDate") if data.get("registrationDate") else None,
                vat_number=data.get("vatNumber"),
                mobile_phone=data.get("mobileNumber"),
                email=data.get("emailAddress"),
                website=data.get("website") ,
                note=data.get("note"),
                landline_phone=data.get("landLine"),
                branch=data.get("branch"),
                unit_number=data.get("unitNumber"),
                building_name=data.get("buildingName"),
                street_number=data.get("streetNumber"),
                street_name=data.get("streetName"),
                suburb=data.get("suburb"),
                city= data.get("city"),
                province=data.get("province"),
                country= data.get("country"),
                area_code=data.get("areaCode"), 
            )
            email_ob = data.get("emailAddress")
            # send email
            user_password = generate_otp()
            hash_password = make_password(user_password)
            if email_ob:
                company_user = CustomUser(
                    email=email_ob,
                    user_id=email_ob,
                    company=company_ob.id,
                    user_type=1,
                    password=hash_password,
                    is_superuser=True,
                )
                company_user.save()
                send_auth_email.delay(
                    email_ob,
                    user_password,
                    email_ob,
                    company_ob.registration_name,
                )
        except IntegrityError as err:

            props = {
                "errors": err,
            }
            if json.loads(request.body)["pageType"] == "dashboard":
                return render(request, "Admin/Search/SearchCompany", props)
            else:
                return render(request, "Admin/Users/SearchCompanyUser", props)
        return redirect("companies")
    return redirect("companies")

@login_required
@internal_required
def upload_companies(request):
    if request.method == "POST":
        file = request.FILES.get("companyFile", None)
        if file is not None:
            pass
        else:
            pass

        return redirect("companies")

    return redirect("companies")

@login_required
@internal_required
def credit_check(request):
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "CreditCheck/Index", props)
        else:
            search_value = data.get("searchValue")
            search_key = data.get("searchParam")

        if search_key == "identification_number":
            result = Individual.objects.filter(
                identification_number=search_value
            ).first()
            individual_schema = IndividualSchema()
            individual = individual_schema.dump(result)
            # func to send OTP

            props = {"result": individual}
            return render(request, "CreditCheck/Index", props)
        else:
            if search_key == "registration_number":
                result = Company.objects.filter(
                    registration_number=search_value
                ).first()
            else:
                result = Company.objects.filter(
                    registration_name__startswith=search_value
                ).first()
            # #result)
            company_schema = CompanySchema()
            company = company_schema.dump(result)

            props = {"result": company}

            return render(request, "CreditCheck/Index", props)

    props = {}
    return render(request, "CreditCheck/Index", props)

@login_required
@internal_required
def leases(request):
    return render(request, "Leases/Index")

@login_required
@internal_required
@require_http_methods(["POST"])
def create_lease(request):
    return redirect("leases")

@login_required
@internal_required
def company_verify_otp(request):
    if request.method == "POST":
        otp_schema = OTPSchema()

        try:
            data = otp_schema.loads(request.body)

        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "Admin/Search/SearchCompany", props)
        else:
            # #"verified...")
            check_otp = OTP.objects.filter(otp_code=data.get("otp")).first()

            if check_otp:
                if check_otp.requested_user_type == "company":
                    req_user = Company.objects.filter(
                        id=check_otp.requested_user
                    ).first()
                else:
                    req_user = None

                if req_user:
                    req_user.is_verified = True
                    req_user.save()
                    check_otp.delete()
                else:
                    pass

            else:
                pass
            props = {"is_verified": True}

            return render(request, "Admin/Search/SearchCompany", props)

    return redirect("companies")

@login_required
@internal_required
def individual_verify_otp(request):
    # "poetry,,,,")
    if request.method == "POST":
        otp_schema = OTPSchema()
        try:
            data = otp_schema.loads(request.body)

        except ValidationError as err:
            props = {"errors": err.messages}
            # ".....", err.messages)
            # #err)
            return render(request, "Admin/Search/SearchIndividual", props)
        else:
            # #"verified...")
            check_otp = OTP.objects.filter(otp_code=data.get("otp")).first()

            if check_otp:
                if check_otp.requested_user_type == "individual":
                    req_user = Individual.objects.filter(
                        id=check_otp.requested_user
                    ).first()
                else:
                    req_user = Company.objects.filter(
                        id=check_otp.requested_user
                    ).first()

                if req_user:
                    req_user.is_verified = True
                    req_user.save()
                    check_otp.delete()
                else:
                    pass

            else:
                pass
            props = {"is_verified": True}

            return render(request, "Admin/Search/SearchIndividual", props)

    return redirect("individuals")

@login_required
@admins_required
def agent_verify_otp(request):
    return None
    # "poetry,,,,")
    if request.method == "POST":
        otp_schema = OTPSchema()
        try:
            data = otp_schema.loads(request.body)

        except ValidationError as err:
            props = {"errors": err.messages}
            # ".....", err.messages)
            # #err)
            return render(request, "Admin/Users/SearchAgencyUsers", props)
        else:
            # #"verified...")
            check_otp = OTP.objects.filter(otp_code=data.get("otp")).first()
            if check_otp:
                if data.get("verification_type") == "agent":
                    req_user = Individual.objects.filter(
                        id=check_otp.requested_user
                    ).first()
                    if req_user:
                        req_user.is_verified = True
                        req_user.save()
                        user_password = generate_otp()
                        hash_password = make_password(user_password)
                        user_name = generate_user_name(req_user.national_id)
                        # create user
                        user = CustomUser(
                            email=req_user.national_id,
                            is_superuser=False,
                            company=int(request.user.company),
                            individual=req_user.id,
                            password=hash_password,
                            user_type=3,
                        )
                        user.save()
                        created_user = CustomUser.objects.filter(
                            email=req_user.national_id
                        ).first()
                        new_message = f"Hi {req_user.firstname}!, Your CrediSafe   Agent account has been created. Your login credentials are : \n User Pin: {created_user.user_id} \n Pincode: {user_password}"
                        otp_code = ""

                        try:
                            send_otp.delay(
                            request.build_absolute_uri(),
                            otp_code,
                            req_user.mobile,
                            request.user.id,
                            req_user.id,
                            "agent",
                            settings.ADD_AGENT_USER,
                            new_message,
                            )
                        except Exception as err:
                            pass
                        check_otp.delete()
                else:
                    pass

            else:
                pass
            props = {"is_verified": True}

            return render(request, "Admin/Users/SearchAgencyUsers", props)

    return redirect("search-agents")

@login_required
@internal_required
def individual_user_verify_otp(request):
    return None
    if request.method == "POST":
        otp_schema = OTPSchema()
        try:
            data = otp_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "Admin/Users/SearchIndividualUser", props)
        else:
            check_otp = OTP.objects.filter(otp_code=data.get("otp")).first()
            if check_otp:
                if check_otp.requested_user_type == "individual":
                    req_user = Individual.objects.filter(
                        id=check_otp.requested_user
                    ).first()
                    if req_user:
                        req_user.is_verified = True
                        req_user.save()
                        user_password = generate_otp()
                        hash_password = make_password(user_password)
                        # create user
                        user_name = generate_user_name(req_user.national_id)
                        user = CustomUser(
                            email=user_name,
                            is_superuser=False,
                            company=int(request.user.company),
                            individual=req_user.id,
                            user_type=4,
                            password=hash_password,
                        )
                        user.save()
                        new_message = f"Hi {req_user.firstname}!, Your CrediSafe account has been created. Your login credentials are : \n User Pin: {user_name} \n Pincode: {user_password}"
                        otp_code = ""

                        # send_otp.delay(
                        #     request.build_absolute_uri(),
                        #     otp_code,
                        #     req_user.mobile,
                        #     request.user.id,
                        #     req_user.id,
                        #     "individual",
                        #     settings.ADD_INDIVIDUAL,
                        #     new_message,
                        # )
                        # check_otp.delete()
                else:
                    pass

            else:
                pass
            props = {"is_verified": True}

            return render(request, "Admin/Users/SearchIndividualUser", props)

    return redirect("individuals")

# get subscription monthly pricing
@login_required
@internal_required
def active_subscription(request):
    if request.method == "POST":
        subscription_data = json.loads(request.body.decode("utf-8"))
        errors =[]
        subs=[]
        for index, data in enumerate(subscription_data):
            if index == 0 and not data.get("subscriberName"):
                continue
            try:
                create_subscription_schema = CreateSubscriptionSchema()
                subscription_data = create_subscription_schema.load(data)
                subs.append(subscription_data)
                # for subscription in subs:
                subPeriod = int(subscription_data.get("subPeriod"))
                if subPeriod == 4:
                    period_length = 12
                elif subPeriod == 3:
                    period_length = 6
                elif subPeriod == 2:
                    period_length = 3
                else:
                    period_length = "N/A"
                datetime_string = subscription_data.get("startDate")
                datetime_obj = datetime.fromisoformat(f"{datetime_string}")

                sub_start = datetime_obj.strftime("%Y-%m-%d")
                sub_end = datetime_obj + relativedelta(months=period_length)
                datetime_ob = datetime.fromisoformat(f"{sub_end}")
                sub_end = datetime_ob.strftime("%Y-%m-%d")
                subscription_ob = Subcsriptions(
                    service_id=subscription_data.get("product"),
                    subscriber_id=subscription_data.get("subscriberName"),  # company id of subscriber
                    start_date=sub_start,
                    subscription_class='combined',
                    period=subPeriod,
                    number_of_subscriptions=subscription_data.get("numberOfSubs"),
                    currency=subscription_data.get("currency"),
                    payment_method=subscription_data.get("paymentMethod"),
                    total_amount=subscription_data.get("subsAmount"),
                    monthly_amount=subscription_data.get("monthlyPrice"),
                    end_date=sub_end,
                )
                subscription_ob.save()
                otp = ""
                period = subPeriod
                message = f"You have successfully subscribed to CrediSafe for {period_length} months,Your subscription will expire on {sub_end} ."
                if len(subscription_data.get("subscriberRegNo")) > 8:
                    subscriber_mobile = Individual.objects.filter(national_id=subscription_data.get("subscriberRegNo")).first().mobile
                    if subscriber_mobile:
                        try:
                            send_otp.delay(
                            request.build_absolute_uri(),
                            otp,
                            subscriber_mobile,
                            request.user.id,
                            subscription_data.get("subscriberRegNo"),
                            "individual",
                            settings.ADD_SUBSCRIPTION,
                            message,
                            )
                        except Exception as err:
                            pass
                            print('error',err)
                else:
                    email_ob = Company.objects.filter(
                        id=subscription_data.get("subscriberName")
                    ).first()
                    email = CompanyProfile.objects.filter(company=email_ob.id).first().email
                    send_credit_check_email.delay(
                        message, 
                        email,
                        "",
                        settings.ADD_SUBSCRIPTION,
                        request.user.id,
                        email_ob.id,
                        )
            except ValidationError as err:
                error_message = err.messages
                errors.append(error_message)
                return JsonResponse({"status": 400,"errors":errors})
            # subscriber_individual_id = Individual.objects.filter(national_id=data.get("subscriberRegNo")).first().id
         
        return redirect("active_subcription")
            # return render(request, "Admin/Subscription/Active", props={})
    else:
        sub_dic = {}
        sub_list = []
        comp_ob = None
        subscriptions = Subcsriptions.objects.filter(is_activated=True)
        for sub in subscriptions:
            activated_leases = Lease.objects.filter(
                lease_giver=sub.subscriber_id, is_active=True, subscription=sub.id
            ).count()
            subscription_slots = int(sub.number_of_subscriptions) - int(activated_leases)
            if len(sub.subscriber_id) < 6: #sub.subscription_class.lower() == "company" and isinstance(sub.subscriber_id, int) :
                comp_ob = Company.objects.filter(
                    id=sub.subscriber_id 
                ).first()
            
            individual_ob = Individual.objects.filter(
                identification_number=sub.subscriber_id
            ).first()
            if individual_ob or comp_ob:
                if comp_ob:
                    subscriber_name = comp_ob.registration_name
                if individual_ob:
                    subscriber_name = (
                        individual_ob.firstname + " " + individual_ob.surname
                    )

                try:
                    service = Services.objects.filter(id=sub.service_id).first()
                    service = service.service_name
                except:
                    service = "N/A"

                try:
                    sub_period = SubcsriptionPeriod.objects.filter(
                        id=sub.period 

                    ).first()
                    period = sub_period.name
                except:
                    period = "N/A"

                if sub.id not in sub_dic.keys():
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
                            sub.is_activated = False
                            sub.save()

                        # months_remaining)
                        days = days_remaining % 30
                    else:
                        months_remaining = period_length
                        days = 0
                    # "the subscription end on ...", sub_end)
                    sub_dic.update(
                        {
                            sub.id: {
                                "id": sub.id,
                                "subscriptionName": subscriber_name,
                                "product": service,
                                "subClass": sub.subscription_class,
                                "period": period,
                                "number_of_subscriptions": f"Total: {sub.number_of_subscriptions} -> Left: {subscription_slots}",
                                "startDate": sub_start,
                                "endDate": sub_end,
                                "monthsRemains": f"{months_remaining} Months",
                            }
                        }
                    )
            else:
                pass

        for key, value in sub_dic.items():
            sub_list.append(value)
        activeSubscriptions = Subcsriptions.objects.filter(is_activated=True).count()
        props = {"subscriptions": sub_list, "activeSubscriptions": activeSubscriptions}
        return render(request, "Admin/Subscription/Active", props)

# get subscription &Lease details for C/I on Admin side
@login_required
@internal_required
def view_subscription_details(request, subscription_id):
    subscriptions = Subcsriptions.objects.filter(id=subscription_id).first()
    individual_ob = Individual.objects.filter(
        national_id=subscriptions.subscriber_id
    ).first()
    try:
        company_ob = Company.objects.filter(
            id=subscriptions.subscriber_id
        ).first()
    except:
        ...
    if individual_ob or company_ob:
        if individual_ob:
            subscriber_id = individual_ob.national_id
            subscriber_company = CustomUser.objects.filter(individual=individual_ob.id).first().company
        if company_ob:
            subscriber_id = company_ob.id
            subscriber_company = CustomUser.objects.filter(company=company_ob.id).first().company
    all_subscriptions = Subcsriptions.objects.filter(subscriber_id=subscriber_id)
    if not all_subscriptions:
        return redirect("active_subcription")
    sub_dic = {}
    sub_list = []
    for sub in all_subscriptions:
        activated_leases = Lease.objects.filter(lease_giver=subscriber_company,is_active =True,subscription =sub.id).count()
        subscription_slots = int(sub.number_of_subscriptions) - int(activated_leases)
        if sub.id not in sub_dic.keys():
            service = Services.objects.filter(id=sub.service_id).first()
            period = SubcsriptionPeriod.objects.filter(id=sub.period).first()
            start_date = sub.start_date.strftime("%d-%B-%Y")
            end_date = sub.end_date.strftime("%d-%B-%Y")
            if service and period:
                sub_dic.update(
                    {
                        sub.id: {
                            "sub_id": sub.id,
                            "subscription_class": sub.subscription_class,
                            "service": service.service_name,
                            "period_length": period.period_length,
                            "start_date": start_date,
                            "open_slots": subscription_slots,
                            "end_date": end_date,
                        }
                    }
                )


    for key, value in sub_dic.items():
        sub_list.append(value)
    #
    lease_dic = {}
    lease_list = []
    subscriber_id = Subcsriptions.objects.filter(id=subscription_id).first()
    individual_ob = Individual.objects.filter(
        national_id=subscriber_id.subscriber_id
    ).first()
    try:
        company_ob = Company.objects.filter(
            id=subscriber_id.subscriber_id
        ).first()
    except:
        ...
    if individual_ob or company_ob:
        if individual_ob:
            subscriber_id = individual_ob.id
        if company_ob:
            subscriber_id = company_ob.id
    leases = Lease.objects.filter(lease_giver=subscriber_id, is_active=True)
    for i in leases:
        name = ""
        mobile = ""
        if i.is_company:
            company_ob = Company.objects.filter(
                id=i.reg_ID_Number
            ).first()
            if company_ob:
                name = company_ob.registration_name 
                mobile = "mobile"

        if i.is_individual:
            individual_ob = Individual.objects.filter(
                national_id=i.reg_ID_Number.upper()
            ).first()
            if individual_ob:
                name = individual_ob.firstname + "" + individual_ob.surname
                mobile = individual_ob.mobile

        if i.lease_id not in lease_dic.keys():
            lease_payment_detail = LeasePayments.objects.filter(lease_id=i.lease_id).last()
            opening_balance_amount = Opening_balance.objects.filter(lease_id=i.lease_id).last()
            if lease_payment_detail or opening_balance_amount:
                owing_amount = float(opening_balance_amount.outstanding_balance)

            if i.status_cache == "NON-PAYER":
                color = "black"
            elif i.status_cache == "HIGH-HIGH":
                color = "danger"
            elif i.status_cache == "HIGH":
                color ="light-red"
            elif i.status_cache == "MEDIUM":
                color = "warning"
            else:
                color = "success"
            
            lease_dic.update(
                {
                    i.lease_id: {
                        "name": name,
                        # "address": i.address,
                        "mobile": mobile,
                        "lease_id": i.lease_id,
                        "reg_ID_Number": i.reg_ID_Number,
                        "is_company": i.is_company,
                        "lease_details": i.lease_details,
                        "deposit_amount": i.deposit_amount,
                        "deposit_period": i.deposit_period,
                        "monthly_rentals": owing_amount,
                        "currency": i.currency,
                        "lease_period": i.lease_period,
                        "status": i.status,
                        "start_date": i.start_date,
                        "color":color,
                        "end_date": i.end_date,
                        "payment_period_start": i.payment_period_start,
                        "payment_period_end": i.payment_period_end,
                    }
                }
            )
    for key, value in lease_dic.items():
        lease_list.append(value)

    return render(
        request,
        "Admin/Subscription/View",
        props={"leases": lease_list, "subscriptions": sub_list},
    )

@login_required
@internal_required
def subs_monthly_pricing(request):
    subscription_monthly_pricing = Subscription_charge_pricing.objects.all().last()
    if subscription_monthly_pricing:
        individual_usd_monthly_price = (
            subscription_monthly_pricing.individual_monthly_charge
        )
        company_usd_monthly_price = subscription_monthly_pricing.company_monthly_charge
        zwl_usd_exchange_rate = Standard_pricing.objects.all().last().current_rate
        individual_zwl_monthly_price = float(individual_usd_monthly_price) * float(
            zwl_usd_exchange_rate
        )
        company_zwl_monthly_price = float(company_usd_monthly_price) * float(
            zwl_usd_exchange_rate
        )
        monthly_pricing = {
            "individual_monthly_price": individual_usd_monthly_price,
            "company_monthly_price": company_usd_monthly_price,
            "individual_zwl_monthly_price": individual_zwl_monthly_price,
            "company_zwl_monthly_price": company_zwl_monthly_price,
        }
        return JsonResponse(monthly_pricing, safe=False)
    else:
        return JsonResponse({"error": "No monthly charge found."}, safe=False)

@login_required
@admins_required
def unallocated_subcription(request):
    return render(request, "Admin/Subscription/Unallocated", props={})

# subscription
@login_required
@admins_required
def historic_subcription(request):
    return render(request, "Admin/Subscription/Historic", props={})

@require_http_methods(["POST"])
def get_client(request):
    client_company = Company.objects.all()

    if client_company:
        client_company_schema = CompanySchema(many=True)
        clients = client_company_schema.dump(client_company)

        for obj in clients:
            obj["class"] = "company"
        return JsonResponse(
            {
                "clients": clients,
                "class": "company",
            },
            safe=False,
        )
    client_individual = Individual.objects.all()
    if client_individual:
        client_individual_schema = IndividualSchema(many=True)
        individuals = client_individual_schema.dump(client_individual)

        for obj in clients:
            obj["class"] = "individual"

        return JsonResponse(
            {
                "individuals": individuals,
                "class": "individual",
            },
            safe=False,
        )
    else:
        return JsonResponse(
            {
                "error": "no clients found",
            },
            safe=False,
        )

@require_http_methods(["POST"])
def get_services(request):
    services = Services.objects.all()
    if services:
        service_schema = ServiceSchema(many=True)
        services = service_schema.dump(services)
        return JsonResponse(
            {
                "services": services,
            },
            safe=False,
        )

@require_http_methods(["POST"])
def get_sub_period(request):
    sub_periods = SubcsriptionPeriod.objects.all()
    if sub_periods:
        sub_period_schema = SubcsriptionPeriodSchema(many=True)
        periods = sub_period_schema.dump(sub_periods)
        return JsonResponse(
            {
                "sub_periods": periods,
            },
            safe=False,
        )

    leases = Lease.objects.all()
    subscription_dic = {}
    lease_list = []
    for lease in leases:
        if lease.lease_id not in subscription_dic.keys():
            subscriber_company = Company.objects.filter(id=lease.lease_giver).first()
            subscriber_company_profile = CompanyProfile.objects.filter(
                company=lease.lease_giver
            ).first()
            subscription = Subcsriptions.objects.filter(id=lease.subscription).first()
            lease_period_ob = SubcsriptionPeriod.objects.filter(
                id=lease.lease_period
            ).first()
            if lease_period_ob:
                lease_period = lease_period_ob.period_length
            else:
                lease_period = "N/A"
            if subscription:
                subscription_class = subscription.subscription_class
                service = Services.objects.filter(id=subscription.service_id).first()
                if service:
                    service_name = service.service_name
                else:
                    service_name = "N/A"
            else:
                subscription_class = "N/A"
                service_name = "N/A"

            if lease.is_company == True:
                lease_receiver_ob = Company.objects.filter(
                    id=lease.reg_ID_Number
                ).first()
                lease_receiver = lease_receiver_ob.registration_name
                lease_reg_number = lease_receiver_ob.registration_number

            elif lease.is_individual == True:
                lease_receiver_ob = Individual.objects.filter(
                    national_id=lease.reg_ID_Number
                ).first()
                lease_receiver = (
                    lease_receiver_ob.firstname + " " + lease_receiver_ob.surname
                )
                lease_reg_number = lease_receiver_ob.national_id
            else:
                lease_receiver = "N/A"
                lease_reg_number = "N/A"

            if subscriber_company and subscriber_company_profile:
                subscription_dic.update(
                    {
                        lease.lease_id: {
                            "lease_id": lease.lease_id,
                            "subscriber": subscriber_company.registration_name,
                            "subscriber_reg_number": subscriber_company.registration_number,
                            "subscriber_profile": subscriber_company_profile.mobile_phone,
                            "lease_receiver": lease_receiver,
                            "lease_reg_number": lease_reg_number,
                            "service": service_name,
                            "subscription_class": subscription_class,
                            "lease_period": lease_period,
                            "lease_start_date": lease.start_date,
                            "lease_end_date": lease.end_date,
                        }
                    }
                )
    return render(request, "Admin/Subscription/Temp", props={})

@login_required
@admins_required
def historic_subs_company(request):
    subscriptions = Subcsriptions.objects.filter(
        is_activated=False, subscription_class="company"
    )
    subscription_dic = {}
    subscription_list = []
    for subscription in subscriptions:
        if subscription.subscriber_id not in subscription_dic.keys():
            subscriber_company = Company.objects.filter(
                id=subscription.subscriber_id
            ).first()
            subscriber_company_profile = CompanyProfile.objects.filter(
                company=subscription.subscriber_id
            ).first()
            lease = Lease.objects.filter(lease_id=subscription.id).first()
            subscription = Subcsriptions.objects.filter(id=subscription.id).first()
            subscription_period_ob = SubcsriptionPeriod.objects.filter(
                id=subscription.period
            ).first()
            if subscription_period_ob:
                subscription_period = subscription_period_ob.period_length
            else:
                subscription_period = "N/A"
            if subscription:
                subscription_class = subscription.subscription_class
                service = Services.objects.filter(id=subscription.service_id).first()
                if service:
                    service_name = service.service_name
                else:
                    service_name = "N/A"
            else:
                subscription_class = "N/A"
                service_name = "N/A"
            if lease:
                if subscription.subscription_class == "company":
                    subscription_taker = Company.objects.filter(
                        id=lease.reg_ID_Number
                    ).first()

                    if subscription_taker:
                        subscriber_reg_number = subscription_taker.registration_number
                        subscriber_reg_name = subscription_taker.registration_name
                    else:
                        subscriber_reg_name = "N/A"
                        subscriber_reg_number = "N/A"

                elif subscription.subscription_class == "individual":
                    subscription_taker_ind = Individual.objects.filter(
                        national_id=lease.reg_ID_Number
                    ).first()
                    if subscription_taker_ind:
                        subscriber_reg_number = subscription_taker_ind.national_id
                        subscriber_reg_name = (
                            subscription_taker_ind.firstname
                            + " "
                            + subscription_taker_ind.surname
                        )
                    else:
                        subscriber_reg_name = "N/A"
                        subscriber_reg_number = "N/A"
                else:
                    pass
            else:
                subscriber_reg_name = "N/A"
                subscriber_reg_number = "N/A"
            if subscriber_company and subscriber_company_profile:
                subscription_dic.update(
                    {
                        subscription.id: {
                            "subscription_id": subscription.id,
                            "subscriber": subscriber_company.registration_name,
                            "subscriber_reg_number": subscriber_company.registration_number,
                            "subscriber_profile_number": subscriber_company_profile.mobile_phone,
                            "subscription_receiver": subscriber_reg_name,
                            "subscription_receiver_reg_number": subscriber_reg_number,
                            "service": service_name,
                            "subscription_class": subscription_class,
                            "subscription_period": subscription_period,
                            "subscription_start_date": (
                                subscription.start_date.strftime("%d-%b-%Y")
                                if subscription.start_date
                                else "N/A"
                            ),
                            "subscription_end_date": (
                                subscription.end_date.strftime("%d-%b-%Y")
                                if subscription.end_date
                                else "N/A"
                            ),
                        }
                    }
                )
            else:
                pass
    for key, value in subscription_dic.items():
        subscription_list.append(value)

    companyHistoricSubscriptions = Subcsriptions.objects.filter(
        is_activated=False, subscription_class="company"
    ).count()

    props = {
        "company_list": subscription_list,
        "companyHistoricSubscriptions": companyHistoricSubscriptions,
    }
    return render(request, "Admin/Subscription/HistoricCompanies", props)

@login_required
@admins_required
def historic_subs_individual(request):
    subscriptions = Subcsriptions.objects.filter(
        is_activated=False, subscription_class="individual"
    )
    subscription_dic = {}
    subscription_list = []
    for subscription in subscriptions:
        if subscription.subscriber_id not in subscription_dic.keys():
            subscriber_company = Company.objects.filter(
                id=subscription.subscriber_id
            ).first()
            subscriber_company_profile = CompanyProfile.objects.filter(
                company=subscription.subscriber_id
            ).first()
            lease = Lease.objects.filter(lease_id=subscription.id).first()
            subscription = Subcsriptions.objects.filter(id=subscription.id).first()
            subscription_period_ob = SubcsriptionPeriod.objects.filter(
                id=subscription.period
            ).first()
            if subscription_period_ob:
                subscription_period = subscription_period_ob.period_length
            else:
                subscription_period = "N/A"
            if subscription:
                subscription_class = subscription.subscription_class
                service = Services.objects.filter(id=subscription.service_id).first()
                if service:
                    service_name = service.service_name
                else:
                    service_name = "N/A"
            else:
                subscription_class = "N/A"
                service_name = "N/A"

            if subscription.subscription_class == "company":
                subscription_taker_comp = Company.objects.filter(
                    registration_number=lease.reg_ID_Number
                ).first()

                if subscription_taker_comp:
                    subscriber_reg_number = subscription_taker_comp.registration_number
                    subscriber_reg_name = subscription_taker_comp.registration_name
                else:
                    subscriber_reg_name = "N/A"
                    subscriber_reg_number = "N/A"

            elif subscription.subscription_class == "individual":
                subscription_taker_ind = Individual.objects.filter(
                    national_id=lease.reg_ID_Number
                ).first()
                if subscription_taker_ind:
                    subscriber_reg_number = subscription_taker_ind.national_id
                    subscriber_reg_name = (
                        subscription_taker_ind.firstname
                        + " "
                        + subscription_taker_ind.surname
                    )
                else:
                    subscriber_reg_name = "N/A"
                    subscriber_reg_number = "N/A"
            if subscriber_company and subscriber_company_profile:
                if subscription:
                    subscription_dic.update(
                        {
                            subscription.id: {
                                "subscription_id": subscription.id,
                                "subscriber": subscriber_company.registration_name,
                                "subscriber_reg_number": subscriber_company.registration_number,
                                "subscriber_profile_number": subscriber_company_profile.mobile_phone,
                                "subscription_receiver": subscriber_reg_name,
                                "subscription_receiver_reg_number": subscriber_reg_number,
                                "service": service_name,
                                "subscription_class": subscription_class,
                                "subscription_period": subscription_period,
                                "subscription_start_date": (
                                    subscription.start_date.strftime("%d-%b-%Y")
                                    if subscription.start_date
                                    else "N/A"
                                ),
                                "subscription_end_date": (
                                    subscription.end_date.strftime("%d-%b-%Y")
                                    if subscription.end_date
                                    else "N/A"
                                ),
                            }
                        }
                    )
                else:
                    pass
            else:
                pass
    for key, value in subscription_dic.items():
        subscription_list.append(value)
    companyHistoricSubscriptions = Subcsriptions.objects.filter(
        is_activated=False, subscription_class="individual"
    ).count()

    props = {
        "individual_list": subscription_list,
        "individualHistoricSubscriptions": companyHistoricSubscriptions,
    }
    return render(request, "Admin/Subscription/HistoricIndividuals", props)

@login_required
@internal_required
def search_individual_users(request):
    """
    search individual users
    """
    individual_dic = {}
    individual_list = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:  # pylint: disable=unused-variable
            # #err.messages)

            return redirect("search_individual_users")
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip()
            result = ""
            
            if searchParam == "fullname" and len(searchValue) > 0:
                searchWords = searchValue.split(" ")

                if len(searchWords) >= 1:
                    firstname = " ".join(searchWords[:-1]) if len(searchWords) > 1 else searchWords[0]
                    surname = searchWords[-1] if len(searchWords) >= 2 else firstname
                    result = Individual.objects.filter(
                        Q(firstname__icontains=firstname) | Q(surname__icontains=surname)
                    )
                    if len(result) == 0:
                        result = Individual.objects.filter(
                            firstname__icontains=searchWords[0]
                        )

                else:
                    pass
            elif searchParam:
                result = Individual.objects.filter(
                    identification_number=searchValue.upper(), is_deleted=False
                )

            if len(result) > 0:
                for individual_ob in result:
                    employment_details = EmployementDetails.objects.filter(
                        individual=individual_ob.id
                    ).first()

                    if (
                        individual_ob.id
                        not in individual_dic.keys()  # pylint: disable=consider-iterating-dictionary
                    ):
                        individual_dic.update(
                            {
                                individual_ob.id: {
                                    "id": individual_ob.id,
                                    "firstname": individual_ob.firstname,
                                    "surname": individual_ob.surname,
                                    "national_id": individual_ob.national_id,
                                    "mobile": individual_ob.mobile,
                                    "gender":individual_ob.gender,
                                    "marital_status":employment_details.marital_status if employment_details else None,
                                    "dob": individual_ob.dob if individual_ob.dob else None,
                                    "landline": individual_ob.land_line,
                                    "email": individual_ob.email,
                                    # "address": individual_ob.address,
                                    "unit_number": individual_ob.unit_number,
                                    "building_name": individual_ob.building_name,
                                    "street_number": individual_ob.street_number,
                                    "street_name": individual_ob.street_name,
                                    "suburb": individual_ob.suburb,
                                    "city": individual_ob.city,
                                    "province": individual_ob.province,
                                    "country": individual_ob.country,
                                    "area_code": individual_ob.area_code,
                                    "identification_type": individual_ob.identification_type,
                                    "identification_number": individual_ob.identification_number,
                                    "date_of_employment": employment_details.date_of_employment if employment_details else None,
                                    "job_tittle": employment_details.job_title if employment_details else None,
                                    "is_verified": individual_ob.is_verified,
                                    "created_at": individual_ob.created_at,
                                }
                            }
                        )
                    if employment_details:
                        individual_dic[individual_ob.id][
                            "job_title"
                        ] = employment_details.job_title
                        individual_dic[individual_ob.id][
                            "employer_name"
                        ] = employment_details.employer_name
                        individual_dic[individual_ob.id][
                            "date_of_employment"
                        ] = employment_details.date_of_employment
                        individual_dic[individual_ob.id][
                            "marital_status"
                        ] = employment_details.marital_status
                for (
                    key,
                    value,
                ) in individual_dic.items():  # pylint: disable=unused-variable
                    individual_list.append(value)
            props = {"result": individual_list}
            return render(request, "Admin/Users/SearchIndividualUser", props)
    else:
        return render(request, "Admin/Users/SearchIndividualUser", props={})

@login_required
@internal_required
def search_company_users(request):
    """
    Search Company Users
    """
    comp_dic = {}
    comp_list = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "Admin/Users/SearchCompanyUser", props)
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip()

            if searchParam == "registration_name" and len(searchValue) > 0:
                comp_obs = Company.objects.filter(
                    registration_name__icontains=searchValue, is_deleted=False
                )
            elif searchParam == "registration_number" and len(searchValue) > 0:
                comp_obs = Company.objects.filter(
                    registration_number=searchValue, is_deleted=False
                )
                # #comp_obs)
            else:
                pass
            if len(comp_obs) > 0:
                for company_ob in comp_obs:
                    com_profile = CompanyProfile.objects.filter(
                        company=company_ob.id
                    ).first()
                    if com_profile:
                        if (
                            company_ob.id not in comp_dic.keys()
                        ):  # pylint: disable=consider-iterating-dictionary
                            comp_dic.update(
                                {
                                    company_ob.id: {
                                        "id": company_ob.id,
                                        "registration_name": company_ob.registration_name,
                                        "registration_number": company_ob.registration_number,
                                        "mobile_phone": com_profile.mobile_phone,
                                        "trading_name": company_ob.trading_name,
                                        "industry": company_ob.industry,
                                        "is_client": company_ob.is_client,
                                        "landline": com_profile.landline_phone,
                                        "registration_date": com_profile.registration_date,
                                        "email": com_profile.email,
                                        "website": com_profile.website,
                                        # "address": com_profile.current_address,
                                        "branch":com_profile.branch if com_profile.branch else "",
                                        "note": com_profile.note,
                                        "vat_number": com_profile.vat_number,
                                        "is_government": company_ob.is_government,
                                        "unit_number": com_profile.unit_number,
                                        "building_name": com_profile.building_name,
                                        "street_number": com_profile.street_number,
                                        "street_name": com_profile.street_name,
                                        "suburb": com_profile.suburb,
                                        "city": com_profile.city,
                                        "province": com_profile.province,
                                        "country": com_profile.country,
                                        "area_code": com_profile.area_code,
                                        
                                    }
                                }
                            )
                for key, value in comp_dic.items():  # pylint: disable=unused-variable
                    comp_list.append(value)
            return render(
                request, "Admin/Users/SearchCompanyUser", props={"result": comp_list}
            )

    return render(request, "Admin/Users/SearchCompanyUser", props={})

@login_required
@admins_required
def delete_company_user(request):
    """
    Deletes a company user and marks the company as deleted in the database.

    Parameters:
        request (HttpRequest): The HTTP request object containing the request data.

    Returns:
        JsonResponse: A JSON response indicating the status of the deletion process.
        Possible values for the "status" field are "success" and "failed".
    """
    json_data = json.loads(request.body)
    company_obj = Company.objects.filter(id=json_data["company_id"]).first()
    if company_obj:
        user = CustomUser.objects.filter(company=company_obj.id).first()
        if user:
            user.delete()
            company_obj.delete()
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "failed"})

@login_required
@admins_required
def delete_individual_user(request):
    """
    Deletes an individual user and associated custom user if they exist.
    Parameters:
        request (HttpRequest): The HTTP request object.
    Returns:
    Absconder_id = national_id number for the deceased and also them.
        JsonResponse: A JSON response indicating the status of the operation.
            Possible status values are:
            - "success": The individual user was successfully deleted.
            - "failed": The individual user does not exist or could not be deleted.
    """
    json_data = json.loads(request.body)
    individual_obj = Individual.objects.filter(id=json_data["individual_id"]).first()
    if individual_obj:
        user = CustomUser.objects.filter(individual=individual_obj.id).first()
        if user:
            user.delete()
        individual_obj.delete()
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "failed"})

@login_required
@internal_required
def edit_individual_user(request):
    """
    Edit individual user
    """
    json_data = json.loads(request.body)
    individual_id = json_data["individualId"]
    try:
        individual_obj = Individual.objects.get(id=individual_id)
        employment_details = EmployementDetails.objects.filter(individual=individual_id).first()
    except Exception as e:  # pylint: disable=broad-exception-caught
        return JsonResponse({"status": "failed", "message": "Individual not found"})
    else:
        # if json_data.get("identificationNumber") and json_data.get("identificationType") == "nationalid":
        #     if validate_national_id(json_data.get("identificationNumber")):
        #         pass
        #     else:
        #         return JsonResponse(
        #             {"status": "error", "message": "Invalid National Id number"}
        #         )
        # elif json_data.get("identificationNumber") and json_data.get("identificationType") == "passport":
        #     if validate_passport_number(json_data.get("identificationNumber")):
        #         pass
        #     else:
        #         return JsonResponse(
        #             {"status": "error", "message": "Invalid Passport number"}
        #         )
        individual_obj.firstname = json_data["firstName"]
        individual_obj.surname = json_data["lastName"]
        individual_obj.national_id = json_data["identificationNumber"].upper()
        individual_obj.identification_type = json_data["identificationType"]
        individual_obj.mobile = json_data["mobileNumber"]
        individual_obj.land_line = json_data.get("landLine")
        # individual_obj.address = json_data["address"]
        individual_obj.email = json_data.get("emailAddress") if json_data.get("emailAddress") else None
        individual_obj.dob = json_data.get("dob") if json_data.get("dob") else None
        individual_obj.gender = json_data.get("gender") if json_data.get("gender") else None
        individual_obj.unit_number = json_data.get("unitNumber")
        individual_obj.street_number =json_data.get("streetNumber")
        individual_obj.street_name =json_data.get("streetName")
        individual_obj.building_name =json_data.get("buildingName")
        individual_obj.suburb = json_data.get("suburb")
        individual_obj.city = json_data.get("city")
        individual_obj.province = json_data.get("province")
        individual_obj.country = json_data.get("country")
        individual_obj.area_code = json_data.get("areaCode")
        
        individual_obj.save()
        if employment_details:
            employment_details.job_title = json_data.get("jobTitle") if json_data.get("jobTitle") else None
            employment_details.employer_name = json_data.get("currentEmployer") if json_data.get("currentEmployer") else None
            employment_details.date_of_employment = json_data.get("dateOfemployment") if json_data.get("dateOfemployment") else None
            employment_details.marital_status = json_data.get("maritalStatus") if json_data.get("maritalStatus") else None
            employment_details.save()
        return JsonResponse(
            {"status": "success", "message": "Individual updated successfully"}
        )

@login_required
@internal_required
def edit_company_user(request):
    """
    Edit company user
    :param request:
    :return: JsonResponse
    """
    json_data = json.loads(request.body.decode("utf-8"))
    company_id = json_data["company_id"]
    try:
        company_obj = Company.objects.get(id=company_id)
        comp_profile = CompanyProfile.objects.get(company=company_id)
    except Exception:  # pylint: disable=broad-exception-caught
        return JsonResponse({"status": "failed", "message": "Company not found"})
    company_obj.registration_name = json_data["registeredName"]
    company_obj.registration_number = json_data["companyRegistrationNumber"]
    company_obj.trading_name = json_data["tradingName"]
    company_obj.industry = json_data.get("industry")
    company_obj.is_client = json_data.get("is_contracted")
    company_obj.is_government = json_data.get("is_gvt")
    
    company_obj.save()
    if comp_profile:
        comp_profile.registration_date = json_data.get("registrationDate")
        comp_profile.vat_number = json_data.get("vatNumber")
        # comp_profile.current_address = json_data.get("currentAddress",None)
        comp_profile.mobile_phone = json_data.get("mobileNumber")
        comp_profile.landline_phone = json_data.get("landLine")
        comp_profile.email = json_data.get("emailAddress")
        comp_profile.website = json_data.get("website")
        comp_profile.note = json_data.get("note")
        comp_profile.branch=json_data.get("branch") if json_data.get("branch") != comp_profile.branch else comp_profile.branch
        comp_profile.unit_number = json_data.get("unitNumber")
        comp_profile.street_number =json_data.get("streetNumber")
        comp_profile.street_name =json_data.get("streetName")
        comp_profile.building_name =json_data.get("buildingName")
        comp_profile.suburb = json_data.get("suburb")
        comp_profile.city = json_data.get("city")
        comp_profile.province = json_data.get("province")
        comp_profile.country = json_data.get("country")
        comp_profile.area_code = json_data.get("areaCode")
        comp_profile.save()
    is_client = company_obj.is_client
    return JsonResponse(
        {
            "status": "success",
            "message": "Company user edited successfully",
            "is_client": is_client,
            'is_government':company_obj.is_government
        }
    )

@login_required
@internal_required
def change_password(request):
    if request.method == "POST":
        user_password_change = PasswordChangeSchema()
        props = {}
        try:
            data = user_password_change.loads(request.body)

            # #data)
        except ValidationError as err:
            props = {
                "errors": err.messages,
            }
            return render(request, "Admin/Profile/ResetPassword", props)
        else:
            new_password = data.get("newPassword")
            confirmed_password = data.get("confirmPassword")
            if request.user:
                old_password = data.get("oldPassword")
                if check_password(old_password, request.user.password):
                    if new_password == confirmed_password:
                        user_password = data.get("confirmPassword")
                        hash_password = make_password(user_password)

                        user = CustomUser.objects.filter(
                            email=request.user.email
                        ).first()
                        user.password = hash_password
                        user.save()
                        props = {"success": "Password changed successfully!"}
                    else:
                        props = {"error": "New Passwords don't match!"}

                else:
                    props = {"error": "Wrong Old Password!"}

                return render(request, "Admin/Profile/ResetPassword", props)

            else:
                props = {"error": "Please Login to perfom this action"}

            return render(request, "Admin/Profile/ResetPassword", props)
    else:
        return render(request, "Admin/Profile/ResetPassword")

@login_required
@admins_required
def make_individual_agent(request):
    json_data = json.loads(request.body.decode("utf-8"))
    user_id = int(json_data["userId"])
    try:
        user_obj = CustomUser.objects.filter(id=user_id).first()
        user_obj.user_type = 3
        user_obj.save()
        individual = Individual.objects.get(id=user_obj.individual)
        otp = ""
        message = "You have been successfully assigned as a  Credisafe agent.\n Your login credentials are still the same. \n\n Thank you."
        try:
            send_otp.delay(
            request.build_absolute_uri(),
            otp,
            individual.mobile,
            request.user.id,
            user_obj.id,
            "agent",
            settings.MAKE_AGENT,
            message,
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": "Failed to send message"})
        return JsonResponse({"status": "success"})
    except Exception as e:  # pylint: disable=broad-exception-caught
        return JsonResponse({"status": "error"})

@login_required
@admins_required
def subs_pricing(request):
    client_data = []
    if request.method == "POST":
        pass
    else:
        last_day_changed = None
        last_usd_rate = None
        special_pricing_data = Special_pricing.objects.all()
        for data in special_pricing_data:
            client_company = data.client_customer
            currency_type = data.currency_type
            individual_charge = data.individual_charge
            company_charge = data.company_charge

            client_data.append(
                {
                    "id": data.id,
                    "client_company": client_company,
                    "currency_type": currency_type,
                    "individual_charge": individual_charge,
                    "company_charge": company_charge,
                }
            )

        current_usd_rate = Standard_pricing.objects.all().last()
        if current_usd_rate:
            last_usd_rate = current_usd_rate.current_rate
            individual_charge = current_usd_rate.individual_charge
            company_charge = current_usd_rate.company_charge
            formatted_date = current_usd_rate.updated_at.strftime("%d-%b-%Y")
        else:
            formatted_date = "N/A"
            last_day_changed = "N/A"
        props = {
            "last_day_changed": formatted_date,
            "current_usd_rate": last_usd_rate,
            "individual_charge": individual_charge,
            "company_charge": company_charge,
            "client_data": client_data,
        }
        return render(request, "Admin/Subscription/Pricing", props)

@login_required
@admins_required
def update_usd_rate(request):
    if request.method == "POST":
        standard_pricing_rate = StandardPricingSchema()
        try:
            data = standard_pricing_rate.loads(request.body)
        except ValidationError as err:
            return JsonResponse({"status": "error", "errors": err.messages})
        else:
            last_rate = data.get("rate")
            individual_price = data.get("individualPrice")
            company_price = data.get("companyPrice")
            current_usd_rate = Standard_pricing.objects.all().last()
            if current_usd_rate:
                if float(current_usd_rate.current_rate) == last_rate:
                    current_usd_rate.individual_charge =individual_price
                    current_usd_rate.company_charge =company_price
                    current_usd_rate.save()
                    return JsonResponse(
                        {"status": "success", "message": "Rate updated successfully!"}
                    )
                else:
                    current_usd_rate.updated_at = datetime.today()
                    current_usd_rate.individual_charge =individual_price
                    current_usd_rate.company_charge =company_price
                    current_usd_rate.current_rate = last_rate
                    current_usd_rate.save()

                    return JsonResponse(
                        {"status": "success", "message": "Rate updated successfully!"}
                    )
            else:
                standard_pricing_ob = Standard_pricing(
                    current_rate=last_rate,
                    individual_charge=individual_price,
                    company_charge=company_price,
                    service_name="rentsafe",
                    currency_type="USD",
                    updated_at=datetime.today(),
                )
                standard_pricing_ob.save()
                return JsonResponse(
                    {"status": "success", "message": "Rate updated successfully!"}
                )
    else:
        pass
    return render(request, "Admin/Subscription/Pricing", props={})

@login_required
@admins_required
def create_special_pricing(request):
    if request.method == "POST":
        special_pricing_data = SpecialPricingSchema()
        try:
            data = special_pricing_data.loads(request.body)
        except ValidationError as err:
            return JsonResponse({"status": "error", "errors": err.messages})
        else:
            client_customer = data.get("clientCustomer")
            special_pricing = Special_pricing(
                client_customer=client_customer,
                currency_type=data.get("currencyType"),
                individual_charge=data.get("individualCharge"),
                company_charge=data.get("companyCharge"),
            )
            special_pricing.save()
            return JsonResponse(
                {
                    "status": "success",
                    "message": f"Special Pricing for {client_customer}created successfully",
                    "special_pricing": special_pricing.id
                }
            )
    else:
        pass
    return render(request, "Admin/Subscription/Pricing", props={})

@login_required
@admins_required
def delete_special_pricing(request):
    special_pricing_id = json.loads(request.body)["specialPricingId"]
    try:
        special_pricing_ob = Special_pricing.objects.filter(
            id=special_pricing_id
        ).first()
        special_pricing_ob.delete()
        return JsonResponse(
            {"status": "success", "message": "Special Pricing deleted successfully!"}
        )
    except Exception as e:
        return JsonResponse(
            {"status": "error", "message": "Special Pricing not found!"}
        )

# @login_required
# @internal_required
def get_all_companies(request):
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return JsonResponse(props, safe=False)
        else:
            searchValue = data.get("searchValue", "").strip()
            result = Company.objects.filter(
                Q(registration_number__startswith=searchValue)
                | Q(registration_name__icontains=searchValue)
            )

            company_profiles = CompanyProfile.objects.filter(company__in=[c.id for c in result])
            email_map = {cp.company: cp.email for cp in company_profiles}
            mobile_map = {cp.company: cp.mobile_phone for cp in company_profiles}
            unit_map = {cp.company: cp.unit_number for cp in company_profiles}
            building_map = {cp.company: cp.building_name for cp in company_profiles}
            street_number_map = {cp.company: cp.street_number for cp in company_profiles}
            street_name_map = {cp.company: cp.street_name for cp in company_profiles}
            suburb_map = {cp.company: cp.suburb for cp in company_profiles}
            city_map = {cp.company: cp.city for cp in company_profiles}
            province_map = {cp.company: cp.province for cp in company_profiles}
            country_map = {cp.company: cp.country for cp in company_profiles}
            area_code_map = {cp.company: cp.area_code for cp in company_profiles}
                       

            company_schema = CompanySchema(many=True)
            companies_data = company_schema.dump(list(result))
            for company_data in companies_data:
                company_data['email'] = email_map.get(str(company_data['id']), '')
                company_data['mobile'] = mobile_map.get(str(company_data['id']), '')
                company_data['unit_number'] = unit_map.get(str(company_data['id']), '')
                company_data['building_name'] = building_map.get(str(company_data['id']), '')
                company_data['street_number'] = street_number_map.get(str(company_data['id']), '')
                company_data['street_name'] = street_name_map.get(str(company_data['id']), '')
                company_data['suburb'] = suburb_map.get(str(company_data['id']), '')
                company_data['city'] = city_map.get(str(company_data['id']), '')
                company_data['province'] = province_map.get(str(company_data['id']), '')
                company_data['country'] = country_map.get(str(company_data['id']), '')
                company_data['area_code'] = area_code_map.get(str(company_data['id']), '')

            return JsonResponse(companies_data, safe=False)
    else:
        return JsonResponse({"result": "No companies found.", "status": "failed"})
    
@login_required
@internal_required
def get_all_individuals(request):
    individuals_list = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return JsonResponse(props, safe=False)
        else:
            searchValue = data.get("searchValue", "").strip().upper()
            result = Individual.objects.filter(
                Q(firstname__startswith=searchValue)
                | Q(surname__startswith=searchValue)
                | Q(national_id__iexact=searchValue)
            )
            for i in result:
                individuals_list.append(i)
            result = individuals_list
            individual_schema = IndividualSchema()
            individual = individual_schema.dump(result, many=True)
            return JsonResponse(individual, safe=False)

    else:
        return JsonResponse({"result": "No individuals found.", "status": "failed"})

@login_required
@internal_required
def get_contracted_company(request):
    """
    Search contracted Company Users
    """
    comp_dic = {}
    comp_list = []
    if request.method == "POST":
        search_schema = SearchSchema()
        try:
            data = search_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return render(request, "Admin/Users/SearchClientUser", props)
        else:
            searchParam = data.get("searchParam")
            searchValue = data.get("searchValue", "").strip().upper()

            if searchParam == "registration_name" and len(searchValue) > 0:
                comp_obs = Company.objects.filter(
                    registration_name__icontains=searchValue,
                    is_deleted=False,
                    is_client=True,
                )
            elif searchParam == "registration_number" and len(searchValue) > 0:
                comp_obs = Company.objects.filter(
                    registration_number=searchValue, is_deleted=False, is_client=True
                )
            else:
                pass
            if len(comp_obs) > 0:
                for company_ob in comp_obs:
                    com_profile = CompanyProfile.objects.filter(
                        company=company_ob.id
                    ).first()
                    if com_profile:
                        if (
                            company_ob.id not in comp_dic.keys()
                        ):  # pylint: disable=consider-iterating-dictionary
                            comp_dic.update(
                                {
                                    company_ob.id: {
                                        "id": company_ob.id,
                                        "registration_name": company_ob.registration_name,
                                        "registration_number": company_ob.registration_number,
                                        "mobile_phone": com_profile.mobile_phone,
                                        "trading_name": company_ob.trading_name,
                                        "industry": company_ob.industry,
                                        "is_client": company_ob.is_client,
                                        "landline": com_profile.landline_phone,
                                        "registration_date": com_profile.registration_date,
                                        "email": com_profile.email,
                                        "website": com_profile.website,
                                        # "address": com_profile.current_address,
                                        "note": com_profile.note,
                                        "vat_number": com_profile.vat_number,
                                        "unit_number": com_profile.unit_number,
                                        "building_name": com_profile.building_name,
                                        "street_number": com_profile.street_number,
                                        "street_name": com_profile.street_name,
                                        "suburb": com_profile.suburb,
                                        "city": com_profile.city,
                                        "province": com_profile.province,
                                        "country": com_profile.country,
                                        "area_code": com_profile.area_code,
                                    }
                                }
                            )
                for key, value in comp_dic.items():  # pylint: disable=unused-variable
                    comp_list.append(value)
            return render(
                request, "Admin/Users/SearchClientUser", props={"result": comp_list}
            )
    return render(request, "Admin/Users/SearchClientUser", props={})

# @login_required
# @internal_required
def get_client_company_users(request):
    """
    Get all contracted company users
    """
    if request.method == "POST":
        get_user_schema = GetClientCompanyUserSchema()
        try:
            data = get_user_schema.loads(request.body)
        except ValidationError as err:
            props = {"errors": err.messages}
            return JsonResponse(props, safe=False)
        else:
            individuals_list = []
            company_name = None
            searchValue = data.get("userName", "").strip().upper()
            result = Individual.objects.filter(
                Q(firstname__startswith=searchValue)
                | Q(surname__startswith=searchValue)
                | Q(national_id__iexact=searchValue)
            )
            if result:
                for i in result:
                    individual_company = CustomUser.objects.filter(individual=i.id).first()
                    if individual_company:
                        company_id = individual_company.company
                        company = Company.objects.filter(id=company_id).first()
                    else:
                        return JsonResponse({"result": "No user company found.", "status": "failed"})
                    if company.is_client:
                        individual_details = {
                            "individual_id": i.id,
                            "company_name" :company.registration_name,
                            "company_id":company.id,
                            "individual_name" :i.firstname + " " + i.surname,
                            "individual_national_id" :i.national_id,
                        }
                        individuals_list.append(individual_details)
                    else:
                        pass
                        return JsonResponse({"result": "user company is not client.", "status": "failed"})
                return JsonResponse(individuals_list, safe=False)
        return JsonResponse({"result": "No User Found", "status": "failed"})

def resend_otp(request):
    """
    Resend OTP
    """
    user = request.user.id
    last_otp_object = OTP.objects.filter(request_user=user).last()
    message = "Your OTP is :"
    otp_code = generate_otp()
    if last_otp_object.requested_user_type == "individual" or last_otp_object.requested_user_type == "agent":
        destination_user = Individual.objects.filter(id=last_otp_object.requested_user).first()
        mobile_number = destination_user.mobile if destination_user else None
        try:
            send_otp.delay(
            request.build_absolute_uri(),
            otp_code,
            mobile_number,
            request.user.id,
            last_otp_object.requested_user,
            last_otp_object.requested_user_type,
            last_otp_object.otp_type,
            message,
            )
        except Exception as e:
            return JsonResponse({"status": "failed"})
        return JsonResponse({"status": "success"})
    elif last_otp_object.requested_user_type == "company":
        destination_user = Company.objects.filter(id=last_otp_object.requested_user).first()
        email_object = CompanyProfile.objects.filter(company=destination_user.id).first()
        email = email_object.email if destination_user else None
        try:
            if last_otp_object.otp_type == settings.CREDIT_CHECK:
                send_credit_check_email.delay(
                otp_code,
                email, 
                destination_user.registration_name,
                last_otp_object.otp_type,
                request.user.id,
                last_otp_object.requested_user
                )
                return JsonResponse({"status": "success"})
            else:
                send_otp.delay(
                request.build_absolute_uri(),
                otp_code,
                email,
                request.user.id,
                last_otp_object.requested_user,
                "company",
                last_otp_object.otp_type,
                message,
                )
        except Exception as e:
            return JsonResponse({"status": "failed"})
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "failed"})

def get_customer_subs_info():
    all_subs = Subcsriptions.objects.filter(is_activated=True,subscription_class='combined')
    individuals_customers_list = []
    companies_customers_list = []
    for sub in all_subs:
        subscriber_details = Individual.objects.filter(identification_number=sub.subscriber_id).first()
        if subscriber_details:
            subscriber_name = subscriber_details.firstname + " " + subscriber_details.surname
            subscriber_id = subscriber_details.identification_number
            subscriber_address = {
                "unit_number": subscriber_details.unit_number,
                "building_name": subscriber_details.building_name,
                "street_number": subscriber_details.street_number,
                "street_name": subscriber_details.street_name,
                "suburb": subscriber_details.suburb,
                "city": subscriber_details.city,
                "province": subscriber_details.province,
                "country": subscriber_details.country,
                "area_code": subscriber_details.area_code,
            }
            activated_leases_count = Lease.objects.filter(is_active=True,lease_giver=subscriber_details.identification_number)
            individuals_customers_list.append({
                "subscriber_name": subscriber_name,
                "individual_leases_count": activated_leases_count.filter(is_individual=True).count() if activated_leases_count else 0,
                "companies_leases_count": activated_leases_count.filter(is_company=True).count() if activated_leases_count else 0,
                "subscriber_id": subscriber_id,
                "subscriber_address": subscriber_address,
            })
            
        else:
            subscriber_details = Company.objects.filter(id=sub.subscriber_id).first()
            if subscriber_details:
                subscriber_name = subscriber_details.registration_name
                subscriber_id = subscriber_details.registration_number
                address_ob = CompanyProfile.objects.filter(company=subscriber_details.id).first()
                subscriber_address = {
                    "unit_number": address_ob.unit_number,
                    "building_name": address_ob.building_name,
                    "street_number": address_ob.street_number,
                    "street_name": address_ob.street_name,
                    "suburb": address_ob.suburb,
                    "city": address_ob.city,
                    "province": address_ob.province,
                    "country": address_ob.country,
                    "area_code": address_ob.area_code,
                }
                activated_leases_count = Lease.objects.filter(is_active=True,lease_giver=subscriber_details.id)
                companies_customers_list.append({
                    "subscriber_name": subscriber_name,
                    "individual_leases_count": activated_leases_count.filter(is_individual=True).count() if activated_leases_count else 0,
                    "company_leases_count": activated_leases_count.filter(is_company=True).count() if activated_leases_count else 0,
                    "subscriber_id": subscriber_id,
                    # "subscriber_address": subscriber_address,
                })
    return individuals_customers_list,companies_customers_list