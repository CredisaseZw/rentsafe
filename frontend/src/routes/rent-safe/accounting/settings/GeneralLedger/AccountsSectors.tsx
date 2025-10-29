import Button from "@/components/general/Button"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import { TableCell, TableRow } from "@/components/ui/table"
import { ACCOUNTING_SECTOR_HEADERS } from "@/constants"
import useAccountSectors from "@/hooks/components/useAccountSectors"
import { Plus } from "lucide-react"

function AccountsSectors() {
  const {
    sectors,
    isLoading,
    error,
    pagination,
  } = useAccountSectors();
  return (
    <div>
      <Header title="Account Sectors"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2}>
          <SectionHeader
            title="Account Lists"
            subTitle="account lists"
            total={pagination?.count ?? 0}
            subTotal={sectors.length}/>
          <div className="flex flex-row  justify-end gap-5">
            <Searchbox
              placeholder="Search by Code / Name"
            />
            <Button asChild className="self-center">Add Account Sector <Plus size={15}/></Button>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase
              headers={ACCOUNTING_SECTOR_HEADERS}
              isError = {Boolean(error)}
              paginationData={pagination}
              paginationName="page"
              isLoading  ={isLoading}
          >
            {
              !isLoading &&
              sectors.length === 0 &&
              <EmptyTableResponse colSpan={ACCOUNTING_SECTOR_HEADERS.length}/>
            }
            {
              sectors.length !== 0 &&
              sectors.map((s, idx)=> (
                <TableRow key={idx}>
                  <TableCell className="text-center">{s.id}</TableCell>
                  <TableCell className="text-center">{s.code}</TableCell>
                  <TableCell className="text-center">{s.name}</TableCell>
                </TableRow>
              ))
            }
          </TableBase>
      </div>
      </div>      
    </div>
  )
}

export default AccountsSectors