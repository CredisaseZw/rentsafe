from datetime import date, datetime, timedelta
from enum import Enum
import json
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
# from simple_history.models import HistoricalRecords


class Company(models.Model):
    # main fields
    fins_number_company = models.CharField(max_length=255, blank=True, null=True)
    cb_number = models.CharField(unique=True, max_length=255, blank=True, null=True)
    registration_number = models.CharField(max_length=255, blank=True, null=True)
    registration_name = models.CharField(max_length=255)
    trading_name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_suspended = models.BooleanField(default=False)
    industry = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)
    company_uploader = models.CharField(max_length=255, blank=True, null=True)
    tin_number = models.CharField(max_length=255, blank=True, null=True)
    is_government = models.BooleanField(default=False)  # is government company
    #history = HistoricalRecords()

    class Meta:
        db_table = "company"

class ContactPerson(models.Model):
    identification_number=models.CharField(max_length=255,blank=True,null=True)
    lease_id = models.CharField(max_length=255,blank=True,null=True)
    client_id = models.CharField(max_length=255,blank=True,null=True)
    first_name = models.CharField(max_length=255,blank=True,null=True)
    surname = models.CharField(max_length=255,blank=True,null=True)
    email = models.CharField(max_length=255,blank=True,null=True)
    phone = models.CharField(max_length=255,blank=True,null=True)
    other_phone = models.CharField(max_length=255,blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    #history = HistoricalRecords()

    def __str__(self) -> int:
        return str(self.client_id)

class CompanyProfile(models.Model):
    company = models.CharField(max_length=255)  # company id
    legal_status = models.CharField(max_length=255, blank=True, null=True)
    trading_status = models.CharField(max_length=255, blank=True, null=True)
    parent_company = models.CharField(max_length=255, blank=True, null=True)
    fomer_address = models.TextField(blank=True, null=True)
    current_address = models.TextField(blank=True, null=True)
    postal_address = models.CharField(max_length=255, blank=True, null=True)
    mobile_phone = models.CharField(max_length=255, blank=True, null=True)
    landline_phone = models.CharField(max_length=255, blank=True, null=True)
    logo = models.CharField(max_length=100, blank=True, null=True)
    registration_date = models.DateField(blank=True, null=True)
    bp_number = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    subscription_category = models.TextField(
        blank=True, null=True
    )  # This field type is a guess.
    vat_number = models.CharField(max_length=255, blank=True, null=True)
    number_of_employees = models.IntegerField(blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    trend = models.CharField(max_length=255, blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    facebook = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    linkdin = models.CharField(max_length=255, blank=True, null=True)
    operations = models.TextField(blank=True, null=True)
    subscription_contract = models.CharField(max_length=100, blank=True, null=True)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    risk_class = models.CharField(max_length=255, blank=True, null=True)
    branch = models.CharField(max_length=255, blank=True, null=True)
    account_number = models.CharField(max_length=255, blank=True, null=True)
    is_under_judicial = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_suspended = models.BooleanField(default=False)
    note = models.TextField(blank=True, null=True)
    #history = HistoricalRecords()
    

    class Meta:
        db_table = "company_profile"


class Individual(models.Model):
    IDENTIFICATION_TYPE_CHOICE = [
        ("nationalid", "nationalid"),
        ("passport", "passport"),
        ("alien", "alien"),
        ("serviceid", "serviceid"),
    ]
    # fins_number = models.CharField(primary_key=True, max_length=255)
    individual_adder = models.CharField(max_length=255)
    national_id = models.CharField(max_length=255, unique=True)
    firstname = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=255, blank=True, null=True)
    land_line = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    identification_type = models.CharField(
        default="nationalid", choices=IDENTIFICATION_TYPE_CHOICE, max_length=128
    )
    identification_number = models.CharField(max_length=50, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)
    #history = HistoricalRecords()
    

    class Meta:
        db_table = "individual"


class EmployementDetails(models.Model):
    individual = models.CharField(max_length=255)
    date_of_employment = models.CharField(max_length=50, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    employer_name = models.CharField(max_length=255, blank=True, null=True)
    employer_email = models.CharField(max_length=255, blank=True, null=True)
    marital_status = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "employement_details"


class IndividualProfile(models.Model):
    individual = models.CharField(max_length=255)
    district = models.CharField(max_length=255, blank=True, null=True)
    town = models.CharField(max_length=255, blank=True, null=True)
    next_of_kin = models.CharField(max_length=255, blank=True, null=True)
    relationship = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #history = HistoricalRecords()
    

    class Meta:
        db_table = "individual_profile"


class Notification(models.Model):
    STATUS_CHOICE = [
        ("pending", "pending"),
        ("accepted", "accepted"),
        ("rejected", "rejected"),
    ]
    company = models.CharField(max_length=128)  # company id from Company model Model
    individual = models.CharField(max_length=128)  # individual id from Individual Model
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(default="pending", choices=STATUS_CHOICE, max_length=128)

    class Meta:
        db_table = "notification"


class Lease(models.Model):
    # method of payment
    CURRENCY_CHOICES = [
        ("USD", "USD"),
        ("ZWG", "ZWG"),
        ("ZAR", "ZAR"),
    ]
    STATUS_CHOICES = [
        ("SAFE", "SAFE"),
        ("MEDIUM", "MEDIUM"),
        ("HIGH", "HIGH"),
        ("HIGH-HIGH", "HIGH-HIGH"),
        ("NON-PAYER", "NON-PAYER"),
    ]

    lease_id = models.AutoField(primary_key=True)
    reg_ID_Number = models.CharField(max_length=255, unique=False)
    is_individual = models.BooleanField(default=False)
    is_company = models.BooleanField(default=False)
    rent_guarantor_id = models.CharField(max_length=255, null=False)
    lease_details = models.CharField(max_length=255, null=False)
    lease_giver = models.CharField(max_length=255, null=False)
    lease_activator = models.CharField(max_length=255, null=False)
    deposit_amount = models.CharField(max_length=255, null=False)
    deposit_period = models.CharField(max_length=255, null=False)
    monthly_rentals = models.CharField(max_length=255, null=False)
    rent_variables = models.BooleanField(
        default=False
    )  # Extra costs needed for a particular rental
    currency = models.CharField(max_length=10, default="USD", choices=CURRENCY_CHOICES)
    status = models.CharField(max_length=255, default="SAFE", choices=STATUS_CHOICES)
    status_cache = models.CharField(
        max_length=255, default="SAFE", choices=STATUS_CHOICES
    )
    account_number = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    start_date = models.DateField(max_length=255, null=True, blank=True)
    end_date = models.DateField(max_length=255, null=True, blank=True)
    created_date = models.DateField(auto_now_add=True)
    termination_date = models.DateField(max_length=255, null=True, blank=True,default=date.today)
    is_government = models.BooleanField(default=False)  # is government lease
    date_updated = models.DateTimeField(auto_now=True)
    leasee_mobile = models.CharField(max_length=255, blank=True, null=True)
    lease_period = models.IntegerField(null=True, default=0)
    subscription = models.IntegerField(null=True, default=0)  # fk subscription
    payment_period_start = models.CharField(max_length=255, null=False)
    payment_period_end = models.CharField(max_length=255, null=False, default=7)
    is_active = models.BooleanField(default=True)
    landlord_id = models.IntegerField(null=True, blank=True)
    #history = HistoricalRecords()
    

    def __str__(self) -> str:
        return str(self.lease_id)


class Services(models.Model):
    SERVICE_NAMES = [
        ("RentSafe", "RentSafe"),
        ("BIU", "BIU"),
    ]
    service_name = models.CharField(max_length=10, choices=SERVICE_NAMES)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)

    def __str__(self) -> str:
        return self.service_name


class SubcsriptionPeriod(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, null=True, blank=True)
    period_length = models.CharField(max_length=255, null=True, blank=True)


class Subcsriptions(models.Model):
    SUB_CLASS = [
        ("individual", "individual"),
        ("company", "company"),
        ("combined", "combined"),
    ]
    CURRENCY = [
        ("USD", "USD"),
        ("ZWG", "ZWG"),
    ]

    PAYMENT_METHOD = [
        ("CASH USD", "CASH USD"),
        ("SWIPE USD", "SWIPE USD"),
        ("SWIPE ZWG", "SWIPE ZWG"),
        ("BANK TRF USD", "BANK TRF USD"),
        ("BANK TRF ZWG", "BANK TRF ZWG"),
        ("ECOCASH USD", "ECOCASH USD"),
        ("ECOCASH ZWG", "ECOCASH ZWG"),
    ]
    service_id = models.CharField(max_length=255)
    subscriber_id = models.CharField(max_length=255, default=0)  # Subscriber ID
    is_activated = models.BooleanField(default=True)
    start_date = models.DateTimeField(max_length=255, null=True, blank=True)
    end_date = models.DateTimeField(max_length=255, null=True, blank=True)
    subscription_class = models.CharField(max_length=10, choices=SUB_CLASS)
    created_date = models.DateTimeField(default=datetime.now)
    date_updated = models.DateTimeField(auto_now=True)
    period = models.CharField(max_length=255)  # SubcsriptionPeriod ID
    number_of_subscriptions = models.CharField(max_length=255)
    currency = models.CharField(max_length=10, choices=CURRENCY)
    payment_method = models.CharField(max_length=100, choices=PAYMENT_METHOD)
    total_amount = models.CharField(max_length=255)
    monthly_amount = models.CharField(max_length=255)

    class meta:
        db_table = "subscriptions"

    def __str__(self) -> str:
        return str(self.id)


def get_default_time():
    current_time = timezone.now()
    default_time = current_time + timedelta(minutes=5)
    return default_time


class OTP(models.Model):
    REQUESTED_USER_TYPE = [
        ("individual", "individual"),
        ("company", "company"),
    ]
    otp_code = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=20)
    request_user = models.CharField(max_length=255)
    requested_user = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)
    requested_user_type = models.CharField(
        max_length=100, choices=REQUESTED_USER_TYPE, default="individual"
    )
    expire_at = models.DateTimeField(default=get_default_time)
    def __str__(self):
        return self.otp_code


