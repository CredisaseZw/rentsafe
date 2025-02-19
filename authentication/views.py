import json
import re
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from inertia import inertia, render
from django.http import HttpResponseRedirect
from django.core.mail import send_mail
from smtplib import SMTPRecipientsRefused
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods
from . import serializers, EmailBackEnd
from marshmallow import ValidationError
from inertia.share import share
from authentication.models import *
from django.contrib.auth.hashers import make_password
from rentsafe.helper import *
from rentsafe.rent_views.company import generate_otp
from django.contrib import messages


def login_view(request):
    
    if request.method == "POST":
        login_schema = serializers.LoginSchema()
        try:
            data = login_schema.loads(request.body)
        except ValidationError as err:
            props = {
                "error": {
                    "type": "error",
                    "message": "Something went wrong!",
                }
            }
            return render(request, "Auth/Login", props)

            pass
            # share_flash(request, error="Exists errors on form", errors=err.messages)
        else:
            user = EmailBackEnd.authenticate(
                request, username=data.get("email"), password=data.get("password")
            )

            if user != None:
                login(request, user)
                return redirect("home")
            else:
                props = {
                    "error": {"type": "error", "message": "Invalid login credentials"}
                }
                print(props)
                # return redirect("login", props)
                return render(request, "Auth/Login", props)
    else:
        props = {}
        return render(request, "Auth/Login", props)
    return render(request, "Auth/Login", props={})


def forgot_password(request):
    login_schema = serializers.LoginSchema()
    try:
        data = login_schema.loads(request.body)
    except ValidationError as err:
        pass
    except json.decoder.JSONDecodeError as err:
        return redirect("login")
        # share_flash(request, error="Exists errors on form", errors=err.messages)
    else:
        try:
            email = data.get("email")

            user = CustomUser.objects.get(email=email)
            email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            user_password = generate_otp()
            print(user_password)
            hash_password = make_password(user_password)
            company_name = Company.objects.filter(id=user.company).first()
            if user:
                if re.match(email_pattern, email):
                    user.password = hash_password
                    user.save()
                    try:
                        send_password_update_email(
                            data.get("email"),
                            user_password,
                            data.get("email"),
                            company_name.registration_name,
                        )
                        props = {
                            "success": {
                                "type": "success",
                                "message": "New User Password Sent, check your email!",
                            }
                        }
                    except SMTPRecipientsRefused as e:
                        props = {"error": {"type": "error", "message": "The email is not valid, sending new password failed."}}
                        
                        
                        pass
                else:
                    if user:
                        user_details = Individual.objects.filter(
                            national_id=email
                        ).first()
                        mobile = user_details.mobile
                        (
                            request_user_type,
                            request_user,
                            requested_user,
                        ) = (
                            "individual",
                            "",
                            "",
                        )
                        registration_message = f"Hi {user_details.firstname}!, Here is your CrediSafe account new password.\n: {user_password}\n please do not share this code with anyone."
                        user.password = hash_password
                        user.save()
                        password = ""
                        send_otp(
                            password,
                            mobile,
                            request.user.company,
                            requested_user,
                            request_user_type,
                            settings.FORGOT_PASSWORD,
                            registration_message,
                        )
                        props = {
                            "success": {
                                "type": "success",
                                "message": f"New User Password Sent to {mobile} , check your Messages!",
                            }
                        }
                return render(request, "Auth/Login", props)
        except CustomUser.DoesNotExist:
            props = {"error": {"type": "error", "message": "This user does not exist!"}}
            return render(request, "Auth/Login", props)
    props = {}
    return render(request, "Auth/Login", props)


@require_http_methods(["GET"])
# @clean_message
def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/")
