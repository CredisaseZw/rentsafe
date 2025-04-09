from rentsafe.models import Lease

tagert_leases = Lease.objects.filter(is_active=True, is_terminated=True)
for lease in tagert_leases:
    if not lease.rent_guarantor_id:
        lease.rent_guarantor_id = 'N/A'
    if not lease.lease_details:
        lease.lease_details = 'Rent'
    lease.is_terminated = False
    lease.termination_date = None
    lease.save()
    print(f"Lease {lease.lease_id} has been updated.")