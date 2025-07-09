import contextlib
from django.db import models
from django.utils.translation import gettext_lazy as _
from common.models.models import Document, Note
from properties.models.models import Unit
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, F
from subscriptions.models.models import Subscription
from django.db import transaction
from django.utils import timezone
from datetime import date
from decimal import Decimal
from common.models.base_models import BaseModel
from django.conf import settings

class Lease(BaseModel):
    LEASE_STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_APPROVAL', 'Pending Approval'),
        ('ACTIVE', 'Active'),
        ('TERMINATED', 'Terminated'),
        ('EXPIRED', 'Expired'),
        ('RENEWED', 'Renewed'),
        ('SUSPENDED', 'Suspended'), 
    )

    PAYMENT_FREQUENCY_CHOICES = (
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('ANNUALLY', 'Annually'),
    )

    LEASE_RISK_CHOICES = {
        0: 'LOW',
        1: 'MEDIUM',
        2: 'HIGH',
        3: 'HIGH HIGH',
        4: 'NON_PAYER',
    }

    lease_id = models.CharField(max_length=50, unique=True,
                                help_text="Unique identifier for the lease (e.g., LSE-001).")
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='leases',
                            help_text="The property unit being leased.")

    # Dates
    start_date = models.DateField(null=True, blank=True,
                                help_text="The date when the lease officially starts.")
    end_date = models.DateField(null=True, blank=True,
                                help_text="The date when the lease is scheduled to end. Can be null for open-ended leases.")
    signed_date = models.DateField(blank=True, null=True,
                                help_text="The actual date the lease agreement was signed.")
    status = models.CharField(max_length=20, choices=LEASE_STATUS_CHOICES, default='DRAFT',
                            help_text="Current operational status of the lease.")

    landlord = models.ForeignKey('leases.Landlord', on_delete=models.PROTECT, related_name='managed_leases',
                                help_text="The landlord responsible for this lease.")

    deposit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'),
                                help_text="The total security/rental deposit amount for the lease.")
    deposit_period = models.IntegerField(default=0,
                                help_text="e.g., number of months rent equivalent for the deposit.")
    currency = models.ForeignKey('accounting.Currency', on_delete=models.PROTECT,
                                help_text="The primary currency in which the lease payments and charges are accounted for.",
                                related_name='leases_as_primary_currency')

    payment_frequency = models.CharField(max_length=20, choices=PAYMENT_FREQUENCY_CHOICES, default='MONTHLY',
                                help_text="The default payment frequency for recurring charges.")
    due_day_of_month = models.SmallIntegerField(default=25,
                                help_text="The day of the month when recurring charges are typically due (1-31).")
    grace_period_days = models.SmallIntegerField(default=7,
                                help_text="Number of days after the due date before a payment is considered late.")

    includes_utilities = models.BooleanField(default=False,
                                help_text="Indicates if basic utilities are included in the overall rent.")
    utilities_details = models.TextField(blank=True, null=True,
                                help_text="Detailed description of utilities included or managed separately.")

    guarantor = models.ForeignKey('leases.Guarantor', on_delete=models.SET_NULL, null=True, blank=True,
                                help_text="The guarantor responsible for financial obligations under this lease.")
    account_number = models.CharField(max_length=50, blank=True, null=True,
                                help_text="Optional bank account number or reference for tenant payments.")

    documents = GenericRelation(Document)
    notes = GenericRelation(Note)

    class Meta:
        app_label = 'leases'
        verbose_name = _('lease')
        verbose_name_plural = _('leases')
        ordering = ['-start_date', 'lease_id']

    def __str__(self):
        tenant_names = [lt.tenant_object.__str__() for lt in self.lease_tenants.all()]
        tenant_str = ", ".join(tenant_names) if tenant_names else "No Tenant"
        return f"Lease {self.lease_id} for {self.unit} ({tenant_str})"

    def get_primary_tenant(self):
        return self.lease_tenants.filter(is_primary_tenant=True).first()

    def get_tenant_names(self):
        return [lt.tenant_object.__str__() for lt in self.lease_tenants.all()]

    def save(self, *args, **kwargs):
        is_new = not self.pk
        original_status = None
        original_landlord = None
        original_deposit_amount = None

        request = kwargs.pop('request', None)
        user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

        if not is_new:
            try:
                original_lease = Lease.objects.get(pk=self.pk)
                original_status = original_lease.status
                original_landlord = original_lease.landlord
                original_deposit_amount = original_lease.deposit_amount
            except Lease.DoesNotExist:
                pass 

        if not self.pk and not self.lease_id:
            self.lease_id = self._generate_unique_lease_id()

        status_changed_to_active = (self.status == 'ACTIVE' and original_status != 'ACTIVE')
        status_changed_from_active = (original_status == 'ACTIVE' and self.status not in ['ACTIVE', 'SUSPENDED'])

        current_lease_details = {
            'lease_id_at_log_time': self.lease_id,
            'unit_id_at_log_time': self.unit.id if self.unit else None,
            'tenant_names_at_log_time': self.get_tenant_names(),
            'start_date_at_log_time': self.start_date.isoformat() if self.start_date else None,
            'unit_name_at_log_time': str(self.unit) if self.unit else None,
            'landlord_id_at_log_time': self.landlord.id if self.landlord else None,
            'landlord_name_at_log_time': str(self.landlord) if self.landlord else None,
        }

        super().save(*args, **kwargs)

        if is_new:
            log_details = current_lease_details.copy()
            log_details.update({'initial_status': self.status})
            LeaseLog.objects.create(
                lease=self,
                log_type='LEASE_CREATED',
                user=user,
                details=log_details
            )
        else:
            log_details = current_lease_details.copy()

            if self.status != original_status:
                log_details |= {
                    'old_status': original_status,
                    'new_status': self.status,
                }
                LeaseLog.objects.create(
                    lease=self,
                    log_type='LEASE_STATUS_CHANGED',
                    user=user,
                    details=log_details
                )
                log_details = current_lease_details.copy()

            # Check for landlord changes
            if self.landlord != original_landlord:
                log_details.update({
                    'field': 'landlord',
                    'old_landlord_id': original_landlord.id if original_landlord else None,
                    'old_landlord_name': str(original_landlord) if original_landlord else None,
                    'new_landlord_id': self.landlord.id if self.landlord else None,
                    'new_landlord_name': str(self.landlord) if self.landlord else None,
                })
                LeaseLog.objects.create(
                    lease=self,
                    log_type='LEASE_UPDATED',
                    user=user,
                    details=log_details
                )
                log_details = current_lease_details.copy()

            if self.deposit_amount != original_deposit_amount:
                log_details.update({
                    'old_deposit_amount': str(original_deposit_amount),
                    'new_deposit_amount': str(self.deposit_amount)
                })
                LeaseLog.objects.create(
                    lease=self,
                    log_type='DEPOSIT_UPDATED',
                    user=user,
                    details=log_details
                )
                log_details = current_lease_details.copy()
        if status_changed_to_active:
            with transaction.atomic():
                if not self._try_decrement_subscription_slot(request=request): 
                    LeaseLog.objects.create(
                        lease=self,
                        log_type='OTHER',
                        user=user,
                        details={
                            'event': 'Subscription Slot Decrement Failed',
                            'lease_status_attempted': 'ACTIVE',
                            **current_lease_details
                        }
                    )
                    print("WARNING: Lease activated but subscription slot decrement failed.")

        elif status_changed_from_active:
            with transaction.atomic():
                self._try_increment_subscription_slot(request=request) 
                LeaseLog.objects.create(
                    lease=self,
                    log_type='OTHER',
                    user=user,
                    details={
                        'event': 'Subscription Slot Incremented',
                        'lease_status_changed_from': original_status,
                        **current_lease_details
                    }
                )
        if not self.pk and not self.lease_id:
            self.lease_id = self._generate_unique_lease_id()

        original_status = None
        if self.pk:
            try:
                original_status = Lease.objects.get(pk=self.pk).status
            except Lease.DoesNotExist:
                pass

        if self.status == 'ACTIVE' and original_status != 'ACTIVE':
            with transaction.atomic():
                if not self._try_decrement_subscription_slot(request=kwargs.get('request')):
                    raise ValueError(_("Cannot activate lease: No active subscription with available slots found for the landlord's associated entity."))
        elif original_status == 'ACTIVE' and self.status not in ['ACTIVE', 'SUSPENDED']:
            with transaction.atomic():
                self._try_increment_subscription_slot(request=kwargs.get('request'))

        # super().save(*args, **kwargs)
        if not self._try_decrement_subscription_slot(request=kwargs.get('request')):
            raise ValueError(_("Cannot activate lease: No active subscription with available slots found for the landlord's associated entity."))
        elif original_status == 'ACTIVE' and self.status not in ['ACTIVE', 'SUSPENDED']:
            with transaction.atomic():
                self._try_increment_subscription_slot(request=kwargs.get('request'))

        super().save(*args, **kwargs)

    def _generate_unique_lease_id(self):
        today = date.today()
        prefix = f"LSE-{today.year % 100:02d}{today.month:02d}"

        last_lease = Lease.objects.filter(lease_id__startswith=prefix).order_by('-lease_id').first()
        if last_lease:
            try:
                last_number_str = last_lease.lease_id.split('-')[-1]
                last_number = int(last_number_str)
                new_number = last_number + 1
            except (ValueError, IndexError):
                new_number = 1
        else:
            new_number = 1

        return f"{prefix}-{new_number:04d}"

    def _get_outstanding_invoice_months(self):
        """
        Calculates the number of distinct months with overdue invoices for this lease.
        An invoice is considered overdue if its `due_date` is in the past AND its `status` is not 'paid'.
        """
        today = timezone.now().date()
        overdue_invoices = self.invoices.filter(
            due_date__lt=today,
            status__in=['pending', 'partially_paid', 'draft']
        ).order_by('due_date')
        outstanding_periods = {
            (invoice.due_date.year, invoice.due_date.month)
            for invoice in overdue_invoices
        }
        return len(outstanding_periods)

    @property
    def risk_level(self):
        """
        Calculates the risk level based on the number of outstanding invoice months.
        """
        outstanding_months = self._get_outstanding_invoice_months()

        if outstanding_months == 0:
            return 'LOW'
        elif outstanding_months == 1:
            return 'MEDIUM'
        elif outstanding_months == 2:
            return 'HIGH'
        elif outstanding_months == 3:
            return 'HIGH HIGH'
        elif outstanding_months >= 4:
            return 'NON_PAYER'
        return 'LOW'


    def _get_landlord_subscriber_entity(self):
        """
        Helper to get the actual Individual or Company linked to the landlord.
        """
        if self.landlord and hasattr(self.landlord, 'owner_object'):
            return self.landlord.owner_object
        return None

    def _try_decrement_subscription_slot(self, request=None):
        """
        Attempts to decrement a subscription slot for the landlord's associated company/individual.
        Returns True if successful, False otherwise.
        """
        subscriber_entity = self._get_landlord_subscriber_entity()
        if not subscriber_entity:
            print(f"DEBUG: Lease {self.lease_id}: No subscriber entity found for landlord.")
            return False

        try:
            active_subscription = Subscription.objects.select_for_update().filter( 
                content_type=ContentType.objects.get_for_model(subscriber_entity.__class__),
                object_id=subscriber_entity.pk,
                service__service_name="RENTSAFE",
                is_activated=True,
                end_date__gte=timezone.now(),
                used_lease_slots__lt=F('total_lease_slots')
            ).first()

            if active_subscription:
                active_subscription.used_lease_slots = F('used_lease_slots') + 1
                active_subscription.save(update_fields=['used_lease_slots'], request=request) # Pass request to subscription save
                print(f"DEBUG: Lease {self.lease_id} consumed a slot from subscription {active_subscription.pk}.")
                return True
            else:
                print(f"DEBUG: Lease {self.lease_id} could not find an available 'RentSafe' subscription slot for {subscriber_entity}.")
                return False
        except Exception as e:
            print(f"ERROR: During subscription slot decrement for Lease {self.lease_id}: {e}")
            return False

    def _try_increment_subscription_slot(self, request=None):
        """
        Attempts to increment (free up) a subscription slot.
        This method will find *any* active RentSafe subscription for the landlord's entity
        that has used slots and decrement it. If a specific subscription per lease is desired,
        a ForeignKey from Lease to Subscription would be needed.
        """
        subscriber_entity = self._get_landlord_subscriber_entity()
        if not subscriber_entity:
            print(f"DEBUG: Lease {self.lease_id}: No subscriber entity found for landlord to free slot.")
            return False

        try:
            active_subscription = Subscription.objects.select_for_update().filter(
                content_type=ContentType.objects.get_for_model(subscriber_entity.__class__),
                object_id=subscriber_entity.pk,
                service__service_name="RENTSAFE",
                is_activated=True,
                end_date__gte=timezone.now(),
                used_lease_slots__gt=0 
            ).first()

            if active_subscription:
                active_subscription.used_lease_slots = F('used_lease_slots') - 1
                active_subscription.save(update_fields=['used_lease_slots'], request=request) 
                print(f"DEBUG: Lease {self.lease_id} freed up a slot from subscription {active_subscription.pk}.")
                return True
            else:
                print(f"DEBUG: Lease {self.lease_id} could not find a 'RentSafe' subscription slot to free for {subscriber_entity}.")
                return False
        except Exception as e:
            print(f"ERROR: During subscription slot increment for Lease {self.lease_id}: {e}")
            return False
    

