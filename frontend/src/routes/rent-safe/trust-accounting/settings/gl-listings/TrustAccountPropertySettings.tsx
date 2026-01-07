import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddPropertyListingDialogue from "@/components/routes/rent-safe/trust-accounting/gl-listings/AddPropertyListingDialogue"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { TRUST_ACCOUNTS_PROPERTY_EXPENSES_HEADERS } from "@/constants"

function TrustAccountPropertySettings() {
  return (
    <div>
      <Header title="Property Expenses"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="">
          <SectionHeader
            title="Property Expenses"
            subTitle="property expenses"
            total={0}
            subTotal={0}
          />
          <div className="flex justify-end">
            <AddPropertyListingDialogue/>
          </div>
        </ColumnsContainer>

        <div className="mt-5">
          <TableBase headers={TRUST_ACCOUNTS_PROPERTY_EXPENSES_HEADERS}>
            <TableRow>
              <TableCell>Levy</TableCell>
              <TableCell>
                <div className="flex flex-row justify-end gap-3">
                    <Button>Edit</Button>
                    <Button variant={"DANGER"}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBase>
        </div>
      </div>
    </div>
  )
}

export default TrustAccountPropertySettings