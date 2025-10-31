import contextlib
import logging
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, F, Sum
from django.conf import settings
from django.utils import timezone
from datetime import date, datetime
from decimal import Decimal
from apps.accounting.models import Payment
from apps.subscriptions.models.models import Subscription
from apps.properties.models.models import Unit
from apps.common.models.models import Document, Note
from apps.common.models.base_models import BaseModel, BaseModelWithUser
from apps.individuals.models import Individual
from apps.companies.models import CompanyBranch
from django.db import transaction

logger = logging.getLogger(__name__)


class Lease(BaseModelWithUser):
    LEASE_STATUS_CHOICES = (
        ("DRAFT", "Draft"),
        ("PENDING_APPROVAL", "Pending Approval"),
        ("ACTIVE", "Active"),
        ("TERMINATED", "Terminated"),
        ("EXPIRED", "Expired"),
        ("RENEWED", "Renewed"),
        ("SUSPENDED", "Suspended"),
    )

    PAYMENT_FREQUENCY_CHOICES = (
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
        ("HALF_YEARLY", "Half-Yearly"),
        ("ANNUALLY", "Annually"),
    )

    RISK_COLORS = {
        "NON_PAYER": "black",
        "HIGH_HIGH": "red",
        "HIGH": "pink",
        "MEDIUM": "orange",
        "LOW": "green",
    }

    lease_id = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique identifier for the lease (e.g., LSE-001).",
    )
    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT,
        related_name="leases",
        help_text="The property unit being leased.",
    )
    # Dates
    start_date = models.DateField(
        null=True, blank=True, help_text="The date when the lease officially starts."
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="The date when the lease is scheduled to end. Can be null for open-ended leases.",
    )
    signed_date = models.DateField(
        blank=True,
        null=True,
        help_text="The actual date the lease agreement was signed.",
    )
    status = models.CharField(
        max_length=20,
        choices=LEASE_STATUS_CHOICES,
        default="ACTIVE",
        help_text="Current operational status of the lease.",
    )

    landlord = models.ForeignKey(
        "leases.Landlord",
        on_delete=models.PROTECT,
        related_name="managed_leases",
        null=True,
        blank=True,
        help_text="The landlord responsible for this lease.",
    )
    lease_tenants = models.ManyToManyField(
        "leases.LeaseTenant",
        through="leases.LeaseTenantAssociation",
        related_name="leases",
        blank=True,
    )
    currency = models.ForeignKey(
        "accounting.Currency",
        on_delete=models.PROTECT,
        help_text="The primary currency in which the lease payments and charges are accounted for.",
        related_name="leases_as_primary_currency",
    )
    managing_client = models.ForeignKey(
        "clients.Client",
        on_delete=models.PROTECT,
        related_name="managed_leases",
        null=True,
        blank=True,
        help_text="The client responsible for managing this lease.",
    )
    payment_frequency = models.CharField(
        max_length=20,
        choices=PAYMENT_FREQUENCY_CHOICES,
        default="MONTHLY",
        help_text="The default payment frequency for recurring charges.",
    )
    due_day_of_month = models.SmallIntegerField(
        default=25,
        help_text="The day of the month when recurring charges are typically due (1-31).",
    )
    grace_period_days = models.SmallIntegerField(
        default=7,
        help_text="Number of days after the due date before a payment is considered late.",
    )

    includes_utilities = models.BooleanField(
        default=False,
        help_text="Indicates if basic utilities are included in the overall rent.",
    )
    utilities_details = models.TextField(
        blank=True,
        null=True,
        help_text="Detailed description of utilities included or managed separately.",
    )

    guarantor = models.ForeignKey(
        "leases.Guarantor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The guarantor responsible for financial obligations under this lease.",
    )
    account_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional bank account number or reference for tenant payments.",
    )
    is_rent_variable = models.BooleanField(
        default=False, help_text="Indicates if the rent amount is variable."
    )
    documents = GenericRelation(Document)
    notes = GenericRelation(Note)

    class Meta:
        app_label = "leases"
        verbose_name = _("lease")
        verbose_name_plural = _("leases")
        ordering = ["-start_date", "lease_id"]

    def __str__(self):
        # Update to use the new relationship
        tenant_names = [lt.tenant_object.__str__() for lt in self.lease_tenants.all()]
        tenant_str = ", ".join(tenant_names) if tenant_names else "No Tenant"
        return f"Lease {self.lease_id} for {self.unit} ({tenant_str})"

    def get_primary_tenant(self):
        association = self.leasetenantassociation_set.filter(
            is_primary_tenant=True
        ).first()
        return association.tenant if association else None

    def get_tenant_names(self):
        return [lt.tenant_object.__str__() for lt in self.lease_tenants.all()]

    def save(self, *args, **kwargs):
        is_new = not self.pk
        original_status = None
        original_landlord = None
        original_deposit_amount = None

        request = kwargs.pop("request", None)
        user = (
            request.user
            if request and hasattr(request, "user") and request.user.is_authenticated
            else None
        )

        if not is_new:
            try:
                original_lease = Lease.objects.get(pk=self.pk)
                original_status = original_lease.status
                original_landlord = original_lease.landlord
            except Lease.DoesNotExist:
                pass

        # This part needs to be here to ensure a lease_id exists before save
        if not self.pk and not self.lease_id:
            self.lease_id = self._generate_unique_lease_id()

        # Call super().save() first to ensure the object has a PK
        super().save(*args, **kwargs)

        # All logic that requires a primary key or accesses related objects must come AFTER this line
        current_lease_details = {
            "lease_id_at_log_time": self.lease_id,
            "unit_id_at_log_time": self.unit.id if self.unit else None,
            "tenant_names_at_log_time": self.get_tenant_names(),
            "start_date_at_log_time": (
                self.start_date.isoformat() if self.start_date else None
            ),
            "unit_name_at_log_time": str(self.unit) if self.unit else None,
            "landlord_id_at_log_time": self.landlord.id if self.landlord else None,
            "landlord_name_at_log_time": str(self.landlord) if self.landlord else None,
        }

        # Handle logging and subscription changes
        status_changed_to_active = (
            self.status == "ACTIVE" and original_status != "ACTIVE"
        )
        status_changed_from_active = (
            original_status == "ACTIVE" and self.status not in ["ACTIVE", "SUSPENDED"]
        )

        # Check for new lease and log creation
        if is_new:
            log_details = current_lease_details.copy()
            log_details.update({"initial_status": self.status})
            LeaseLog.objects.create(
                lease=self, log_type="LEASE_CREATED", user=user, details=log_details
            )
        # Check for updates and log changes
        else:
            # Check for status changes
            if self.status != original_status:
                log_details = current_lease_details.copy()
                log_details.update(
                    {
                        "old_status": original_status,
                        "new_status": self.status,
                    }
                )
                LeaseLog.objects.create(
                    lease=self,
                    log_type="LEASE_STATUS_CHANGED",
                    user=user,
                    details=log_details,
                )
            # Check for landlord changes
            if self.landlord != original_landlord:
                log_details = current_lease_details.copy()
                log_details.update(
                    {
                        "field": "landlord",
                        "old_landlord_id": (
                            original_landlord.id if original_landlord else None
                        ),
                        "old_landlord_name": (
                            str(original_landlord) if original_landlord else None
                        ),
                        "new_landlord_id": self.landlord.id if self.landlord else None,
                        "new_landlord_name": (
                            str(self.landlord) if self.landlord else None
                        ),
                    }
                )
                LeaseLog.objects.create(
                    lease=self, log_type="LEASE_UPDATED", user=user, details=log_details
                )

        # Handle subscription slot logic
        if status_changed_to_active:
            # Subscription logic for activating a lease
            if not self._try_decrement_subscription_slot(request=request):
                LeaseLog.objects.create(
                    lease=self,
                    log_type="OTHER",
                    user=user,
                    details={
                        "event": "Subscription Slot Decrement Failed",
                        "lease_status_attempted": "ACTIVE",
                        **current_lease_details,
                    },
                )
                print(
                    "WARNING: Lease activated but subscription slot decrement failed."
                )
        elif status_changed_from_active:
            # Subscription logic for deactivating a lease
            self._try_increment_subscription_slot(request=request)
            LeaseLog.objects.create(
                lease=self,
                log_type="OTHER",
                user=user,
                details={
                    "event": "Subscription Slot Incremented",
                    "lease_status_changed_from": original_status,
                    **current_lease_details,
                },
            )

    def _generate_unique_lease_id(self):
        today = date.today()
        prefix = f"LSE-{today.year % 100:02d}{today.month:02d}"

        last_lease = (
            Lease.objects.filter(lease_id__startswith=prefix)
            .order_by("-lease_id")
            .first()
        )
        if last_lease:
            try:
                last_number_str = last_lease.lease_id.split("-")[-1]
                last_number = int(last_number_str)
                new_number = last_number + 1
            except (ValueError, IndexError):
                new_number = 1
        else:
            new_number = 1

        return f"{prefix}-{new_number:04d}"

    @property
    def risk_color(self):
        """Return the color code for the current risk level"""
        return self.RISK_COLORS.get(self.risk_level, "green")

    def _get_outstanding_invoice_months(self):
        """
        Calculates the number of months since the oldest unpaid invoice's sale date.
        Only considers unpaid or partially paid invoices.
        """
        today = timezone.now().date()

        # Get all unpaid invoices
        unpaid_invoices = self.invoices.filter(
            status__in=["pending", "partially_paid", "draft"]
        )

        if not unpaid_invoices.exists():
            return 0

        # Find the oldest invoice by sale_date
        oldest_invoice = unpaid_invoices.order_by("sale_date").first()

        if not oldest_invoice or not oldest_invoice.sale_date:
            return 0

        # Calculate months difference between today and the oldest invoice sale date
        if isinstance(oldest_invoice.sale_date, datetime):
            sale_date = oldest_invoice.sale_date.date()
        else:
            sale_date = oldest_invoice.sale_date

        # Calculate months difference
        months_diff = (today.year - sale_date.year) * 12 + (
            today.month - sale_date.month
        )
        # Ensure at least 1 month if invoice is overdue
        return max(1, months_diff)

    def determine_initial_risk_status(self):
        risk_status = "LOW"

        try:
            opening_balance = self.opening_balance
        except Exception as e:
            return risk_status

        if opening_balance.three_months_plus_balance > 0:
            risk_status = "NON_PAYER"
        elif opening_balance.three_months_back_balance > 0:
            risk_status = "HIGH_HIGH"
        elif opening_balance.two_months_back_balance > 0:
            risk_status = "HIGH"
        elif opening_balance.one_month_back_balance > 0:
            risk_status = "MEDIUM"

        if opening_balance.outstanding_balance > 0:
            from apps.leases.services.invoice_service import LeaseInvoiceService

            LeaseInvoiceService.generate_initial_invoice_for_opening_balance(self)

        return risk_status

    def apply_payment(
        self,
        amount,
        payment_date,
        method,
        reference=None,
        request=None,
        description=None,
        cashbook=None,
    ):
        """
        Apply a payment to the lease, allocating to the oldest debts first.
        Allows overpayments which will create a negative balance.
        Handles landlord commissions for each payment allocation.
        """
        from apps.leases.utils.commissions import CommissionHandler

        remaining_amount = Decimal(amount)
        payments_made = []

        # Get all unpaid invoices ordered by due date (oldest first)
        unpaid_invoices = self.invoices.filter(
            status__in=["pending", "partially_paid"]
        ).order_by("due_date")
        with transaction.atomic():
            # Apply payment to unpaid invoices first
            for invoice in unpaid_invoices:
                if remaining_amount <= 0:
                    break

                # Calculate invoice balance properly (handle None values)
                total_paid_result = invoice.payments.aggregate(total_paid=Sum("amount"))
                total_paid = total_paid_result["total_paid"] or Decimal("0.00")

                invoice_balance = invoice.total_inclusive - total_paid

                payment_amount = min(remaining_amount, invoice_balance)

                if payment_amount > 0 or invoice_balance <= 0:
                    # Create payment
                    payment = Payment.objects.create(
                        invoice=invoice,
                        payment_date=payment_date,
                        amount=payment_amount,
                        description=description,
                        method=method,
                        reference=reference,
                        cashbook=cashbook,
                        created_by=(
                            request.user
                            if request and hasattr(request, "user")
                            else None
                        ),
                    )

                    payments_made.append(payment)
                    remaining_amount -= payment_amount
                    # def handle_payment_commission(lease, payment_amount, payment_date, payment_reference, request=None):
                    # Handle landlord commission for this specific payment allocation
                    CommissionHandler.handle_payment_commission(
                        lease=self,
                        payment_amount=payment_amount,
                        payment_date=payment_date,
                        payment_reference=f"{reference or 'Payment'} for invoice {invoice.document_number}",
                        request=request,
                    )

                    # Update invoice status
                    if payment_amount >= invoice_balance:
                        invoice.status = "paid"
                    else:
                        invoice.status = "partially_paid"
                    invoice.save()

            # Handle overpayment by adding to the last payment
            if remaining_amount > 0:
                # Add overpayment to the last payment made
                if payments_made:
                    last_payment = payments_made[-1]
                    last_payment.amount += remaining_amount
                    last_payment.save()
                elif (
                    last_payment := Payment.objects.filter(invoice__lease=self)
                    .order_by("-payment_date", "-id")
                    .first()
                ):
                    last_payment.amount += remaining_amount
                    last_payment.save()
                CommissionHandler.handle_payment_commission(
                    lease=self,
                    payment_amount=remaining_amount,
                    payment_date=payment_date,
                    payment_reference=f"{reference or 'Payment'} overpayment",
                    request=request,
                )

                remaining_amount = Decimal("0.00")

            # Log the payment
            if payments_made or remaining_amount > 0:
                log_details = {
                    "total_amount": str(amount),
                    "payment_method": str(method),
                    "reference": reference,
                    "applied_to_invoices": [
                        p.invoice.document_number for p in payments_made
                    ],
                    "overpayment_amount": (
                        str(remaining_amount) if remaining_amount > 0 else "0.00"
                    ),
                }

                LeaseLog.objects.create(
                    lease=self,
                    log_type="PAYMENT_RECEIVED",
                    user=request.user if request and hasattr(request, "user") else None,
                    details=log_details,
                )

            return payments_made, remaining_amount
        return [], remaining_amount

    @property
    def risk_level(self):
        """
        Calculates risk level based on both opening balance age and invoice aging.
        Opening balance takes precedence, then unpaid invoices.
        """
        outstanding_months = self._get_outstanding_invoice_months()

        if outstanding_months > 4:
            return "NON_PAYER"
        elif outstanding_months == 4:
            return "HIGH HIGH"
        elif outstanding_months == 3:
            return "HIGH"
        elif outstanding_months == 2:
            return "MEDIUM"
        else:
            return "LOW"

    @property
    def get_latest_balance(self):
        return self.current_balance

    @property
    def payment_status(self):
        """Returns a human-readable payment status based on risk level."""
        risk = self.risk_level
        if risk == "NON_PAYER":
            return "Non-Payer"
        elif risk in ["HIGH HIGH", "HIGH"]:
            return "High-Risk"
        elif risk == "MEDIUM":
            return "Medium-Risk"
        else:
            return "Low-Risk"

    @property
    def client_name(self):
        """Get the managing client's name"""
        return self.managing_client.name if self.managing_client else "N/A"

    @property
    def current_balance(self):
        """
        Calculate the current balance of the lease.
        Positive = amount owed, Negative = credit balance (overpayment)
        """
        total_invoiced = self.invoices.filter(
            invoice_type__in=["fiscal", "proforma"]
        ).aggregate(total=Sum("total_inclusive"))["total"] or Decimal("0.00")

        # Calculate total payments
        total_paid = Payment.objects.filter(invoice__lease=self).aggregate(
            total=Sum("amount")
        )["total"] or Decimal("0.00")

        return total_invoiced - total_paid

    def _get_landlord_subscriber_entity(self):
        """
        Helper to get the actual Individual or Company linked to the landlord.
        """
        if self.landlord and hasattr(self.landlord, "owner_object"):
            return self.landlord.owner_object
        return None

    def _try_decrement_subscription_slot(self, request=None):
        """
        Attempts to decrement a subscription slot for the landlord's associated company/individual.
        Returns True if successful, False otherwise.
        """
        subscriber_entity = self._get_landlord_subscriber_entity()
        if not subscriber_entity:
            print(
                f"DEBUG: Lease {self.lease_id}: No subscriber entity found for landlord."
            )
            return False

        try:
            active_subscription = (
                Subscription.objects.select_for_update()
                .filter(
                    content_type=ContentType.objects.get_for_model(
                        subscriber_entity.__class__
                    ),
                    object_id=subscriber_entity.pk,
                    service__service_name="RENTSAFE",
                    is_activated=True,
                    end_date__gte=timezone.now(),
                    used_lease_slots__lt=F("total_lease_slots"),
                )
                .first()
            )

            if active_subscription:
                active_subscription.used_lease_slots = F("used_lease_slots") + 1
                active_subscription.save(
                    update_fields=["used_lease_slots"], request=request
                )  # Pass request to subscription save
                print(
                    f"DEBUG: Lease {self.lease_id} consumed a slot from subscription {active_subscription.pk}."
                )
                return True
            else:
                print(
                    f"DEBUG: Lease {self.lease_id} could not find an available 'RentSafe' subscription slot for {subscriber_entity}."
                )
                return False
        except Exception as e:
            print(
                f"ERROR: During subscription slot decrement for Lease {self.lease_id}: {e}"
            )
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
            print(
                f"DEBUG: Lease {self.lease_id}: No subscriber entity found for landlord to free slot."
            )
            return False

        try:
            active_subscription = (
                Subscription.objects.select_for_update()
                .filter(
                    content_type=ContentType.objects.get_for_model(
                        subscriber_entity.__class__
                    ),
                    object_id=subscriber_entity.pk,
                    service__service_name="RENTSAFE",
                    is_activated=True,
                    end_date__gte=timezone.now(),
                    used_lease_slots__gt=0,
                )
                .first()
            )

            if active_subscription:
                active_subscription.used_lease_slots = F("used_lease_slots") - 1
                active_subscription.save(
                    update_fields=["used_lease_slots"], request=request
                )
                print(
                    f"DEBUG: Lease {self.lease_id} freed up a slot from subscription {active_subscription.pk}."
                )
                return True
            else:
                print(
                    f"DEBUG: Lease {self.lease_id} could not find a 'RentSafe' subscription slot to free for {subscriber_entity}."
                )
                return False
        except Exception as e:
            print(
                f"ERROR: During subscription slot increment for Lease {self.lease_id}: {e}"
            )
            return False


