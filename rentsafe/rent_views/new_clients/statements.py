import json

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from inertia import render

from authentication.models import *
from rentsafe.helper import *
from django.db.models import Sum
import contextlib


class CommissionType(str, Enum):
    INDIVIDUAL = "individual"
    COMPANY = "company"
    COMBINED = "combined"


# @login_required
def commission_statement(request):
    # get filters
    commission_type = request.GET.get("commission_type", "combined")
    start_date = request.GET.get("start_date", None)
    end_date = request.GET.get("end_date", None)
    month = request.GET.get("month", None)
    year = request.GET.get("year", None)

    statement_rows = []
    lease_receipts = []

    # Lease filters
    lease_filters = {
        "is_active": True,
    }

    # Add commission type filters
    lease_filters["lease_giver"] = request.user.company
    if commission_type == CommissionType.INDIVIDUAL:
        lease_filters["is_individual"] = True
    elif commission_type == CommissionType.COMPANY:
        lease_filters["is_company"] = True
    else:
        pass

    # if request.user.is_superuser:
    # else:
    #     lease_filters["lease_giver"] = request.user.company

    leases = Lease.objects.filter(**lease_filters)

    for lease in leases:

        receipt_filters = {
            "lease_id": lease.lease_id,
        }

        if start_date:
            receipt_filters["date_received__gte"] = start_date
        if end_date:
            receipt_filters["date_received__lte"] = end_date

        if month and year:
            receipt_filters["date_received__month"] = month
            receipt_filters["date_received__year"] = year

        receipts = LeaseReceiptBreakdown.objects.filter(**receipt_filters)

        if not receipts.exists():
            continue

        lease_receipts.extend(receipts)

    tenant_name = ""
    balance = 0
    for receipt in lease_receipts:
        lease = Lease.objects.filter(lease_id=receipt.lease_id).first()
        if not lease or receipt.receipt_number[:3].lower() in ["ope", "dis"]:
            continue
        if lease.is_individual:
            tenant = Individual.objects.filter(
                identification_number=lease.reg_ID_Number
            ).first()
            tenant_name = (
                f"{tenant.firstname} {tenant.surname}" if tenant else "Unknown Tenant"
            )

        elif lease.is_company:
            tenant = Company.objects.filter(id=lease.reg_ID_Number).first()
            tenant_name = tenant.registration_name if tenant else "Unknown Tenant"

        if not tenant_name:
            continue
        balance += float(receipt.commission)
        statement_rows.append(
            {
                "date": receipt.date_received,
                "description": f"{tenant_name} Commission",
                "ref": receipt.receipt_number,
                "amount": receipt.commission,
                "balance": balance,
            }
        )
    props = {"statement": {"rows": statement_rows}}

    return render(request, "Client/Accounting/CommissionStatement", props)


from django.db.models import Sum, Q
from collections import defaultdict


@login_required
def creditor_statements(request):
    props = {"creditors": []}
    # get query params
    items_per_page = request.GET.get("items_per_page", 60)
    page = request.GET.get("page", 1)
    # filters
    filters = {}
    # add user filters
    if request.user.is_superuser:
        filters["user_id"] = request.user.id
    else:
        filters["user_id"] = request.user

    # get landlords
    paginator = Paginator(
        object_list=Lease.objects.filter(lease_giver=request.user.company)
        .all()
        .order_by("created_date"),
        per_page=items_per_page,
    )

    leases = paginator.get_page(page)
    for lease in leases:
        landlord = Landlord.objects.filter(lease_id=lease.lease_id).first()
        if landlord and not landlord.landlord_id:
            landlord.landlord_id = getattr(lease, "landlord_id", None)
            landlord.save(update_fields=["landlord_id"])

        creditor_name = "N/A"
        if landlord:
            creditor_name = landlord.landlord_name
            if total_sum := LeaseReceiptBreakdown.objects.filter(
                lease_id=lease.lease_id
            ).last():
                total_sum = total_sum.total_amount
            else:
                total_sum = 0

            if lease:
                if lease.is_individual:
                    tenant = Individual.objects.filter(
                        identification_number=lease.reg_ID_Number
                    ).first()
                    tenant_name = (
                        f"{tenant.firstname} {tenant.surname}"
                        if tenant
                        else f"Lease ID - {lease.lease_id}"
                    )

                elif lease.is_company:
                    tenant = Company.objects.filter(id=lease.reg_ID_Number).first()
                    tenant_name = (
                        tenant.trading_name
                        if tenant
                        else f"Lease ID - {lease.lease_id}"
                    )
                props["creditors"].append(
                    {
                        "creditor_id": landlord.landlord_id,
                        "lease_id": lease.lease_id,
                        "creditor_name": f"{creditor_name} - {tenant_name}",
                        "address": lease.address,
                        "balance_owed": total_sum,
                    }
                )
        else:
            pass

    props["total_pages"] = paginator.num_pages
    props["total_items"] = paginator.count
    props["current_page"] = page
    props["queryParams"] = request.GET.dict() if request.GET.dict() else None

    return render(request, "Client/Accounting/CreditorStatements", props)


@login_required
def detailed_creditor_statement(request, creditor_id):
    statement_rows = []
    reg_id_number = request.GET.get("reg_id_number")
    landlord = Landlord.objects.filter(landlord_id=creditor_id).last()
    incoming_lease_id = request.GET.get("lease_id")
    # Get all leases for this landlord
    # Get landlord info (use any landlord record with this reg_ID_Number)

    creditor_name = landlord.landlord_name if landlord else "Unknown"
    # Add opening balance
    opening_balance = (
        float(landlord.opening_balance) if landlord and landlord.opening_balance else 0
    )
    statement_rows.append(
        {
            "date": landlord.created_at if landlord else timezone.now(),
            "description": "Opening Balance",
            "ref": "",
            "amount": opening_balance,
            "balance": opening_balance,
        }
    )

    running_balance = opening_balance
    # Get all receipts for all leases of this landlord
    all_receipts = (
        LeaseReceiptBreakdown.objects.filter(lease_id=incoming_lease_id)
        .exclude(receipt_number="Opening Balance")
        .order_by("date_received")
    )
    lease = Lease.objects.filter(lease_id=incoming_lease_id).first()
    # Process each receipt
    tenant_name = "Unknown Tenant"
    if lease:
        if lease.is_individual:
            tenant = Individual.objects.filter(
                identification_number=lease.reg_ID_Number
            ).first()
            if tenant:
                tenant_name = f"{tenant.firstname} {tenant.surname}"
        elif lease.is_company:
            tenant = Company.objects.filter(id=lease.reg_ID_Number).first()
            if tenant:
                tenant_name = tenant.registration_name
    for receipt in all_receipts:
        # Get lease and tenant info
        # Process different types of receipts
        if receipt.receipt_number.startswith("Disbursement receipted"):
            running_balance -= float(receipt.amount_paid)
            amount = -float(receipt.amount_paid)  # Negative for disbursements
            description = f"Disbursement to {creditor_name}"
        elif receipt.receipt_number.startswith("Creditor DBT"):
            running_balance -= float(receipt.amount_paid)
            amount = -float(receipt.amount_paid)  # Negative for debits
            description = receipt.description or ""
        elif receipt.receipt_number.startswith("Creditor CRD"):
            running_balance += float(receipt.amount_paid)
            amount = float(receipt.amount_paid)  # Positive for credits
            description = receipt.description or ""
        else:
            running_balance += float(receipt.base_amount)
            amount = float(receipt.base_amount)  # Positive for rent received
            description = f"{tenant_name} Rent Received"
            if lease:
                description += f" - {lease.address}" if lease.address else ""

        statement_rows.append(
            {
                "date": receipt.date_received,
                "description": description,
                "ref": receipt.receipt_number,
                "amount": amount,
                "balance": running_balance,
            }
        )

    # props = {
    #     "statement": {
    #         "creditor_name": creditor_name,
    #         "reg_id_number": reg_id_number,
    #         "total_leases": len(lease_ids),
    #         "rows": statement_rows
    #     }
    # }
    props = {
        "statement": {"creditor_name": landlord.landlord_name, "rows": statement_rows},
    }

    return render(request, "Client/Accounting/DetailedCreditorStatement", props)


