"""
Serializers for the rentsafe app.
"""

import re

from django.utils import timezone
from marshmallow import EXCLUDE, Schema, ValidationError, fields, validate,pre_load,post_load

from authentication.models import CustomUser
from authentication.serializers import *
from rentsafe.models import *
from rentsafe.validators import validate_national_id


def validate_otp(value):
    if value.isdigit() and len(value) == 4:
        check_otp = OTP.objects.filter(otp_code=value).first()
        if check_otp:
            if check_otp.expire_at < timezone.now():
                check_otp.delete()
                raise ValidationError("The verification code has expired")
            else:
                pass
        else:
            raise ValidationError("Wrong otp code.")

    else:
        raise ValidationError("Invalid OTP")


def validate_mobile_number(mobile):
    mobile_regex = r"^263\d{9}$"
    if not re.match(mobile_regex, mobile):
        raise ValidationError(
            "Invalid Mobile Number Format!, mobile must be 2637XXXXXXXX"
        )
    else:
        pass



def validate_subscription(subscription_field_value):
    if subscription_field_value == "" or subscription_field_value is None:
        raise ValidationError("Required!")


# Validating companies


def validate_company_reg_number(registration_number):
    if registration_number == "" or registration_number is None:
        raise ValidationError("Please Enter Company Reg Number!")
    check_company = Company.objects.filter(
        registration_number=registration_number
    ).first()
    if check_company:
        raise ValidationError("This Company Reg Number Already Exist!")
    else:
        pass


def validate_special_priced_client(client):
    if client == "" or client is None:
        raise ValidationError("Please Select a client")
    check_client = Special_pricing.objects.filter(client_customer=client).first()
    if check_client:
        raise ValidationError("This Client Already Exist!")
    else:
        pass


def validate_company_reg_name(registration_name):
    if registration_name == "" or registration_name is None:
        raise ValidationError("Please Enter Company Name!")
    check_company = Company.objects.filter(registration_name=registration_name).first()
    if check_company:
        raise ValidationError("This Company Name Already Exist!")
    else:
        pass


def validate_individual_nationalID(national_id: str) -> None:
    # if validate_national_id(national_id):
    #     pass
    # else:
    #     raise ValidationError("Invalid National ID!")

    check_individual = Individual.objects.filter(
        identification_number=national_id.upper()
    ).first()
    if check_individual:
        raise ValidationError("This National ID Already Exist!")
    else:
        pass


def validate_individual_email(email):
    if email != "":
        check_individual = Individual.objects.filter(email=email).first()
        if check_individual:
            raise ValidationError("This Email Already Exist!")
    else:
        pass
    

def validated_date(date):
    incoming_date = datetime.strptime(date, "%Y-%m-%d")
    if incoming_date < datetime.now():
        raise ValidationError("End date cannot be in the past")
    elif incoming_date == datetime.now():
        raise ValidationError("End date cannot be today")
    else:
        pass


def validate_company_email(email):
    if email != "":
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if re.match(pattern, email):
            # check_individual = CompanyProfile.objects.filter(email=email).first()
            # existing_user_email = CustomUser.objects.filter(email=email).first()
            # if check_individual:
            #     raise ValidationError("This Email Already Exist!")
            # elif existing_user_email:
            #     raise ValidationError("A user with this email already exists")
            # else:
            #     pass
            pass
        else:
            raise ValidationError("Invalid Email Address")
    else:
        raise ValidationError("Please Enter Email Address")


def validate_deposit_amount(value):
    if isinstance(value, (str, int, float)):
        return True
    else:
        raise ValidationError("deposit_amount must be a string or a number.")

def validate_user_email(email):
    if email != "":
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if re.match(pattern, email):
            check_individual = CustomUser.objects.filter(email=email).first()
            if check_individual:
                raise ValidationError("This Email Already Exist!")
            else:
                pass
        else:
            raise ValidationError("Invalid Email Address")
    else:
        raise ValidationError("Please Enter Email Address")


# from . import models
class OTPSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.
    Used for validating and serializing data related to a search operation.
    """

    otp = fields.Str(data_key="otp", required=True, validate=validate_otp)
    verification_type = fields.Str(data_key="verification_type")


class CreateAccountSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.
    Used for validating and serializing data related to a search operation.
    """

    username = fields.Str(
        data_key="username",
        required=True,
    )
    password = fields.Str(
        data_key="password", required=True, validate=validate.Length(min=6)
    )
    confirmPassword = fields.Str(data_key="confirmPassword")


