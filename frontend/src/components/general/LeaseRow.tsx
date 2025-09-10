import { TableCell, TableRow } from "../ui/table";
import StaticBadge from "./StaticBadge";
import ReceiptDialog from "../routes/rent-safe/tenant-leases/ReceiptDialog";
import { Button } from "../ui/button";
import TerminateLeaseDialog from "../routes/rent-safe/tenant-leases/TerminateLeaseDialog";
import type { Lease } from "@/types";
import { getCurrentDate, riskLevelColorCode, summarizeAddress } from "@/lib/utils";

interface Props {
  lease: Lease;
  refetch: () => void;
}

function LeaseRow({ lease, refetch }: Props) {
  const primaryFullname =
    lease.tenants.find((t) => t.is_primary_tenant)?.tenant_object.full_name ?? "";

  const landlordName =
    lease.landlord?.landlord_name ??
    lease.landlord_opening_balances_data?.[0]?.landlord?.landlord_name ??
    "-";

  return (
    <TableRow>
      <TableCell className="text-center">{lease.lease_id}</TableCell>
      <TableCell className="text-center">{primaryFullname}</TableCell>
      <TableCell className="text-center">{landlordName}</TableCell>
      <TableCell className="text-center">{lease.unit.property.type ?? "-"}</TableCell>
      <TableCell className="text-center whitespace-normal break-words max-w-[250px]">
        {lease.unit.property.addresses[0]
          ? summarizeAddress(lease.unit.property.addresses[0])
          : "-"}
      </TableCell>
      <TableCell>
        <StaticBadge bgColor={riskLevelColorCode(lease.risk_level_class)}>
          <span className="text-white font-semibold text-sm py-2">
            <i>({lease.currency.currency_code})</i> {lease.owing}
          </span>
        </StaticBadge>
      </TableCell>
      <TableCell>
        <ReceiptDialog
          lease={{
            lease_id: lease.lease_id,
            id: lease.id,
            customerName: primaryFullname,
            rentOwing: lease.owing,
            payment_date : getCurrentDate()
          }}
        />
      </TableCell>
      <TableCell>
        <StaticBadge bgColor="bg-amber-500">
          <Button variant="ghost">Renew</Button>
        </StaticBadge>
      </TableCell>
      <TableCell>
        <StaticBadge bgColor="bg-red-600">
          <TerminateLeaseDialog
            refetch={refetch}
            tenantName={primaryFullname}
            lease_id={lease.lease_id}
          />
        </StaticBadge>
      </TableCell>
    </TableRow>
  );
}

export default LeaseRow;
