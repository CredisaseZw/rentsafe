"""Management command to seed Trust General Ledger accounts and sectors."""

from django.core.management.base import BaseCommand
from apps.accounting.models.models import AccountType
from apps.trust_accounting.models.models import TrustGeneralLedger


class Command(BaseCommand):
    """
    Django management command to seed Trust General Ledger accounts and sectors.
    """

    help = "Seeds trust account sectors and trust general ledger accounts"

    ACCOUNTS_DATA = [
        {
            "account_name": "Rental Income",
            "account_number": "T10001",
            "sector_code": "S1",
            "sector_name": "Revenue",
        },
        {
            "account_name": "Late Fees",
            "account_number": "T10002",
            "sector_code": "S1",
            "sector_name": "Revenue",
        },
        {
            "account_name": "Parking fees",
            "account_number": "T10003",
            "sector_code": "S1",
            "sector_name": "Revenue",
        },
        {
            "account_name": "Operating Expenses Recovery",
            "account_number": "T10004",
            "sector_code": "S1",
            "sector_name": "Revenue",
        },
        {
            "account_name": "Other Income",
            "account_number": "T10005",
            "sector_code": "S1",
            "sector_name": "Revenue",
        },
        {
            "account_name": "Insurance",
            "account_number": "T30010",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "General Expenses",
            "account_number": "T30020",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Legal fees",
            "account_number": "T30030",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Marketing",
            "account_number": "T30040",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Operating expenses",
            "account_number": "T30050",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Professional fees",
            "account_number": "T30060",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Property Taxes",
            "account_number": "T30070",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Repairs and Maintenance",
            "account_number": "T30080",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Security",
            "account_number": "T30090",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Utilities",
            "account_number": "T30100",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Wages and salaries",
            "account_number": "T30110",
            "sector_code": "S5",
            "sector_name": "Expenses",
        },
        {
            "account_name": "Landlord VAT",
            "account_number": "T90050",
            "sector_code": "S11",
            "sector_name": "Current Liabilities",
        },
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding trust account sectors..."))

        # Get unique sectors from the data
        unique_sectors = {
            (entry["sector_code"], entry["sector_name"]) for entry in self.ACCOUNTS_DATA
        }

        for code, name in unique_sectors:
            AccountType.objects.get_or_create(
                code=code,
                defaults={
                    "name": name,
                    "account_type": self.get_sector_type(name),
                },
            )

        self.stdout.write(self.style.SUCCESS("Trust account sectors seeded."))

        self.stdout.write(
            self.style.SUCCESS("Seeding trust general ledger accounts...")
        )

        for entry in self.ACCOUNTS_DATA:
            sector = AccountType.objects.get(code=entry["sector_code"])
            TrustGeneralLedger.objects.get_or_create(
                account_number=entry["account_number"],
                defaults={
                    "account_name": entry["account_name"],
                    "account_type": sector,
                    "is_system_account": True,
                    "is_contra_account": False,
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded trust sectors and general ledger accounts."
            )
        )

    def get_sector_type(self, name):
        """Helper method to determine sector type based on sector name."""
        lower = name.lower()
        if "contra asset" in lower:
            return "contra_asset"
        elif "contra liability" in lower:
            return "contra_liability"
        elif "contra equity" in lower:
            return "contra_equity"
        elif "asset" in lower:
            return "asset"
        elif "liabilities" in lower or "liability" in lower:
            return "liability"
        elif "equity" in lower:
            return "equity"
        elif ("revenue" in lower) or ("income" in lower) or ("sales" in lower):
            return "revenue"
        elif ("expense" in lower) or ("cost " in lower):
            return "expense"
        else:
            return "other"
