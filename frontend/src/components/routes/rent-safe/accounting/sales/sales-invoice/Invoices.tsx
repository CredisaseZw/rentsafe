import ColumnsContainer from "@/components/general/ColumnsContainer"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import InvoicesFilter from "./InvoicesFilter"
import AddInvoiceDialogue from "./AddInvoiceDialogue"
import { TableBase } from "@/components/general/TableBase"
import { SALES_INVOICES_HEADERS } from "@/constants"
import { TableRow } from "@/components/ui/table"

function Invoices() {
  return (
    <div>
      <ColumnsContainer numberOfCols={2} >
        <SectionHeader
          title="Invoice Lists"
          subTitle="invoices"
          total={0}
          subTotal={0}
        />
        <div className="self-center flex flex-row justify-end gap-5">
          <Searchbox
            placeholder="Invoice ID"
            handleSearch={()=>{}}
          />
          <div className="self-center">
            <InvoicesFilter/>
          </div>
           <div className="self-center">
            <AddInvoiceDialogue/>
          </div>
        </div>
     </ColumnsContainer>
     <div className="mt-5">
      <TableBase headers={SALES_INVOICES_HEADERS}>
        <TableRow>
        </TableRow>
      </TableBase>
     </div>
    </div>
  )
}

export default Invoices