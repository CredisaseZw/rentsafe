from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from decimal import Decimal
from django.utils.translation import gettext_lazy as _
from apps.common.models.base_models import BaseModel
from apps.accounting.models.models import Currency
    


class SpecialPricing(BaseModel):
    service = models.ForeignKey('subscriptions.Service', on_delete=models.CASCADE, related_name='special_pricing_options',
                                help_text=_("The service this special pricing applies to."))
    
    client_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                    limit_choices_to=Q(app_label='individuals', model='individual') |
                    Q(app_label='companies', model='companybranch'),
                    related_name='special_pricing_as_client',
                    help_text=_("The type of entity this special pricing is for."))
    client_object_id = models.PositiveIntegerField(
        help_text=_("The ID of the client entity (Individual or Company).")
    )
    client_customer = GenericForeignKey('client_content_type', 'client_object_id')

    individual_charge = models.DecimalField(_("Individual Charge"), max_digits=12, decimal_places=2,
                    help_text=_("Special charge amount for individuals."))
    company_charge = models.DecimalField(_("Company Charge"), max_digits=12, decimal_places=2,
                    help_text=_("Special charge amount for companies."))
    
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='special_pricing',
                help_text=_("The currency of the special charges."))
    
    class Meta(BaseModel.Meta):
        verbose_name = _("Special Pricing")
        verbose_name_plural = _("Special Pricing")
        unique_together = ('service', 'client_content_type', 'client_object_id')

    def __str__(self):
        return f"Special Pricing for {self.service.service_name}"

class StandardPricing(BaseModel):
    service = models.ForeignKey('subscriptions.Service', on_delete=models.CASCADE, related_name='standard_pricing_options',
                                help_text=_("The service this standard pricing applies to."))
    
    individual_charge = models.DecimalField(_("Individual Charge"), max_digits=12, decimal_places=2)
    company_charge = models.DecimalField(_("Company Charge"), max_digits=12, decimal_places=2)
    
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='standard_pricing',
                help_text=_("The currency of the standard charges."))
    
    current_rate = models.DecimalField(_("Current Rate"), max_digits=12, decimal_places=4, default=Decimal('0.00'),
                    help_text=_("The current conversion rate if this pricing involves currency conversion."))
    
    class Meta(BaseModel.Meta):
        verbose_name = _("Standard Pricing")
        verbose_name_plural = _("Standard Pricing")
        unique_together = ('service', 'currency')

    def __str__(self):
        return f"Standard Pricing for {self.service.service_name} ({self.currency.code})"
