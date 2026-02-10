import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { CASH_BOOK_RECEIPT_HEADERS } from "@/constants"
import useCashbookReceipt from "@/hooks/components/useCashbookReceipt"
import { Plus, X } from "lucide-react"

function CashbookReceipts() {
  const {  
    receipts,
    cashbooks,
    cashbookCurrency,
    adjustPaymentCurrency,
    addRow} = useCashbookReceipt();
  return (
    <div>

      <Header title="Receipts" />
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="">
          <SectionHeader
            title="Receipts"
            total={0}
            subTotal={0}
         />
         <div className="flex flex-row justify-end gap-3">
            <Select onValueChange={(v)=>{
              adjustPaymentCurrency(v);
            }}>
              <SelectTrigger className="self-center w-[250px]">
                <SelectValue placeholder = "Select Cashbook..."/>
              </SelectTrigger>
              <SelectContent>
                {
                  cashbooks.map((c)=>(
                  <SelectItem value={String(c.cashbook_id)}>{c.cashbook_name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <span className="text-sm self-center">Currency: <span className="text-green-600">{cashbookCurrency}</span></span>
         </div>
        </ColumnsContainer>
        <div className="mt-10">
          <TableBase headers={CASH_BOOK_RECEIPT_HEADERS}>
              {
                receipts.map(pr=>(
                  <TableRow>
                    <TableCell className="text-center">{pr.date ?? ""}</TableCell>
                    <TableCell className="text-center">{pr.receiptNumber ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.type ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.glAccount ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.details ?? ""}</TableCell>
                    <TableCell className="text-end">{pr.amount ?? ""}</TableCell>
                    <TableCell className="text-end">{pr.matching ?? ""}</TableCell>
                    <TableCell className="text-center">{pr.matching ?? ""}</TableCell>
                    <TableCell className="text-end">{pr.invoiceRate ?? ""}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Button variant={"ghost"}><X/></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))  
              }
          </TableBase>
          <div className="flex flex-row mt-3 gap-3 justify-end">
            <Button variant={"outline"} onClick={addRow}><Plus/> Add Row</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashbookReceipts