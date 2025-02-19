from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _

from .manager import CustomUserManager

def generate_id(length,letters,id):
    zeros = (length - len(letters)) * "0"
    return '{letters}{zeros}{id}'.format(letters=letters,zeros=zeros, id=str(id))


class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        (1, "client"),
        (2, "company"),
        (3, "agent"),
        (4, "individual"),
    )
    email = models.CharField(max_length=50, unique=True)
    user_id = models.CharField(_('username'),max_length=50,default="00",unique=True,null=True)
    individual = models.CharField(
        _("individual_id"), max_length=255,default=0
    )  # from individual model
    company = models.CharField(_("company_id"), max_length=255)  # from company model
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, default=1)
    date_joined = models.DateTimeField(_("date joined"), auto_now_add=True)
    is_active = models.BooleanField(_("is_active"), default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(_("staff"), default=False)
    last_login = models.DateTimeField(null=True)
    can_send_email = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "user_id"
    REQUIRED_FIELDS = ["individual", "company"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        db_table = "users"

    def save(self, *args, **kwargs):
        super(CustomUser, self).save(*args, **kwargs)
        if self.user_id == "00" : 
            CustomUser.objects.filter(id=self.id).update(
                user_id=generate_id(5, 'A', self.id))


    def __str__(self):
        return str(self.user_id)