class LeaseTenant(BaseModel):
    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name='lease_tenants')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                    limit_choices_to=Q(app_label='individuals', model='individual') |
                                    Q(app_label='companies', model='companybranch'))
    object_id = models.PositiveIntegerField()
    tenant_object = GenericForeignKey('content_type', 'object_id')

    is_primary_tenant = models.BooleanField(default=False,
                        help_text="Designates this tenant as the primary contact for the lease.")

    class Meta:
        app_label = 'leases'
        db_table = 'lease_tenant'
        ordering = ['tenant_object__name']
        unique_together = ('lease', 'content_type', 'object_id')
        verbose_name = _('lease tenant')
        verbose_name_plural = _('lease tenants')
    
    def __str__(self):
        return f"{self.tenant_object} on Lease {self.lease.lease_id}"
    def save(self, *args, **kwargs):
        is_new = not self.pk
        original_primary_status = None

        request = kwargs.pop('request', None)
        user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

        if not is_new:
            with contextlib.suppress(LeaseTenant.DoesNotExist):
                original_lease_tenant = LeaseTenant.objects.get(pk=self.pk)
                original_primary_status = original_lease_tenant.is_primary_tenant
        super().save(*args, **kwargs)

        tenant_obj_id = self.tenant_object.id if self.tenant_object else None
        tenant_obj_name = str(self.tenant_object) if self.tenant_object else "N/A"

        lease_details_for_log = {
            'lease_id_at_log_time': self.lease.lease_id if self.lease else None,
            'unit_id_at_log_time': self.lease.unit.id if self.lease and self.lease.unit else None,
            'unit_name_at_log_time': str(self.lease.unit) if self.lease and self.lease.unit else None,
            'landlord_id_at_log_time': self.lease.landlord.id if self.lease and self.lease.landlord else None,
            'landlord_name_at_log_time': str(self.lease.landlord) if self.lease and self.lease.landlord else None,
            'tenant_id': tenant_obj_id,
            'tenant_name': tenant_obj_name,
        }

        if is_new:
            LeaseLog.objects.create(
                lease=self.lease, 
                log_type='TENANT_ADDED',
                user=user,
                details={**lease_details_for_log, 'is_primary': self.is_primary_tenant},
                content_type=ContentType.objects.get_for_model(self),
                object_id=self.pk
            )
        elif original_primary_status != self.is_primary_tenant:
            LeaseLog.objects.create(
                lease=self.lease,
                log_type='PRIMARY_TENANT_CHANGED',
                user=user,
                details={
                    **lease_details_for_log,
                    'old_primary_status': original_primary_status,
                    'new_primary_status': self.is_primary_tenant
                },
                content_type=ContentType.objects.get_for_model(self),
                object_id=self.pk
            )

    def delete(self, *args, **kwargs):
        request = kwargs.pop('request', None)
        user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

        tenant_obj_id = self.tenant_object.id if self.tenant_object else None
        tenant_obj_name = str(self.tenant_object) if self.tenant_object else "N/A"
        
        lease_details_for_log = {
            'lease_id_at_log_time': self.lease.lease_id if self.lease else None,
            'unit_id_at_log_time': self.lease.unit.id if self.lease and self.lease.unit else None,
            'unit_name_at_log_time': str(self.lease.unit) if self.lease and self.lease.unit else None,
            'landlord_id_at_log_time': self.lease.landlord.id if self.lease and self.lease.landlord else None,
            'landlord_name_at_log_time': str(self.lease.landlord) if self.lease and self.lease.landlord else None,
            'tenant_id': tenant_obj_id,
            'tenant_name': tenant_obj_name,
        }

        LeaseLog.objects.create(
            lease=self.lease,
            log_type='TENANT_REMOVED',
            user=user,
            details={**lease_details_for_log, 'was_primary': self.is_primary_tenant}
        )
        super().delete(*args, **kwargs)