class Receipt(models.Model):
    lease_id = models.CharField(max_length=255)
    date = models.CharField(max_length=255)
    payment_id = models.CharField(max_length=255)  # FK to leasepayments
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.lease_id
class LeasePayments(models.Model):
    lease_id = models.CharField(max_length=255)  # FK to lease table
    payment_amount = models.CharField(max_length=255)
    date = models.CharField(max_length=255)
    month = models.CharField(max_length=255)
    payment_reference = models.CharField(max_length=255)
    owing_amount = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    balance_amount = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_balance_checked = models.BooleanField(default=False)

    def __str__(self):
        return self.lease_id
class LeaseReceiptBreakdown(models.Model):
    landlord_id = models.CharField(max_length=255)
    lease_id = models.CharField(max_length=255)
    receipt_number = models.CharField(max_length=255, default="Rcpt")
    total_amount = models.FloatField(default=0)
    base_amount = models.FloatField(default=0)
    date_received = models.DateField(default=date.today)
    commission = models.FloatField(default=0)
    operating_costs = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    amount_paid = models.FloatField(default=0)

    def __str__(self) -> str:
        return f"LeaseReceiptBreakdown(lease_id={self.lease_id}, total_amount={self.total_amount}, base_amount={self.base_amount}, commission={self.commission}, operating_costs={self.operating_costs})"

