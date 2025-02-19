from django.urls import path
from .views import WhatsAppWebhook

urlpatterns = [
    path(
        "credisafe/d5135604-08b7-42de-bfd2-f1d9595f4002/",
        WhatsAppWebhook.as_view(),
        name="webhook",
    ),
]