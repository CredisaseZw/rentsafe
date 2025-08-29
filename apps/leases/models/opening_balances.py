# leases/models/opening_balances.py

from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models.base_models import BaseModelWithUser
from apps.leases.models import Lease, Landlord 

class LeaseOpeningBalance(BaseModelWithUser):
    """
    Tracks the aged outstanding balance for a specific lease.
    Using DecimalField for accurate financial calculations.
    """
    lease = models.OneToOneField(
        Lease,
        on_delete=models.CASCADE,
        related_name='opening_balance',
        verbose_name=_('Lease')
    )
    current_month_balance = models.DecimalField(
        _('Current Month Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Outstanding balance for the current month.")
    )
    one_month_back_balance = models.DecimalField(
        _('1-Month Back Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Outstanding balance from one month ago.")
    )
    two_months_back_balance = models.DecimalField(
        _('2-Months Back Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Outstanding balance from two months ago.")
    )
    three_months_back_balance = models.DecimalField(
        _('3-Months Back Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Outstanding balance from three months ago.")
    )
    three_months_plus_balance = models.DecimalField(
        _('3-Months+ Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Outstanding balance older than three months.")
    )
    outstanding_balance = models.DecimalField(
        _('Total Outstanding Balance'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("Total outstanding balance (sum of all aged balances).")
    )
    class Meta:
        app_label = 'leases'
        db_table = 'lease_opening_balance'
        verbose_name = _('Lease Opening Balance')
        verbose_name_plural = _('Lease Opening Balances')
        # Ensures each lease has only one opening balance record
        unique_together = ('lease',)

    def __str__(self):
        return f"Opening Balance for Lease {self.lease.lease_id}"


class LandlordOpeningBalance(BaseModelWithUser):
    """
    Tracks the opening balance owed by or to a landlord from a specific debtor.
    The debtor can be either an individual or a company.
    """
    landlord = models.ForeignKey(
        Landlord,
        on_delete=models.CASCADE,
        related_name='opening_balances',
        verbose_name=_('Landlord')
    )
    debtor = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='landlord_opening_balances',
        verbose_name=_('Debtor')
    )
    lease_id = models.CharField(
        _('Lease ID'),
        max_length=255,
        blank=True,
        null=True,
        help_text=_("The ID of the lease associated with this opening balance.")
    )
    amount = models.DecimalField(
        _('Amount'),
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text=_("The amount of the opening balance owed.")
    )
    commission_percentage = models.DecimalField(
        _('Commission Percentage'),
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text=_("The commission rate applied to the balance.")
    )
    operating_costs_inclusive = models.BooleanField(
        _('Operating Costs Inclusive'),
        default=False,
        help_text=_("Indicates if operating costs are included in the amount.")
    )
    class Meta:
        app_label = 'leases'
        db_table = 'landlord_opening_balance'
        verbose_name = _('Landlord Opening Balance')
        verbose_name_plural = _('Landlord Opening Balances')
        # Ensures a landlord has only one opening balance per unique debtor

    def __str__(self):
        return f"Landlord {self.landlord.landlord_name} Balance with {self.debtor}"

