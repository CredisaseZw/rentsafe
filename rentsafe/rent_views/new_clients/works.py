from rentsafe.models import *
from django.db.models import Q
from django.db.models import Count
from rentsafe.serializers import CreateMaintenanceScheduleSchema
from datetime import datetime, timedelta
from django.http import JsonResponse
from marshmallow import ValidationError
from inertia import render

def create_maintenance_schedule(request):
    schema = CreateMaintenanceScheduleSchema()

    try:
        data = schema.loads(request.body)
    except ValidationError as err:
        return JsonResponse(
            {
                "status": "error",
                "message": "Validation failed while loading request data.",
                "errors": err.messages
            },
            status=400
        )

    try:
        maintenance_schedule_data = {
            key: value for key, value in data.items() if key != "scheduled_date" or key != "frequency"
        }

        if "scheduled_date" in data:
            maintenance_schedule_data["scheduled_date"] = datetime.strptime(
                data["scheduled_date"], "%Y-%m-%d"
            ).date()
        maintenance_schedule = MaintenanceSchedule.objects.create(**maintenance_schedule_data)
        maintenance_schedule.user_id=request.user.id
        maintenance_schedule.company_id=request.user.company
        maintenance_schedule.save()
        client = None
        try:
            if lease:=Lease.objects.filter(lease_id=maintenance_schedule.lease_id).first():
                if lease.is_individual:
                    client = Individual.objects.filter(
                        identification_number=lease.reg_ID_Number.upper()
                    ).first()

                elif lease.is_company:
                    client = Company.objects.filter(id=lease.reg_ID_Number).first()
            # CommsHistMessage.objects.create(
            #         user_id=request.user.company,
            #         user=request.user.id,
            #         client_id=client.id,
            #         message=f"Maintenance: {maintenance_schedule.title} scheduled for {maintenance_schedule.scheduled_day.title()}",
            #         is_sms=False,
            #         is_email=False
            #     )
        except Exception as e:
            print('error',e)
        return JsonResponse(
            {
                "status": "success",
                "message": "Maintenance schedule created successfully",
                "data": {
                    "id": maintenance_schedule.id,
                    "details":f"Maintenance: {maintenance_schedule.title} scheduled for {maintenance_schedule.scheduled_day.title()}"
                }
            },
            status=201
        )
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                "traceback": error_trace
            },
            status=500
        )


def get_balance_and_color(lease_id):
    opening_balance = Opening_balance.objects.filter(lease_id=lease_id).last()
    if opening_balance:
        last_balance = opening_balance.outstanding_balance

    lease = Lease.objects.filter(lease_id=lease_id).first()
    if lease:
        currency = lease.currency
        if lease.status_cache in ["HIGH","HIGH-HIGH"]:
            color = "red"
        elif lease.status_cache =="MEDIUM":
            color = "orange"
        elif lease.status_cache =="NON-PAYER":
            color = "black"
        else:
            color = "green"
    return last_balance, color, currency

def get_tenant_name(tenant_lease_ob):
    if tenant_lease_ob.is_company:
        tenant_name_ob = Company.objects.filter(id=tenant_lease_ob.reg_ID_Number).first() 
        tenant_name = tenant_name_ob.registration_name if tenant_name_ob else 'N/A'  
    else: 
        tenant_name_ob = Individual.objects.filter(identification_number=tenant_lease_ob.reg_ID_Number).first()
        tenant_name = tenant_name_ob.firstname + ' ' + tenant_name_ob.surname if tenant_name_ob else 'N/A'
    return tenant_name

