from django.core.management.base import BaseCommand
from apps.accounting.models.models import VATSetting


class Command(BaseCommand):
    help = "Seed the database with initial VAT rates"

    def handle(self, *args, **kwargs):
        vat_rates = [
            {"name": "Exemption Rate", "rate": None},
            {"name": "Zero Rate", "rate": 0.0},
        ]

        for vat_data in vat_rates:
            vat, created = VATSetting.objects.get_or_create(
                description=vat_data["name"], defaults={"rate": vat_data["rate"]}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created VAT: {vat.description} with rate {'Exempt' if vat.rate is None else f'{vat.rate}%'}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"VAT: {vat.description} already exists")
                )
