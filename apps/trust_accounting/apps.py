from django.apps import AppConfig


class TrustAccountingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.trust_accounting"
    verbose_name = "Trust Accounting"

    def ready(self):
        """Import signals when the app is ready"""
        import apps.trust_accounting.services.signals
