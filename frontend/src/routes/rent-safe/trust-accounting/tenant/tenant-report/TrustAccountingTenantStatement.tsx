import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { TRUST_ACCOUNTS_TENANT_STATEMENT_HEADERS } from "@/constants"
import { getCurrentDate } from "@/lib/utils"
import { Eye } from "lucide-react"

function TrustAccountingTenantStatement() {
  return (
    <div>
      <Header title="Tenant Statements"/>
      <div className="main-card">
        <ColumnsContainer marginClass="" numberOfCols={2}>
          <div>
            <SectionHeader
              title="Statement Balances"
              subTitle="statement balances"
              total={0}
              subTotal={0}
            />
          </div>
          <div className="flex flex-row justify-end gap-3 ">
            <Searchbox
              placeholder="Search ..."
            />
            <div className="flex flex-col justify-baseline self-center">
                <span className="self-center text-sm text-color">{getCurrentDate()}</span>
                <div className="text-green-600 font-semibold">
                  USD
                </div>
              </div>
          </div>
        </ColumnsContainer>
        <br />
        <TableBase headers={TRUST_ACCOUNTS_TENANT_STATEMENT_HEADERS}>
          <TableRow>
            <TableCell className="text-center">88</TableCell>
            <TableCell className="text-left">David Blake</TableCell>
            <TableCell>123 Ann Road, Spinway Zone, ZW</TableCell>
            <TableCell className = "flex justify-end">
              <div className="w-fit p-2.5 bg-yellow-600 text-white rounded">
                  $45, 766
                </div>
            </TableCell>
            <TableCell>
              <div className="flex  justify-center items-center">
                  <Button variant={"ghost"}>
                    <Eye size={15}/>
                  </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBase>
      </div>
    </div>
  )
}

export default TrustAccountingTenantStatement