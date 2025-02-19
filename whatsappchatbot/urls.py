from django.urls import path
from . import views

urlpatterns = [
    # path('webhook', views.webhook, name='webhook'),  # Webhook endpoint
    path('', views.home, name='landing-page'),        # Home page
    # path('reset', views.reset, name='reset'),      # Route to reset message log
]
