import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddSaleCategoryDialogue from "@/components/routes/rent-safe/accounting/sales/sales-categories/AddSaleCategoryDialogue"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, SALES_CATEGORIES_HEADERS } from "@/constants"
import useSalesCategories from "@/hooks/components/useSalesCategories"
import { handleDeletion } from "@/lib/utils"

function SalesCategories() {
  const {
    salesCategories,
    pagination,
    categoriesError,
    categoriesLoading,
    refetch,
  } = useSalesCategories();
  
  return (
    <div>
      <Header title="Sale Categories"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="mt-0">
          <SectionHeader
            title="Sales categories"
            subTitle="sale categories"
            total={pagination?.count ?? 0}
            subTotal={salesCategories.length}
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Item ID"
            />
            <div className="self-center">
              <AddSaleCategoryDialogue
                refetch  = {refetch}
              />
            </div>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase 
            paginationData={pagination}
            paginationName="sales_categories"
            isError = {Boolean(categoriesError)}
            isLoading = {categoriesLoading}
            headers={SALES_CATEGORIES_HEADERS}>
            {
              salesCategories.length === 0 &&
              !!categoriesLoading &&
              <EmptyTableResponse colSpan={SALES_CATEGORIES_HEADERS.length} />
            }
            {
              salesCategories.map((c, idx)=>
                <TableRow key={idx}>
                  <TableCell className="text-center">{c.code}</TableCell>
                  <TableCell className="text-left">{c.name}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <div className="flex flex-row gap-5">
                      <AddSaleCategoryDialogue
                        refetch={refetch}
                        initial={c}
                      />
                      <DeleteDialogue
                        keyStore="salesCategories"
                        value="Sales Category"
                        mutationFunc={()=>handleDeletion(DELETION_LINKS.SALES_CATEGORIES, Number(c.id))}
                      />
                      
                    </div>
                  </TableCell>
                </TableRow>
              )
            }
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default SalesCategories