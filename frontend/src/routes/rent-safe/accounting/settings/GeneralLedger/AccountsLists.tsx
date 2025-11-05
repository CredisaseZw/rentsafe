import ColumnsContainer from "@/components/general/ColumnsContainer"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddGeneralLedgerAccountDialogue from "@/components/routes/rent-safe/accounting/settings/accounting-lists/AddGeneralLedgerAccountDialogue"
import { TableCell, TableRow } from "@/components/ui/table"
import { DELETION_LINKS, GENERAL_ACCOUNTS_HEADERS } from "@/constants"
import useGeneralLedgersAccountsLists from "@/hooks/components/useGeneralLedgersAccountsLists"
import { handleDeletion } from "@/lib/utils"

function AccountsLists() {
  const {      
    accounts,
    pagination,
    generalLedgersError,
    generalLedgersLoading
  } = useGeneralLedgersAccountsLists();
  return (
    <div>
      <Header title="Account Lists" />
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="mt-0">
         <SectionHeader
            title="General Ledger Accounts"
            subTitle="general ledger accounts"
            total={pagination?.count ?? 0}
            subTotal={accounts.length}
          />
          <div className="flex justify-end">
            <AddGeneralLedgerAccountDialogue/>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase
            paginationData={pagination}
            paginationName="page"
            isError = {Boolean(generalLedgersError)}
            isLoading = {generalLedgersLoading}
            headers={GENERAL_ACCOUNTS_HEADERS}
          >
            {
              !generalLedgersLoading &&
              accounts.length === 0 &&
              <EmptyTableResponse colSpan={GENERAL_ACCOUNTS_HEADERS.length}/>
            }
            {
              accounts.map((a, idx)=>(
                <TableRow
                  key={idx}
                  className={`${a.preset ? "bg-gray-200 " : ""} hover:bg-transparent`}
                  >
                  <TableCell className="text-center">{a.account_number}</TableCell>
                  <TableCell className="text-center">{a.account_name}</TableCell>
                  <TableCell className="text-center">{a.is_secondary_currency ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-center">{a.account_sector.code}</TableCell>
                  <TableCell className="text-center">{a.account_sector.name}</TableCell>
                  <TableCell className="text-center flex flex-row justify-center items-center gap-5">
                    {
                      !a.preset &&
                      <>
                        <AddGeneralLedgerAccountDialogue initial={a}/>
                        <DeleteDialogue
                          mutationFunc={()=>handleDeletion(DELETION_LINKS.GENERAL_LEDGER, a.id)}
                          keyStore="generalLedgerAccounts"
                          value="General Ledger account"
                          />
                          
                      </>
                      
                   }
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

export default AccountsLists