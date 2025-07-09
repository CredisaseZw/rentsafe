from django.db import models

# Create your models here.
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from common.models.base_models import BaseModel
from individuals.models.models import Individual
from companies.models.models import Company
from uuid import uuid4

class Client(BaseModel):
    """
    Represents a client, which can be either an Individual or a Company.
    """
    USER_TYPE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('AGENT', 'Agent'),
        ('CLIENT', 'Client'),
        ('LANDLORD', 'Landlord'),
        ('INDIVIDUAL_USER', 'Individual Profile User'),
        ('COMPANY_USER', 'Company Profile User'), 
    )
    client_content_type = models.ForeignKey(
            ContentType,
            on_delete=models.RESTRICT,
            limit_choices_to=Q(app_label='individuals', model='individual') |
            Q(app_label='companies', model='companybranch'),
            related_name='client_profiles',
            help_text=_("The type of the associated client entity (Individual or Company).")
    )
    client_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='CLIENT',
            help_text=_("The role or type of the user in the system."))
    client_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the associated client entity.")
    )
    client_object = GenericForeignKey('client_content_type', 'client_object_id')
    name = models.CharField(max_length=255, unique=True, blank=True, null=True,
                            help_text=_("A unique display name for this client. Auto-generated if empty."))

    client_status_choices = (
        ('ACTIVE', _('Active')),
        ('INACTIVE', _('Inactive')),
        ('PENDING', _('Pending Approval')),
        ('SUSPENDED', _('Suspended')),
        ('CLOSED', _('Closed')),
    )
    status = models.CharField(max_length=20, choices=client_status_choices, default='ACTIVE',
                    help_text=_("The current status of the client in the system."))

    external_client_id = models.UUIDField(blank=True, null=True, unique=True, default=uuid4,
                            help_text=_("An optional external ID for this client (e.g., from a CRM)."))
    class Meta:
        verbose_name = _("Client")
        verbose_name_plural = _("Clients")
        ordering = ['name']
        unique_together = [['client_content_type', 'client_object_id']]

    def __str__(self):
        return self.name or f"Client {self.pk}"

    def save(self, *args, **kwargs):
        if not self.name and self.client_object:
            if isinstance(self.client_object, Individual):
                self.name = f"{self.client_object.full_name}"
            elif isinstance(self.client_object, Company):
                self.name = f"{self.client_object.registration_name}"
            else:
                self.name = f"Client {self.client_content_type.model}-{self.client_object_id}"

        original_name = self.name
        counter = 1
        while self.name and Client.objects.filter(name=self.name).exclude(pk=self.pk).exists():
            self.name = f"{original_name} {counter}"
            counter += 1
        super().save(*args, **kwargs)

    @property
    def get_linked_entity(self):
        """Returns the linked Individual or Company object."""
        return self.client_object

    @property
    def is_individual_client(self):
        """Returns True if the client is an Individual."""
        return isinstance(self.client_object, Individual)

    @property
    def is_company_client(self):
        """Returns True if the client is a Company."""
        return isinstance(self.client_object, Company)
    