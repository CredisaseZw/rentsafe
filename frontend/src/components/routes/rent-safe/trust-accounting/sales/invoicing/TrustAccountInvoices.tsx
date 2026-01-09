import { TableBase } from "@/components/general/TableBase"
import TrustAccountBillTableHeader from "./TrustAccountBillTableHeader"
import { TRUST_ACCOUNT_INVOICE_LIST_HEADERS } from "@/constants"
import { TableRow, TableCell } from "@/components/ui/table"

function TrustAccountInvoices() {
  return (
    <div>
        <TrustAccountBillTableHeader
          title="Invoices"
        />
        <div className="mt-5">
          <TableBase 
            headers={TRUST_ACCOUNT_INVOICE_LIST_HEADERS}>
            <TableRow>
              <TableCell className="text-center whitespace-nowrap">
                15-Dec-25
              </TableCell>
              <TableCell className="text-center">
                INV-10234
              </TableCell>
              <TableCell className="text-left">
                Prime Properties
              </TableCell>
              <TableCell className="text-left">
                Smash'd Burgers
              </TableCell>
              <TableCell className="text-center">
                USD
              </TableCell>
              <TableCell className="text-end font-medium">
                1,200.00
              </TableCell>
              <TableCell className="text-end">
                180.00
              </TableCell>
              <TableCell className="text-end font-semibold">
                1,380.00
              </TableCell>
              <TableCell className="text-center">
                View
              </TableCell>
            </TableRow>
          </TableBase>
        </div>
     
    </div>
  )
}

export default TrustAccountInvoices