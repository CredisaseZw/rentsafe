import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddSaleItemDialogue from "@/components/routes/rent-safe/accounting/sales/sales-invoice/AddSaleItemDialogue"
import { SALES_ITEMS_HEADERS } from "@/constants"

function SalesItems() {
  return (
    <div>
      <Header title="Sales Items"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="mt-0">
          <SectionHeader
            title="Sales Items List"
            subTitle="sales items"
            total={0}
            subTotal={0}
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Item ID"
              handleSearch={()=>{}}
            />
            <div className="self-center">
              <AddSaleItemDialogue/>
            </div>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase headers={SALES_ITEMS_HEADERS}>
            <></>
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default SalesItems