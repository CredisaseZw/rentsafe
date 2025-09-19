from django.core.management.base import BaseCommand
from apps.properties.models import PropertyType

class Command(BaseCommand):
    help = 'Seed property types'

    def handle(self, *args, **options):
        property_types = [
            # Residential
            {"name": "Residential - House", "description": "Standalone residential house."},
            {"name": "Residential - Cottage", "description": "Small residential cottage."},
            {"name": "Residential - Townhouse", "description": "Multi-level residential townhouse."},
            {"name": "Residential - Flats", "description": "Apartment units in a residential building."},
            {"name": "Residential - Small Holdings", "description": "Residential property with small-scale agricultural land."},

            # Commercial
            {"name": "Commercial - Offices", "description": "Commercial office space."},
            {"name": "Commercial - Retail", "description": "Retail commercial property."},
            {"name": "Commercial - Industrial", "description": "Industrial warehouses or factories."},
            {"name": "Commercial - Hospitality", "description": "Hotels, B&Bs, or other hospitality properties."},

            # Agricultural
            {"name": "Agricultural - Plot", "description": "Agricultural plot of land."},
            {"name": "Agricultural - Small Farm", "description": "Small-scale farming property."},
            {"name": "Agricultural - Commercial Farm", "description": "Large-scale commercial farm."},

            # Land
            {"name": "Land - Undeveloped", "description": "Raw or vacant land with no developments."},
        ]
        PropertyType.objects.all().delete()
        for pt in property_types:
            obj, created = PropertyType.objects.get_or_create(
                name=pt['name'],
                defaults={'description': pt['description']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created property type: {pt['name']}"))
            else:
                self.stdout.write(f"Property type already exists: {pt['name']}")
