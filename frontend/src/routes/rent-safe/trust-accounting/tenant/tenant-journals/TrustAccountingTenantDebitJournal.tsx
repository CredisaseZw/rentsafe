import Header from "@/components/general/Header"
import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { TRUST_ACCOUNTS_TENANT_DC_JOURNAL_HEADERS } from "@/constants"
import { Plus } from "lucide-react"

function TrustAccountingTenantDebitJournal() {
  return (
    <div>
      <Header title="Tenant Debit Journal" variant={"success"}/>
      <div className="main-card">
        <TableBase
          headers={TRUST_ACCOUNTS_TENANT_DC_JOURNAL_HEADERS}
        >
          <TableRow>
            <TableCell className="text-center whitespace-nowrap">17-Dec-25</TableCell>
            <TableCell className="text-center"> TDJ87 </TableCell>
            <TableCell className="text-left"> Smash'd Burgers </TableCell>
            <TableCell className="text-left max-w-md">
              Late fees Nov25 and Dec25 rent
            </TableCell>
            <TableCell className="text-end font-medium">
              $282.45
            </TableCell>
            <TableCell className="text-center">
              -
            </TableCell>
          </TableRow>
        </TableBase>
        <div className="mt-5 w-full flex justify-end">
          <div className="w-fit flex flex-row gap-3">
            <Button variant={"outline"}><Plus/> Add Row</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustAccountingTenantDebitJournal