from django.db import models
from django.db.models import Q
from decimal import Decimal
from django.utils.translation import gettext_lazy as _
from apps.common.models.base_models import BaseModel,BaseModelWithUser
from apps.accounting.models.models import Currency
    


class ServiceSpecialPricing(BaseModelWithUser):
    service = models.ForeignKey('subscriptions.services', on_delete=models.CASCADE, related_name='special_pricing_options',
                                help_text=_("The service this special pricing applies to."))
    
    client_customer = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='special_pricing',
                help_text=_("The specific client this special pricing is for."))

    individual_charge = models.DecimalField(_("Individual Charge"), max_digits=12, decimal_places=2,
                    help_text=_("Special charge amount for individuals."))
    company_charge = models.DecimalField(_("Company Charge"), max_digits=12, decimal_places=2,
                    help_text=_("Special charge amount for companies."))
    
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='special_pricing',
                help_text=_("The currency of the special charges."))
    
    class Meta(BaseModel.Meta):
        verbose_name = _("Service Special Pricing")
        verbose_name_plural = _("Services Special Pricing")
        unique_together = ('service', 'client_customer')

    def __str__(self):
        return f"Special Pricing for {self.service.service_name}"

class ServiceStandardPricing(BaseModelWithUser):
    service = models.ForeignKey('subscriptions.services', on_delete=models.CASCADE, related_name='standard_pricing_options',
                                help_text=_("The service this standard pricing applies to."))
    
    individual_charge = models.DecimalField(_("Individual Charge"), max_digits=12, decimal_places=2)
    company_charge = models.DecimalField(_("Company Charge"), max_digits=12, decimal_places=2)
    
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='standard_pricing',
                help_text=_("The currency of the standard charges."))
    
    current_rate = models.DecimalField(_("Current Rate"), max_digits=12, decimal_places=4, default=Decimal('0.00'),
                    help_text=_("The current conversion rate if this pricing involves currency conversion."))
    
    class Meta(BaseModel.Meta):
        verbose_name = _("Service Standard Pricing")
        verbose_name_plural = _("Services Standard Pricing")
        unique_together = ('service', 'currency')

    def __str__(self):
        return f"Standard Pricing for {self.service.service_name} ({self.currency.currency_code})"
