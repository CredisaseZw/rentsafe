import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import { TableRow, TableCell } from "@/components/ui/table"
import { TENANT_BALANCES_HEADERS } from "@/constants"

function TenantBalancesCombined() {
  return (
    <div>
        <TableBase
            headers={TENANT_BALANCES_HEADERS}
        >
            <TableRow>
                <TableCell className = "text-center">4566</TableCell>
                <TableCell className = "text-end">G. Lopah</TableCell>
                <TableCell className = "flex justify-end ">
                    <div className="w-fit p-2.5 bg-yellow-600 text-white rounded">
                        $45, 766
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex justify-end">
                        <Button>Receipt</Button>
                    </div>
                </TableCell>

            </TableRow>
        </TableBase>
    </div>
  )
}

export default TenantBalancesCombined