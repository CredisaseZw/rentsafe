import ColumnsContainer from "@/components/general/ColumnsContainer"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import { SALES_INVOICES_HEADERS } from "@/constants"
import { TableRow } from "@/components/ui/table"
import AddInvoiceDialogue from "@/components/routes/rent-safe/accounting/sales/sales-invoice/AddInvoiceDialogue"
import FilterPopover from "@/components/routes/rent-safe/accounting/sales/sales-invoice/InvoicesFilter"
import Header from "@/components/general/Header"

function SalesCreditNote() {
  return (
    <div>
      <Header title="Credit Note" variant="danger"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} >
          <SectionHeader
            title="Credit Note List"
            subTitle="credit notes"
            total={0}
            subTotal={0}
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Invoice ID"
            />
            <div className="self-center">
              <FilterPopover/>
            </div>
            <div className="self-center">
              <AddInvoiceDialogue title = "Add Credit Note"/>
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
    </div>
  )
}

export default SalesCreditNote