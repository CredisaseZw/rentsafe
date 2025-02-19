from django.contrib import admin
from .models import *
# from simple_history.admin import SimpleHistoryAdmin


class EnquiriesAdmin(admin.ModelAdmin):
    list_display = ("id", "enquirer", "individual_company_id", "enquiry_company_id", "date_of_enquiry", "is_company_searched", "is_individual_searched")
    list_display_links = ("enquirer", "enquiry_company_id")
    search_fields = ("enquirer", "individual_company_id", "enquiry_company_id")
    list_filter = ("is_company_searched", "is_individual_searched", "date_of_enquiry")
    ordering = ("-date_of_enquiry",)


class SpecialPricingAdmin(admin.ModelAdmin):
    list_display = ("client_customer",)
    search_fields = ("client_customer",)


@admin.register(Individual)
class IndividualAdmin(admin.ModelAdmin):
    list_display = ("firstname", "surname", "email", "national_id", "id")
    list_display_links = ("national_id",)
    search_fields = ("firstname", "surname", "email", "national_id","id")
    ordering = ("surname",)


@admin.register(EmployementDetails)
class EmployementDetailsAdmin(admin.ModelAdmin):
    list_display = ("individual", "employer_name", "marital_status")
    list_display_links = ("individual",)
    search_fields = ("individual__firstname", "individual__surname", "employer_name")
    list_filter = ("marital_status",)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("registration_name", "registration_number", "id")
    list_display_links = ("registration_number", "id")
    search_fields = ("registration_name", "registration_number")
    ordering = ("registration_name",)


admin.site.register(Services)


@admin.register(SubcsriptionPeriod)
class SubcsriptionPeriodAdmin(admin.ModelAdmin):
    list_display = ("name", "id")
    list_display_links = ("name", "id")
    search_fields = ("name",)


@admin.register(Subcsriptions)
class SubscriptionsAdmin(admin.ModelAdmin):
    list_display = ("id", "subscriber_id", "subscription_class", "service_id", "period")
    list_display_links = ("id", "service_id")
    search_fields = ("subscriber_id", "subscription_class", "service_id__name")
    list_filter = ("period",)
    ordering = ("-id",)


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ("company", "email")
    list_display_links = ("company", "email")
    search_fields = ("company__registration_name", "email")


@admin.register(Subscription_charge_pricing)
class Subscription_charge_pricingAdmin(admin.ModelAdmin):
    list_display = ("individual_monthly_charge", "company_monthly_charge")
    list_display_links = ("company_monthly_charge",)
    search_fields = ("company_monthly_charge",)


@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    list_display = ("is_company", "is_individual", "lease_id", "status", "is_active", "rent_variables", "reg_ID_Number", "payment_period_end", "lease_giver","created_date")
    list_display_links = ("lease_id", "is_company", "is_individual")
    search_fields = ("lease_id", "reg_ID_Number", "lease_giver")
    list_filter = ("status", "is_active", "payment_period_end")
    ordering = ("-created_date",)


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ("lease_id", "payment_id", "date")
    list_display_links = ("lease_id",)
    search_fields = ("lease_id", "payment_id")
    list_filter = ("date",)
    ordering = ("-date",)


@admin.register(LeasePayments)
class LeasePaymentsAdmin(admin.ModelAdmin):
    list_display = ("lease_id", "balance_amount", "date", "payment_reference", "owing_amount", "date_created")
    list_display_links = ("lease_id", "payment_reference")
    search_fields = ("lease_id", "payment_reference")
    list_filter = ("date", "date_created")
    ordering = ("-date_created",)
    history_list_display = ["changed_fields", "changed_by"] 
    
admin.site.register(Special_pricing, SpecialPricingAdmin)
@admin.register(Standard_pricing)
class Standard_pricingAdmin(admin.ModelAdmin):
    list_display = ("service_name", "individual_charge", "company_charge", "current_rate", "date_created", "updated_at")
    list_display_links = ("service_name", "current_rate")
    search_fields = ("service_name",)
    list_filter = ("date_created", "updated_at")
    ordering = ("-updated_at",)
    history_list_display = ["changed_fields", "changed_by"] 
    

@admin.register(Opening_balance)
class Opening_balanceAdmin(admin.ModelAdmin):
    list_display = ("lease_id", "three_months_plus", "three_months_back", "two_months_back", "one_month_back", "current_month",)
    list_display_links = ("lease_id",)
    search_fields = ("lease_id",)
    ordering = ("-date_created",)
    history_list_display = ["changed_fields", "changed_by"] 


@admin.register(Invoicing)
class InvoicingAdmin(admin.ModelAdmin):
    list_display = ("lease_id", "amount", "operation_costs")
    list_display_links = ("lease_id",)
    search_fields = ("lease_id",)
    list_filter = ("amount",)
    ordering = ("-date_created",)

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("otp_code", "otp_type", "request_user", "requested_user")
    list_display_links = ("otp_code", "request_user")
    search_fields = ("otp_code", "request_user__username", "requested_user__username")
    list_filter = ("otp_type",)
    ordering = ("-created_at",)

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ("id", "creditor_id", "data_source", "debtor_id", "is_individual", "is_company", "account_number", "currency", "amount", "date", "created_at", "updated_at")
    list_display_links = ("id", "creditor_id")
    search_fields = ("creditor_id", "debtor_id", "account_number")
    list_filter = ("is_individual", "is_company", "date")
    ordering = ("-created_at",)

@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = ("client_id", "spoke_with", "expected_pay_date", "amount")
    list_display_links = ("client_id","spoke_with")
    search_fields = ("client_id","user_id")
    list_filter = ("expected_pay_date",)
    ordering = ("-created_at",)
@admin.register(CommsHistMessage)
class CommsHistMessageAdmin(admin.ModelAdmin):
    list_display = ("client_id", "message", "created_at")
    list_display_links = ("client_id",)
    search_fields = ("client_id",)
    list_filter = ("created_at",)
    ordering = ("-created_at",)

@admin.register(Landlord)
class LandlordAdmin(admin.ModelAdmin):
    list_display = ("id","landlord_name","reg_ID_Number","opening_balance")
    list_display_links = ("id","landlord_name","reg_ID_Number")
    search_fields = ("landlord_name","reg_ID_Number")
    ordering =["-created_at"]

@admin.register(LeaseReceiptBreakdown)
class LeaseReceiptBreakdownAdmin(admin.ModelAdmin):
    list_display = ("lease_id", "total_amount", "date_received")
    list_display_links = ("lease_id",)
    search_fields = ("lease_id","landlord_id")
    list_filter = ("date_received",)
    ordering = ("-created_at",)

@admin.register(LeaseCurrencyRate)
class LeaseCurrencyRateAdmin(admin.ModelAdmin):
    list_display = ("company_id", "currency", "date_created", "current_rate", "base_currency" )
    list_display_links = ("company_id",)
    search_fields = ("company_id",)
    list_filter = ("currency",)
    ordering = ("-updated_at",)

@admin.register(WorkSchedule)
class WorkScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "lease_id", "title", "created_at")
    list_display_links = ("id", "lease_id")
    search_fields = ("lease_id", "title")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