def todo_list(request):
    try:
        today = datetime.now().date()
        tomorrow = today - timedelta(days=1)
        last_balance = 0
        color = "green"
        currency ="USD"
        tasks,reminders_list,maintenance_list =[],[],[]
        last_balance,color = None, None
        work_schedules = WorkSchedule.objects.filter(Q(status__in = ["PENDING","DONE"]) & Q(scheduled_date__lte=today)  & Q(user_id=request.user.id)
        ).values()
        for work_schedule in work_schedules:
            if work_schedule.get("responsible_person") =="tenant":
                last_balance, color, currency = get_balance_and_color(work_schedule.get("lease_id"))
                
                tenant_lease_ob = Lease.objects.filter(lease_id=work_schedule.get("lease_id")).first()
                tenant_name = get_tenant_name(tenant_lease_ob)
                work_schedule['title'] = tenant_name +" "+work_schedule.get("title",'')
            if work_schedule.get("updated_at").date() == today and work_schedule["status"] == "DONE":
                tasks.append({**work_schedule, "function": "works","last_balance":last_balance})
            elif work_schedule["status"] == "PENDING":
                tasks.append({**work_schedule, "function": "works","last_balance":last_balance})
            else:
                pass
        note_reminders = CommunicationHistoryReminder.objects.filter(Q(action_date__lte=today) & Q(user=request.user.id,is_sms=False, is_email=False)
        ).all()
        
        for note_reminder in note_reminders:
            if note_reminder.message.endswith('#REMINDER'):
                tasks.append({
                    'id': note_reminder.id,
                    'company_id': note_reminder.user_id,
                    'user_id': note_reminder.user_id,
                    'created_at': note_reminder.created_at,
                    'updated_at': note_reminder.updated_at,
                    'lease_id': None,
                    'details': note_reminder.message.strip('#REMINDER'), 
                    'title': note_reminder.message.strip('#REMINDER'), 
                    'scheduled_date': note_reminder.action_date,
                    'is_creditor': False,
                    'status': 'PENDING',
                    "function": "reminder",
                    })
            
            # if note_reminder.endswith('#REMINDER'):
            #     tasks.append({**note_reminder, "function": "reminder"})
        reminders= PaymentPlan.objects.filter(Q(status__in = ["PENDING","DONE"]) &
            Q(expected_pay_date__lt=today) & Q(user=request.user.id)
        ).values()
        for reminder in reminders:
            last_balance, color, currency = get_balance_and_color(reminder.get("lease_id"))
            tenant_lease_ob = Lease.objects.filter(lease_id=reminder.get("lease_id")).first()
            tenant_name = get_tenant_name(tenant_lease_ob)            
            new_reminders = {**reminder}
            if new_reminders.get("is_creditor"):
                details = f"Remember to pay {currency}{new_reminders['amount']} on {new_reminders['expected_pay_date']} to {new_reminders['spoke_with']}"
                reminders_list.append({**reminder, "function": "landlord","details":details, "current_balance": last_balance, "color": color})
            else:
                details = f"{tenant_name} - {new_reminders['spoke_with']} promised to pay {currency}{new_reminders['amount']} on {new_reminders['expected_pay_date']}"
                reminders_list.append({**reminder, "function": "tenant","details":details, "current_balance": last_balance, "color": color})
        maintenance_schedules = MaintenanceSchedule.objects.filter(Q(status__in =["PENDING","DONE"]) &
            Q(created_at__lte=today) & Q(user_id=request.user.id) 
        ).values()
        for maintenance_schedule in maintenance_schedules:
            new_maintenance_schedule = {**maintenance_schedule}
            if maintenance_schedule.get("responsible_person") =="tenant":
                
                last_balance, color, currency = get_balance_and_color(maintenance_schedule.get("lease_id"))
                tenant_lease_ob = Lease.objects.filter(lease_id=maintenance_schedule.get("lease_id")).first()
                tenant_name = get_tenant_name(tenant_lease_ob)
                maintenance_schedule['title'] = tenant_name +" "+maintenance_schedule.get("title",'')
            if new_maintenance_schedule.get("status") == "DONE" and new_maintenance_schedule.get("updated_at").date() == today:
                tasks.append({**maintenance_schedule, "function": "works","scheduled_date":new_maintenance_schedule.get("created_at").date(),"last_balance":last_balance})
            elif new_maintenance_schedule.get("status") == "PENDING":
                tasks.append({**maintenance_schedule, "function": "works","scheduled_date":new_maintenance_schedule.get("created_at").date(),"last_balance":last_balance})
            else:
                ...

        return render(request, "Client/TodoList", 
            {
                "status": "success",
                "message": "Work schedules fetched successfully",
                "works": tasks,
                "reminders": reminders_list,
                "maintenance": maintenance_list
            })

    except Exception as e:
        print('error',e)
        import traceback
        error_trace = traceback.format_exc()
        return render(request, "Client/TodoList", 
            {
                "status": "error",
                "message": str(e),
                "traceback": error_trace
            })
    

