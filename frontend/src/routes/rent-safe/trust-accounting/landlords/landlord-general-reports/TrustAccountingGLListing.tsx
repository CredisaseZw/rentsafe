import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import Header from "@/components/general/Header"
import OptionsWrapper from "@/components/general/OptionsWrapper"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddTrustACCGeneralLedgerDialogue from "@/components/routes/rent-safe/trust-accounting/gl-listings/AddTrustACCGeneralLedgerDialogue"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, TRUST_ACCOUNT_GENERAL_LEDGERS } from "@/constants"
import useOptimisticCacheUpdate from "@/hooks/components/useOptimisticCacheUpdate"
import useTrustAccountingGLListing from "@/hooks/components/useTrustAccountingGLListing"
import { handleDeletion } from "@/lib/utils"
import { Trash } from "lucide-react"


function TrustAccountingGLListing() {
  const {
    generalLedgers,
    pagination,
    isError,
    isLoading,   
  } = useTrustAccountingGLListing()
  const {updateCache} = useOptimisticCacheUpdate()
  return (
    <div >
      <Header title="Trust Account General Ledgers"/>
      <div className="main-card flex flex-col gap-5">
        <ColumnsContainer numberOfCols={2}>
            <SectionHeader
              title="Trust ACC General Ledgers"
              total={pagination?.count ?? 0}
              subTotal={generalLedgers.length}
            />
            <div className="flex md:flex-row flex-col self-center md:justify-end gap-3">
              <Searchbox
                placeholder="Search by name"
              />
              <AddTrustACCGeneralLedgerDialogue/>
            </div>
        </ColumnsContainer>

        <TableBase
          isLoading = {isLoading}
          isError = {isError}
          paginationData={pagination}
          isEmpty = {generalLedgers.length === 0}
          headers={TRUST_ACCOUNT_GENERAL_LEDGERS}
        >
         
          {
            generalLedgers.map((acc)=>(
              <TableRow key={acc.id}>
                <TableCell className="text-left">{acc.account_number}</TableCell>
                <TableCell className="text-left">{acc.account_name}</TableCell>
                <TableCell className="text-left">{acc.account_type.code}</TableCell>
                <TableCell className="text-center">{acc.is_system_account ? "Yes" : "No"}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <OptionsWrapper>
                    <AddTrustACCGeneralLedgerDialogue
                      tsaGeneralLedger={acc}
                    />
                    <DeleteDialogue
                      trigger = {
                        <div className="flex flex-row gap-3 cursor-pointer">
                          <Trash size={15} className="self-center text-red-600"/>
                          <span className="text-red-600 text-sm">Delete</span>
                        </div>
                      }
                      mutationFunc={()=> handleDeletion(DELETION_LINKS.TRUST_ACC_GENERAL_LEDGER, acc.id)}
                      keyStore={()=> updateCache({
                        key : ["trust-general-ledgers"],
                        id : acc.id,
                        mode : "deletion"
                      })}
                      value="General Ledger"
                    />
                  </OptionsWrapper>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBase>
      </div>
    </div>
  )
}

export default TrustAccountingGLListing