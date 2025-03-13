"""
This module defines the URL patterns for the RentSafe web application.

The urlpatterns list contains instances of the path() function that map
URL patterns to view functions.
The path() function takes a string representing the URL pattern, a view
function, and a name for the URL pattern.

The views module is imported to provide the view functions for the URL
patterns. The views module contains functions for rendering HTML templates
and processing form data.

The URL patterns defined in this module include:
- An index page at the root URL that displays a list of companies and individuals
- A contact page at the "/contact/" URL that displays a contact form
- A page at the "/companies/" URL that displays a list of companies
- A page at the "/get-" URL that displays a list of individuals
- A page at the "/create_individual/" URL that displays a form for creating a new individual
- A page at the "/create_company/" URL that displays a form for creating a new company
- A page at the "/upload-companies/" URL that displays a form for uploading a CSV file of companies
"""

from django.urls import include, path

from rentsafe.rent_views.new_clients import claims, leases, statements, works, forecasts, inspection

from . import views
from .rent_views import agents, clients, company,creditors
from .rent_views.templates import download_template

urlpatterns = [
    path("", views.index, name="home"),
    # templates download url
    path(
        "download_template/<template_name>", download_template, name="download_template"
    ),
    # admins url
    path(
        "admins/",
        include(
            [
                
                path("", company.admin_home, name="admin_home"),
                path("companies/", company.companies, name="companies"),
                path("get-", company.individuals, name="individuals"),
                path(
                    "create_individual/",
                    company.create_individual,
                    name="create-individual",
                ),
                path(
                    "create_individual_user/",
                    company.create_individual_user,
                    name="create-individual-user",
                ),
                path("create_company/", company.create_company, name="create-company"),
                path(
                    "upload-companies/",
                    company.upload_companies,
                    name="upload-companies",
                ),
                path("credit-check/", company.credit_check, name="credit-check"),
                path("leases/", company.leases, name="leases"),
                path("create-lease/", company.create_lease, name="create-lease"),
                path(
                    "company-verify-otp/",
                    company.company_verify_otp,
                    name="company_verify_otp",
                ),
                path(
                    "individual-verify-otp/",
                    company.individual_verify_otp,
                    name="individual_verify_otp",
                ),
                path(
                    "individual-user-verify-otp/",
                    company.individual_user_verify_otp,
                    name="individual_user_verify_otp",
                ),
                path(
                    "active-subcription/",
                    company.active_subscription,
                    name="active_subcription",
                ),
                path(
                    "get-searched-individuals/",
                    company.get_all_individuals,
                    name="get_searched_individuals",
                ),
                path(
                    "get-searched-companies/",
                    company.get_all_companies,
                    name="get_searched_companies",
                ),
                path(
                    "monthly-pricing/",
                    company.subs_monthly_pricing,
                    name="subs_monthly_pricing",
                ),
                path(
                    "historic-subcription/",
                    company.historic_subcription,
                    name="historic_subcription",
                ),
                path(
                    "unallocated-subcription/",
                    company.unallocated_subcription,
                    name="unallocated_subcription",
                ),
                path("get_client/", company.get_client, name="get_client"),
                path("get_services/", company.get_services, name="get_services"),
                path("get_sub_period/", company.get_sub_period, name="get_sub_period"),
                path(
                    "historic-subs-get-",
                    company.historic_subs_individual,
                    name="historic-subs-individual",
                ),
                path(
                    "historic-subs-companies/",
                    company.historic_subs_company,
                    name="historic-subs-company",
                ),
                path(
                    "search-company-users/",
                    company.search_company_users,
                    name="search_company_users",
                ),
                path(
                    "search-client-users/",
                    company.get_contracted_company,
                    name="search_contracted_companies",
                ),
                path(
                    "search-individual-users/",
                    company.search_individual_users,
                    name="search_individual_users",
                ),
                path(
                    "delete-company-user/",
                    company.delete_company_user,
                    name="delete_company_user",
                ),
                path(
                    "delete-individual-user/",
                    company.delete_individual_user,
                    name="delete_individual_user",
                ),
                path(
                    "edit-company-user/",
                    company.edit_company_user,
                    name="edit_company_user",
                ),
                path(
                    "verify/",
                    company.is_user_verified,
                    name="verify",
                ),
                path(
                    "edit-individual-user/",
                    company.edit_individual_user,
                    name="edit_individual_user",
                ),
                path(
                    "change_password/", company.change_password, name="change-password"
                ),
                path("agents/", company.agents, name="search-agents"),
                path("update-agent/", company.update_agent, name="edit-agent"),
                path("delete-agent/", company.destroy_agent, name="delete-agent"),
                path(
                    "create-agent/",
                    company.create_agent_user,
                    name="create-agent",
                ),
                path("verify-agent/", company.agent_verify_otp, name="verify-agent"),
                path(
                    "activate-agent/",
                    company.make_individual_agent,
                    name="activate-agent",
                ),
                path(
                    "is-individual-verified/",
                    company.is_individual_verified,
                    name="is_individual_verified",
                ),
                path(
                    "subscriptions/invoicing/special-pricing",
                    company.create_special_pricing,
                    name="create_special_pricing",
                ),
                path(
                    "subscriptions/invoicing/pricing",
                    company.subs_pricing,
                    name="standard_subs_pricing",
                ),
                path(
                    "subscriptions/invoicing/pricing/usd-rate",
                    company.update_usd_rate,
                    name="update_usd_rate",
                ),
                path(
                    "subscriptions/invoicing/pricing/delete-special-pricing/",
                    company.delete_special_pricing,
                    name="delete_special_pricing",
                ),
                path(
                    "active-subcription/view-subscriptions/<int:subscription_id>/",
                    company.view_subscription_details,
                    name="view_subscription_details",
                ),
                path(
                    "client-company-user/",
                    company.get_client_company_users,
                    name="client_company_users",
                ),
                path(
                    "new-otp/",
                    company.resend_otp,
                    name="new_otp",
                ),
                path(
                   
                    "leases/<str:leases_type>/",
                    clients.client_leases_new,
                    name="admin_leases",
                    
                    
                )
            ]
        ),
    ),
    # client url
    path(
        "clients/",
        include(
            [
                path("cash-sales", clients.cash_sales, name="cash_sales"),
                path("sales-accounts", clients.sales_accounts, name="sales_accounts"),
                path("sales-categories", clients.sales_categories, name="sales_categories"),
                path("products-and-services", clients.products_and_services, name="products_and_services"),
                path("vat-settings", clients.vat_settings, name="vat_settings"),
                path("cash-books", clients.cash_books, name="cash_books"),
                path("general-ledger", clients.general_ledger, name="general_ledger"),
                path("sales-invoicing", clients.sales_invoicing, name="sales_invoicing"),
                path(
                    "claims/",
                    claims.create_claim,
                    name="create_claim",
                ),
                path(
                    "claims/search/",
                    claims.search_individuals_or_companies,
                    name="search_individuals_or_companies",
                ),
                path(
                    "client-details/",
                    leases.get_client_details,
                    name="client_details",
                ),
                path(
                    "creditor-details/",
                    leases.get_creditor_details,
                    name="creditor_details",
                ),
                path(
                    "payment-plans/",
                    leases.post_payment_plans,
                    name="payment_plans",
                ),
                path(
                    "debtor-intelligence/",
                    leases.update_debtor_intelligence,
                    name="debtor_intelligence",
                ),
                path(
                    "communication-history/",
                    leases.post_communication_history,
                    name="communication_history",
                ),
                path(
                    "update-client-contact-details/",
                    leases.update_client_contact_details,
                    name="update_client_contact_details",
                ),
                path("manual-otp/", clients.manual_send_otp, name="manual_otp"),
                path(
                    "get-client-company-journals/",
                    clients.get_client_company_journals,
                    name="get_client_company_journals",
                ),
                path(
                    "get-client-individual-journals/",
                    clients.get_client_individual_journals,
                    name="get_client_individual_journals",
                ),
                path("", clients.clients_home, name="clients_home"),
                path("leases/", clients.client_leases, name="client-leases"),
                path(
                    "create-lease/individual/",
                    clients.create_individual_lease,
                    name="create-individual-lease",
                ),
                path(
                    "create-lease/company/",
                    clients.create_company_lease,
                    name="create-company-lease",
                ),
                path(
                    "create-lease/confirmation/",
                    clients.create_lease_confirmation,
                    name="create-lease-confirmation",
                ),
                path("edit-lease/", clients.edit_lease, name="client-edit-lease"),
                path("credit-check/", clients.credit_check, name="client-credit-check"),
                path(
                    "credit-check/get-",
                    clients.credit_check_individuals,
                    name="client-credit-check-individuals",
                ),
                path(
                    "credit-check/companies/",
                    clients.credit_check_companies,
                    name="client-credit-check-companies",
                ),
                path(
                    "create-individual/",
                    clients.create_individual,
                    name="client-create-individual",
                ),
                path(
                    "create-company/",
                    clients.create_company,
                    name="client-create-company",
                ),
                path(
                    "company-verify-otp/<str:url_link>/",
                    clients.company_verify_otp,
                    name="client-company-verify-otp",
                ),
                path(
                    "individual-verify-otp/",
                    clients.individual_verify_otp,
                    name="client-individual-verify-otp",
                ),
                path(
                    "cl-is-individual-verified/",
                    clients.is_individual_verified,
                    name="cl_is_individual_verified",
                ),
                path(
                    "credit-check-confirmation",
                    clients.credit_check_confirmation,
                    name="client-credit-check-confirmation",
                ),
                path("credit-given/", clients.credit_given, name="client-credit-given"),
                path("credit-taken/", clients.credit_taken, name="client-credit-taken"),
                path("create-users/", clients.create_user, name="create-user"),
                path("users/", clients.client_users, name="client-users"),
                path("delete-user/", clients.destroy_user, name="destroy-user"),
                path("update-user/", clients.update_user, name="edit-user"),
                path("get-user/", clients.get_user, name="get-user"),
                path("get-company/", clients.get_company, name="get-company"),
                path("companies/", clients.companies, name="cl-search-companies"),
                path("get-", clients.individuals, name="cl-search-individuals"),
                path("company-report/", clients.company_report, name="company-report"),
                path(
                    "individual-report/",
                    clients.individual_report,
                    name="individual-report",
                ),
                path(
                    "cl-store-individual",
                    clients.store_individual,
                    name="cl-store-individual",
                ),
                path(
                    "cl-verify-individual-otp",
                    clients.verify_individual_otp,
                    name="verify_individual_otp",
                ),
                path(
                    "cl-verify-lease/<str:url_link>/",
                    clients.verify_company_lease,
                    name="verify_lease",
                ),
                path(
                    "cl-store-company", clients.store_company, name="cl-store-company"
                ),
                path(
                    "cl-verify-company-otp",
                    clients.verify_company_otp,
                    name="verify_company_otp",
                ),
                path(
                    "cl-open-subscription",
                    clients.open_subscription,
                    name="open_subscription",
                ),
                path("cl-delete-lease", clients.delete_lease, name="delete_lease"),
                path(
                    "cl-get-all-active-leases",
                    clients.get_all_active_leases,
                    name="get_all_active_leases",
                ),
                path(
                    "cl-check-credit-score",
                    clients.check_credit_score,
                    name="check_credit_score",
                ),
                path(
                    "cl-verify-agent",
                    clients.is_agent_verified,
                    name="cl_is_agent_verified",
                ),
                path(
                    "cl-search-individual-users",
                    clients.store_individual_user,
                    name="cl-search-individual-users",
                ),
                path(
                    "cl-change_password/",
                    clients.change_password,
                    name="cl-change-password",
                ),
                path(
                    "enquiries/",
                    clients.enquiry_count,
                    name="enquiry_count",
                ),
                path(
                    "accounting/tenant-statements/",
                    clients.client_statements,
                    name="tenant_statements",
                ),
                path(
                    "accounting/detailed-period-statement/",
                    clients.request_period_statement,
                    name="detailed_period_statement",
                ),
                path(
                    "accounting/invoice",
                    clients.client_invoicing,
                    name="client_invoice",
                ),
                path(
                    "bulk_individuals/",
                    clients.create_bulk_individuals,
                    name="create_bulk_individuals",
                ),
                path(
                    "bulk_companies/",
                    clients.create_bulk_companies,
                    name="create_bulk_companies",
                ),
                path(
                    "bulk_individual_leases/",
                    clients.create_individual_bulk_leases,
                    name="create_individual_bulk_leases",
                ),
                path(
                    "bulk_company_leases/",
                    clients.create_company_bulk_leases,
                    name="create_company_bulk_leases",
                ),
                path(
                    "cl-create-receipt-and-payment",
                    clients.create_receipt_and_payments,
                    name="create_receipt_and_payment",
                ),
                path(
                    "accounting/detailed-statement/<int:tenant_id>/",
                    clients.detailed_statements,
                    name="detailed_statement",
                ),
                path(
                    "accounting/account-adjustment/debit-journal/",
                    clients.debit_journal,
                    name="debit_journal",
                ),
                path(
                    "accounting/account-adjustment/credit-journal/",
                    clients.credit_journal,
                    name="credit_journal",
                ),
                path(
                    "accounting/account-adjustment/creditor/debit-journal/",
                    clients.creditor_debit_journal,
                    name="creditor_debit_journal",
                ),
                path(
                    "accounting/account-adjustment/creditor/credit-journal/",
                    clients.creditor_credit_journal,
                    name="creditor_credit_journal",
                ),
                path(
                    "accounting/commission-statement/",
                    statements.commission_statement,
                    name="commission_statement",
                ),
                path(
                    "accounting/creditor-statements/",
                    statements.creditor_statements,
                    name="creditor_statements",
                ),
                path(
                    "accounting/creditor-statements/<int:creditor_id>/",
                    statements.detailed_creditor_statement,
                    name="detailed_creditor_statement",
                ),
                path(
                    "accounting/disbursements/",
                    statements.disbursements,
                    name="disbursements",
                ),
                path(
                    "accounting/disbursements/create",
                    statements.create_disbursement,
                    name="create_disbursement",
                ),
                path(
                    "accounting/forecasts/",
                    statements.forecasts,
                    name="forecasts",
                ),
                path(
                    "settings/rate-setup/",
                    clients.rate_setup,
                    name="rate_setup",
                ),
                path(
                    "write-off/",
                    clients.write_off,
                    name="write-off",
                ),
                path(
                    "accounting/customers/debt-call/",
                    clients.debt_call,
                    name="debt_call",
                ),
                path(
                    "maintenance-schedule/",
                    works.create_maintenance_schedule,
                    name="create_maintenance_schedule",
                ),
                path(
                    "work-schedule/",
                    works.create_work_schedule,
                    name="create_work_schedule",
                ),
                path(
                    "work-schedule/todo-list/",
                    works.todo_list,
                    name="todo_list",
                ),
                path(
                    "delete-schedule/<int:work_schedule_id>/",
                    works.delete_work_schedule,
                    name="delete_work_schedule",
                ),
                path(
                    "resolve-task/<int:work_schedule_id>/",
                    works.resolve_task,
                    name="resolve_task",
                ),
                path(
                    "sync-history/<int:company_id>/",
                    clients.switch_history,
                    name="history",
                ),
                path(
                    "forecasts/",
                    forecasts.get_forecast_inflows,
                    name="forecasts",
                ),
                path(
                    "creditor-debit/",
                    creditors.creditor_debit_journal,
                    name="creditor_debit_journal",
                ),
                path(
                    "creditor-credit/",
                    creditors.creditor_credit_journal,
                    name="creditor_credit_journal",
                ),
                path(
                    "inspection-save/",
                    inspection.save_inspection_document,
                    name="save_inspection_document",
                ),
                
            ]
        ),
    ),
    # agent url
    path(
        "agents/",
        include(
            [
                path("", agents.agent_home, name="agent_home"),
            ]
        ),
    ),
]