def delete_work_schedule(request, work_schedule_id):
    data = json.loads(request.body)
    type_ = data.get("type")
    try:
        if type_ == "maintenance": 
            work_schedule = MaintenanceSchedule.objects.get(id=work_schedule_id)
        elif type_ == "works":
            work_schedule = WorkSchedule.objects.get(id=work_schedule_id)
        elif type_ == "reminder":
            work_schedule = PaymentPlan.objects.get(id=work_schedule_id)
        else:
            return JsonResponse(
                {
                    "status": "error",
                    "message": "Work schedule not found",
                    "type_": type_,
                    "work_schedule_id": work_schedule_id
                },
                status=404
            )
        work_schedule.delete()
        return JsonResponse(
            {
                "status": "success",
                "message": "Work schedule deleted successfully"
            },
            status=200
        )
    except WorkSchedule.DoesNotExist:
        return JsonResponse(
            {
                "status": "error",
                "message": "Work schedule not found"
            },
            status=404
        )
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                "traceback": error_trace
            },
            status=500
        )

def resolve_task(request, work_schedule_id):
    data = json.loads(request.body)
    type_ = data.get("type")
    try:
        if type_ == "maintenance":
            work_schedule = MaintenanceSchedule.objects.get(id=work_schedule_id)
        elif type_ == "works":
            work_schedule = WorkSchedule.objects.get(id=work_schedule_id)
        else:
            work_schedule = PaymentPlan.objects.get(id=work_schedule_id)
        work_schedule.status = "DONE"
        work_schedule.save()
        return JsonResponse(
            {
                "status": "success",
                "message": "Work schedule resolved successfully"
            },
            status=200
        )
    except WorkSchedule.DoesNotExist:
        return JsonResponse(
            {
                "status": "error",
                "message": "Work schedule not found"
            },
            status=404
        )
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                "traceback": error_trace
            },
            status=500
        )

def create_work_schedule(request):
    schema = CreateMaintenanceScheduleSchema()
    try:
        data = schema.loads(request.body)
    except ValidationError as err:
        return JsonResponse(
            {
                "status": "error",
                "message": "Validation failed while loading request data.",
                "errors": err.messages
            },
            status=400
        )
    try:
        work_schedule_data = {
            key: value for key, value in data.items() if key not in ["frequency", "scheduled_day"]
        }

        if "scheduled_date" in data:
            work_schedule_data["scheduled_date"] = datetime.strptime(
                data["scheduled_date"], "%Y-%m-%d"
            ).date()
        work_schedule = WorkSchedule.objects.create(**work_schedule_data)
        work_schedule.user_id=request.user.id
        work_schedule.company_id=request.user.company
        work_schedule.save()
        client = None
        try:
            if lease:=Lease.objects.filter(lease_id=work_schedule.lease_id).first():
                if lease.is_individual:
                    client = Individual.objects.filter(
                        identification_number=lease.reg_ID_Number.upper()
                    ).first()

                elif lease.is_company:
                    client = Company.objects.filter(id=lease.reg_ID_Number).first()
            # CommsHistMessage.objects.create(
            #         user_id=request.user.company,
            #         user=request.user.id,
            #         client_id=client.id,
            #         message=f"Work schedule: {work_schedule.title} scheduled for {work_schedule.scheduled_date}",
            #         is_sms=False,
            #         is_email=False
            #     )
            
        except Exception as e:
            print('error',e)
        return JsonResponse(
            {
                "status": "success",
                "message": "Work schedule created successfully",
                "data": {
                    "id": work_schedule.id,
                    "details":f"Work schedule {work_schedule.title} scheduled for {work_schedule.scheduled_date}"
                }
            },
            status=201
        )
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return JsonResponse(
            {
                "status": "error",
                "message": str(e),
                "traceback": error_trace
            },
            status=500
        )