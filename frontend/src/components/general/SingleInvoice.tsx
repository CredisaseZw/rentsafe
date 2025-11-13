import type { Invoice } from '@/interfaces'
import Pill from './Pill'
import { DELETION_LINKS, INVOICE_SALES_HEADERS, INVOICE_STATUS_VARIANT, MODES } from '@/constants'
import { capitalizeFirstLetter, getSummaryDate, handleDeletion } from '@/lib/utils'
import { TableBase } from './TableBase'
import { TableCell, TableRow } from '../ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical } from 'lucide-react'
import MutateInvoiceStatus from '../routes/rent-safe/accounting/sales/sales-invoice/MutateInvoiceStatus'
import DeleteDialogue from './DeleteDialogue'
import AddInvoiceDialogue from '../routes/rent-safe/accounting/sales/sales-invoice/AddInvoiceDialogue'
import { getRefetchInvoices } from '@/store/invoiceStore'

interface props{
    invoice: Invoice | undefined
    handleGoBack? : () => void
    markInvoice? : (mark: string) => void
}

function SingleInvoice({invoice, handleGoBack, markInvoice}:props) {
  const MODE =  invoice?.invoice_type === "fiscal"
  ? MODES.FISCAL
  : invoice?.invoice_type === "proforma"
  ? MODES.PROFORMA
  : MODES.RECURRING

  return (
    <div className='w-full'>
        <div className="flex justify-between border-b border-color pb-4">
            <span className="text-lg self-center">{capitalizeFirstLetter(invoice?.invoice_type ?? "-")} Invoice</span>
            <div className='flex flex-row gap-5'>
                <span className="font-bold text-sm self-center">ID#: {invoice?.document_number}</span>
                  <Popover >
                    <PopoverTrigger className='rounded-2xl border border-color p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-900'>
                      <EllipsisVertical size={18}/>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      {
                        invoice?.status === "pending" ||
                        invoice?.status === "draft" && 
                        <AddInvoiceDialogue
                          invoice={invoice}
                          defaultInvoiceType={invoice?.invoice_type}
                          title="Edit Invoice"/>
                      }
                      {
                        invoice?.status === "pending" ||
                        invoice?.status === "draft" && 
                        <>
                          <MutateInvoiceStatus 
                            mode="MARK"
                            invoiceMode={MODE}
                            invoiceID = {invoice?.id}  
                            documentNumber = {invoice?.document_number}
                            successCallBack={()=> markInvoice?.("paid")}
                          />
                          <MutateInvoiceStatus 
                            mode="CANCEL"
                            invoiceMode={MODE}
                            invoiceID = {invoice?.id}  
                            documentNumber = {invoice?.document_number}
                            successCallBack={()=> markInvoice?.("cancelled")}

                          />
                        </>
                      }
                      {
                        invoice?.can_convert_to_fiscal &&
                        <MutateInvoiceStatus 
                            mode="CONVERT"
                            invoiceMode={MODE}
                            invoiceID = {invoice?.id}  
                            documentNumber = {invoice?.document_number}
                        />
                      }  
                      <DeleteDialogue
                        trigger = {
                          <div className="flex flex-row gap-5 cursor-pointer">
                            <span className="text-sm text-red-600 text-center">Delete</span>
                          </div>
                        }
                        successCallBack={()=> handleGoBack?.()}
                        mutationFunc={()=> handleDeletion(DELETION_LINKS.INVOICE, Number(invoice?.id))}
                        keyStore={()=>getRefetchInvoices?.()}
                        value={`${capitalizeFirstLetter(invoice?.invoice_type ?? "-")} Invoice`}
                        
                      />
                    </PopoverContent>
                  </Popover>
            </div>
        </div>  
        <div className="flex flex-row justify-between mt-5">
            <div className="flex flex-col gap-1.5">
                <span className="text-xs">To</span>
                <span className="font-semibold">{invoice?.customer_details.full_name ?? "N/A"}</span>
                {invoice?.customer_details.industry && <span className="text-sm">Industry: {invoice.customer_details.industry}</span>}
                {invoice?.customer_details.email && <span className="text-sm">Email: {invoice.customer_details.email}</span>}
                {invoice?.customer_details.phone && <span className="text-sm">Phone: {invoice.customer_details.phone}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
                <span className="text-xs text-end">Issued On</span>
                <span className="text-sm text-end">{getSummaryDate(invoice?.date_created ?? "")}</span>
                <div className="flex justify-end">
                    <Pill variant={INVOICE_STATUS_VARIANT[invoice?.status as keyof typeof INVOICE_STATUS_VARIANT]} >
                        {invoice?.status.replace("_", " ")}
                    </Pill>
                </div>
            </div>
        </div>

        <div className='mt-10'>
            <TableBase 
                headers={INVOICE_SALES_HEADERS}>
                {
                    invoice?.line_items.map((item, idx)=>(
                        <TableRow key={idx} noHover>
                            <TableCell className='text-center border-r border-color'>{item.sales_item.name}</TableCell>
                            <TableCell className='text-center border-r border-color'>{Math.floor(Number(item.quantity))}</TableCell>
                            <TableCell className='text-end border-r border-color'>{invoice.currency.symbol}{item.unit_price}</TableCell>
                            <TableCell className='text-end border-r border-color'>{item.vat_amount}%</TableCell>
                            <TableCell className='text-end border-r border-color'>{invoice.currency.symbol}{item.total_price}</TableCell>
                        </TableRow>
                    ))
                }
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Sub-Total</TableCell>
                    <TableCell className='text-end'>{invoice?.currency.symbol}{invoice?.total_excluding_vat}</TableCell>
                </TableRow >
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Discount</TableCell>
                    <TableCell className='text-end'>{invoice?.currency.symbol}{invoice?.discount}</TableCell>
                </TableRow>
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>VAT Total</TableCell>
                    <TableCell className='text-end'>{invoice?.vat_total}%</TableCell>
                </TableRow >
                   <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Total</TableCell>
                    <TableCell className='text-end font-bold'>{invoice?.currency.symbol}{invoice?.total_inclusive}</TableCell>
                </TableRow>
            </TableBase>
        
        </div>
    </div>
  )
}

export default SingleInvoice