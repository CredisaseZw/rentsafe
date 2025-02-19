from django_cron import CronJobBase, Schedule
from .models import *
from datetime import datetime, timedelta
import random
from rentsafe.rent_views.clients import update_lease_status

def generate_otp():
    return str(random.randint(100000, 999999))

class LeaseOwingBalances(CronJobBase):
    RUN_AT_TIMES = ['00:00'] # Run the job at 00:00
    RETRY_AFTER_FAILURE_MINS = 20  # Retry the job after 20 minutes if it fails

    schedule = Schedule(run_at_times=RUN_AT_TIMES)
    code = 'rentsafe.lease_owing_amounts'
    def do(self):
        today = datetime.now().date()
        target_date = datetime(today.year, today.month, 25).date()

        if today < target_date:
            target_date = target_date
        else:
            target_date = (today + timedelta(days=32)).replace(day=25)

        leases = Lease.objects.filter(is_active=True, rent_variables=False,is_government=False)
        if leases:
            today_date = datetime.now().date()
            month = today_date.strftime("%B")
            year = today_date.strftime("%Y")
            current_month = f"{month} {year}"
            today_date_obj = datetime.now()
            next_month = (today_date_obj.replace(day=1) + timedelta(days=32)).replace(day=1)
            next_month_name = next_month.strftime("%B %Y")

            for lease in leases:
                if lease.start_date <= today_date:
                    last_payment_record = LeasePayments.objects.filter(lease_id=lease.lease_id).last()
                    last_opening_balance_record = Opening_balance.objects.filter(lease_id=lease.lease_id).last()

                    if last_opening_balance_record:
                        if Opening_balance.objects.filter(lease_id=lease.lease_id).count() <2:
                            last_opening_balance_record=Opening_balance.objects.create(
                                lease_id =lease.lease_id,
                                current_month=last_opening_balance_record.current_month,
                                one_month_back=last_opening_balance_record.one_month_back,
                                two_months_back=last_opening_balance_record.two_months_back,
                                three_months_back=last_opening_balance_record.three_months_back,
                                three_months_plus=last_opening_balance_record.three_months_plus,
                                outstanding_balance=last_opening_balance_record.outstanding_balance,
                            )
                        
                        current_month = float(last_opening_balance_record.current_month)
                        one_months_ago = float(last_opening_balance_record.one_month_back)
                        two_months_ago = float(last_opening_balance_record.two_months_back)
                        three_months_ago = float(last_opening_balance_record.three_months_back)
                        four_months_ago = float(last_opening_balance_record.three_months_plus)
                        outstanding_balance = float(last_opening_balance_record.outstanding_balance)

                    if last_payment_record:
                        saved = False
                        try:
                            if outstanding_balance < 0:
                                last_opening_balance_record.outstanding_balance = outstanding_balance + float(lease.monthly_rentals)
                            else:
                                last_opening_balance_record.three_months_plus = four_months_ago + three_months_ago
                                last_opening_balance_record.three_months_back = two_months_ago
                                last_opening_balance_record.two_months_back = one_months_ago
                                last_opening_balance_record.one_month_back = current_month
                                last_opening_balance_record.current_month = lease.monthly_rentals
                                last_opening_balance_record.outstanding_balance = outstanding_balance + float(lease.monthly_rentals)
                            saved = True
                            try:
                                update_lease_status(lease.lease_id)
                            except:
                                pass
                        except:
                            pass
                        lease_balance = float(last_opening_balance_record.outstanding_balance) + float(lease.monthly_rentals) 
                        invoice_code = generate_otp()
                        lease_payment = LeasePayments(
                            lease_id=lease.lease_id,
                            owing_amount=float(lease.monthly_rentals ),
                            balance_amount=float(lease.monthly_rentals),
                            is_balance_checked=True,
                            payment_reference=f"INV#{invoice_code}",
                            description="invoice",
                            month=next_month_name,
                            date=today_date,
                            payment_amount =0,
                        )
                        if last_payment_record.payment_reference[:4] != "INV#" or last_payment_record.month != next_month_name:
                            lease_payment.save()
                            if saved:
                                last_opening_balance_record.save()
                        else:
                            pass
                        try:
                            invoicing_ob = Invoicing(
                                lease_id=lease.lease_id,
                                amount=float(lease.monthly_rentals),
                                operation_costs=0,
                                ref=f"INV-{invoice_code}",
                                is_invoiced=True,
                                description="auto generated non variable invoice"
                            )
                            invoicing_ob.save()
                        except:
                            pass