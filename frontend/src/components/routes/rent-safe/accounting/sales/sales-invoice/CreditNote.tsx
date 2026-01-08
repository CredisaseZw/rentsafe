
import type { CreditNote} from '@/interfaces'
import { DELETION_LINKS, SALES_ITEM_HEADERS } from '@/constants'
import {  getSummaryDate, handleDeletion } from '@/lib/utils'
import { TableBase } from '../../../../../general/TableBase'
import { TableCell, TableRow } from '../../../../../ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical } from 'lucide-react'
import DeleteDialogue from '../../../../../general/DeleteDialogue'
import { getCreditNoteStore } from '@/store/creditNoteStore'
import PrintBillingDocument from './PrintBillingDocument'

interface props{
    creditNote: CreditNote | null
    handleGoBack? : () => void
}

function SingleCreditNote({creditNote, handleGoBack}:props) {

  return (
    <div className='w-full'>
      <div className="flex justify-between border-b border-color pb-4">
          <span className="text-lg self-center">Credit Note</span>
          <div className='flex flex-row gap-5'>
              <span className="font-bold text-sm self-center">ID#: {creditNote?.document_number}</span>
                <Popover >
                  <PopoverTrigger className='rounded-2xl border border-color p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-900'>
                    <EllipsisVertical size={18}/>
                  </PopoverTrigger>
                  <PopoverContent className="space-y-2">
                    <DeleteDialogue
                      trigger = {
                        <div className="flex flex-row gap-5 cursor-pointer">
                          <span className="text-sm text-red-600 text-center">Delete</span>
                        </div>
                      }
                      successCallBack={()=> handleGoBack?.()}
                      mutationFunc={()=> handleDeletion(DELETION_LINKS.CREDIT_NOTE, Number(creditNote?.id))}
                      keyStore={()=>getCreditNoteStore?.()}
                      value={`Credit Note`}
                      
                    />
                  </PopoverContent>
                </Popover>
          </div>
      </div>  
      <div className="flex flex-row justify-between mt-5">
          <div className="flex flex-col gap-1.5">
              <span className="text-xs">To</span>
              <span className="font-semibold">{creditNote?.customer_details.full_name ?? "N/A"}</span>
              <span className='text-sm'>{creditNote?.description ?? "-"}</span>
              {creditNote?.customer_details.industry && <span className="text-sm">Industry: {creditNote.customer_details.industry}</span>}
              {creditNote?.customer_details.email && <span className="text-sm">Email: {creditNote.customer_details.email}</span>}
              {creditNote?.customer_details.phone && <span className="text-sm">Phone: {creditNote.customer_details.phone}</span>}
          </div>
          <div className="flex flex-col space-y-1.5">
              <span className="text-xs text-end">Issued On</span>
              <span className="text-sm text-end">{getSummaryDate(creditNote?.credit_date ?? "")}</span>
          </div>
      </div>

      <div className='mt-10'>
          <TableBase 
              headers={SALES_ITEM_HEADERS}>
              {
                  creditNote?.line_items.map((item, idx)=>(
                      <TableRow key={idx} noHover>
                          <TableCell className='text-center border-r border-color'>{item.sales_item.name}</TableCell>
                          <TableCell className='text-center border-r border-color'>{Math.floor(Number(item.quantity))}</TableCell>
                          <TableCell className='text-end border-r border-color'>{creditNote.currency.symbol}{item.unit_price}</TableCell>
                          <TableCell className='text-end border-r border-color'>{item.vat_amount}%</TableCell>
                          <TableCell className='text-end border-r border-color'>{creditNote.currency.symbol}{item.total_price}</TableCell>
                      </TableRow>
                  ))
              }
              <TableRow noHover>
                  <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Sub-Total</TableCell>
                  <TableCell className='text-end'>{creditNote?.currency.symbol}{creditNote?.total_excluding_vat}</TableCell>
              </TableRow >
              <TableRow noHover>
                  <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Discount</TableCell>
                  <TableCell className='text-end'>{creditNote?.currency.symbol}{creditNote?.discount}</TableCell>
              </TableRow>
              <TableRow noHover>
                  <TableCell colSpan={4} className='text-end border-r border-color font-bold'>VAT Total</TableCell>
                  <TableCell className='text-end'>{creditNote?.total_vat}</TableCell>
              </TableRow >
                  <TableRow noHover>
                  <TableCell colSpan={4} className='text-end border-r border-color font-bold'>Total</TableCell>
                  <TableCell className='text-end font-bold'>{creditNote?.currency.symbol}{creditNote?.credit_note_total}</TableCell>
              </TableRow>
          </TableBase>
          <div className='flex justify-end'>
              {
                creditNote &&
                <PrintBillingDocument billTitle='credit note' bill={creditNote}/>
              }
          </div>
      </div>
    </div>
  )
}

export default SingleCreditNote