class Guarantor(BaseModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                    limit_choices_to=Q(app_label='individuals', model='individual') |
                                                    Q(app_label='companies', model='companybranch'))
    object_id = models.PositiveIntegerField()
    guarantor_object = GenericForeignKey('content_type', 'object_id')

    guarantee_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,
                                        help_text="The maximum amount guaranteed by this guarantor, if specified.")
    
    class Meta:
        app_label = 'leases'
        db_table = 'guarantor'
        verbose_name = _('guarantor')
        verbose_name_plural = _('guarantors')
        unique_together = ('content_type', 'object_id')
        ordering = ['guarantor_object__name']

    def __str__(self):
        guarantor_name = self.guarantor_object.__str__() if self.guarantor_object else "N/A"
        return f"Guarantor: {guarantor_name}"


class LeaseCharge(BaseModel):
    CHARGE_TYPE_CHOICES = (
        ('RENT', 'Rent'),
        ('UTILITY', 'Utility'),
        ('SERVICE_FEE', 'Service Fee'),
        ('LATE_FEE', 'Late Fee'),
        ('DEPOSIT', 'Deposit'), 
        ('DISCOUNT', 'Discount'),
        ('OTHER', 'Other'),
    )
    FREQUENCY_CHOICES = (
        ('ONE_TIME', 'One-time'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('ANNUALLY', 'Annually'),
    )

    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name='charges')
    charge_type = models.CharField(max_length=20, choices=CHARGE_TYPE_CHOICES, default='RENT')
    description = models.CharField(max_length=255, blank=True, null=True,
                                help_text="A brief description of the charge (e.g., 'Monthly Rent - Jan 2024', 'Water Bill').")
    amount = models.DecimalField(max_digits=12, decimal_places=2,
                                help_text="The monetary amount of the charge. Use negative for discounts.")
    currency = models.ForeignKey('accounts.Currency', on_delete=models.PROTECT,
                                help_text="The currency for this specific charge.",
                                related_name='lease_charges')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='MONTHLY',
                                help_text="How often this charge recurs.")
    effective_date = models.DateField(help_text="The date from which this charge becomes effective.")
    end_date = models.DateField(null=True, blank=True,
                                help_text="The date this charge stops being applied (e.g., for rent increases/discounts).")
    is_active = models.BooleanField(default=True,
                                    help_text="Indicates if this charge is currently active and should be applied.")

    class Meta:
        app_label = 'leases'
        db_table = 'lease_charge'
        verbose_name = _('lease charge')
        verbose_name_plural = _('lease charges')
        ordering = ['lease', 'effective_date', 'charge_type']

    def __str__(self):
        return f"{self.charge_type.replace('_', ' ').title()} of {self.amount} {self.currency.code} for Lease {self.lease.lease_id} ({self.frequency})"

    def save(self, *args, **kwargs):
        if self.frequency == 'ONE_TIME' and self.end_date:
            self.end_date = None
        is_new = not self.pk
        original_amount = None
        original_frequency = None
        original_charge_type = None

        request = kwargs.pop('request', None)
        user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

        if not is_new:
            with contextlib.suppress(LeaseCharge.DoesNotExist):
                original_charge = LeaseCharge.objects.get(pk=self.pk)
                original_amount = original_charge.amount
                original_frequency = original_charge.frequency
                original_charge_type = original_charge.charge_type
        super().save(*args, **kwargs)

        # Capture lease, unit, and landlord details for the log
        lease_details_for_log = {
            'lease_id_at_log_time': self.lease.lease_id if self.lease else None,
            'unit_id_at_log_time': self.lease.unit.id if self.lease and self.lease.unit else None,
            'unit_name_at_log_time': str(self.lease.unit) if self.lease and self.lease.unit else None,
            'landlord_id_at_log_time': self.lease.landlord.id if self.lease and self.lease.landlord else None,
            'landlord_name_at_log_time': str(self.lease.landlord) if self.lease and self.lease.landlord else None,
        }

        if is_new:
            LeaseLog.objects.create(
                lease=self.lease,
                log_type='CHARGE_ADDED',
                user=user,
                details={
                    **lease_details_for_log,
                    'charge_type': self.charge_type,
                    'amount': str(self.amount),
                    'currency_code': self.currency.code if self.currency else None,
                    'frequency': self.frequency,
                    'description': self.description
                },
                content_type=ContentType.objects.get_for_model(self),
                object_id=self.pk
            )
        else:
            log_details = lease_details_for_log.copy() # Start with core details

            # Track changes to charge fields
            changed_fields = False
            if self.amount != original_amount:
                log_details['old_amount'] = str(original_amount)
                log_details['new_amount'] = str(self.amount)
                changed_fields = True
            if self.frequency != original_frequency:
                log_details['old_frequency'] = original_frequency
                log_details['new_frequency'] = self.frequency
                changed_fields = True
            if self.charge_type != original_charge_type:
                log_details['old_charge_type'] = original_charge_type
                log_details['new_charge_type'] = self.charge_type
                changed_fields = True

            if changed_fields:
                LeaseLog.objects.create(
                    lease=self.lease,
                    log_type='CHARGE_UPDATED',
                    user=user,
                    details=log_details,
                    content_type=ContentType.objects.get_for_model(self),
                    object_id=self.pk
                )

    def delete(self, *args, **kwargs):
        request = kwargs.pop('request', None)
        user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

        lease_details_for_log = {
            'lease_id_at_log_time': self.lease.lease_id if self.lease else None,
            'unit_id_at_log_time': self.lease.unit.id if self.lease and self.lease.unit else None,
            'unit_name_at_log_time': str(self.lease.unit) if self.lease and self.lease.unit else None,
            'landlord_id_at_log_time': self.lease.landlord.id if self.lease and self.lease.landlord else None,
            'landlord_name_at_log_time': str(self.lease.landlord) if self.lease and self.lease.landlord else None,
        }

        LeaseLog.objects.create(
            lease=self.lease,
            log_type='CHARGE_REMOVED',
            user=user,
            details={
                **lease_details_for_log,
                'charge_type': self.charge_type,
                'amount': str(self.amount),
                'description': self.description
            }
        )
        super().delete(*args, **kwargs)


