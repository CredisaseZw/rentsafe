import ColumnsContainer from "@/components/general/ColumnsContainer"
import Searchbox from "@/components/general/Searchbox"
import SectionHeader from "@/components/general/SectionHeader"
import InvoicesFilter from "./InvoicesFilter"
import AddInvoiceDialogue from "./AddInvoiceDialogue"
import { TableBase } from "@/components/general/TableBase"
import { DELETION_LINKS, MODE_PAGES, MODES, SALES_INVOICES_HEADERS } from "@/constants"
import { TableCell, TableRow } from "@/components/ui/table"
import useInvoices from "@/hooks/components/useInvoices"
import EmptyTableResponse from "@/components/general/EmptyTableResponse"
import { getSummaryDate, handleDeletion } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical } from "lucide-react"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"
import DeleteDialogue from "@/components/general/DeleteDialogue"
import { Link } from "react-router"
import MutateInvoiceStatus from "./MutateInvoiceStatus"

function Invoices() {
  const MODE = MODES.FISCAL;
  const {
    page,
    pagination,
    invoices,
    invoicesError,
    invoicesLoading
  } = useInvoices(MODE);
  return (
    <div>
      <ColumnsContainer numberOfCols={2} >
        <SectionHeader
          title="Invoice Lists"
          subTitle="invoices"
          total={pagination?.count ?? 0}
          subTotal={invoices.length}
        />
        <div className="self-center flex flex-row justify-end gap-5">
          <Searchbox
            placeholder="Invoice ID"
          />
          <div className="self-center">
            <InvoicesFilter/>
          </div>
           <div className="self-center">
            <AddInvoiceDialogue/>
          </div>
        </div>
     </ColumnsContainer>
     <div className="mt-5">
      <TableBase 
        headers={SALES_INVOICES_HEADERS}
        isError = {Boolean(invoicesError)}
        isLoading = {invoicesLoading}
        paginationData={pagination}
        paginationName={MODE_PAGES[MODE]}
        >
          {
            invoices.length === 0 &&
            !invoicesLoading &&
            <EmptyTableResponse colSpan={SALES_INVOICES_HEADERS.length}/>
          }
          {
            invoices.map((i)=>(
              <TableRow key={i.id}> 
                <TableCell className="text-center">{i.document_number}</TableCell>
                <TableCell className="text-center">{getSummaryDate(i.date_created)}</TableCell>
                <TableCell className="text-center">{i.customer_details.full_name}</TableCell>
                <TableCell className="text-center">{i.currency.currency_name} ({i.currency.currency_code})</TableCell>
                <TableCell className="text-center">{i.currency.symbol}{i.total_excluding_vat}</TableCell>
                <TableCell className="text-center">{i.currency.symbol}{i.vat_total}</TableCell>
                <TableCell className="text-end">{i.currency.symbol}{i.total_inclusive}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical size={18}/>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      <Link to={`${RENTSAFE_PRE_SEG}${i.document_number}`} className="flex flex-row gap-3 hover:text-green-600">
                        <span className="text-sm dark:text-white text-gray-600 ">View More</span>
                      </Link>
                      <MutateInvoiceStatus 
                        mode="MARK"
                        invoiceID = {i.id}  
                        documentNumber = {i.document_number}
                      />
                      <MutateInvoiceStatus 
                        mode="CANCEL"
                        invoiceID = {i.id}  
                        documentNumber = {i.document_number}
                      />
                      {
                        i.can_convert_to_fiscal &&
                        <MutateInvoiceStatus 
                          mode="CONVERT"
                          invoiceID = {i.id}  
                          documentNumber = {i.document_number}
                        />
                      }  
                      <DeleteDialogue
                        trigger = {
                          <div className="flex flex-row gap-5 cursor-pointer">
                            <span className="text-sm text-red-600 text-center">Delete</span>
                          </div>
                        }
                        mutationFunc={()=> handleDeletion(DELETION_LINKS.INVOICE, i.id)}
                        keyStore={["invoices", MODE, page]}
                        value=" Fiscal Invoice"
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
  )
}

export default Invoices