class LeaseTenantAssociation(BaseModel):
    lease = models.ForeignKey("leases.Lease", on_delete=models.CASCADE)
    tenant = models.ForeignKey("leases.LeaseTenant", on_delete=models.CASCADE)
    is_primary_tenant = models.BooleanField(default=False)

    class Meta:
        unique_together = ("lease", "tenant")
        verbose_name = _("Lease Tenant Association")
        verbose_name_plural = _("Lease Tenant Associations")

    def __str__(self):
        return f"{self.tenant} on {self.lease} (Primary: {self.is_primary_tenant})"


class LeaseTenant(BaseModel):
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=Q(app_label="individuals", model="individual")
        | Q(app_label="companies", model="companybranch"),
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    tenant_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        app_label = "leases"
        db_table = "lease_tenant"
        unique_together = ("content_type", "object_id")
        verbose_name = _("lease tenant")
        verbose_name_plural = _("lease tenants")

    def __str__(self):
        return f"{self.tenant_object}"

    def tenant_info(self):
        if self.tenant_object:
            if isinstance(self.tenant_object, Individual):
                return {
                    "type": "individual",
                    "id": self.tenant_object.id,
                    "name": self.tenant_object.full_name,
                    "identification_number": self.tenant_object.identification_number,
                }
            elif isinstance(self.tenant_object, CompanyBranch):
                return {
                    "type": "company_branch",
                    "id": self.tenant_object.id,
                    "name": self.tenant_object.full_name,
                    "company_name": self.tenant_object.company.registration_name,
                }
        return None

    @property
    def phone(self):
        if self.tenant_object and isinstance(
            self.tenant_object, (Individual, CompanyBranch)
        ):
            return self.tenant_object.phone[0]
        return None

    @property
    def email(self):
        if self.tenant_object and isinstance(self.tenant_object, CompanyBranch):
            return self.tenant_object.email
        return None


