"""
Define a decorator that checks if the user is an admin user.
"""
from django.contrib.auth.decorators import user_passes_test

def admin_required(function=None, redirect_field_name=None, login_url=None):
    """
    Decorator for views that checks if the user is logged in and is an admin user,
    redirecting to the login page if necessary.

    :param function: The view function to be decorated.
    :param redirect_field_name: The name of the redirect field in the request.
    :param login_url: The URL to redirect to if the user is not logged in.
    :return: The decorated view function.
    """
    # Create the actual decorator using the `user_passes_test` decorator from Django.
    actual_decorator = user_passes_test(
        lambda u: u.is_active and (u.is_staff or u.is_superuser),
        login_url=login_url,
        redirect_field_name=redirect_field_name
    )

    # If a view function is provided, apply the decorator to it and return the decorated function.
    if function:
        return actual_decorator(function)

    # If no view function is provided, return the decorator itself.
    return actual_decorator