# from . import models
class SearchSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.
    Used for validating and serializing data related to a search operation.
    """

    searchParam = fields.Str(
        data_key="searchParam", required=True, validate=validate.Length(min=3)
    )
    """
    A string field that represents the search parameter. 
    It is required and must have a minimum length of 3 characters.
    """

    searchValue = fields.Str(
        data_key="searchValue", required=True, validate=validate.Length(min=1)
    )
    """
    A string field that represents the search value. 
    It is required and must have a minimum length of 1 character.
    """


class FileSerializer(Schema):
    """
    A schema for serializing and deserializing file data.

    Fields:
    - file: A field of type Raw that represents the file data. It is marked as dump_only=True, meaning it is only used for serialization and not for deserialization.
    """

    file = fields.Raw(dump_only=True)


class CreateIndividualSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.
    Used to validate and serialize data for creating individual records.
    """

    firstname = fields.Str(
        data_key="firstName", required=True, validate=validate.Length(min=1)
    )
    surname = fields.Str(
        data_key="lastName", required=True, validate=validate.Length(min=1)
    )
    identificationNumber = fields.Str(
        data_key="identificationNumber",
        required=True,
        validate=validate_individual_nationalID,
    )

    dob = fields.Str(data_key="dob", required=False)
    gender = fields.Str(data_key="gender", required=False)
    mobile = fields.Str(
        data_key="mobileNumber", required=True, validate=validate_mobile_number
    )
    address = fields.Str(
        data_key="address", required=False, validate=validate.Length(min=0)
    )
    identification_type = fields.Str(
        data_key="identificationType", required=True, validate=validate.Length(min=5)
    )
    email = fields.Str(
        data_key="emailAddress", required=False, validate=validate_individual_email
    )
    marital_status = fields.Str(data_key="maritalStatus", required=False)
    employer_name = fields.Str(data_key="currentEmployer", required=False)
    job_title = fields.Str(data_key="jobTitle", required=False)
    land_line = fields.Str(data_key="landLine", required=False)
    date_of_employment = fields.Str(data_key="dateOfemployment", required=False)
    individual_id = fields.Int(data_key="individualId", required=False)
    
    # Address validation
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    suburb = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))
    

    
class IndividualSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.

    This class defines the structure and validation rules for individual data.
    """

    id = fields.Str(required=True)
    firstname = fields.Str(required=True)
    surname = fields.Str(required=True)
    identification_number = fields.Str(required=True)

    def __init__(self, *args, **kwargs):
        """
        Initialize the IndividualSchema class.

        Parameters:
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.
        """
        super().__init__(*args, **kwargs)


class AgentSchema(Schema):
    """
    A schema definition using the Marshmallow library in Python.

    This class defines the structure and validation rules for individual data.
    """

    id = fields.Str(required=True)
    firstname = fields.Str(required=True)
    surname = fields.Str(required=True)
    identification_number = fields.Str(required=True)
    national_id = fields.Str(required=True)
    mobile = fields.Str(required=True)
    landline = fields.Str(required=True)
    email = fields.Str(required=True)
    address = fields.Str(required=True)
    identification_type = fields.Str(required=True)
    identification_number = fields.Str(required=True)
    dob = fields.Str(required=True)
    gender = fields.Str(required=True)
    date_of_employment = fields.Str(required=True)
    employer_name = fields.Str(required=True)
    job_title = fields.Str(required=True)
    is_agent = fields.Bool(required=True)
    
    def __init__(self, *args, **kwargs):
        """
        Initialize the IndividualSchema class.

        Parameters:
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.
        """
        super().__init__(*args, **kwargs)


class CompanySchema(Schema):
    """
    A schema definition for a company object using the Marshmallow library in Python.

    Fields:
    - id: An integer field that represents the ID of the company.
    - registration_number: A string field that represents the registration number of the company.
    - registration_name: A string field that represents the registration name of the company.
    """

    id = fields.Int()
    registration_number = fields.Str()
    registration_name = fields.Str()
    branch = fields.Str()
    trading_name = fields.Str()


class IndividualSchema(Schema):
    id = fields.Int()
    firstname = fields.Str()
    surname = fields.Str()
    national_id = fields.Str()


class IndividualAddressSchema(Schema):
    id = fields.Int()
    firstname = fields.Str()
    surname = fields.Str()
    national_id = fields.Str()
    address = fields.Str()


class ServiceSchema(Schema):
    id = fields.Int()
    service_name = fields.Str()


class SubcsriptionPeriodSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    code = fields.Str()
    period_length = fields.Str()


class CreateCompanySchema(Schema):
    """
    Schema definition for creating a company.

    Fields:
    - registeredName: The registered name of the company. Required, minimum length of 3 characters.
    - tradingName: The trading name of the company. Required, minimum length of 3 characters.
    - companyRegistrationNumber: The registration number of the company.
    Required, minimum length of 3 characters.validate_company_reg_number
    - registrationDate: The registration date of the company. Required.
    - vatNumber: The VAT number of the company. Required.
    - currentAddress: The current address of the company. Required, minimum length of 3 characters.
    - landLine: The landline number of the company. Required.
    - mobileNumber: The mobile number of the company. Required, minimum length of 3 characters.
    - emailAddress: The email address of the company. Required, minimum length of 3 characters.
    - website: The website of the company. Required.
    - industry: The industry of the company. Required.
    - note: A note about the company. Required.
    """

    registeredName = fields.Str(
        data_key="registeredName", required=True, validate=validate_company_reg_name
    )

    tradingName = fields.Str(
        data_key="tradingName", required=True, validate=validate.Length(min=3)
    )
    branch = fields.Str(data_key="branch", required=False)
    companyRegistrationNumber = fields.Str(
        data_key="companyRegistrationNumber",
        required=False,
        # validate=validate_company_reg_number,
    )

    registrationDate = fields.Str(data_key="registrationDate", required=False)
    vatNumber = fields.Str(data_key="vatNumber", required=False)
    currentAddress = fields.Str(data_key="currentAddress", required=False)
    landLine = fields.Str(data_key="landLine", required=False)
    mobileNumber = fields.Str(
        data_key="mobileNumber", required=False, validate=validate.Length(max=15)
    )
    emailAddress = fields.Str(
        data_key="emailAddress", required=True, validate=validate_company_email
    )
    website = fields.Str(data_key="website", required=False)
    industry = fields.Str(data_key="industry", required=False)
    is_contracted = fields.Bool(data_key="is_contracted", required=False)
    is_gvt = fields.Bool(data_key="is_gvt", required=False)
    note = fields.Str(data_key="note", required=False)
    companyId = fields.Str(data_key="company_id", required=False)
    pageType = fields.Str(data_key="pageType", required=False)
    tin_number = fields.Str(data_key="tinNumber", required=False)
    
    # Address validation
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    suburb = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))


# Add-Lease
class CreateIndividualLeaseSchema(Schema):
    identificationNumber = fields.Str(
        data_key="identificationNumber", required=True, validate=validate.Length(min=3)
    )
    lesseeName = fields.Str(
        data_key="lesseeName", required=True, validate=validate.Length(min=3)
    )
    monthlyRental = fields.Float(data_key="monthlyRental", required=True)
    paymentPeriodStart = fields.Str(
        data_key="paymentPeriodStart",
        required=True,
    )
    paymentPeriodEnd = fields.Str(
        data_key="paymentPeriodEnd",
        required=True,
    )
    leaseStartDate = fields.Str(data_key="leaseStartDate", required=True)

    # lesseeAddress = fields.Str(
    #     data_key="lesseeAddress", required=False, validate=validate.Length(min=0)
    # )
    leaseEndDate = fields.Str(data_key="leaseEndDate", required=True, validate=validated_date)
    lesseePhone = fields.Str(
        data_key="lesseePhone",
        required=True,
    )

    depositPeriod = fields.Int(data_key="depositPeriod", required=True)
    leaseCurrency = fields.Str(data_key="leaseCurrency", required=True)
    depositAmount = fields.Field(
        data_key="depositAmount",
        required=True,
        allow_none=True,
        validate=validate_deposit_amount,
    )
    leaseDetails = fields.Str(data_key="leaseDetails", required=True)
    leasePeriod = fields.Int(data_key="leasePeriod", required=True)
    isCompany = fields.Bool(data_key="isCompany", required=False)
    rentVariable = fields.Bool(data_key="rentVariable", required=False)
    leaseId = fields.Int(data_key="leaseId", required=False)
    monthOneBalance = fields.Float(
        data_key="monthOneBalance", required=False, default=0
    )
    monthTwoBalance = fields.Float(
        data_key="monthTwoBalance", required=False, default=0
    )
    monthThreeBalance = fields.Float(
        data_key="monthThreeBalance", required=False, default=0
    )
    moreThanThreeMonthsBalance = fields.Float(
        data_key="moreThanThreeMonthsBalance", required=False, default=0
    )
    currentBalance = fields.Float(data_key="currentBalance", required=False, default=0)
    outStandingBalance = fields.Float(
        data_key="outStandingBalance", required=False, default=0
    )
    monthOneDate = fields.Date(data_key="monthOneDate", required=False)
    monthTwoDate = fields.Date(data_key="monthTwoDate", required=False)
    monthThreeDate = fields.Date(data_key="monthThreeDate", required=False)
    currentDate = fields.Date(data_key="currentDate", required=False)
    rentGuarantorId = fields.Str(data_key="rentGuarantorId", required=False)
    rentGuarantorIdType = fields.Str(data_key="rentGuarantorIdType", required=False)
    rentGuarantorName = fields.Str(data_key="rentGuarantorName", required=False)

    # landlord schema
    landlordName = fields.Str(data_key="landlordName", required=False)
    landlordType = fields.Str(
        data_key="landlordType",
        required=False,
        validate=validate.OneOf([t.value for t in LandLordType]),
    )
    commission = fields.Float(data_key="commission", required=False)
    regIdNumber = fields.Str(data_key="regIdNumber", required=False)
    openingBalance = fields.Float(data_key="openingBalance", required=False)

    # Address validation
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    suburb = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))


class CreateCompanyLeaseSchema(Schema):
    identificationNumber = fields.Str(data_key="identificationNumber", required=False)
    lesseeName = fields.Str(
        data_key="lesseeName", required=True, validate=validate.Length(min=3)
    )
    monthlyRental = fields.Float(data_key="monthlyRental", required=True)
    paymentPeriodStart = fields.Str(
        data_key="paymentPeriodStart",
        required=True,
    )
    paymentPeriodEnd = fields.Str(
        data_key="paymentPeriodEnd",
        required=True,
    )
    leaseStartDate = fields.Str(data_key="leaseStartDate", required=True)

    # lesseeAddress = fields.Str(
    #     data_key="lesseeAddress", required=False
    # )
    leaseEndDate = fields.Str(data_key="leaseEndDate", required=True,validate=validated_date)
    mobile = fields.Str(data_key="mobile", required=False)
    email = fields.Email(
        data_key="email", required=True, validate=validate.Length(min=3)
    )
    contactEmail = fields.Str(data_key="contactEmail", required=False)
    rentGuarantorId = fields.Str(data_key="rentGuarantorId", required=False)
    rentGuarantorIdType = fields.Str(data_key="rentGuarantorIdType", required=False)
    rentGuarantorName = fields.Str(data_key="rentGuarantorName", required=False)
    depositPeriod = fields.Int(data_key="depositPeriod", required=True)
    leaseCurrency = fields.Str(data_key="leaseCurrency", required=True)
    depositAmount = fields.Field(
        data_key="depositAmount",
        required=True,
        allow_none=True,
        validate=validate_deposit_amount,
    )
    leaseDetails = fields.Str(data_key="leaseDetails", required=True)
    leasePeriod = fields.Int(data_key="leasePeriod", required=True)
    isCompany = fields.Bool(data_key="isCompany", required=False)
    isGovernment = fields.Bool(data_key="isGovernment", required=False)
    rentVariable = fields.Bool(data_key="rentVariable", required=False)
    leaseId = fields.Int(data_key="leaseId", required=False)
    monthOneBalance = fields.Float(
        data_key="monthOneBalance", required=False, default=0
    )
    monthTwoBalance = fields.Float(
        data_key="monthTwoBalance", required=False, default=0
    )
    monthThreeBalance = fields.Float(
        data_key="monthThreeBalance", required=False, default=0
    )
    moreThanThreeMonthsBalance = fields.Float(
        data_key="moreThanThreeMonthsBalance", required=False, default=0
    )
    currentBalance = fields.Float(data_key="currentBalance", required=False, default=0)
    outStandingBalance = fields.Float(
        data_key="outStandingBalance", required=False, default=0
    )
    monthOneDate = fields.Date(data_key="monthOneDate", required=False)
    monthTwoDate = fields.Date(data_key="monthTwoDate", required=False)
    monthThreeDate = fields.Date(data_key="monthThreeDate", required=False)
    currentDate = fields.Date(data_key="currentDate", required=False)

    # landlord schema
    landlordName = fields.Str(data_key="landlordName", required=False)
    landlordType = fields.Str(
        data_key="landlordType",
        required=False,
        validate=validate.OneOf([t.value for t in LandLordType]),
    )
    commission = fields.Float(data_key="commission", required=False)
    regIdNumber = fields.Str(data_key="regIdNumber", required=False)
    openingBalance = fields.Float(data_key="openingBalance", required=False)
    accountNumber = fields.Str(data_key="accountNumber", required=False)
    
    # Address validation
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    suburb = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))


def validate_email(value):
    # Check if the email already exists in the database
    email_exists = "false"
    if value:
        user = CustomUser.objects.filter(email=value).first()
        if user:
            email_exists = "true"
            raise ValidationError("User with this email address already exists")
        else:
            email_regex = r"^[\w]+@[a-zA-Z0-9]+\.[a-zA-Z]+[a-zA-Z]$"
            if not re.match(email_regex, value):
                email_exists = "invalid"
                print(value)
                raise ValidationError("Invalid email format")
            else:
                email_exists = "valid"
        return email_exists
    else:
        pass


# Add-user
class CreateUserSchema(Schema):
    userId = fields.Int(data_key="userId", required=False)
    identificationNumber = fields.Str(
        data_key="identificationNumber",
        required=True,
        validate=validate.Length(min=4),
    )
    identificationType = fields.Str(
        data_key="identificationType", required=True, validate=validate.Length(min=3)
    )
    firstName = fields.Str(
        data_key="firstName", required=True, validate=validate.Length(min=3)
    )
    lastName = fields.Str(data_key="lastName", required=True)
    userEmail = fields.Email(
        data_key="userEmail", required=True, validate=validate_user_email
    )
    mobileNumber = fields.Str(
        data_key="mobileNumber", required=True, validate=validate_mobile_number
    )
    address = fields.Str(data_key="address", required=True)

    accessLevel = fields.Str(
        data_key="accessLevel", required=True, validate=validate.Length(min=3)
    )


class UpdateUserSchema(Schema):
    userId = fields.Int(data_key="userId", required=True)
    identificationNumber = fields.Str(
        data_key="identificationNumber", required=True, validate=validate.Length(min=3)
    )
    identificationType = fields.Str(
        data_key="identificationType", required=True, validate=validate.Length(min=3)
    )
    firstName = fields.Str(
        data_key="firstName", required=True, validate=validate.Length(min=3)
    )
    lastName = fields.Str(data_key="lastName", required=True)
    userEmail = fields.Email(data_key="userEmail", required=True)
    mobileNumber = fields.Str(
        data_key="mobileNumber", required=True, validate=validate_mobile_number
    )
    address = fields.Str(data_key="address", required=True)

    accessLevel = fields.Str(
        data_key="accessLevel", required=True, validate=validate.Length(min=3)
    )


class CreateAgentSchema(Schema):
    identificationNumber = fields.Str(
        data_key="identificationNumber",
        required=True,
        validate=validate_individual_nationalID,
    )
    identificationType = fields.Str(
        data_key="identificationType", required=True, validate=validate.Length(min=3)
    )
    firstName = fields.Str(
        data_key="firstName", required=True, validate=validate.Length(min=3)
    )
    lastName = fields.Str(data_key="lastName", required=True)
    userEmail = fields.Str(
        data_key="emailAddress", required=False, validate=validate_email
    )
    mobileNumber = fields.Str(
        data_key="mobileNumber", required=True, validate=validate_mobile_number
    )
    address = fields.Str(data_key="address", required=False)
    maritalStatus = fields.Str(data_key="maritalStatus", required=False)
    landline = fields.Str(data_key="landLine", required=False)
    dateOfBirth = fields.Str(data_key="dob", required=False)
    gender = fields.Str(data_key="gender", required=False)
    currentEmployer = fields.Str(data_key="currentEmployer", required=False)
    currentJobTitle = fields.Str(data_key="jobTitle", required=False)
    dateOfEmployment = fields.Str(data_key="dateOfemployment", required=False)
    individualId = fields.Int(data_key="individualId", required=False)
    isAgent = fields.Boolean(data_key="isAgent", required=False)
    
    # Address validation
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    suburb = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))



class UpdateAgentSchema(Schema):
    identificationNumber = fields.Str(
        data_key="identificationNumber", required=True, validate=validate.Length(min=3)
    )
    identificationType = fields.Str(
        data_key="identificationType", required=True, validate=validate.Length(min=3)
    )
    firstName = fields.Str(
        data_key="firstName", required=True, validate=validate.Length(min=3)
    )
    lastName = fields.Str(data_key="lastName", required=True)
    userEmail = fields.Email(
        data_key="emailAddress", required=False, validate=validate_email
    )
    mobileNumber = fields.Str(
        data_key="mobileNumber", required=True, validate=validate_mobile_number
    )
    address = fields.Str(data_key="address", required=False)
    maritalStatus = fields.Str(data_key="maritalStatus", required=False)
    landline = fields.Str(data_key="landLine", required=False)
    dateOfBirth = fields.Str(data_key="dob", required=False)
    gender = fields.Str(data_key="gender", required=False)
    currentEmployer = fields.Str(data_key="currentEmployer", required=False)
    currentJobTitle = fields.Str(data_key="jobTitle", required=False)
    dateOfEmployment = fields.Str(data_key="dateOfemployment", required=False)
    individualId = fields.Int(data_key="individualId", required=False)


def isExistUser(value):
    user = CustomUser.objects.filter(id=int(value)).first()
    if user:
        pass
    else:
        raise ValidationError("User not found")


class CheckUserSchema(Schema):
    userId = fields.Int(data_key="userId", required=True, validate=isExistUser)


class GetUserSchema(Schema):
    identificationNumber = fields.Str(data_key="identificationNumber", required=True)
    lesseeName = fields.Str(data_key="lesseeName", required=False)
    # lesseeAddress = fields.Str(data_key="lesseeAddress", required=False)
    lesseePhone = fields.Str(data_key="lesseePhone", required=False)
    leaseDetails = fields.Str(data_key="leaseDetails", required=False)
    leaseStartDate = fields.Str(data_key="leaseStartDate", required=False)
    leaseEndDate = fields.Str(data_key="leaseEndDate", required=False)
    leaseCurrency = fields.Str(data_key="leaseCurrency", required=False)
    depositAmount = fields.Int(data_key="depositAmount", required=False)
    depositPeriod = fields.Int(data_key="depositPeriod", required=False)
    monthlyRental = fields.Int(data_key="monthlyRental", required=False)
    rentVariable = fields.Bool(data_key="rentVariable", required=False)
    paymentPeriodStart = fields.Str(data_key="paymentPeriodStart", required=False)
    paymentPeriodEnd = fields.Str(data_key="paymentPeriodEnd", required=False)
    leasePeriod = fields.Int(data_key="leasePeriod", required=False)
    leaseId = fields.Int(data_key="leaseId", required=False)
    isCompany = fields.Bool(data_key="isCompany", required=False)
    currentBalance = fields.Str(data_key="currentBalance", required=False)
    rentGuarantorId = fields.Str(data_key="rentGuarantorId", required=False)
    rentGuarantorIdType = fields.Str(data_key="rentGuarantorIdType", required=False)
    rentGuarantorName = fields.Str(data_key="rentGuarantorName", required=False)
    monthOneBalance = fields.Str(data_key="monthOneBalance", required=False)
    monthTwoBalance = fields.Str(data_key="monthTwoBalance", required=False)
    monthThreeBalance = fields.Str(data_key="monthThreeBalance", required=False)
    moreThanThreeMonthsBalance = fields.Str(
        data_key="moreThanThreeMonthsBalance", required=False
    )
    outStandingBalance = fields.Str(data_key="outStandingBalance", required=False)


class GetCompanySchema(Schema):
    # identificationNumber = fields.Str(
    #     data_key="identificationNumber", required=False #validate=validate.Length(min=3)
    # )
    identificationNumber = fields.Str(
        data_key="identificationNumber",
        required=False,  # validate=validate.Length(min=3)
    )
    lesseeName = fields.Str(data_key="lesseeName", required=False)
    monthlyRental = fields.Int(data_key="monthlyRental", required=False)
    paymentPeriodStart = fields.Str(
        data_key="paymentPeriodStart",
        required=False,
    )
    paymentPeriodEnd = fields.Str(
        data_key="paymentPeriodEnd",
        required=False,
    )
    leaseStartDate = fields.Str(data_key="leaseStartDate", required=False)

    # lesseeAddress = fields.Str(
    #     data_key="lesseeAddress",
    #     required=False,
    # )
    leaseEndDate = fields.Str(data_key="leaseEndDate", required=False)
    mobile = fields.Str(
        data_key="mobile",
        required=False,
    )
    email = fields.Str(
        data_key="email",
        required=False,
    )
    contactEmail = fields.Str(
        data_key="contactEmail",
        required=False,
    )
    contactMobile = fields.Str(
        data_key="contactMobile",
        required=False,
    )
    contactPosition = fields.Str(
        data_key="contactPosition",
        required=False,
    )
    contactName = fields.Str(
        data_key="contactName",
        required=False,
    )
    depositPeriod = fields.Int(
        data_key="depositPeriod",
        required=False,
    )
    rentGuarantorId = fields.Str(data_key="rentGuarantorId", required=False)
    rentGuarantorIdType = fields.Str(data_key="rentGuarantorIdType", required=False)
    rentGuarantorName = fields.Str(data_key="rentGuarantorName", required=False)
    leaseCurrency = fields.Str(data_key="leaseCurrency", required=False)
    depositAmount = fields.Int(data_key="depositAmount", required=False)
    leaseDetails = fields.Str(data_key="leaseDetails", required=False)
    leasePeriod = fields.Int(data_key="leasePeriod", required=False)
    leaseId = fields.Int(data_key="leaseId", required=False)
    isCompany = fields.Bool(data_key="isCompany", required=False)
    rentVariable = fields.Bool(data_key="rentVariable", required=False)
    monthOneBalance = fields.Str(data_key="monthOneBalance", required=False)
    monthTwoBalance = fields.Str(data_key="monthTwoBalance", required=False)
    monthThreeBalance = fields.Str(data_key="monthThreeBalance", required=False)
    moreThanThreeMonthsBalance = fields.Str(
        data_key="moreThanThreeMonthsBalance", required=False
    )
    currentBalance = fields.Str(data_key="currentBalance", required=False)
    outStandingBalance = fields.Int(data_key="outStandingBalance", required=False)

    #Address infor
    unitNumber = fields.Str(data_key="unitNumber",required=False)
    buildingName = fields.Str(data_key="buildingName",required=False)
    streetNumber = fields.Str(data_key="streetNumber",required=False)
    streetName = fields.Str(data_key="streetName",required=False)
    surbub = fields.Str(data_key="suburb",required=False)
    city = fields.Str(data_key="city",required=False)
    province = fields.Str(data_key="province",required=False)
    country = fields.Str(data_key="country",required=False)
    areaCode = fields.Str(data_key="areaCode",required=False, validate=validate.Length(max=15))

class CreateSubscriptionSchema(Schema):
    subscriberName = fields.Str(
        data_key="subscriberName", required=True, validate=validate_subscription
    )
    product = fields.Str(
        data_key="product", required=True, validate=validate_subscription
    )
    subClass = fields.Str(
        data_key="subClass" 
    )
    subPeriod = fields.Str(
        data_key="subPeriod", required=True, validate=validate_subscription
    )
    numberOfSubs = fields.Str(
        data_key="numberOfSubs", required=True, validate=validate_subscription
    )
    startDate = fields.Str(
        data_key="startDate", required=True, validate=validate_subscription
    )
    currency = fields.Str(
        data_key="currency", required=True, validate=validate_subscription
    )
    monthlyPrice = fields.Str(
        data_key="monthlyPrice",
        required=False,  # validate=validate_subscription
    )

    monthlyPriceZWL = fields.Int(
        data_key="monthlyPriceZWL",
        required=False,  # validate=validate_subscription
    )

    subsAmount = fields.Str(
        data_key="subsAmount",
        required=False,  # validate=validate_subscription
    )
    paymentMethod = fields.Str(
        data_key="paymentMethod", required=True, validate=validate_subscription
    )
    subscriberRegNo = fields.Str(data_key="subscriberRegNo", required=False)


class CreateLeaseReceiptSchema(Schema):
    paymentDate = fields.Str(data_key="paymentDate", required=True)
    receivedAmount = fields.Str(data_key="receivedAmount", required=True)


class PasswordChangeSchema(Schema):
    oldPassword = fields.Str(data_key="oldPassword", required=True)
    newPassword = fields.Str(
        data_key="newPassword", required=True, validate=password_validation
    )
    confirmPassword = fields.Str(
        data_key="confirmPassword", required=True, validate=password_validation
    )


class StandardPricingSchema(Schema):
    rate = fields.Float(data_key="rate", required=False)
    individualPrice = fields.Float(data_key="individualPrice", required=False)
    companyPrice = fields.Float(data_key="companyPrice", required=False)


class RequestedPeriodSchema(Schema):
    tenantID = fields.Str(data_key="tenantID", required=True)
    startDate = fields.Str(data_key="startDate", required=True)
    endDate = fields.Str(data_key="endDate", required=True)


class SpecialPricingSchema(Schema):
    serviceName = fields.Str(data_key="serviceName", required=False)
    individualCharge = fields.Str(data_key="individualCharge", required=True)
    companyCharge = fields.Str(data_key="companyCharge", required=True)
    currencyType = fields.Str(data_key="currencyType", required=True)
    clientCustomer = fields.Str(
        data_key="clientCustomer",
        required=False,
        validate=validate_special_priced_client,
    )


# class IndividualSchema(serializers.Serializer):
#     firstname = serializers.CharField()
#     surname = serializers.CharField()
#     address = serializers.CharField()


class InvoiceSchema(Schema):
    leaseId = fields.Int(data_key="leaseId", required=True)
    operationCosts = fields.Str(data_key="operationCosts", required=False)
    baseRental = fields.Str(data_key="baseRental", required=True)


class GetClientCompanyUserSchema(Schema):
    userName = fields.Str(data_key="userName", required=False)
    userID = fields.Int(data_key="userID", required=False)
    enquiredIndividualOrCompanyID = fields.Int(
        data_key="enquiredIndividualOrCompanyID", required=False
    )
    isCompanyEnquired = fields.Bool(data_key="isCompanyEnquired", required=False)


class CreatePaymentPlansSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    plans = fields.List(fields.Nested("PaymentPlanSchema"), required=True)


from marshmallow import Schema, fields, EXCLUDE, ValidationError, pre_load
from datetime import datetime

class PaymentPlanSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    client_id = fields.Str(data_key="client_id", required=False)
    creditor_id = fields.Str(data_key="creditor_id", required=False)
    spoke_with = fields.Str(data_key="spoke_with", required=True)
    expected_pay_date = fields.Str(data_key="expected_pay_date", required=True)
    amount = fields.Float(data_key="amount", required=True)

    @staticmethod
    def validate_date_format(value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValidationError("Invalid date format. Expected format: YYYY-MM-DD")
        return value

    @pre_load
    def ensure_client_or_creditor(self, data, **kwargs):
        if not data.get("client_id") and not data.get("creditor_id"):
            raise ValidationError(
                "Either 'client_id' or 'creditor_id' must be provided."
            )

        if not data.get("client_id") and data.get("creditor_id"):
            data["client_id"] = data["creditor_id"]
        
        return data

    def load(self, data, *args, **kwargs):
        data = super().load(data, *args, **kwargs)

        if "expected_pay_date" in data:
            data["expected_pay_date"] = self.validate_date_format(
                data["expected_pay_date"]
            )

        return data

    def loads(self, data, *args, **kwargs):
        data = super().loads(data, *args, **kwargs)

        if "expected_pay_date" in data:
            data["expected_pay_date"] = self.validate_date_format(
                data["expected_pay_date"]
            )

        return data



class CreateCommunicationHistoryReminderSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    client_id = fields.Str(data_key="client_id", required=True)
    message = fields.Str(data_key="message", required=True)
    reminder_type = fields.Str(
        data_key="reminder_type",
        validate=validate.OneOf([t.value for t in CommunicationHistoryReminderType]),
    )
    action_date = fields.Str(data_key="action_date", required=True)
    @pre_load
    def ensure_client_or_creditor(self, data, **kwargs):
        if not data.get("client_id") and not data.get("creditor_id"):
            raise ValidationError(
                "Either 'client_id' or 'creditor_id' must be provided."
            )

        if not data.get("client_id") and data.get("creditor_id"):
            data["client_id"] = data["creditor_id"]
        
        return data


class UpdateDebtorIntelSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    client_id = fields.Str(data_key="client_id", required=True)
    note = fields.Str(data_key="note", required=True)


class CreateClaimSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    data_source = fields.Str(data_key="data_source", required=True)
    debtor_id = fields.Int(data_key="debtor_id", required=True)
    debtor_type = fields.Str(
        data_key="debtor_type",
        required=True,
        validate=validate.OneOf([t.value for t in ClaimDebtorType]),
    )
    date = fields.Str(data_key="date", required=True)
    # account_number = fields.Str(data_key="account_number", required=True)
    currency = fields.Str(
        data_key="currency",
        required=True,
        validate=validate.OneOf([c.value for c in Currency]),
    )
    amount = fields.Float(data_key="amount", required=True)

    def validate_date_format(self, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValidationError("Invalid date format. Expected format: YYYY-MM-DD")
        return value

    def load(self, data, *args, **kwargs):
        data = super().load(data, *args, **kwargs)

        if "date" in data:
            data["date"] = self.validate_date_format(data["date"])

        return data

    def loads(self, data, *args, **kwargs):
        data = super().loads(data, *args, **kwargs)

        if "date" in data:
            data["date"] = self.validate_date_format(data["date"])

        return data


class UpdateClientContactSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    # TODO: add custom methods for validating email address and national id

    client_id = fields.Str(data_key="client_id", required=True)
    firstname = fields.Str(data_key="firstname", required=True)
    surname = fields.Str(data_key="surname", required=True)
    sms_number = fields.Str(
        data_key="sms_number", required=True, validate=validate.Length(min=5)
    )
    # other_numbers = fields.List(fields.Str(), data_key="other_numbers", required=True)
    email_address = fields.Email(data_key="email_address", required=True)
    address = fields.Str(data_key="address", required=True)


class CreateDisbursementSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    lease_id = fields.Str(data_key="lease_id", required=True)
    user_id = fields.Str(data_key="user_id", required=True)
    date = fields.Str(data_key="date", required=True)
    creditor = fields.Str(data_key="creditor", required=True)
    ref = fields.Str(data_key="ref", required=True)
    details = fields.Str(data_key="details", required=True)
    amount_paid = fields.Float(data_key="amount_paid", required=True)

    def validate_date_format(self, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValidationError("Invalid date format. Expected format: YYYY-MM-DD")
        return value

    def load(self, data, *args, **kwargs):
        data = super().load(data, *args, **kwargs)

        if "date" in data:
            data["date"] = self.validate_date_format(data["date"])

        return data

    def loads(self, data, *args, **kwargs):
        data = super().loads(data, *args, **kwargs)

        if "date" in data:
            data["date"] = self.validate_date_format(data["date"])

        return data

class RateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    current_rate = fields.Float(data_key="current_rate", required=True)
    base_currency = fields.Str(data_key="base_currency", required=True)
    currency = fields.Str(data_key="currency", required=True)
    date = fields.Str(data_key="date", required=False)
    
class CreateMaintenanceScheduleSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    property = fields.Str(data_key="property", required=False)
    tenant_landlord = fields.Str(data_key="tenant_landlord", required=False)
    details = fields.Str(data_key="details", required=False)
    title = fields.Str(data_key="title", required=True,validate=validate.Length(min=3))
    tradesman = fields.Str(data_key="tradesman", required=False)
    contractor = fields.Str(data_key="contractor", required=False)
    required_materials = fields.Str(data_key="required_materials", required=False)
    budget = fields.Float(data_key="budget", required=False)
    responsible_person = fields.Str(data_key="responsible_person", required=False)
    reason = fields.Str(data_key="reason", required=False)
    frequency = fields.Str(data_key="frequency", required=False)
    scheduled_day = fields.Str(data_key="scheduled_day", required=False)
    scheduled_date = fields.Str(data_key="scheduled_date", required=False)
    month_frequency = fields.Integer(data_key="month_frequency", required=False)
    lease_id = fields.Integer(data_key="lease_id", required=False)
    is_creditor = fields.Integer(data_key="creditor_id", required=False)
    
    @post_load
    def add_is_creditor_flag(self, data, **kwargs):
        try:
            data["is_creditor"] = True if data["is_creditor"] else False
        except Exception:
            ...
        return data

class DebtCallFilterDataSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    contact_methods = fields.List(fields.Str(), required=False)
    aging_filters = fields.List(fields.Str(), required=True)
    balance_filter = fields.Int(data_key="balance_filter", required=False)
    sms_message = fields.Str(data_key="sms_message", required=False)
    email_message = fields.Str(data_key="email_message", required=False)
    
    