# Rental payment receipted
class Enquiries(models.Model):
    enquirer = models.CharField(max_length=255)  # enquirer user id
    enquiry_company_id = models.CharField(max_length=255)  # enquiry company id
    individual_company_id = models.CharField(
        max_length=255
    )  # id for individual or company enquired
    date_of_enquiry = models.DateField(auto_now=True)
    is_company_searched = models.BooleanField(default=False)
    is_individual_searched = models.BooleanField(default=False)

    def __str__(self):
        return self.enquirer

class Special_pricing(models.Model):
    service_name = models.CharField(max_length=255)
    individual_charge = models.CharField(max_length=255)
    company_charge = models.CharField(max_length=255)
    currency_type = models.CharField(max_length=255)
    client_customer = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.service_name

class Standard_pricing(models.Model):
    service_name = models.CharField(max_length=255)
    individual_charge = models.CharField(max_length=255)
    company_charge = models.CharField(max_length=255)
    currency_type = models.CharField(max_length=255)
    current_rate = models.CharField(max_length=255, default="0")
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.service_name

class LeaseCurrencyRate(models.Model):
    company_id = models.CharField(max_length=255)  # FK to company table
    current_rate = models.FloatField(max_length=255, default=0)
    base_currency = models.CharField(max_length=255,default="USD")
    currency = models.CharField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Company {self.company_id} Latest Rate {self.current_rate}"
