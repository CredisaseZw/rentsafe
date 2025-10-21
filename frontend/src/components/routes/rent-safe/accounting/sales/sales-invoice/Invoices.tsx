import ColumnsContainer from "@/components/general/ColumnsContainer"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import FilterPopover from "./FilterPopover"
import AddInvoiceDialogue from "./AddInvoiceDialogue"

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
            <FilterPopover/>
          </div>
           <div className="self-center">
            <AddInvoiceDialogue/>
          </div>
        </div>
     </ColumnsContainer>
    </div>
  )
}

export default Invoices