# @login_required
def disbursements(request):
    props = None
    if request.method == "POST":
        # Check if data is sent as JSON
        try:
            data = json.loads(request.body)
            search_value = data.get("search_value", None)
        except json.JSONDecodeError:
            # Fallback to form-encoded (e.g., standard HTML form)
            search_value = request.POST.get("search_value", None)
        leases: list[Lease] = []
        disbursement_data = []
        lease_receipts: list[LeaseReceiptBreakdown] = []

        # Querying Landlord details with search_value
        number_part_in_search = re.search(r"\d+", search_value)
        print("the incoming search value is ", search_value)
        number = number_part_in_search.group() if number_part_in_search else None
        if number:
            landlord_details = Landlord.objects.filter(
                Q(reg_ID_Number__iexact=search_value) | Q(lease_id__iexact=number)
            ).first()
        else:
            landlord_details = Landlord.objects.filter(
                Q(reg_ID_Number__iexact=search_value)
                | Q(landlord_name__icontains=search_value)
            ).first()
        if landlord_details:
            print("landlord details found ", landlord_details.landlord_name)
            # Find Lease associated with landlord
            try:
                print("about to query leases")

                lease_ob = Lease.objects.filter(
                    landlord_id=landlord_details.landlord_id
                )

            except Exception as e:
                print("LEASE ERROR:", str(e))
                return JsonResponse(
                    {"error": str(e)},
                    status=500,
                )
            if lease_ob:
                for lease_item in lease_ob:
                    # Fetch Lease Receipt Breakdown
                    lease_receipts = LeaseReceiptBreakdown.objects.filter(
                        lease_id=lease_item.lease_id
                    ).last()
                    if not lease_receipts:
                        continue
                    if lease_item.is_individual:
                        tenant = Individual.objects.filter(
                            identification_number=lease_item.reg_ID_Number
                        ).first()
                        tenant_name = (
                            f"{tenant.firstname} {tenant.surname}"
                            if tenant
                            else "Unknown Tenant"
                        )
                    elif lease_item.is_company:
                        tenant = Company.objects.filter(
                            id=lease_item.reg_ID_Number
                        ).first()
                        tenant_name = (
                            tenant.registration_name if tenant else "Unknown Tenant"
                        )
                    disbursement = {
                        "date": (
                            lease_receipts.date_received
                            if lease_receipts
                            else datetime.now().date()
                        ),
                        "landlord_name": landlord_details.landlord_name,
                        "landlord_id": landlord_details.landlord_id,
                        "lease_id": lease_item.lease_id,
                        "tenant_name": tenant_name,
                        "amount": (
                            round(float(lease_receipts.total_amount), 2)
                            if lease_receipts
                            else landlord_details.opening_balance
                        ),
                        "reg_number": "",  # landlord_details.reg_ID_Number,
                    }
                    disbursement_data.append(disbursement)
                else:
                    print(
                        "no lease details found for landlord ",
                        landlord_details.landlord_name,
                    )
        props = {"disbursements": disbursement_data}

    return JsonResponse(props, status=200, safe=False)
    # return render(request, "Client/Accounting/Disbursements", props)


