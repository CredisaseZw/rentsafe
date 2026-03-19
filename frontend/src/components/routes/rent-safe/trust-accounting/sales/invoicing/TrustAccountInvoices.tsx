import { TableBase } from "@/components/general/TableBase"
import TrustAccountBillTableHeader from "./TrustAccountBillTableHeader"
import { TRUST_ACCOUNT_INVOICE_LIST_HEADERS } from "@/constants"

function TrustAccountInvoices() {
  return (
    <div>
        <TrustAccountBillTableHeader
          title="Invoices"
        />
        <div className="mt-5">
          <TableBase 
            headers={TRUST_ACCOUNT_INVOICE_LIST_HEADERS}>
              <></>
          </TableBase>
        </div>
     
    </div>
  )
}

export default TrustAccountInvoices