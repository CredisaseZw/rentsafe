import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddSaleCategoryDialogue from "@/components/routes/rent-safe/accounting/sales/sales-categories/AddSaleCategoryDialogue"
import { SALES_CATEGORIES_HEADERS } from "@/constants"

function SalesCategories() {
  return (
    <div>
      <Header title="Sale Categories"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="mt-0">
          <SectionHeader
            title="Sales categories"
            subTitle="sale categories"
            total={0}
            subTotal={0}
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Item ID"
              handleSearch={()=>{}}
            />
            <div className="self-center">
              <AddSaleCategoryDialogue/>
            </div>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase headers={SALES_CATEGORIES_HEADERS}>
            <></>
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default SalesCategories