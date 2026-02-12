"""Seed the database with initial VAT rates"""

from django.core.management.base import BaseCommand
from apps.trust_accounting.models.models import TrustTaxType


class Command(BaseCommand):
    help = "Seed the database with initial VAT rates"

    def handle(self, *args, **kwargs):
        vat_rates = [
            {
                "name": "Zero Rate",
                "rate": 0.0,
                "description": "Zero percent VAT",
                "code": "ZR",
            },
            {
                "name": "Exemption Rate",
                "rate": None,
                "description": "Exempt from VAT",
                "code": "EX",
            },
        ]

        for vat_data in vat_rates:
            vat, created = TrustTaxType.objects.get_or_create(
                defaults={
                    "name": vat_data["name"],
                    "rate": vat_data["rate"],
                    "description": vat_data["description"],
                    "code": vat_data["code"],
                },
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
