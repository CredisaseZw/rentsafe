from rentsafe.models import *
from authentication.models import CustomUser
from django.http import JsonResponse
from inertia import render
from datetime import timedelta

def get_forecast_inflows(request):
    current_date = datetime.now().date()
    forecast_inflows_list = []
    current_rate = LeaseCurrencyRate.objects.filter(company_id=request.user.company).first()

    payment_plans = PaymentPlan.objects.filter(expected_pay_date__gte=current_date)
    if payment_plans:
        for payment_plan in payment_plans:
            lease = Lease.objects.filter(lease_id=payment_plan.lease_id).first()
            if not lease:
                continue
            
            tenant_name = "N/A"
            if lease.is_company:
                company_obj = Company.objects.filter(id=lease.reg_ID_Number).first()
                tenant_name = company_obj.registration_name if company_obj else "N/A"
            else:
                individual_obj = Individual.objects.filter(identification_number=lease.reg_ID_Number).first()
                if individual_obj:
                    tenant_name = f"{individual_obj.firstname} {individual_obj.surname}"

            tenant_inflows = {
                "tenant": tenant_name,
                "0-7": 0,
                "8-14": 0,
                "14-21": 0,
                "21+": 0,
                "total": 0,
            }
            tenant_payment_plans = PaymentPlan.objects.filter(lease_id=payment_plan.lease_id,expected_pay_date__gte=current_date)
            for plan in tenant_payment_plans:
                days_difference = (plan.expected_pay_date - current_date).days

                if 0 <= days_difference <= 7:
                    tenant_inflows["0-7"] += (float(plan.amount)/current_rate.current_rate) if lease.currency != "USD" else plan.amount
                elif 8 <= days_difference <= 14:
                    tenant_inflows["8-14"] += (float(plan.amount)/current_rate.current_rate) if lease.currency != "USD" else plan.amount
                elif 15 <= days_difference <= 21:
                    tenant_inflows["14-21"] += (float(plan.amount)/current_rate.current_rate) if lease.currency != "USD" else plan.amount
                elif days_difference > 21:
                    tenant_inflows["21+"] += (float(plan.amount)/current_rate.current_rate) if lease.currency != "USD" else plan.amount

                tenant_inflows["total"] += (float(plan.amount)/current_rate.current_rate) if lease.currency != "USD" else plan.amount

            forecast_inflows_list.append(tenant_inflows)

    context = {"forecast_inflows": forecast_inflows_list}
    return render(request, "Client/Accounting/Forecasts", context)
