"""
This module defines the URL patterns for the RentSafe web application.

The urlpatterns list contains instances of the path() function that map URL patterns
to view functions.
The path() function takes a string representing the URL pattern, a view function, and
name for the URL pattern.

The admin module is imported to provide the admin site view function for the "/admin/" URL pattern.
The include() function is used to include the URL patterns defined in the rentsafe.urls
and authentication.urls modules.

The URL patterns defined in this module include:
- The admin site at the "/admin/" URL pattern
- The URL patterns defined in the rentsafe.urls module at the root URL pattern
- The URL patterns defined in the authentication.urls module at the root URL pattern
"""

from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounting/', include('accounting.urls')),
    path('', include('rentsafe.urls')),
    path('', include('authentication.urls')),
    path('', include('whatsappchatbot.urls')),
    path('webhook/', include('bot.urls'))

]
    