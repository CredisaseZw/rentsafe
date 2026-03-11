import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import DeleteTrigger from "@/components/general/DeleteTrigger"
import Header from "@/components/general/Header"
import OptionsWrapper from "@/components/general/OptionsWrapper"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddTrustAccSaleItemDialog from "@/components/routes/rent-safe/trust-accounting/sales/AddTrustAccSaleItemDialog"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, TRUST_ACC_SALES_ITEMS_HEADERS } from "@/constants"
import useOptimisticCacheUpdate from "@/hooks/components/useOptimisticCacheUpdate"
import useTrustAccountingSalesItems from "@/hooks/components/useTrustAccountingSalesItems"
import { handleDeletion } from "@/lib/utils"

function TrustAccountingSalesItems() {
    const {
        salesItems,
        pagination,
        isLoading,
        isError
    } = useTrustAccountingSalesItems()
    const {updateCache}= useOptimisticCacheUpdate()
  return (
    <div>
        <Header 
            title="Trust Account Sales Items"
            variant="success"
        />
        <div className="main-card">
            <ColumnsContainer numberOfCols={2}>
                <SectionHeader
                    title="Trust Account Sales Items"
                    total={pagination?.count ?? 0}
                    subTotal={salesItems.length}
                />
                <div className="flex flex-col gap-3 md:justify-end md:flex-row">
                    <Searchbox placeholder="e.g Item name"/>
                    <AddTrustAccSaleItemDialog/>
                </div>
            </ColumnsContainer>
            <div className="mt-5">
                <TableBase
                    isEmpty = {salesItems.length === 0}
                    paginationData={pagination}
                    isLoading = {isLoading}
                    isError = {isError}
                    headers={TRUST_ACC_SALES_ITEMS_HEADERS}
                >
                    {
                        salesItems.map((item)=>(
                            <TableRow key={item.id}>
                                <TableCell>{item.item_code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.unit_name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.tax_type}</TableCell>
                                <TableCell className="text-end">{item.currency} {item.price}</TableCell>
                                <TableCell className="text-end">{item.currency} {item.price_including_tax}</TableCell>
                                <TableCell className="flex justify-center items-center">
                                    <OptionsWrapper>
                                        <AddTrustAccSaleItemDialog salesItem={item}/>
                                        <DeleteDialogue
                                            trigger = {<DeleteTrigger/>}
                                            mutationFunc={()=> handleDeletion(DELETION_LINKS.TRUST_ACC_SALES_ITEM, item.id)}
                                            keyStore={()=>updateCache({
                                                mode : "deletion",
                                                key : ["trust-account-sales-items"],
                                                id : item.id
                                            })}
                                            value="Sales item"
                                        />
                                    </OptionsWrapper>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBase>

            </div>
        </div>

    </div>
  )
}

export default TrustAccountingSalesItems