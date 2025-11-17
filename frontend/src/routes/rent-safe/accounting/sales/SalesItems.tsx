import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddSaleItemDialogue from "@/components/routes/rent-safe/accounting/sales/sales-items/AddSaleItemDialogue"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, SALES_ITEMS_HEADERS } from "@/constants"
import useSalesItems from "@/hooks/components/useSalesItems"
import {  getSummaryDate, handleDeletion } from "@/lib/utils"

function SalesItems() {
  const {
    error,
    saleItems,
    isLoading,
    pagination,
  } = useSalesItems();

  return (
    <div>
      <Header title="Sales Items"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="mt-0">
          <SectionHeader
            title="Sales Items List"
            subTitle="sales items"
            total={pagination?.count ?? 0}
            subTotal={saleItems.length }
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Item ID"
            />
            <div className="self-center">
              <AddSaleItemDialogue/>
            </div>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase 
            headers={SALES_ITEMS_HEADERS}
            paginationData={pagination ?? undefined}
            isLoading = {isLoading}
            paginationName="sale_items"
            isError = {Boolean(error)} >
            {
              saleItems.length === 0 && !Boolean(error) &&
              <EmptyTableResponse colSpan={SALES_ITEMS_HEADERS.length}/>
            }
            {
              saleItems.map(s=>(
                <TableRow key={s.id}>
                  <TableCell className="text-center">{s.id}</TableCell>
                  <TableCell className="text-center">{s.category_object.name}</TableCell>
                  <TableCell className="text-left">{s.name}</TableCell>
                  <TableCell className="text-center">{s.price}</TableCell>
                  <TableCell className="text-center">{getSummaryDate(s.date_created)}</TableCell>
                  <TableCell className="flex flex-row gap-5 justify-center items-center">
                    <AddSaleItemDialogue initial={s}/>
                    <DeleteDialogue
                      mutationFunc={()=>handleDeletion(DELETION_LINKS.SALES_ITEMS,s.id)}
                      keyStore="salesItems"
                      value="Sales Item"
                    />
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

export default SalesItems