class LeaseCharge(BaseModel):
    CHARGE_TYPE_CHOICES = (
        ("RENT", "Rent"),
        ("UTILITY", "Utility"),
        ("SERVICE_FEE", "Service Fee"),
        ("LATE_FEE", "Late Fee"),
        ("DEPOSIT", "Deposit"),
        ("DISCOUNT", "Discount"),
        ("OTHER", "Other"),
    )
    FREQUENCY_CHOICES = (
        ("ONE_TIME", "One-time"),
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
        ("ANNUALLY", "Annually"),
    )

    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name="charges")
    charge_type = models.CharField(
        max_length=20, choices=CHARGE_TYPE_CHOICES, default="OTHER"
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="A brief description of the charge (e.g., 'Monthly Rent - Jan 2024', 'Water Bill').",
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="The monetary amount of the charge. Use negative for discounts.",
    )
    currency = models.ForeignKey(
        "accounting.Currency",
        on_delete=models.PROTECT,
        help_text="The currency for this specific charge.",
        related_name="lease_charges",
    )
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default="MONTHLY",
        help_text="How often this charge recurs.",
    )
    effective_date = models.DateField(
        help_text="The date from which this charge becomes effective.",
        auto_now_add=True,
        blank=True,
        null=True,
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="The date this charge stops being applied (e.g., for rent increases/discounts).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Indicates if this charge is currently active and should be applied.",
    )
    vat_inclusive = models.BooleanField(
        default=False, help_text="Indicates if the charge amount includes VAT."
    )

    class Meta:
        app_label = "leases"
        db_table = "lease_charge"
        verbose_name = _("lease charge")
        verbose_name_plural = _("lease charges")
        ordering = ["lease", "effective_date", "charge_type"]

    def __str__(self):
        return f"{self.charge_type.replace('_', ' ').title()} of {self.amount} {self.currency.currency_code} for Lease {self.lease.lease_id} ({self.frequency})"

    def save(self, *args, **kwargs):
        if self.frequency == "ONE_TIME" and self.end_date:
            self.end_date = None
        is_new = not self.pk
        original_amount = None
        original_frequency = None
        original_charge_type = None

        request = kwargs.pop("request", None)
        user = (
            request.user
            if request and hasattr(request, "user") and request.user.is_authenticated
            else None
        )

        if not is_new:
            with contextlib.suppress(LeaseCharge.DoesNotExist):
                original_charge = LeaseCharge.objects.get(pk=self.pk)
                original_amount = original_charge.amount
                original_frequency = original_charge.frequency
                original_charge_type = original_charge.charge_type
        super().save(*args, **kwargs)

        # Capture lease, unit, and landlord details for the log
        lease_details_for_log = {
            "lease_id_at_log_time": self.lease.lease_id if self.lease else None,
            "unit_id_at_log_time": (
                self.lease.unit.id if self.lease and self.lease.unit else None
            ),
            "unit_name_at_log_time": (
                str(self.lease.unit) if self.lease and self.lease.unit else None
            ),
            "landlord_id_at_log_time": (
                self.lease.landlord.id if self.lease and self.lease.landlord else None
            ),
            "landlord_name_at_log_time": (
                str(self.lease.landlord) if self.lease and self.lease.landlord else None
            ),
        }

        if is_new:
            LeaseLog.objects.create(
                lease=self.lease,
                log_type="CHARGE_ADDED",
                user=user,
                details={
                    **lease_details_for_log,
                    "charge_type": self.charge_type,
                    "amount": str(self.amount),
                    "currency_code": (
                        self.currency.currency_code if self.currency else None
                    ),
                    "frequency": self.frequency,
                    "description": self.description,
                },
                content_type=ContentType.objects.get_for_model(self),
                object_id=self.pk,
            )
        else:
            log_details = lease_details_for_log.copy()  # Start with core details

            # Track changes to charge fields
            changed_fields = False
            if self.amount != original_amount:
                log_details["old_amount"] = str(original_amount)
                log_details["new_amount"] = str(self.amount)
                changed_fields = True
            if self.frequency != original_frequency:
                log_details["old_frequency"] = original_frequency
                log_details["new_frequency"] = self.frequency
                changed_fields = True
            if self.charge_type != original_charge_type:
                log_details["old_charge_type"] = original_charge_type
                log_details["new_charge_type"] = self.charge_type
                changed_fields = True

            if changed_fields:
                LeaseLog.objects.create(
                    lease=self.lease,
                    log_type="CHARGE_UPDATED",
                    user=user,
                    details=log_details,
                    content_type=ContentType.objects.get_for_model(self),
                    object_id=self.pk,
                )

    def delete(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        user = (
            request.user
            if request and hasattr(request, "user") and request.user.is_authenticated
            else None
        )

        lease_details_for_log = {
            "lease_id_at_log_time": self.lease.lease_id if self.lease else None,
            "unit_id_at_log_time": (
                self.lease.unit.id if self.lease and self.lease.unit else None
            ),
            "unit_name_at_log_time": (
                str(self.lease.unit) if self.lease and self.lease.unit else None
            ),
            "landlord_id_at_log_time": (
                self.lease.landlord.id if self.lease and self.lease.landlord else None
            ),
            "landlord_name_at_log_time": (
                str(self.lease.landlord) if self.lease and self.lease.landlord else None
            ),
        }

        LeaseLog.objects.create(
            lease=self.lease,
            log_type="CHARGE_REMOVED",
            user=user,
            details={
                **lease_details_for_log,
                "charge_type": self.charge_type,
                "amount": str(self.amount),
                "description": self.description,
            },
        )
        super().delete(*args, **kwargs)


class LeaseDeposit(BaseModel):
    DEPOSIT_HOLDER_CHOICES = [
        ("agent", "Agent"),
        ("landlord", "Landlord"),
        ("tenant", "Tenant"),
    ]
    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name="deposits")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.ForeignKey("accounting.Currency", on_delete=models.PROTECT)
    deposit_date = models.DateField(blank=True, null=True)
    deposit_holder = models.CharField(
        max_length=255, choices=DEPOSIT_HOLDER_CHOICES, default="agent"
    )

    class Meta:
        app_label = "leases"
        db_table = "lease_deposit"
        verbose_name = _("lease deposit")
        verbose_name_plural = _("lease deposits")

    def __str__(self):
        return f"Lease: {self.lease.lease_id if self.lease else 'N/A'} Deposit: {self.currency.currency_code if self.currency else 'N/A'} {self.amount}"


