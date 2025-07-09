from django.db import models
from django.utils.translation import gettext_lazy as _
from common.models.base_models import BaseModel
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q




class ActiveCredit(BaseModel): 
    date_time = models.DateTimeField(_("Transaction Date/Time"), auto_now=True,
                help_text=_("Date and time of the transaction/entry."))
    dr_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='debit_entries',
                                limit_choices_to=Q(app_label='individuals', model='individual') | Q(app_label='companies', model='companybranch'))
    dr_object_id = models.PositiveIntegerField(null=True, blank=True)
    debited_party = GenericForeignKey('dr_content_type', 'dr_object_id')

    cr_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True,
                                        related_name='credit_entries',
                                        limit_choices_to=Q(app_label='individuals', model='individual') | Q(app_label='companies', model='companybranch'))
    cr_object_id = models.PositiveIntegerField(null=True, blank=True)
    credited_party = GenericForeignKey('cr_content_type', 'cr_object_id')
    due_date = models.DateField(_("Due Date"), null=True, blank=True)
    start_date = models.DateField(_("Start Date"), null=True, blank=True)
    end_date = models.DateField(_("End Date"), null=True, blank=True)
    details = models.TextField(_("Details"), null=True, blank=True)
    amount = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2)
    balance = models.DecimalField(_("Balance"), max_digits=12, decimal_places=2, null=True, blank=True,
                help_text=_("Remaining balance after this transaction (if applicable)."))
    
    STATUS_CHOICES = (
        ('PAID', _('Paid')),
        ('OUTSTANDING', _('Outstanding')),
        ('OVERDUE', _('Overdue')),
        ('PARTIALLY_PAID', _('Partially Paid')),
        ('CANCELLED', _('Cancelled')),
    )
    status = models.CharField(_("Status"), max_length=20, choices=STATUS_CHOICES, default="OUTSTANDING")
    
    payment_date = models.DateField(_("Payment Date"), null=True, blank=True)
    
    TYPE_CHOICES = (
        ('RENTAL', _('Rental Payment')),
        ('LOAN', _('Loan')),
        ('DEPOSIT', _('Deposit')),
        ('CHARGE', _('Charge/Fee')),
        ('DISBURSEMENT', _('Disbursement')),
        ('OTHER', _('Other')),
    )
    type = models.CharField(_("Transaction Type"), max_length=20, choices=TYPE_CHOICES)

    class Meta(BaseModel.Meta):
        db_table = "active_credit" 
        verbose_name = _("Financial Entry")
        verbose_name_plural = _("Financial Entries")
        ordering = ['-date_time']
