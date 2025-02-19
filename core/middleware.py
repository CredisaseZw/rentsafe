"""
This module contains a middleware function for the 'rentsafe' app in Django.

It includes the `AuthPropsMiddleware` function which adds authentication properties to
the request if the user is authenticated.

Functions:
    AuthPropsMiddleware: This function adds authentication properties to the request.
"""

from inertia.share import share
from rentsafe.models import Individual, Company
from django.contrib.messages import get_messages
from django.contrib import messages

def AuthPropsMiddleware(get_response):

    """
    Middleware function to add authentication properties to the request.
    This function checks if the user is authenticated. If the user is authenticated, it
    adds the user's properties to the request. If the user is not authenticated, it adds
    empty properties to the request.
    Args:
        get_response (function): A function that takes a request and returns a response.

    Returns:
        function: A function that takes a request, modifies it and returns a response.
    """
    def middleware(request):

        msg = list(get_messages(request))
        if msg:
            flash = {"type": "success", "message": msg[0].message}
        else:
            flash = {"type": None, "message": None}

        try:
            if request.user.is_authenticated:
                # individual_object = Individual.objects.filter(
                #     id=request.user.id
                # ).first()
                company = Company.objects.filter(id=request.user.company).first()
                is_internal = 0  # False
                company_id = company.registration_name
                if not company is None:
                    if company.registration_name.lower() == "fincheck":
                        is_internal = 1  # True
                        individual_object = Individual.objects.filter(id = request.user.individual).first()
                        company_id = individual_object.firstname + " " + individual_object.surname
                if company:
                    share(
                        request,
                        Auth={
                            "user": {
                                "email": request.user.email,
                                "is_active": request.user.is_active,
                                "is_staff": request.user.is_staff,
                                "is_superuser": request.user.is_superuser,
                                "user_type": request.user.user_type,
                                "permissions": list(
                                    request.user.get_group_permissions()
                                ),
                            },
                            "user_profile": {
                                "individual_id": request.user.individual,
                                "first_name": company_id,
                                "last_name": "",
                            },
                            "company": {
                                "company_id": request.user.company,
                                "company_name": company_id,
                            },
                            "is_internal": is_internal,
                        },
                        messages=[{'message': m.message, 'tags': m.tags} for m in messages.get_messages(request)],

                        flash = flash
                    )
                elif not company is None:
                    share(
                        request,
                        Auth={
                            "user": {
                                "email": request.user.email,
                                "is_active": request.user.is_active,
                                "is_staff": "",
                                "is_superuser": request.user.is_superuser,
                                "user_type": request.user.user_type,
                                "permissions": list(
                                    request.user.get_group_permissions()
                                ),
                            },
                            "user_profile": {
                                "individual_id": "",
                                "first_name": "",
                                "last_name": "",
                            },
                            "company": {
                                "company_id": request.user.company,
                                "company_name": company_id,
                            },
                            "is_internal": is_internal,
                        },
                        messages=[{'message': m.message, 'tags': m.tags} for m in messages.get_messages(request)],

                        flash = flash
                    )
                else:
                    pass
            else:
                share(
                    request,
                    Auth={
                        "user": {
                            "email": "",
                            "is_active": "",
                            "is_staff": "",
                            "is_superuser": "",
                            "user_type": "",
                            "permissions": "",
                        },
                        "user_profile": {
                            "individual_id": "",
                            "first_name": "",
                            "last_name": "",
                        },
                        "company": {
                            "company_id": "",
                        },
                    },
                    flash = flash
                )
        except Exception as e:
            pass

        return get_response(request)

    return middleware