@login_required
def create_disbursement(request):
    if request.method == "POST":
        user_id = None

        if request.user.is_superuser:
            user_id = request.user.company
        else:
            user_id = request.user.company

        # get data from request
        data = json.loads(request.body.decode("utf-8"))
        new_balance = 0

        for row in data["disbursements"]:
            landlord_balance = LeaseReceiptBreakdown.objects.filter(
                lease_id=row["lease_id"]
            ).last()
            lease_obj = Lease.objects.filter(lease_id=row["lease_id"]).first()
            if (
                lease_obj.lease_giver != request.user.company
                and lease_obj.lease_activator != request.user.id
            ):
                return JsonResponse({"error": "Unauthorized"}, status=403)
            amount_paid = row["amount_paid"]
            date_to_use = row["date"]
            if landlord_balance:
                new_total_balance = landlord_balance.total_amount - float(
                    row["amount_paid"]
                )
                new_balance = landlord_balance.base_amount - float(row["amount_paid"])
                ref = row["ref"]
                LeaseReceiptBreakdown.objects.create(
                    lease_id=row["lease_id"],
                    landlord_id=landlord_balance.landlord_id,
                    date_received=row["date"],
                    total_amount=new_total_balance,
                    base_amount=new_balance,
                    receipt_number=f"Disbursement receipted #{ref}",
                    amount_paid=row["amount_paid"],
                )

            # create disbursement
            with contextlib.suppress(Exception):
                disbursement = Disbursement(
                    user_id=user_id,
                    date=row.get("date", datetime.now().date()),
                    creditor_id=row.get("landlord_id", None),
                    ref=row.get("ref", ""),
                    details=row.get("details", ""),
                    amount_paid=row.get("amount_paid", 0),
                )
                disbursement.save()
            landlord_obj = Landlord.objects.filter(
                lease_id=landlord_balance.lease_id
            ).first()
            creditor_company = Company.objects.filter(id=request.user.company).first()
            company_name = getattr(creditor_company, "trading_name", "").title() or (
                request.user.firstname if request.user else "Rental Manager"
            )
            if landlord_obj:

                if landlord_obj.is_individual:
                    landlord = Individual.objects.filter(
                        identification_number=landlord_obj.reg_ID_Number
                    ).first()
                    landlord_name = (
                        f"{landlord.firstname} {landlord.surname}"
                        if landlord
                        else "Creditor"
                    )
                    phone_or_email = landlord.mobile
                    contact_type = "individual"
                else:
                    landlord = Company.objects.filter(
                        id=landlord_obj.landlord_id
                    ).first()
                    landlord_name = (
                        landlord.registration_name if landlord else "Creditor"
                    )
                    landlord_email = CompanyProfile.objects.filter(
                        company=landlord.id
                    ).first()
                    phone_or_email = landlord_email.email if landlord_email else None
                    contact_type = "company"
                if not landlord_obj.landlord_id:
                    landlord_obj.landlord_id = landlord.id if landlord else None
                    landlord_obj.save(update_fields=["landlord_id"])
                    if not lease_obj.landlord_id:
                        lease_obj.landlord_id = landlord.id if landlord else None
                        lease_obj.save(update_fields=["landlord_id"])

                other_landlord_profiles = Landlord.objects.filter(
                    reg_ID_Number=landlord_obj.reg_ID_Number
                ).exclude(lease_id=landlord_balance.lease_id)
                for other_profile in other_landlord_profiles:
                    if not other_profile.landlord_id:
                        other_profile.landlord_id = landlord.id
                        other_profile.save(update_fields=["landlord_id"])
                        if not lease_obj.landlord_id:
                            lease_obj.landlord_id = landlord.id
                            lease_obj.save(update_fields=["landlord_id"])
                registration_message = f"From {company_name}.Hallo {landlord_name}.This is a confirmation  of payment to you of {lease_obj.currency.upper()}{amount_paid} on {date_to_use} for {lease_obj.address}."
                send_otp.delay(
                    "",
                    "",
                    phone_or_email,
                    request.user.id,
                    landlord.id,
                    contact_type,
                    settings.PAYMENT_RECEIPT,
                    registration_message,
                    True,
                )

        props = {"status": "success"}
        return JsonResponse(props, safe=False)


@login_required
def forecasts(request):
    sample_statement_rows = [
        {
            "customer": "Example Customer",
            "zero_to_seven_days": 0,
            "eight_to_fourteen_days": 10,
            "fifteen_to_twenty_one_days": 20,
            "twenty_one_plus_days": 30,
            "total": 60,
        },
        {
            "customer": "Example Customer 2",
            "zero_to_seven_days": 0,
            "eight_to_fourteen_days": 0,
            "fifteen_to_twenty_one_days": 2,
            "twenty_one_plus_days": 400,
            "total": 402,
        },
        {
            "customer": "Example Customer 3",
            "zero_to_seven_days": 0,
            "eight_to_fourteen_days": 0,
            "fifteen_to_twenty_one_days": 0,
            "twenty_one_plus_days": 1000,
            "total": 1000,
        },
        {
            "customer": "Example Customer 3",
            "zero_to_seven_days": 5400,
            "eight_to_fourteen_days": 0,
            "fifteen_to_twenty_one_days": 100,
            "twenty_one_plus_days": 0,
            "total": 5500,
        },
    ]

    # props = {"statement": {"rows": sample_statement_rows}}
    props = {}
    return render(request, "Client/Accounting/Forecasts", props)
