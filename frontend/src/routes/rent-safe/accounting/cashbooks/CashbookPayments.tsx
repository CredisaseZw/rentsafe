import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import SectionHeader from "@/components/general/SectionHeader"
import { TableBase } from "@/components/general/TableBase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { CASH_BOOK_PAYMENT_HEADERS } from "@/constants";
import useCashbookPayments from "@/hooks/components/useCashbookPayments"
import { Plus, X } from "lucide-react";

function CashbookPayments() {
  const {
    payments,
    cashbooks,
    paymentCurrency,
    adjustPaymentCurrency,
    addRow
  } = useCashbookPayments();
  return (
    <div>
      <Header title="Payment" variant={"danger"}/>
      <div className="main-card">
        <ColumnsContainer numberOfCols={2} marginClass="">
          <SectionHeader
            title="Payments"
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
            <span className="text-sm self-center">Currency: <span className="text-green-600">{paymentCurrency}</span></span>
         </div>
        </ColumnsContainer>
        <div className="mt-10">
          <TableBase headers={CASH_BOOK_PAYMENT_HEADERS}>
              {
                payments.map(pr=>(
                  <TableRow>
                    <TableCell className="text-center">{pr.date ?? ""}</TableCell>
                    <TableCell className="text-center">{pr.payRef ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.type ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.glAccount ?? ""}</TableCell>
                    <TableCell className="text-left">{pr.details ?? ""}</TableCell>
                    <TableCell className="text-end">{pr.totalPay ?? ""}</TableCell>
                    <TableCell className="text-end">{pr.vat ?? ""}</TableCell>
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

export default CashbookPayments