class LeaseTermination(BaseModel):
    lease = models.OneToOneField(Lease, on_delete=models.CASCADE, related_name='termination')
    termination_date = models.DateField()
    reason = models.TextField(help_text="Detailed reason for the lease termination.")
    notes = models.TextField(blank=True, null=True,
                            help_text="Additional notes related to the termination.")

    class Meta:
        app_label = 'leases'
        db_table = 'lease_termination'
        verbose_name = _('lease termination')
        verbose_name_plural = _('lease terminations')

    def __str__(self):
        return f"Termination of Lease {self.lease.lease_id} on {self.termination_date}"
    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)

        if is_new:
            request = kwargs.pop('request', None)
            user = request.user if request and hasattr(request, 'user') and request.user.is_authenticated else None

            lease_details_for_log = {
                'lease_id_at_log_time': self.lease.lease_id if self.lease else None,
                'unit_id_at_log_time': self.lease.unit.id if self.lease and self.lease.unit else None,
                'unit_name_at_log_time': str(self.lease.unit) if self.lease and self.lease.unit else None,
                'landlord_id_at_log_time': self.lease.landlord.id if self.lease and self.lease.landlord else None,
                'landlord_name_at_log_time': str(self.lease.landlord) if self.lease and self.lease.landlord else None,
            }

            LeaseLog.objects.create(
                lease=self.lease,
                log_type='LEASE_TERMINATED',
                user=user,
                details={**lease_details_for_log, 'termination_date': str(self.termination_date), 'reason': self.reason}
            )
            
            if self.lease.status != 'TERMINATED':
                self.lease.status = 'TERMINATED'
                self.lease.save(request=request) # Pass request


