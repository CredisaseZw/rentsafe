import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddPropertyListingDialogue from "@/components/routes/rent-safe/trust-accounting/gl-listings/AddPropertyListingDialogue"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, TRUST_ACCOUNTS_PROPERTY_EXPENSES_HEADERS } from "@/constants"
import usePropertyExpenses from "@/hooks/components/usePropertyExpenses"
import { getSummaryDate, handleDeletion } from "@/lib/utils"
import { Trash } from "lucide-react"

function TrustAccountPropertySettings() {
  const {
    propertyExpenses,
    pagination,
    isError,
    isLoading,
    onDelete
  } = usePropertyExpenses()
  return (
    <div>
      <Header title="Property Expenses" variant="success"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="">
          <SectionHeader
            title="Property Expenses"
            subTitle="property expenses"
            total={pagination?.count ?? 0}
            subTotal={propertyExpenses.length}
          />
          <div className="flex md:flex-row flex-col gap-3 justify-end">
            <Searchbox
              placeholder="Search by name"
            />
            <AddPropertyListingDialogue/>
          </div>
        </ColumnsContainer>

        <div className="mt-5">
          <TableBase 
            isEmpty = {propertyExpenses.length === 0}
            isError = {isError}
            isLoading = {isLoading}
            paginationData={pagination}
            headers={TRUST_ACCOUNTS_PROPERTY_EXPENSES_HEADERS}>
              {
                propertyExpenses.map((property)=>
                  <TableRow key={property.id}>
                    <TableCell className="text-left">{property.expense}</TableCell>
                    <TableCell className="text-left">{property.expense_account_name}</TableCell>
                    <TableCell className="text-left">{getSummaryDate(property.date_created)}</TableCell>
                    <TableCell>
                      <div className="flex flex-row justify-end gap-3">
                          <AddPropertyListingDialogue propertyExpense={property}/>
                          <DeleteDialogue
                            trigger = {
                              <Button variant={"DANGER"}>
                                <Trash/>
                                Delete
                              </Button>
                            }
                            mutationFunc={()=> handleDeletion(DELETION_LINKS.PROPERTY_EXPENSE, property.id)}
                            keyStore={()=>onDelete(property.id)}
                            value="Property Expense"
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

export default TrustAccountPropertySettings