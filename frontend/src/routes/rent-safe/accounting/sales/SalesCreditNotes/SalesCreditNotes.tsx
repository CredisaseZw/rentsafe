import ColumnsContainer from "@/components/general/ColumnsContainer"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import { DELETION_LINKS, SALES_CREDIT_NOTE_HEADERS } from "@/constants"
import { TableCell, TableRow } from "@/components/ui/table"
import AddInvoiceDialogue from "@/components/routes/rent-safe/accounting/sales/sales-invoice/AddBillingInformationDialogue"
import Header from "@/components/general/Header"
import useCreditNotes from "@/hooks/components/useCreditNotes"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import { getSummaryDate, handleDeletion } from "@/lib/utils"
import ExpandableText from "@/components/general/ExpandableText"
import CreditNotesFilter from "@/components/routes/rent-safe/accounting/sales/sales-invoice/CreditNoteFilter"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import { getCreditNoteStore } from "@/store/creditNoteStore"
import { Link } from "react-router"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EllipsisVertical } from "lucide-react"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"

function SalesCreditNotes() {
  const {
    creditNotes,
    isLoading,
    error,
    pagination
  } = useCreditNotes();

  return (
    <div>
      <Header title="Credit Note" variant="danger"/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} >
          <SectionHeader
            title="Credit Note List"
            subTitle="credit notes"
            total={pagination?.count ?? 0}
            subTotal={creditNotes.length}
          />
          <div className="self-center flex flex-row justify-end gap-5">
            <Searchbox
              placeholder="Credit Note ID"
            />
            <div className="self-center">
              <CreditNotesFilter/>
            </div>
            <div className="self-center">
              <AddInvoiceDialogue 
                type = {"creditNote"}
                title = "Add Credit Note"/>
            </div>
          </div>
        </ColumnsContainer>
        <div className="mt-5">
          <TableBase 
            isLoading ={isLoading}
            isError = {Boolean(error)}
            paginationData={pagination}
            paginationName="page"
            headers={SALES_CREDIT_NOTE_HEADERS}>
            {
              !isLoading&&
              creditNotes.length === 0 &&
              <EmptyTableResponse colSpan={SALES_CREDIT_NOTE_HEADERS.length}/>
            }
            {
              creditNotes.map((i)=>(
                <TableRow key={i.id}>
                  <TableCell className="text-center">{i.document_number}</TableCell>
                  <TableCell className="text-center">{getSummaryDate(i.credit_date)}</TableCell>
                  <TableCell className="text-left">{i.customer_details.full_name}</TableCell>
                  <TableCell className="text-left">
                   { i.description ? <ExpandableText text={i.description}/> : "-"}
                  </TableCell>
                  <TableCell className="text-end">{i.currency.symbol}{i.total_excluding_vat}</TableCell>
                  <TableCell className="text-end">{i.currency.symbol}{i.total_vat}</TableCell>
                  <TableCell className="text-end">{i.currency.symbol}{i.credit_note_total}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <Popover>
                      <PopoverTrigger>
                        <EllipsisVertical size={15}/>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col">
                        <Link to={`${RENTSAFE_PRE_SEG}/accounting/sales/credit_note/${i.id}`}>
                          <span className="text-sm dark:text-white text-gray-600 ">View More</span>
                        </Link>
                        <DeleteDialogue
                            trigger = {
                              <div className="flex flex-row gap-5 cursor-pointer">
                                <span className="text-sm text-red-600 text-center">Delete</span>
                              </div>
                            }
                            mutationFunc={()=> handleDeletion(DELETION_LINKS.CREDIT_NOTE, i.id)}
                            keyStore={()=>getCreditNoteStore?.()}
                            value="Credit Note"
                          />
                        </PopoverContent>
                    </Popover>
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

export default SalesCreditNotes