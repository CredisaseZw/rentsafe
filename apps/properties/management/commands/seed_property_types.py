from django.core.management.base import BaseCommand
from apps.properties.models import PropertyType

class Command(BaseCommand):
    help = 'Seed property types'

    def handle(self, *args, **options):
        property_types = [
            {'name': 'Apartment', 'description': 'A self-contained housing unit.'},
            {'name': 'House', 'description': 'A standalone residential building.'},
            {'name': 'Condo', 'description': 'A unit in a condominium building.'},
            {'name': 'Townhouse', 'description': 'A terraced or row house.'},
            {'name': 'Studio', 'description': 'A small apartment with a combined living and sleeping area.'},
            {'name': 'Loft', 'description': 'A large, open space, often converted from industrial use.'},
            {'name': 'Duplex', 'description': 'A house divided into two apartments.'},
            {'name': 'Triplex', 'description': 'A building divided into three separate residences.'},
            {'name': 'Villa', 'description': 'A luxurious country residence.'},
            {'name': 'Cottage', 'description': 'A small house, typically in a rural area.'},
            {'name': 'Bungalow', 'description': 'A low house with a broad front porch.'},
            {'name': 'Penthouse', 'description': 'An apartment on the top floor of a building.'},
        ]

        for pt in property_types:
            obj, created = PropertyType.objects.get_or_create(
                name=pt['name'],
                defaults={'description': pt['description']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created property type: {pt['name']}"))
            else:
                self.stdout.write(f"Property type already exists: {pt['name']}")