class Subscription_charge_pricing(models.Model):

    individual_monthly_charge = models.CharField(max_length=255)
    company_monthly_charge = models.CharField(max_length=255)
    currency_type = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.individual_monthly_charge
class Opening_balance(models.Model):
    lease_id = models.CharField(max_length=255)  # FK to lease table
    current_month = models.CharField(max_length=255, default=0, null=True)
    one_month_back = models.CharField(max_length=255, default=0, null=True)
    two_months_back = models.CharField(max_length=255, null=True)
    three_months_back = models.CharField(max_length=255, default=0, null=True)
    three_months_plus = models.FloatField(max_length=255, default=0, null=True)
    outstanding_balance = models.CharField(max_length=255, default=0, null=True)
    date_updated = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)
    #history = HistoricalRecords()
    

    def __str__(self):
        return self.lease_id
class ActiveCredit(models.Model):  # loans and payments
    date_time = models.DateTimeField(auto_now=True)
    dr_company = models.CharField(null=True, blank=True, max_length=255)
    cr_company = models.CharField(null=True, blank=True, max_length=255)
    dr_individual = models.CharField(null=True, blank=True, max_length=255)
    cr_individual = models.CharField(null=True, blank=True, max_length=255)
    due_date = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    deposit_amount = models.DecimalField(max_digits=200, decimal_places=2, default=0)
    deposit_period = models.DecimalField(max_digits=200, decimal_places=2, default=0)
    monthly_rental = models.DecimalField(max_digits=200, decimal_places=2, default=0)
    details = models.TextField(null=True, blank=True)
    amount = models.DecimalField(max_digits=200, decimal_places=2)
    balance = models.DecimalField(max_digits=200, decimal_places=2)
    status = models.CharField(
        max_length=255, default="Not Payed"
    )  # paid ... or not by defaulte
    payment_period_start = models.CharField(max_length=255, default="25")
    payment_period_end = models.CharField(max_length=255, default="10")
    payment_date = models.DateTimeField(null=True, blank=True)
    type = models.CharField(max_length=255)  # rent/Lease , loan , ......etc

    class Meta:
        db_table = "active_credit"

class Invoicing(models.Model):
    lease_id = models.CharField(max_length=255)  # FK to lease
    description = models.CharField(max_length=255)
    ref = models.CharField(max_length=255, default="INV-0000")
    operation_costs = models.FloatField(default=0)
    amount = models.FloatField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_invoiced = models.BooleanField(default=False)
    account_number = models.CharField(max_length=255, null=True, blank=True)
    invoice_number = models.CharField(max_length=255, null=True, blank=True, default="0")
    #history = HistoricalRecords()

class PaymentPlan(models.Model):
    client_id = models.CharField(max_length=255, null=True, blank=True)
    lease_id = models.CharField(max_length=200, null=True, blank=True)
    user = models.CharField(max_length=255, null=True, blank=True)
    user_id = models.CharField(max_length=255)
    spoke_with = models.CharField(max_length=255, null=True, blank=True)
    expected_pay_date = models.DateField()
    amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_creditor = models.BooleanField(default=False)
    status = models.CharField(max_length=255, blank=True, null=True,default="PENDING")
    

    def __str__(self):
        return f"PayementPlan(payment_plan_id={self.id}, client_id={self.client_id}, user_id={self.user_id}, spoke_with={self.spoke_with}, expected_pay_date={self.expected_pay_date}, amount={self.amount}, created_at={self.created_at}, updated_at={self.updated_at})"

    def __repr__(self):
        return self.__str__()

class DebtorIntelligenceNote(models.Model):
    user_id = models.CharField(max_length=255)
    user = models.CharField(max_length=255, null=True, blank=True)
    client_id = models.CharField(max_length=255)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.lease_id

class CommunicationHistoryReminderType(str, Enum):
    # PAYMENT_PLAN = "PAYMENT_PLAN"
    SMS = "SMS"
    EMAIL = "EMAIL"
    NOTE = "NOTE"
    REMINDER="REMINDER"

