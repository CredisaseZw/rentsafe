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
    balance =0
    for receipt in lease_receipts:
        lease = Lease.objects.filter(lease_id=receipt.lease_id).first()
        if not lease or receipt.receipt_number[:3].lower() in ["ope", "dis"]:
            continue  
        if lease.is_individual:
            tenant = Individual.objects.filter(
                identification_number=lease.reg_ID_Number
            ).first()
            tenant_name = f"{tenant.firstname} {tenant.surname}" if tenant else "Unknown Tenant"

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
    object_list=Lease.objects.filter(lease_giver=request.user.company).all().order_by("created_date"),
    per_page=items_per_page,
    )
    
    leases = paginator.get_page(page)
    for lease in leases:
        landlord=Landlord.objects.filter(lease_id=lease.lease_id).first()
        creditor_name ='N/A'
        if landlord:
            creditor_name = landlord.landlord_name
            if total_sum := LeaseReceiptBreakdown.objects.filter(lease_id=lease.lease_id).last():
                total_sum = total_sum.total_amount
            else:
                total_sum =  0
            

            if lease:
                props["creditors"].append(
                    {
                        "creditor_id": landlord.landlord_id,
                        "lease_id": lease.lease_id,
                        "creditor_name": creditor_name,
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
    lease_id = request.GET.get("lease_id", 245)
    lease = Lease.objects.filter(lease_id=lease_id).first()
    all_creditor_statements = LeaseReceiptBreakdown.objects.filter(lease_id=lease_id).all().order_by("date_received")
    creditor_name = ""
    creditor_name = Landlord.objects.filter(lease_id=lease_id).first()
    statement_rows = [
        {
            "date": creditor_name.created_at,
            "description": "Opening Balance",
            "ref": "",
            "amount": float(creditor_name.opening_balance) if creditor_name and creditor_name.opening_balance else 0,
            "balance": float(creditor_name.opening_balance) if creditor_name and creditor_name.opening_balance else 0,
        }
    ]
    balance = float(creditor_name.opening_balance) if creditor_name and creditor_name.opening_balance else 0
    for receipt in all_creditor_statements:
        if receipt.receipt_number=='Opening Balance':
            continue
        if lease and lease.is_individual:
            tenant = Individual.objects.filter(identification_number=lease.reg_ID_Number).first()
            tenant_name = f"{tenant.firstname} {tenant.surname}"
        elif lease and lease.is_company:
            tenant = Company.objects.filter(id=lease.reg_ID_Number).first()
            tenant_name = tenant.registration_name
        if receipt.receipt_number.startswith("Disbursement receipted"):
            balance -= float(receipt.amount_paid)
            amount = float(receipt.amount_paid)
            description = f"Disbursement to {creditor_name.landlord_name}"
        elif receipt.receipt_number.startswith("Creditor DBT"):
            balance -= float(receipt.amount_paid)
            amount = receipt.amount_paid
            description = receipt.receipt_number
        elif receipt.receipt_number.startswith("Creditor CRD"):
            balance += float(receipt.amount_paid)
            amount = receipt.amount_paid
            description = receipt.receipt_number
        else:
            balance += float(receipt.base_amount) 
            amount =receipt.base_amount 
            description = f"{tenant_name} Rent Received"
        statement_rows.append(
            {
                "date": receipt.date_received,
                "description": description,
                "ref": receipt.receipt_number,
                "amount":amount * -1 if receipt.receipt_number.startswith("Disbursement receipted") else amount,
                "balance": balance,
            }
        )

    props = {"statement": {"creditor_name": creditor_name.landlord_name,   "rows": statement_rows},}

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
        landlord_details = Landlord.objects.filter(
            Q(reg_ID_Number__iexact=search_value) | Q(landlord_name__icontains=search_value)
        ).first()
        if landlord_details:
            # Find Lease associated with landlord
            if lease_ob:= Lease.objects.filter(landlord_id=landlord_details.landlord_id).all():
                for lease_item in lease_ob:
                    # Fetch Lease Receipt Breakdown
                    lease_receipts = LeaseReceiptBreakdown.objects.filter(lease_id=lease_item.lease_id).last()
                    disbursement = {
                        "date": lease_receipts.date_received if lease_receipts else datetime.now().date(),
                        "landlord_name": landlord_details.landlord_name,
                        "landlord_id": landlord_details.landlord_id,
                        "lease_id": lease_item.lease_id,
                        "amount": round(float(lease_receipts.total_amount),2) if lease_receipts else landlord_details.opening_balance,
                        "reg_number": landlord_details.reg_ID_Number,
                    }
                    disbursement_data.append(disbursement)

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
            landlord_balance = LeaseReceiptBreakdown.objects.filter(lease_id=row["lease_id"]).last()
            amount_paid= row['amount_paid']
            date_to_use = row['date']
            if landlord_balance:   
                new_total_balance = landlord_balance.total_amount - float(row["amount_paid"])
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
                    date=row["date"],
                    creditor_id=row["creditor"],
                    ref=row["ref"],
                    details=row["details"],
                    amount_paid=row["amount_paid"],
                )
                disbursement.save()
            landlord_obj = Landlord.objects.filter(landlord_id=landlord_balance.landlord_id).first()
            creditor_company = Company.objects.filter(id=request.user.company).first()
            lease_obj = Lease.objects.filter(lease_id=row["lease_id"]).first()
            if landlord_obj:
                if landlord_obj.is_individual:
                    tenant = Individual.objects.filter(identification_number=landlord_obj.reg_ID_Number).first()
                    tenant_name = f"{tenant.firstname} {tenant.surname}"
                    phone_or_email = tenant.mobile
                    contact_type = "individual"
                else:
                    tenant = Company.objects.filter(id=landlord_obj.id).first()
                    tenant_name = tenant.registration_name
                    tenant_email = CompanyProfile.objects.filter(company_id=tenant.id).first()
                    phone_or_email = tenant_email.email if tenant_email else None
                    contact_type = "company"
                registration_message = f"From {creditor_company.registration_name.title()}.Hallo {tenant_name}.This is a confirmation  of payment to you of {lease_obj.currency.upper()}{amount_paid} on {date_to_use} for {lease_obj.address}."
                send_otp.delay(
                '',
                '',
                phone_or_email,
                request.user.id,
                tenant.id,
                contact_type,
                settings.PAYMENT_RECEIPT,
                registration_message,
                True,
                )

        props = {"status": 'success'}
        return JsonResponse(props, safe=False)

@login_required
def forecasts(request):
    sample_statement_rows = [
        {
            'customer': 'Example Customer',
            'zero_to_seven_days': 0,
            'eight_to_fourteen_days': 10,
            'fifteen_to_twenty_one_days': 20,
            'twenty_one_plus_days': 30,
            'total': 60,
        },
        {
            'customer': 'Example Customer 2',
            'zero_to_seven_days': 0,
            'eight_to_fourteen_days': 0,
            'fifteen_to_twenty_one_days': 2,
            'twenty_one_plus_days': 400,
            'total': 402,
        },
        {
            'customer': 'Example Customer 3',
            'zero_to_seven_days': 0,
            'eight_to_fourteen_days': 0,
            'fifteen_to_twenty_one_days': 0,
            'twenty_one_plus_days': 1000,
            'total': 1000,
        },
        {
            'customer': 'Example Customer 3',
            'zero_to_seven_days': 5400,
            'eight_to_fourteen_days': 0,
            'fifteen_to_twenty_one_days': 100,
            'twenty_one_plus_days': 0,
            'total': 5500,
        },
    ]

    # props = {"statement": {"rows": sample_statement_rows}}
    props = {}
    return render(request,"Client/Accounting/Forecasts", props) 




    