class Guarantor(BaseModel):
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=Q(app_label="individuals", model="individual")
        | Q(app_label="companies", model="companybranch"),
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    guarantor_object = GenericForeignKey("content_type", "object_id")

    guarantee_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="The maximum amount guaranteed by this guarantor, if specified.",
    )

    class Meta:
        app_label = "leases"
        db_table = "guarantor"
        verbose_name = _("guarantor")
        verbose_name_plural = _("guarantors")
        unique_together = ("content_type", "object_id")

    def __str__(self):
        guarantor_name = (
            self.guarantor_object.__str__() if self.guarantor_object else "N/A"
        )
        return f"Guarantor: {guarantor_name}"


class LeaseTermination(BaseModel):
    lease = models.OneToOneField(
        Lease, on_delete=models.CASCADE, related_name="termination"
    )
    termination_date = models.DateField()
    reason = models.TextField(help_text="Detailed reason for the lease termination.")
    notes = models.TextField(
        blank=True, null=True, help_text="Additional notes related to the termination."
    )

    class Meta:
        app_label = "leases"
        db_table = "lease_termination"
        verbose_name = _("lease termination")
        verbose_name_plural = _("lease terminations")

    def __str__(self):
        return f"Termination of Lease {self.lease.lease_id} on {self.termination_date}"

    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)

        if is_new:
            request = kwargs.pop("request", None)
            user = (
                request.user
                if request
                and hasattr(request, "user")
                and request.user.is_authenticated
                else None
            )

            lease_details_for_log = {
                "lease_id_at_log_time": self.lease.lease_id if self.lease else None,
                "unit_id_at_log_time": (
                    self.lease.unit.id if self.lease and self.lease.unit else None
                ),
                "unit_name_at_log_time": (
                    str(self.lease.unit) if self.lease and self.lease.unit else None
                ),
                "landlord_id_at_log_time": (
                    self.lease.landlord.id
                    if self.lease and self.lease.landlord
                    else None
                ),
                "landlord_name_at_log_time": (
                    str(self.lease.landlord)
                    if self.lease and self.lease.landlord
                    else None
                ),
            }

            LeaseLog.objects.create(
                lease=self.lease,
                log_type="LEASE_TERMINATED",
                user=user,
                details={
                    **lease_details_for_log,
                    "termination_date": str(self.termination_date),
                    "reason": self.reason,
                },
            )

            if self.lease.status != "TERMINATED":
                self.lease.status = "TERMINATED"
                self.lease.save(request=request)  # Pass request


