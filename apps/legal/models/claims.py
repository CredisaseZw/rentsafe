from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from datetime import date
from apps.common.models.base_models import BaseModel, BaseModelWithUser
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company
from apps.accounting.models.models import Currency
from apps.clients.models.models import Client

class Claim(BaseModelWithUser):
    client= models.ForeignKey(Client, on_delete=models.CASCADE, related_name='claims',
                            help_text=_("The client associated with the claim."))

    debtor_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                        limit_choices_to=Q(app_label='individuals', model='individual') |
                        Q(app_label='companies', model='companybranch'),
                        related_name='claims_as_debtor',
                        help_text=_("The type of entity that is the debtor."))
    debtor_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the debtor entity.")
    )
    debtor_object = GenericForeignKey('debtor_content_type', 'debtor_object_id')

    data_source = models.CharField(_("Data Source"), max_length=255, blank=True, null=True,
                                help_text=_("Source of the claim data (e.g., 'Lease System', 'Manual Input')."))
    account_number = models.CharField(_("Account Number"), max_length=255, blank=True, null=True,
                                help_text=_("Account number related to the claim."))
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='claims',
                                help_text=_("The currency of the claim amount."))
    amount = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2)
    claim_date = models.DateField(_("Claim Date"), default=date.today)
    is_verified = models.BooleanField(_("Is Verified"), default=False,
                                help_text=_("Indicates if the claim has been verified."))
    is_closed = models.BooleanField(_("Is Closed"), default=False,
                                help_text=_("Indicates if the claim is closed."))
    closed_by = models.ForeignKey('users.CustomUser', on_delete=models.PROTECT,
                        related_name="claims_closed", blank=True, null=True)
    closed_date = models.DateField(_("Closed Date"), blank=True, null=True)
    verified_date = models.DateField(_("Verified Date"), blank=True, null=True)
    verified_by = models.ForeignKey('users.CustomUser', on_delete=models.PROTECT,
                        related_name="claims_verified", blank=True, null=True)
    
    class Meta(BaseModel.Meta):
        app_label = 'legal'
        db_table = "claim"
        verbose_name = _("Claim")
        verbose_name_plural = _("Claims")
        ordering = ['-claim_date']
        unique_together = ('client', 'debtor_content_type', 'debtor_object_id', 'account_number', 'amount', 'claim_date')
        
    def __str__(self):
        return str(self.id)