"""Management command to seed the database with predefined accounts and sectors."""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounting.models.models import GeneralLedgerAccount, AccountType

CustomUser = get_user_model()


class Command(BaseCommand):
    """
    Django management command to seed the database with predefined accounts and sectors.
    """

    help = "Seeds the database with predefined accounts and sectors"

    ACCOUNTS_DATA = [
        {
            "account_name": "Sales",
            "account_number": "10000",
            "sector_code": "S1",
            "sector_name": "Sales",
        },
        {
            "account_name": "Consumer Enquiries",
            "account_number": "10001",
            "sector_code": "S1",
            "sector_name": "Sales",
        },
        {
            "account_name": "Consumer Enquiries (ZWG)",
            "account_number": "10002",
            "sector_code": "S1",
            "sector_name": "Sales",
        },
        {
            "account_name": "Other income",
            "account_number": "11000",
            "sector_code": "S4",
            "sector_name": "Other income",
        },
        {
            "account_name": "Cost of sales",
            "account_number": "20000",
            "sector_code": "S2",
            "sector_name": "Cost of Sales",
        },
        {
            "account_name": "Direct Expenses",
            "account_number": "21000",
            "sector_code": "S3",
            "sector_name": "Direct expenses",
        },
        {
            "account_name": "Accounting / Audit Fees",
            "account_number": "30010",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Advertising & Promotions",
            "account_number": "30020",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Amortisation",
            "account_number": "30030",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Bad Debts",
            "account_number": "30040",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Bank Charges",
            "account_number": "30050",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Computer Expenses",
            "account_number": "30060",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Consultancy",
            "account_number": "30070",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Depreciation",
            "account_number": "30080",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Electricity and water",
            "account_number": "30090",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Finance charges",
            "account_number": "30100",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Fuel and oils",
            "account_number": "30110",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Insurance",
            "account_number": "30120",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Internet & Email",
            "account_number": "30130",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Cloud charges",
            "account_number": "30131",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Legal Fees",
            "account_number": "30140",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Meeting expenses",
            "account_number": "30150",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Miscellaneous Expenses",
            "account_number": "30160",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Motor Vehicle repairs and maintenance",
            "account_number": "30170",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Pension contributions",
            "account_number": "30180",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Parking",
            "account_number": "30190",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "PAYE",
            "account_number": "30200",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Printing & Stationery",
            "account_number": "30210",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Profit/(Loss) on foreign exchange",
            "account_number": "30220",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Rates",
            "account_number": "30230",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Rent",
            "account_number": "30240",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Repairs & Maintenance",
            "account_number": "30250",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Salaries & Wages",
            "account_number": "30260",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Staff Training",
            "account_number": "30270",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Staff Welfare",
            "account_number": "30280",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Subscriptions",
            "account_number": "30290",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Teas & Cleaning",
            "account_number": "30300",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Telephone Costs",
            "account_number": "30310",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Mobile expenses",
            "account_number": "30311",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Travel Costs external",
            "account_number": "30320",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Travel costs internal",
            "account_number": "30330",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Cost - Fixed Assets",
            "account_number": "40010",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Cost - Computers",
            "account_number": "40020",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Cost - Furniture & Fittings",
            "account_number": "40030",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Cost - Land & Buildings",
            "account_number": "40040",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Cost - Motor Vehicles",
            "account_number": "40050",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Cost - Office Equipment",
            "account_number": "40060",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Fixed Assets",
            "account_number": "41010",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Computers",
            "account_number": "41020",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Furniture & Fittings",
            "account_number": "41030",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Land & Buildings",
            "account_number": "41040",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Motor Vehicles",
            "account_number": "41050",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Accumulated Depreciation - Office Equipment",
            "account_number": "41060",
            "sector_code": "S6",
            "sector_name": "Fixed Assets",
        },
        {
            "account_name": "Investments",
            "account_number": "50010",
            "sector_code": "S7",
            "sector_name": "Investments",
        },
        {
            "account_name": "Petty-Cash",
            "account_number": "60010",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Bank",
            "account_number": "60020",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Trade debtors",
            "account_number": "60030",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Trade debtors (ZWG)",
            "account_number": "60035",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Prepayments",
            "account_number": "60040",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Stock",
            "account_number": "60050",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Other current assets",
            "account_number": "60060",
            "sector_code": "S8",
            "sector_name": "Current Assets",
        },
        {
            "account_name": "Share Capital",
            "account_number": "70010",
            "sector_code": "S9",
            "sector_name": "Equity & Reserves",
        },
        {
            "account_name": "Retained Income",
            "account_number": "70020",
            "sector_code": "S9",
            "sector_name": "Equity & Reserves",
        },
        {
            "account_name": "Long term loans",
            "account_number": "80010",
            "sector_code": "S10",
            "sector_name": "Long Term Liabilities",
        },
        {
            "account_name": "Trade creditors",
            "account_number": "90010",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "Accruals",
            "account_number": "90020",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "Provisions",
            "account_number": "90030",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "Other current liabilities",
            "account_number": "90040",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "VAT Control Account",
            "account_number": "90050",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "VAT Control Account (ZWG)",
            "account_number": "90055",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
        {
            "account_name": "Income Tax",
            "account_number": "90060",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding account sectors..."))

        # Get unique sectors from the data
        unique_sectors = {
            (entry["sector_code"], entry["sector_name"]) for entry in self.ACCOUNTS_DATA
        }

        for code, name in unique_sectors:
            AccountType.objects.get_or_create(
                code=code,
                defaults={"name": name, "account_type": self.get_sector_type(name)},
            )

        self.stdout.write(self.style.SUCCESS("Account sectors seeded."))

        self.stdout.write(self.style.SUCCESS("Seeding sales accounts..."))

        for entry in self.ACCOUNTS_DATA:
            sector = AccountType.objects.get(code=entry["sector_code"])
            GeneralLedgerAccount.objects.get_or_create(
                account_number=entry["account_number"],
                defaults={
                    "account_name": entry["account_name"],
                    "account_type": sector,
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded sectors and general ledger accounts."
            )
        )

    def get_sector_type(self, name):
        """Helper method to determine sector type based on sector name."""
        if "contra asset" in name.lower():
            return "contra_asset"
        elif "contra liability" in name.lower():
            return "contra_liability"
        elif "contra equity" in name.lower():
            return "contra_equity"
        elif "asset" in name.lower():
            return "asset"
        elif "liabilities" in name.lower():
            return "liability"
        elif "equity" in name.lower():
            return "equity"
        elif "revenue" in name.lower():
            return "revenue"
        elif "expense" in name.lower():
            return "expense"
        else:
            return "other"
