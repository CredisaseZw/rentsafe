import { TableCell, TableRow } from "../ui/table";
import StaticBadge from "./StaticBadge";
import ReceiptDialog from "../routes/rent-safe/tenant-leases/ReceiptDialog";
import TerminateLeaseDialog from "../routes/rent-safe/tenant-leases/TerminateLeaseDialog";
import type { Lease, LeaseReceiptPayload } from "@/types";
import { getCurrentDate, riskLevelColorCode, summarizeAddress } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical, } from "lucide-react";
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks";
import { Link } from "react-router";
import ActivateLease from "../routes/rent-safe/tenant-leases/ActivateLease";
import RenewLeaseDialog from "../routes/rent-safe/tenant-leases/RenewLeaseDialog";

interface Props {
  lease: Lease;
  onSuccessCallback : (payload?: LeaseReceiptPayload[] ) => void
  refetch: () => void;
}

function LeaseRow({ lease, refetch, onSuccessCallback }: Props) {
  const primaryFullname =
    lease.tenants.find((t) => t.is_primary_tenant)?.tenant_object?.full_name ?? "";

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
            <i>({lease.currency.symbol})</i> {lease.owing}
          </span>
        </StaticBadge>
      </TableCell>
      <TableCell>
        <ReceiptDialog
          onSuccessCallback={onSuccessCallback}
          lease={{
            lease_id: lease.lease_id,
            id: lease.id,
            is_rent_variable : lease.is_rent_variable,
            customerName: primaryFullname,
            rentOwing: lease.owing,
            payment_date : getCurrentDate()
          }}
        />
      </TableCell>
      <TableCell>
      {
        new Date(lease.end_date) < new Date(getCurrentDate()) ? (
          <RenewLeaseDialog
            tenantName={primaryFullname ?? "-"}
            lease_id={lease.lease_id}
            refetch={refetch}
          />
        ) : (
          <ActivateLease
            leaseID={lease.lease_id}
            state="update"
          />
        )
      }
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical size={18}/>
          </PopoverTrigger>
          <PopoverContent>
            <Link to={`${RENTSAFE_PRE_SEG}/tenants/tenant-statement/${lease.lease_id}`} className="flex flex-row gap-3 justify-center items-center hover:text-green-600">
              <span className="text-sm dark:text-white text-gray-600">View More</span>
            </Link>
            <TerminateLeaseDialog
                optional = {true}
                refetch={refetch}
                tenantName={primaryFullname}
                lease_id={lease.lease_id}
              />
          </PopoverContent>
      </Popover>

      </TableCell>
    </TableRow>
  );
}

export default LeaseRow;
