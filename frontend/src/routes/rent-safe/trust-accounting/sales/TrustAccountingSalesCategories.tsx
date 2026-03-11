import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import DeleteTrigger from "@/components/general/DeleteTrigger"
import Header from "@/components/general/Header"
import OptionsWrapper from "@/components/general/OptionsWrapper"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddTrustAccSalesCategoryDialog from "@/components/routes/rent-safe/trust-accounting/sales/AddTrustAccSalesCategoryDialog"
import { TableCell, TableRow } from "@/components/ui/table"
import { TRUST_ACC_SALES_CATEGORIES_HEADERS } from "@/constants"
import { BASE_TRUST_ACC_SALES_CATEGORIES } from "@/constants/base-links"
import useOptimisticCacheUpdate from "@/hooks/components/useOptimisticCacheUpdate"
import useTrustAccountingSalesCategories from "@/hooks/components/useTrustAccountingSalesCategories"
import { handleDeletion } from "@/lib/utils"

function TrustAccountingSalesCategories() {
  const {
    isError,
    isLoading,
    pagination,
    categories
  } = useTrustAccountingSalesCategories()
  const {updateCache} = useOptimisticCacheUpdate();
  return (
    <div>
      <Header title="Trust Account Categories"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2}>
          <SectionHeader
            title="Trust Account Categories"
            total={pagination?.count ?? 0}
            subTotal={categories.length}
          />
          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <Searchbox/>
            <AddTrustAccSalesCategoryDialog/>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase
            isEmpty = {categories.length === 0}
            isLoading = {isLoading}
            paginationData={pagination}
            isError ={isError}
            headers={TRUST_ACC_SALES_CATEGORIES_HEADERS}
          >
            {
              categories.map((item)=>(
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <OptionsWrapper>
                      <AddTrustAccSalesCategoryDialog category={item}/>
                      <DeleteDialogue
                        trigger = {<DeleteTrigger/>}
                        mutationFunc={()=> handleDeletion(BASE_TRUST_ACC_SALES_CATEGORIES.link, Number(item.id))}
                        value="Sales Category"
                        keyStore={()=> updateCache({
                          mode : "deletion",
                          key : ["trust-account-sales-categories"],
                          id: item.id
                        })}
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

export default TrustAccountingSalesCategories