class LeaseLog(BaseModel):
    LOG_TYPE_CHOICES = (
        ("LEASE_CREATED", "Lease Created"),
        ("LEASE_UPDATED", "Lease Updated"),
        ("TENANT_ADDED", "Tenant Added"),
        ("TENANT_REMOVED", "Tenant Removed"),
        ("PRIMARY_TENANT_CHANGED", "Primary Tenant Changed"),
        ("LEASE_STATUS_CHANGED", "Lease Status Changed"),
        ("LEASE_TERMINATED", "Lease Terminated"),
        ("LEASE_RENEWED", "Lease Renewed"),
        ("CHARGE_ADDED", "Charge Added"),
        ("CHARGE_UPDATED", "Charge Updated"),
        ("CHARGE_REMOVED", "Charge Removed"),
        ("DEPOSIT_UPDATED", "Deposit Updated"),
        ("OTHER", "Other"),
    )

    lease = models.ForeignKey(
        Lease,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="logs",
        help_text="The lease associated with this log entry. Set to NULL if the lease is deleted.",
    )

    log_type = models.CharField(
        max_length=50,
        choices=LOG_TYPE_CHOICES,
        help_text="The type of event being logged.",
    )
    timestamp = models.DateTimeField(
        auto_now_add=True, help_text="The date and time the event occurred."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who performed the action, if applicable.",
    )

    details = models.JSONField(
        null=True,
        blank=True,
        help_text="JSON field to store detailed changes or relevant data, including core lease identifiers.",
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The content type of the related object (e.g., LeaseTenant).",
    )
    object_id = models.PositiveIntegerField(
        null=True, blank=True, help_text="The ID of the related object."
    )
    related_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        app_label = "leases"
        db_table = "lease_log"
        verbose_name = _("lease log")
        verbose_name_plural = _("lease logs")
        ordering = ["-timestamp"]

    def __str__(self):
        lease_identifier = (
            self.details.get("lease_id_at_log_time", "N/A")
            if self.lease is None
            else self.lease.lease_id
        )
        return f"{self.log_type} for Lease {lease_identifier} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
