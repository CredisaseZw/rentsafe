
import json
from datetime import date, datetime, timedelta

from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from inertia import render
from inertia.share import share
from marshmallow import ValidationError

from rentsafe.decorators import clients_required
from rentsafe.helper import *
from rentsafe.models import *
from rentsafe.rent_views.company import generate_otp
from rentsafe.serializers import *

def get_client_company_journals(request):
    if request.method != "POST":
        return JsonResponse(
            {"result": "No companies found.", "status": "failed"}, safe=False
        )
    search_schema = SearchSchema()
    company_data = []
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError as err:
        props = {"errors": str(err)}
        return JsonResponse(props, status=400, safe=False)
    else:
        try:
            return get_company_journals_helper(data, request, company_data)
        except Exception as e:
            return JsonResponse(
                {"error": "company not found", "status": "failed"}, safe=False
            )

def get_creditor_journals(request):
    if request.method != "POST":
        return JsonResponse(
            {"result": "No Creditor found.", "status": "failed"}, safe=False
        )
    search_schema = SearchSchema()
    individual_data = []
    try:
        data = json.loads(request.body)
    except ValidationError as err:
        props = {"errors": err.messages}
        return JsonResponse(props, safe=False)
    else:
        try:
            return get_creditor_helper(data, request, individual_data)
        except:
            ...
        return JsonResponse(
            {"result": "No creditor found.", "status": "failed"}, safe=False
        )

def creditor_debit_journal(request):

    if request.method == "POST":
        lease_id, account_balance, debit_amount, details, end_balance, date = (
            "",
            "",
            "",
            "",
            "",
            "",
        )
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse(
                {"error": "Error occured", "status": "failed"}, safe=False
            )
        if data:
            today = datetime.now().date()
            max_date = today + timedelta(days=1)
            date_error = op_balance_error = False
            for item in data["rows"]:
                lease_id = item.get("leaseId")
                debit_amount = float(item.get("debitAmount"))
                details = item.get("details")
                end_balance = item.get("endBalance")
                date = item.get("date")
                creditor_balance_ob = LeaseReceiptBreakdown.objects.filter(lease_id=lease_id)
               
                if creditor_balance_ob:
                    if creditor_balance_ob.first().created_at.date() <= datetime.strptime(date, "%Y-%m-%d").date() < max_date:
                        total_amount = creditor_balance_ob.last().total_amount - debit_amount
                        new_breakdown = LeaseReceiptBreakdown(
                            lease_id=lease_id,
                            total_amount=total_amount,
                            landlord_id=creditor_balance_ob.first().landlord_id,
                            receipt_number="Creditor DBT#" + str(random.randint(1000, 9999)),
                            amount_paid=debit_amount,
                            date_received=date,
                        )   
                        new_breakdown.save()
                    else:
                        date_error = True
                else:
                    op_balance_error = True
            if date_error:
                return JsonResponse(
                    {
                        "error": "Debits before opening balances and after today are not allowed!",
                        "status": "failed",
                    },
                    safe=False,
                )
            if op_balance_error:
                return JsonResponse({"error": "No Opening balance found"}, safe=False)
            return JsonResponse({"status": "success"}, safe=False)
    return render(request, "Client/Accounting/AccountAdjustment/CreditorDebitJournal")

def creditor_credit_journal(request,lease_no=None):
    if request.method == "POST":
        
        lease_id, account_balance, debit_amount, details, end_balance, date = (
            "",
            "",
            "",
            "",
            "",
            "",
        )
        
        if lease_no:
            last_balance = LeaseReceiptBreakdown.objects.filter(lease_id=lease_no).last()
            data ={'rows': [{'id': 1, 'date': datetime.now().date(), 'customerType': 'individual', 'customerName': 'N/A', 'details': 'Cleared balance after termination', 'accountBalance': f'{last_balance.total_amount}', 'creditAmount': f'{last_balance.total_amount}', 'endBalance': '', 'leaseId': lease_no, 'endDate': timezone.now()}]}
        else:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError as e:
                return JsonResponse(
                    {"failed": "Error occured", "status": "failed"}, safe=False
                )
        if data:
            today = datetime.now().date()
            date_error = op_balance_error = False
            max_date = today + timedelta(days=1)
            for item in data["rows"]:
                if not lease_no:
                    lease_id = item.get("leaseId")
                    credit_amount = float(item.get("creditAmount"))
                    details = item.get("details")
                    end_balance = item.get("endBalance")
                    date = item.get("date")
                else:
                    lease_id = lease_no
                    date = f"{today}"
                    credit_amount = last_balance.total_amount
                    end_balance =0
                    
                creditor_opening_balance = LeaseReceiptBreakdown.objects.filter(
                    lease_id=lease_id
                )
                if creditor_opening_balance.last():
                    
                    if (
                        creditor_opening_balance.first().created_at.date()
                        <= datetime.strptime(date, "%Y-%m-%d").date()
                        < max_date
                    ):
                        creditor_balance = creditor_opening_balance.last().total_amount + credit_amount
                        new_breakdown = LeaseReceiptBreakdown(
                            lease_id=lease_id,
                            total_amount=creditor_balance,
                            landlord_id=creditor_opening_balance.first().landlord_id,
                            receipt_number="Creditor CRD#" + str(random.randint(1000, 9999)),
                            amount_paid=credit_amount,
                            date_received=date,
                        )   
                        new_breakdown.save()
                        # lease_credit_journal = LeasePayments(
                        #     lease_id=lease_id,
                        #     payment_amount=credit_amount,
                        #     date=date,
                        #     month=datetime.strptime(date, "%Y-%m-%d")
                        #     .date()
                        #     .strftime("%B %Y"),
                        #     payment_reference="Creditor CRD#" + str(random.randint(1000, 9999)),
                        #     description=details or "Creditor Credit",
                        #     owing_amount=end_balance,
                        #     balance_amount=end_balance,
                        #     is_balance_checked=True,
                        # )
                        # lease_credit_journal.save()
                    else:
                        date_error = True
                else:
                    op_balance_error = True
            if date_error:
                return JsonResponse(
                    {
                        "error": "Credit journals before opening balance and after today are not allowed",
                        "status": "failed",
                    },
                    safe=False,
                )
            if op_balance_error:
                return JsonResponse({"error": "No Opening balance found"}, safe=False)
            return JsonResponse({"status": "success"}, safe=False)

    return render(request, "Client/Accounting/AccountAdjustment/CreditorCreditJournal")
