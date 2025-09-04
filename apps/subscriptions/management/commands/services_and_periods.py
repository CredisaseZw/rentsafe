from django.core.management.base import BaseCommand
from apps.subscriptions.models import SubscriptionPeriod, Services


class Command(BaseCommand):
    help = "Seeds the database with subscription periods and services"

    def handle(self, *args, **options):
        data_map = {
            SubscriptionPeriod: [
                {
                    "lookup": {"code": "monthly"},
                    "defaults": {"name": "Monthly", "period_length_days": 30, "period_length_months": 1},
                },
                {
                    "lookup": {"code": "quarterly"},
                    "defaults": {"name": "Quarterly", "period_length_days": 90, "period_length_months": 3},
                },
                {
                    "lookup": {"code": "half_yearly"},
                    "defaults": {"name": "Half a year", "period_length_days": 180, "period_length_months": 6},
                },
                {
                    "lookup": {"code": "yearly"},
                    "defaults": {"name": "Yearly", "period_length_days": 365, "period_length_months": 12},
                },
            ],
            Services: [
                {"lookup": {"code": "rentsafe"}, "defaults": {"service_name": "RENTSAFE"}},
                {"lookup": {"code": "biu"}, "defaults": {"service_name": "BIU"}},
                {"lookup": {"code": "countsafe"}, "defaults": {"service_name": "COUNTSAFE"}},
            ],
        }

        for model, records in data_map.items():
            for record in records:
                obj, created = model.objects.update_or_create(
                    **record["lookup"], defaults=record["defaults"]
                )
                name = getattr(obj, "name", getattr(obj, "service_name", str(obj)))
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created: {name} ({model.__name__})"))
                else:
                    self.stdout.write(self.style.WARNING(f"Updated: {name} ({model.__name__})"))

        self.stdout.write(self.style.SUCCESS(" Database seeding complete."))
