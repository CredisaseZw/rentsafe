from django.db import models

# Create your models here.
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from datetime import timedelta
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.core.exceptions import ValidationError
from apps.clients.models.models import Client
from apps.common.models.base_models import BaseModel
from apps.accounting.models.models import Currency, PaymentMethod

class Services(BaseModel): 
    service_name = models.CharField(max_length=55, unique=True,
                                    help_text=_("The name of the service provided."))
    code = models.CharField(max_length=15, null=True, blank=True, unique=True,
                            help_text=_("Short code for the product)."))
    class Meta:
        app_label = 'subscriptions'
        db_table = "services"
        verbose_name = _('service')
        verbose_name_plural = _('services')

    def __str__(self) -> str:
        return self.service_name

class SubscriptionPeriod(BaseModel):
    name = models.CharField(max_length=255, unique=True,
                            help_text=_("Descriptive name of the subscription period (e.g., 'Monthly', 'Annual')."))
    code = models.CharField(max_length=255, null=True, blank=True, unique=True,
                            help_text=_("Short code for the period (e.g., 'M', 'A')."))
    
    period_length_days = models.IntegerField(
        null=True, blank=True,
        help_text=_("The duration of this subscription period in days (e.g., 30, 365).")
    )
    period_length_months = models.IntegerField(
        null=True, blank=True,
        help_text=_("The duration of this subscription period in months (e.g., 1, 3, 12).")
    )

    class Meta:
        app_label = 'subscriptions'
        db_table = "subscription_periods"
        verbose_name = _('subscription period')
        verbose_name_plural = _('subscription periods')

    def __str__(self) -> str:
        return self.name
    
    def duration(self):
        if self.period_length_months and not self.period_length_days:
            return self.period_length_months * 30 
        elif self.period_length_days and not self.period_length_months:
            return self.period_length_days / 30
        return 0

    def save(self,*args,**kwargs):
        self.duration()
        return super().save(*args,**kwargs)

class Subscription(BaseModel):
    SUB_CLASS_CHOICES = [
        ("COMBINED", "Combined"),
    ]
    subscription_id = models.CharField(max_length=20, unique=True, default=None)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='subscriptions')
    service = models.ForeignKey(Services, on_delete=models.PROTECT, related_name='subscriptions',
                                help_text=_("The service provided by this subscription (e.g., RentSafe)."))
    
    is_activated = models.BooleanField(default=True,
                                    help_text=_("Whether this subscription is currently active and usable."))
    start_date = models.DateTimeField(null=True, blank=True, default=timezone.now,
                                    help_text=_("The date and time when the subscription became active."))
    end_date = models.DateTimeField(null=True, blank=True,
                                    help_text=_("The date and time when the subscription is scheduled to end."))
    
    subscription_class = models.CharField(max_length=10, choices=SUB_CLASS_CHOICES, default='COMBINED',
                                        help_text=_("The classification of the subscriber (e.g., Individual, Company)."))
    
    period = models.ForeignKey(SubscriptionPeriod, on_delete=models.PROTECT, related_name='subscriptions',
                            help_text=_("The billing period for this subscription (e.g., Monthly, Annually)."))
    
    total_slots = models.IntegerField(default=1,
                                            help_text=_("The total number of lease slots this subscription provides for RentSafe service."))

    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='subscriptions_currency',
                                help_text=_("The currency in which this subscription is paid."))
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, related_name='subscriptions_payment_method',
                                        help_text=_("The primary method of payment for this subscription."))
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2,
                                    help_text=_("The total amount paid for the entire subscription period."))
    monthly_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,
                                        help_text=_("The equivalent monthly cost of the subscription, if applicable."))

    class Meta:
        app_label = 'subscriptions'
        db_table = "subscriptions"
        verbose_name = _('subscription')
        verbose_name_plural = _('subscriptions')
        ordering = ['-date_created']

    def __str__(self) -> str:
        subscriber_name = str(self.client) if self.client else "N/A Subscriber"
        return f"Subscription {self.pk} for {subscriber_name} ({self.service.service_name})"

    
    @property
    def used_slots(self):
        """Returns the number of slots currently in use by active leases under this subscription."""
        from apps.leases.models.models import Lease

        active_leases = Lease.objects.filter(managing_client=self.client, status='ACTIVE')
        return active_leases.count()
    
    @property
    def open_slots(self):
        """Returns the number of slots currently available for use under this subscription."""
        return self.total_slots - self.used_slots

    @property
    def get_service_name(self):
        return self.service.service_name if self.service else "N/A Service"
    @property
    def used_slots(self):
        """Returns the number of slots currently in use by active leases under this subscription."""
        from apps.leases.models.models import Lease

        active_leases = Lease.objects.filter(managing_client=self.client, status='ACTIVE')
        return active_leases.count()
    
    @property
    def open_slots(self):
        """Returns the number of slots currently available for use under this subscription."""
        return self.total_slots - self.used_slots

    @property
    def has_available_slots(self):
        """Checks if there are any available slots remaining on this subscription."""
        return self.used_slots < self.total_slots
    @property
    def status(self):
        return "active" if self.is_activated else "inactive"


    def calculate_end_date(self):
        """
        Calculates the end date based on start_date and subscription period.
        Call this method before saving a new subscription or when period/start_date changes.
        """
        if self.start_date and self.period and self.period.period_length_months:
            self.end_date = self.start_date + relativedelta(months=self.period.period_length_months)
        elif self.start_date and self.period and self.period.period_length_days:
            self.end_date = self.start_date + timedelta(days=self.period.period_length_days)

    def clean(self):
        if self.used_slots > self.total_slots:
            raise ValidationError(_("Subscription exhausted, please upgrade your plan."))
        
    def generate_subscription_id(self):
        return f"SUB-{int(timezone.now().timestamp())}-{self.client.id}"
    def save(self, *args, **kwargs):
        if not self.subscription_id:
            self.subscription_id = self.generate_subscription_id()

        if not self.end_date and self.start_date and self.period:
            self.calculate_end_date()
        self.full_clean()
        super().save(*args, **kwargs)
    

