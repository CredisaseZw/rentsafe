"""
This module contains the application configuration for the 'rentsafe' app in Django.

It includes the `RentsafeConfig` class which inherits from Django's `AppConfig` class.
This class is used to set some default configurations for the 'rentsafe' app.

Classes:
    RentsafeConfig: This class represents the 'rentsafe' application and contains its
    configurations.

Attributes:
    default_auto_field (str): The default auto field type for the 'rentsafe' app. Set to
    'django.db.models.BigAutoField'.
    name (str): The name of the application. Set to 'rentsafe'.
"""
from django.apps import AppConfig


class RentsafeConfig(AppConfig):
    """
    Django application configuration class for the 'rentsafe' app.

    Configures the 'rentsafe' app in Django by setting the default auto field to
    'django.db.models.BigAutoField'.

    Attributes:
        default_auto_field (str): The default auto field type for the 'rentsafe' app. Set to
        'django.db.models.BigAutoField'.
        name (str): The name of the application. Set to 'rentsafe'.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "rentsafe"
    