from django.core.management.base import BaseCommand
from apps.accounting.models.models import Currency 

class Command(BaseCommand):
    """Command to seed default payment methods for RentSafe application."""
    help = "Seed default payment methods for RentSafe application."
    def handle(self, *args, **kwargs):
        # Define the default currencies
        currencies = {
            "USD": "United States Dollar",
            "ZWL": "Zimbabwean Dollar",
            "EUR": "Euro",
            "GBP": "British Pound",
            "JPY": "Japanese Yen",
            "CNY": "Chinese Yuan"
        }
        # Create or update each currency
        for code, name in currencies.items():
            Currency.objects.get_or_create(currency_code=code, currency_name=name)

        self.stdout.write(self.style.SUCCESS("Default currencies seeded successfully."))