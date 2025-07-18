from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company
User = get_user_model()

class UserCreationService:
    @classmethod
    @transaction.atomic
    def create_company_user(cls, creator, user_data, individual_data=None):
        """
        Creates a company user with proper validation and relationships
        """
        # Validate creator permissions
        if not creator.is_superuser and creator.user_type not in ['ADMIN', 'AGENT']:
            raise PermissionError("Only admins or agents can create users")

        company = user_data.get('company') if creator.is_superuser else creator.company

        if not company and not creator.is_superuser:
            raise ValidationError("Company is required for non-superuser creators")

        # Create the individual profile if needed
        profile = None
        profile_content_type = None
        if individual_data and not Individual.objects.filter(
            identification_number=individual_data.get('identification_number')
            ).exists():
            profile = Individual.objects.create(
                first_name=individual_data.get('first_name'),
                last_name=individual_data.get('last_name'),
                date_of_birth=individual_data.get('date_of_birth'),
                gender=individual_data.get('gender', 'other'),
                identification_type=individual_data.get('identification_type', 'national_id'),
                identification_number=individual_data.get('identification_number'),
                email=individual_data.get('email'),
                mobile_phone=individual_data.get('mobile_phone'),
                company=company
            )
            profile_content_type = ContentType.objects.get_for_model(profile)
        else:
            profile = Individual.objects.filter(
                identification_number=individual_data.get('identification_number')
            ).first() if individual_data else None

            profile_content_type = ContentType.objects.get_for_model(profile) if profile else None

        return User.objects.create_user(
            username=user_data.get('username'),
            email=user_data.get('email'),
            password=user_data.get('password'),
            user_type=user_data.get('user_type', 'COMPANY_USER'),
            company=company,
            profile_content_type=profile_content_type,
            profile_object_id=profile.id if profile else None,
            is_verified=user_data.get('is_verified', False),
        )