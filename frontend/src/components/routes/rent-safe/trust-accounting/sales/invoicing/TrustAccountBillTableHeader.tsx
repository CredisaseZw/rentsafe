import ColumnsContainer from '@/components/general/ColumnsContainer'
import Searchbox from '@/components/general/Searchbox'
import SectionHeader from '@/components/general/SectionHeader'
import InvoicesFilter from '../../../accounting/sales/sales-invoice/InvoicesFilter'
import AddBillingInformationDialogue from '../../../accounting/sales/sales-invoice/AddBillingInformationDialogue'

interface props {
    title : string,
    total? : number,
    subTotal?: number,
}

function TrustAccountBillTableHeader({title, total, subTotal}:props) {
  return (
    <div>
       <ColumnsContainer numberOfCols={2} >
            <SectionHeader
                title={title}
                total={ total ?? 0}
                subTotal={subTotal ?? 0}
            />
            <div className="self-center flex flex-row justify-end gap-5">
                <Searchbox
                    placeholder={title + " ID"}
                />
                <div className="self-center">
                    <InvoicesFilter/>
                </div>
                <div className="self-center">
                    <AddBillingInformationDialogue/>
                </div>
            </div>
        </ColumnsContainer>
               
    </div>
  )
}

export default TrustAccountBillTableHeader