class LeaseLog(BaseModel):
    LOG_TYPE_CHOICES = (
        ('LEASE_CREATED', 'Lease Created'),
        ('LEASE_UPDATED', 'Lease Updated'),
        ('TENANT_ADDED', 'Tenant Added'),
        ('TENANT_REMOVED', 'Tenant Removed'),
        ('PRIMARY_TENANT_CHANGED', 'Primary Tenant Changed'),
        ('LEASE_STATUS_CHANGED', 'Lease Status Changed'),
        ('LEASE_TERMINATED', 'Lease Terminated'),
        ('LEASE_RENEWED', 'Lease Renewed'),
        ('CHARGE_ADDED', 'Charge Added'),
        ('CHARGE_UPDATED', 'Charge Updated'),
        ('CHARGE_REMOVED', 'Charge Removed'),
        ('DEPOSIT_UPDATED', 'Deposit Updated'),
        ('OTHER', 'Other'),
    )

    lease = models.ForeignKey(Lease, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs',
                        help_text="The lease associated with this log entry. Set to NULL if the lease is deleted.")
    
    log_type = models.CharField(max_length=50, choices=LOG_TYPE_CHOICES,
                        help_text="The type of event being logged.")
    timestamp = models.DateTimeField(auto_now_add=True,
                        help_text="The date and time the event occurred.")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                        help_text="The user who performed the action, if applicable.")
    
    details = models.JSONField(null=True, blank=True,
                        help_text="JSON field to store detailed changes or relevant data, including core lease identifiers.")
    
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True,
                                    help_text="The content type of the related object (e.g., LeaseTenant).")
    object_id = models.PositiveIntegerField(null=True, blank=True,
                        help_text="The ID of the related object.")
    related_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        app_label = 'leases'
        db_table = 'lease_log'
        verbose_name = _('lease log')
        verbose_name_plural = _('lease logs')
        ordering = ['-timestamp']

    def __str__(self):
        lease_identifier = self.details.get('lease_id_at_log_time', 'N/A') if self.lease is None else self.lease.lease_id
        return f"{self.log_type} for Lease {lease_identifier} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"