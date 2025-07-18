from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from datetime import date
from apps.common.models.base_models import BaseModel
from apps.individuals.models.models import Individual
from apps.companies.models.models import Company
from apps.accounting.models.models import Currency

class Claim(BaseModel):
    creditor_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                    limit_choices_to=Q(app_label='individuals', model='individual') |
                    Q(app_label='companies', model='companybranch'),
                    related_name='claims_as_creditor',
                    help_text=_("The type of entity that is the creditor."))
    creditor_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the creditor entity.")
    )
    creditor_object = GenericForeignKey('creditor_content_type', 'creditor_object_id')

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
    
    class Meta(BaseModel.Meta):
        app_label = 'legal'
        db_table = "claim"
        verbose_name = _("Claim")
        verbose_name_plural = _("Claims")
        ordering = ['-claim_date']
    def __str__(self):
        return str(self.id)