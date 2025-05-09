from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _



    
class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, individual, company, password, **extra_fields):
        values = [email, individual, company]
        field_value_map = dict(zip(self.model.REQUIRED_FIELDS, values))
        for field_name, value in field_value_map.items():
            if not value:
                raise ValueError('The {} value must be set'.format(field_name))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            individual=individual,
            company=company,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, individual, company, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, individual, company, password, **extra_fields)

    def create_superuser(self, email, individual, company, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, individual, company, password, **extra_fields)