import os

from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
TIME_ZONE = "Africa/Harare"
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ["SECRET_KEY"]
# email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ["EMAIL_HOST"]
# EMAIL_USE_TLS = os.environ['EMAIL_USE_TLS']
EMAIL_PORT = os.environ["EMAIL_PORT"]
EMAIL_USE_SSL = os.environ["EMAIL_USE_SSL"]
EMAIL_HOST_USER = os.environ["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]

SMS_USERNAME = os.environ["SMS_USERNAME"]
SMS_PASSWORD = os.environ["SMS_PASSWORD"]
SMS_API_KEY = os.environ["SMS_API_KEY"]
# twilio
ACCOUNT_SID = os.environ["ACCOUNT_SID"]
AUTH_TOKEN = os.environ["AUTH_TOKEN"]
# SECURITY WARNING: don't run with debug turned on in production!

#Whatsapp bot Settings
WHATSAPP_API_MEDIA_URL= os.environ["WHATSAPP_API_MEDIA_URL"]
WHATSAPP_API_URL = os.environ["WHATSAPP_API_URL"]
WHATSAPP_ACCESS_TOKEN = os.environ["WHATSAPP_ACCESS_TOKEN"]
WHATSAPP_VERIFY_TOKEN = os.environ["WHATSAPP_VERIFY_TOKEN"]

DEBUG = True
ALLOWED_HOSTS = ["*"]
AUTH_USER_MODEL = "authentication.CustomUser"

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # user define apps
    "authentication",
    "rentsafe",
    "bot",
    # thirdpart apps
    "inertia",
    "django_vite",
    "js_routes",
    "django_cron",
    "whatsappchatbot",
    "django_celery_beat",
    "accounting",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # inertia middleware
    "inertia.middleware.InertiaMiddleware",
    # user defined middleware
    "core.middleware.AuthPropsMiddleware",
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases


DB_ENGINE   = os.getenv('DB_ENGINE'   , None)
DB_USERNAME = os.getenv('DB_USERNAME' , None)
DB_PASS     = os.getenv('DB_PASS'     , None)
DB_HOST     = os.getenv('DB_HOST'     , None)
DB_PORT     = os.getenv('DB_PORT'     , None)
DB_NAME     = os.getenv('DB_NAME'     , None)

# if DB_ENGINE and DB_NAME and DB_USERNAME:
# DATABASES = { 
#     'default': {
#     'ENGINE'  : 'django.db.backends.mysql', 
#     'NAME'    : 'finchec1_rentsafe',
#     'USER'    : 'finchec1_admin',
#     'PASSWORD': 'n2(&lJweshvu',
#     'HOST'    : '129.232.213.107',
#     'PORT'    : '3306',
#     }, 
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

CRON_CLASSES = [
    "rentsafe.cronjob.LeaseOwingBalances",
]
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework.authentication.SessionAuthentication', 
#         'rest_framework.authentication.TokenAuthentication', 
#     ),
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticated',
#     ),
# }



# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

USE_I18N = True

USE_TZ = True

# OTP TYPES
ADD_INDIVIDUAL = "ADD_INDIVIDUAL"
ADD_INDIVIDUAL_USER = "ADD_INDIVIDUAL_USER"
ADD_AGENT_USER = "ADD_AGENT_USER"
ADD_COMPANY = "ADD_COMPANY"
CREDIT_CHECK = "CREDIT_CHECK"
SEARCH_INDIVIDUAL = "SEARCH_INDIVIDUAL"
SEARCH_COMPANY = "SEARCH_COMPANY"
ADD_IND_LEASE = "INDIVIDUAL_LEASE"
ADD_COMP_LEASE = "COMPANY_LEASE"
MAKE_AGENT = "MAKE_AGENT"
FORGOT_PASSWORD = "FORGOT_PASSWORD"
ADD_SUBSCRIPTION = "ADD_SUBSCRIPTION"
PAYMENT_RECEIPT = "PAYMENT_RECEIPT"
LEASE_STATUS = "LEASE_STATUS"
# Requested user type

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


STATIC_URL = "static/"
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
INERTIA_LAYOUT = "base.html"
# We need this for django form posting
CSRF_HEADER_NAME = "HTTP_X_XSRF_TOKEN"
CSRF_COOKIE_NAME = "XSRF-TOKEN"
# Where ViteJS assets are built.
DJANGO_VITE_ASSETS_PATH = BASE_DIR / "react-app" / "dist"


# If we should use HMR or not.
# DJANGO_VITE_DEV_MODE = DEBUG

# we need this to get around cors issues
DJANGO_VITE_DEV_SERVER_HOST = "localhost"                                                           

# this is the default, but I'm leaving this here, so you know what to change if you want to run on a different port
# DJANGO_VITE_PORT = 5173
DJANGO_VITE_DEV_SERVER_PORT = 5173

# Name of our static files' folder (after called python manage.py collectstatic)
STATIC_ROOT = BASE_DIR / "static"
# Include DJANGO_VITE_ASSETS_PATH into STATICFILES_DIRS to be copied inside
# when run command python manage.py collectstatic
# STATICFILES_DIRS = [DJANGO_VITE_ASSETS_PATH]
STATICFILES_DIRS = [DJANGO_VITE_ASSETS_PATH]

JS_ROUTES_INCLUSION_LIST = [
    
    
    # New Accounting routes
    "products_list",  # GET /accounting/products/
    "products_detail",  # GET/PUT/DELETE /accounting/products/{id}/
    "sales_categories_list",
    "sales_categories_detail",
    "sales_accounts_list",
    "sales_accounts_detail",
    "invoices_list",
    "invoices_detail",
    "cash_sales_list",
    "cash_sales_detail",
    "cashbook_entries_list",
    "cashbook_entries_detail",
    "ledger_accounts_list",
    "ledger_accounts_detail",
    "journal_entries_list",
    "journal_entries_detail",
    "ledger_transactions_list",
    "ledger_transactions_detail",
    "customer_invoice_details", #TODO: url for viewing invoice details | Sales side
    
    "debit_journal",
    "credit_journal",
    "get_client_company_journals",
    "get_client_individual_journals",
    "create_bulk_individuals",  # create bulk individuals
    "create_bulk_companies",  # create bulk companies
    "create_individual_bulk_leases",  # create bulk individual leases
    "create_company_bulk_leases",  # create bulk company leases
    "home",
    "contact",
    "companies",
    "individuals",
    "search-agents",
    "login",
    "logout",
    "forgot_password",
    "cl-change-password",
    "change-password",
    "create-individual",
    "create-individual-user",
    "create-agent",
    "edit-agent",
    "delete-agent",
    "create-company",
    "upload-companies",
    "credit-check",
    "leases",
    "client-home",
    "client-leases",
    "create-individual-lease",
    "create-company-lease",
    "client-create-lease-confirmation",
    "client-edit-lease",
    "client-credit-check",
    "client-credit-check-confirmation",
    "client-credit-check-individuals",
    "client-credit-check-companies",
    "client-create-company",
    "client-create-individual",
    "client-individual-verify-otp",
    "client-company-verify-otp",  # otp for credit check for company
    "admin_home",
    "company_verify_otp",
    "individual_verify_otp",
    "individual_user_verify_otp",
    "client-credit-taken",
    "client-credit-given",
    "create-user",
    "client-users",
    "destroy-user",
    "edit-user",
    "get-user",
    "get-company",
    "active_subcription",
    "historic_subcription",
    "unallocated_subcription",
    "get_client",
    "get_services",
    "get_sub_period",
    "cl-search-individuals",
    "cl-search-companies",
    "company-report",
    "individual-report",
    "cl-store-individual",
    "verify_individual_otp",
    "cl-store-company",
    "verify_company_otp",  # otp for  companies cred
    "open_subscription",
    "delete_lease",
    "historic-subs-individual",
    "historic-subs-company",
    "get_all_active_leases",
    "create_receipt_and_payment",
    "check_credit_score",
    "search_company_users",
    "search_individual_users",
    "check_credit_score",
    "edit_individual_user",
    "edit_company_user",
    "delete_individual_user",
    "delete_company_user",
    "verify",
    "is_agent_verified",
    "cl_is_agent_verified",
    "cl-search-individual-users",
    "enquiry_count",
    # agents routes
    "agent_home",
    "verify-agent",
    "activate-agent",
    # new routes
    "is_individual_verified",
    "standard_subs_pricing",
    "update_usd_rate",
    "create_special_pricing",
    "tenant_statements",
    "detailed_statement",
    "detailed_period_statement",
    "subs_monthly_pricing",  # get all subs monthly pricing
    "get_searched_companies",  # get all companies searched on add-subscription page
    "get_searched_individuals",  # get all individuals searched on add-subscription page
    "search_contracted_companies",  # get all contracted companies
    "cl_is_individual_verified",  # HIT THIS URL AFTER INDIVIDUAL OTP VERIFY IS SUCCESSFUL. | client side.
    "delete_special_pricing",
    "view_subscription_details",  # url for viewing subscription details | Admin side
    "verify_lease",
    "client_invoice",  # TODO: url for viewing invoice details | Client side
    "client_company_users",  # getting client company users |report
    "new_otp",  # new otp code for every redeem
    "download_template",  # templates download
    "debit_journal",  # debit journal
    "credit_journal",  # credit journal
    # claim routes
    "create_claim",
    "search_individuals_or_companies",
    # payment plan and communication history routes
    "client_details",
    "payment_plans",
    "debtor_intelligence",
    "communication_history",
    "update_client_contact_details",
    # statements
    "commission_statement",
    "creditor_statements",
    "creditor_statement",
    "detailed_creditor_statement",
    "create_disbursement",
    "disbursements",
    "forecasts",
    "rate_setup",
    "write-off",
    "debt_call",
    "create_work_schedule",
    "create_maintenance_schedule",
    "todo_list",
    "creditor_details",
    "resolve_task",
    "delete_work_schedule",
    "forecasts",
    "admin_leases", # <str: leases_type> as the url parameter
    #CREDITORS BALANCES
    "creditor_debit_journal",
    "creditor_credit_journal",
    "get_creditor_journals",
    "save_inspection_document", # save inspection document
    # acounting -> sales
    "sales_categories",
    "products_and_services",
    "vat_settings",
    "cash_sales",
    "sales_accounts",
    "cash_books",
    "sales_invoicing",
    "accounts_list",
    "in_development",
    "detailed_general_ledger",
    "cash_books_list",
]

LOGIN_URL = "login"
LOGOUT_REDIRECT_URL = "/"