class CommunicationHistoryReminder(models.Model):
    user_id = models.CharField(max_length=255)
    user = models.CharField(max_length=255, null=True, blank=True)
    client_id = models.CharField(max_length=255)
    message = models.TextField()
    is_sms = models.BooleanField(default=False)
    is_email = models.BooleanField(default=False)
    action_date = models.DateField(null=True, default=None)
    message_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_creditor= models.BooleanField(default=False)

    def __str__(self):
        return f"Reminder(user_id={self.user_id}, action_date={self.action_date})"

    def __repr__(self):
        return self.__str__()
class CommsHistMessage(models.Model):
    user_id = models.CharField(max_length=255)
    user = models.CharField(max_length=255, null=True, blank=True)
    client_id = models.CharField(max_length=255)
    message = models.TextField()
    is_sms = models.BooleanField(default=False)
    is_email = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_creditor= models.BooleanField(default=False)

    def __str__(self):
        return f"Reminder(user_id={self.user_id}, created_at={self.created_at})"

    def __repr__(self):
        return self.__str__()

class Currency(str, Enum):
    USD = "USD"
    ZWL = "ZWL"
    ZAR = "ZAR"

class ClaimDebtorType(str, Enum):
    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"

class Claim(models.Model):
    creditor_id = models.CharField(max_length=255)
    data_source = models.CharField(max_length=255)
    debtor_id = models.CharField(max_length=255)
    is_individual = models.BooleanField(default=False)
    is_company = models.BooleanField(default=False)
    account_number = models.CharField(max_length=255)
    currency = models.CharField(max_length=255)
    amount = models.FloatField()
    date = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class LandLordType(str, Enum):
    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"

class Landlord(models.Model):
    user_id = models.CharField(max_length=255)
    lease_id = models.CharField(max_length=255)
    landlord_id = models.CharField(max_length=255)
    is_individual = models.BooleanField(default=False)
    is_company = models.BooleanField(default=False)
    landlord_name = models.CharField(max_length=255)
    opening_balance = models.FloatField(null=True, blank=True,default=0)
    reg_ID_Number = models.CharField(max_length=255)
    agent_commission = models.FloatField(null=True, blank=True,default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Disbursement(models.Model):
    user_id = models.CharField(max_length=255)
    user = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()
    creditor_id = models.CharField(max_length=255)
    ref = models.CharField(max_length=255)
    details = models.TextField()
    amount_paid = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class WorkSchedule(models.Model):
    user_id = models.CharField(max_length=255, blank=True, null=True)
    company_id = models.CharField(max_length=255, blank=True, null=True)
    property = models.CharField(max_length=255, blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    title=models.CharField(max_length=255, blank=True, null=True)
    tradesman = models.CharField(max_length=255, blank=True, null=True)
    contractor = models.CharField(max_length=255, blank=True, null=True)
    required_materials = models.TextField(blank=True, null=True)
    budget = models.FloatField(blank=True, null=True)
    responsible_person = models.CharField(max_length=255, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    scheduled_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tenant_landlord = models.CharField(max_length=250, null=True, blank=True)
    lease_id = models.CharField(max_length=255, blank=True, null=True)
    is_creditor = models.BooleanField(default=False)
    status = models.CharField(max_length=255, blank=True, null=True,default="PENDING")
    
class MaintenanceSchedule(models.Model):
    user_id = models.CharField(max_length=255, blank=True, null=True)
    company_id = models.CharField(max_length=255, blank=True, null=True)
    property = models.CharField(max_length=255, blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    title=models.CharField(max_length=255, blank=True, null=True)
    tradesman = models.CharField(max_length=255, blank=True, null=True)
    contractor = models.CharField(max_length=255, blank=True, null=True)
    required_materials = models.TextField(blank=True, null=True)
    budget = models.FloatField(blank=True, null=True)
    responsible_person = models.CharField(max_length=255, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    frequency = models.CharField(max_length=255, blank=True, null=True)
    scheduled_day = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tenant_landlord = models.CharField(max_length=255, null=True, blank=True)    
    month_frequency =models.IntegerField(null=True, blank=True)
    lease_id = models.CharField(max_length=255, blank=True, null=True)
    is_creditor = models.BooleanField(default=False)
    status = models.CharField(max_length=255, blank=True, null=True,default="PENDING")