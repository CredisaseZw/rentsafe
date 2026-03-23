import type { TrustAccInvoice } from "@/interfaces"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical } from 'lucide-react'
import { getSummaryDate } from "@/lib/utils"
import MutateInvoiceStatus from "../../../accounting/sales/sales-invoice/MutateInvoiceStatus"
import Pill from "@/components/general/Pill"
import { TableBase } from "@/components/general/TableBase"
import { SALES_ITEM_HEADERS } from "@/constants"
import { TableCell, TableRow } from "@/components/ui/table"
import PrintBillingDocument from "../../../accounting/sales/sales-invoice/PrintBillingDocument"


interface props {
    invoice: TrustAccInvoice 
}
function TrustAccountSingleInvoice({invoice}: props) {
    const MODE = invoice.invoice_type
    const VARIANT = invoice.status_display === "Pending"
    ? "warning" : invoice.status_display === "Approved"
    ? "success" : invoice.status_display === "Partially Paid"
    ? "primary" : (invoice.status_display === "Overdue" || invoice.status_display === "Written Off")
    ? "danger"  : "outline";

    return (
    <div className="w-full">
        <div className="flex justify-between border-b border-color pb-4">
            <span className="text-lg self-center">{invoice.invoice_type_display}</span>
            <div className='flex flex-row gap-5'>
                <div className="flex flex-col self-center text-end">
                    <span className="font-bold text-sm text-end">ID#: {invoice?.document_number}</span>
                    <span className="text-sm text-end">{invoice?.invoice_number}</span>
                </div>
                  <Popover >
                    <PopoverTrigger className='rounded-2xl border border-color w-8 h-8 flex justify-center items-center self-center hover:bg-gray-200 dark:hover:bg-zinc-900'>
                      <EllipsisVertical size={18}/>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                      {
                        (invoice?.status === "pending" || invoice?.status === "approved") && (
                            <>
                            <MutateInvoiceStatus 
                                mode="MARK"
                                invoiceMode={MODE}
                                invoiceID={invoice?.id}  
                                documentNumber={invoice?.document_number}
                            />
                            </>
                        )
                        }
                        {   
                            invoice.status === "pending" &&
                            MODE === "proforma" &&
                            <MutateInvoiceStatus 
                                mode="CONVERT"
                                invoiceMode={MODE}
                                invoiceID = {invoice?.id}  
                                documentNumber = {invoice?.document_number}
                            />
                        }  
                        {
                            invoice.status !== "cancelled" &&
                            <MutateInvoiceStatus 
                                mode="CANCEL"
                                invoiceMode={MODE}
                                invoiceID={invoice?.id}  
                                documentNumber={invoice?.document_number}
                            />
                        }
                    </PopoverContent>
                  </Popover>
            </div>
        </div>  
          <div className="flex flex-row justify-between mt-5">
            <div className="flex flex-col gap-1.5">
                <span className="text-xs">To</span>
                <span className="font-semibold">{invoice?.tenant?.tenant_object.full_name ?? "N/A"}</span>
                {invoice?.tenant?.tenant_type && <span className="text-sm">Industry: {invoice.tenant.tenant_type}</span>}
                {invoice?.tenant?.tenant_object.email && <span className="text-sm">Email: {invoice.tenant?.tenant_object.email}</span>}
                {invoice?.tenant?.tenant_object.phone_number && <span className="text-sm">Email: {invoice.tenant?.tenant_object.phone_number}</span>}
                {invoice?.lease?.lease_id && <span className="text-sm">Lease ID: {invoice.lease.lease_id}</span>}
                {invoice?.lease && <span className="text-sm">Lease Start Date: {invoice.lease.start_date}</span>}
                        
            </div>
            <div className="flex flex-col space-y-1.5">
                <span className="text-xs text-end">Issued On</span>
                <span className="text-sm text-end">{getSummaryDate(invoice?.date_created ?? "")}</span>
                <div className="flex justify-end">
                    <Pill variant={VARIANT} >
                        {invoice?.status_display}
                    </Pill>
                </div>
            </div>
        </div>
        <div className='mt-10'>
            <TableBase 
                headers={SALES_ITEM_HEADERS}>
                {
                    invoice?.line_items.map((item, idx)=>(
                        <TableRow key={idx} noHover>
                            <TableCell className='text-center border-r border-color'>{item.sales_item_name}</TableCell>
                            <TableCell className='text-center border-r border-color'>{Math.floor(Number(item.quantity))}</TableCell>
                            <TableCell className='text-end border-r border-color'>{invoice.currency_symbol}{item.unit_price}</TableCell>
                            <TableCell className='text-end border-r border-color'>{item.vat_amount}</TableCell>
                            <TableCell className='text-end border-r border-color'>{invoice.currency_symbol}{item.total_price}</TableCell>
                        </TableRow>
                    ))
                }
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Sub-Total</TableCell>
                    <TableCell className='text-end'>{invoice.currency_symbol}{invoice?.subtotal}</TableCell>
                </TableRow >
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Discount</TableCell>
                    <TableCell className='text-end'>{invoice.currency_symbol}{invoice?.discount_amount}</TableCell>
                </TableRow>
                <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>VAT Total</TableCell>
                    <TableCell className='text-end'>{invoice?.tax_total}</TableCell>
                </TableRow >
                    <TableRow noHover>
                    <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Total</TableCell>
                    <TableCell className='text-end font-bold'>{invoice.currency_symbol}{invoice?.total_amount}</TableCell>
                </TableRow>
            </TableBase>
            <div className='flex justify-end'>
                {
                    invoice &&
                    <PrintBillingDocument 
                        bill={invoice}
                        billTitle='Invoice'
                    />
                }
            </div> 
        </div>
    </div>
  )
}

export default TrustAccountSingleInvoice