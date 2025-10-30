import DeleteDialogue from "@/components/general/DeleteDialogue"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import AddCashbookDialog from "@/components/routes/rent-safe/accounting/settings/cashbook-settings/AddCashbookDialog"
import { TableCell, TableRow } from "@/components/ui/table"
import { CASH_BOOK_HEADERS, DELETION_LINKS } from "@/constants"
import useCashbookLists from "@/hooks/components/useCashbookLists"
import { handleDeletion } from "@/lib/utils"

function Lists() {
  const {
    pagination,
    cashBooks,
    isLoading,
    error
  } = useCashbookLists();
  return (
    <div>
      <Header title="Cashbooks"/>
      <div className="main-card">
        <div className="flex flex-row justify-between">
          <SectionHeader
            title="Cashbook List"
            subTitle="cashbook list"
            total={pagination?.count ?? 0}
            subTotal={cashBooks.length}/>
            <AddCashbookDialog/>
        </div>
        <div className="mt-5">
          <TableBase
            isError = {Boolean(error)}
            isLoading = {isLoading}
            paginationData={pagination}
            paginationName="page"
            headers={CASH_BOOK_HEADERS}
          >
            {
              cashBooks.length === 0 &&
              !isLoading &&
              <EmptyTableResponse colSpan={CASH_BOOK_HEADERS.length}/>
            }
            {
              cashBooks.map((c)=>(
                <TableRow key={c.id}>
                  <TableCell className="text-center">{c.cashbook_id}</TableCell>
                  <TableCell className="text-center">{c.cashbook_name}</TableCell>
                  <TableCell className="text-center">{c.requisition_status ? "Yes" : "None"}</TableCell>
                  <TableCell className="text-center">{c.account_type}</TableCell>
                  <TableCell className="text-center">{c.branch_name}</TableCell>
                  <TableCell className="text-center">{`${c.general_ledger_account.account_sector_code} - ${c.general_ledger_account.account_sector_name}`}</TableCell>
                  <TableCell className="flex flex-row justify-center items-center gap-5">
                    <AddCashbookDialog
                      initial = {c}
                    />
                    <DeleteDialogue
                      mutationFunc={()=>handleDeletion(DELETION_LINKS.CASH_BOOK, c.id)}
                      keyStore="cashBooks"
                      value="Cash Book"
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

export default Lists