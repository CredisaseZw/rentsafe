from django.core.management.base import BaseCommand
from accounting.models import SalesAccount, AccountSector
from authentication.models import CustomUser

class Command(BaseCommand):
    help = "Seeds the database with predefined accounts and sectors"

    ACCOUNTS_DATA = [
        {"account_name": "Sales", "account_number": "10000", "sector_code": "S1", "sector_name": "Sales"},
        {"account_name": "Other income", "account_number": "11000", "sector_code": "S4", "sector_name": "Other income"},
        {"account_name": "Cost of sales", "account_number": "20000", "sector_code": "S2", "sector_name": "Cost of Sales"},
        {"account_name": "Direct Expenses", "account_number": "21000", "sector_code": "S3", "sector_name": "Direct expenses"},
        {"account_name": "Accounting / Audit Fees", "account_number": "30010", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Advertising & Promotions", "account_number": "30020", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Amortisation", "account_number": "30030", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Bad Debts", "account_number": "30040", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Bank Charges", "account_number": "30050", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Consultancy", "account_number": "30070", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Depreciation", "account_number": "30080", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Electricity and Water", "account_number": "30090", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Rent", "account_number": "30240", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Salaries & Wages", "account_number": "30260", "sector_code": "S5", "sector_name": "Expenses"},
        {"account_name": "Fixed Assets", "account_number": "40010", "sector_code": "S6", "sector_name": "Fixed Assets"},
        {"account_name": "Investments", "account_number": "50010", "sector_code": "S7", "sector_name": "Investments"},
        {"account_name": "Bank", "account_number": "60020", "sector_code": "S8", "sector_name": "Current Assets"},
        {"account_name": "Trade debtors", "account_number": "60030", "sector_code": "S8", "sector_name": "Current Assets"},
        {"account_name": "Share Capital", "account_number": "70010", "sector_code": "S9", "sector_name": "Equity & Reserves"},
        {"account_name": "Retained Income", "account_number": "70020", "sector_code": "S9", "sector_name": "Equity & Reserves"},
        {"account_name": "Long term loans", "account_number": "80010", "sector_code": "S10", "sector_name": "Long Term Liabilities"},
        {"account_name": "Trade creditors", "account_number": "90010", "sector_code": "S11", "sector_name": "Current Liabilities"},
        {"account_name": "VAT Control Account", "account_number": "90050", "sector_code": "S11", "sector_name": "Current Liabilities"},
    ]

    def handle(self, *args, **kwargs):
        """Seeds account sectors and sales accounts"""
        self.stdout.write(self.style.SUCCESS("Starting account seeding..."))

        # Create a default user (Admin) if needed
        admin_user = CustomUser.objects.get(email="admin@admin.com")

        for data in self.ACCOUNTS_DATA:
            # Get or create AccountSector
            sector, _ = AccountSector.objects.get_or_create(code=data["sector_code"], defaults={"name": data["sector_name"]})

            # Get or create SalesAccount linked to the sector
            SalesAccount.objects.get_or_create(
                account_number=data["account_number"],
                defaults={
                    "account_name": data["account_name"],
                    "company": admin_user.company,
                    "account_sector": sector,
                    "user": admin_user,
                },
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded account sectors and sales accounts!"))
