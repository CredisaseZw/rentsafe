import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import { Button } from "@/components/ui/button"
import useInvoiceTotalsTables from "@/hooks/components/useInvoiceTotalsTables"
import { forwardRef } from "react"

interface props{
    isCashSales? : boolean
}

const InvoiceTotalsTable = forwardRef(({isCashSales}: props, ref) => {
    const {
        currencies,
        currencyLoading,
        currency,
        cashSalesRows,
        discount,
        rows,
        handleDiscountChange,
        AddInvoiceRow,
        RemoveCashSalesRows,
        RemoveInvoiceRow,
        AddCashSaleRow,
    } = useInvoiceTotalsTables(ref)
   
    return (
    <Table className="border-color rounded border w-full">
        <TableRow noHover>
            <TableCell className="w-1/12"></TableCell>
            <TableCell className="w-2/12"></TableCell>
            <TableCell className="w-2/12"></TableCell>
            <TableCell colSpan={2} className="text-center w-2/12 text-red-600">Currency</TableCell>
            <TableCell colSpan={2} className="text-center w-3/12">
                <Select key={currency?.id}  name="currency" required defaultValue={String(currency?.id)}>
                <SelectTrigger className="w-full bg-red-600 text-white">
                        <SelectValue placeholder="Select ..." />
                    </SelectTrigger>
                    <SelectContent className="bg-red-600 text-white border-white">
                        {
                            currencies.map((c)=>
                            <SelectItem value={String(c.id)} key={c.id} >{c.currency_code + " " +  c.currency_name}</SelectItem>)
                        }
                        { 
                            currencies.length === 0 &&
                            currencyLoading &&
                            <SelectItem disabled value="loading" className="text-center flex flex-col justify-center items-center">
                                <LoadingIndicator />
                            </SelectItem>
                        }
                    </SelectContent>
                </Select>
            </TableCell>
        </TableRow>
        <TableRow noHover>
            <TableCell className="text-center border-r border-color w-1/12"></TableCell>
            <TableCell className="text-center border-r border-color w-2/12">Sales Item</TableCell>
            <TableCell className="text-center border-r border-color w-2/12">Sales Code</TableCell>
            <TableCell className="text-center border-r border-color w-2/12">Price (VAT Inc)</TableCell>
            <TableCell className="text-center border-r border-color w-1/12">Qty</TableCell>
            <TableCell className="text-center border-r border-color w-2/12">VAT</TableCell>
            <TableCell className="text-center w-2/12">Total (VAT Inc)</TableCell>
        </TableRow>
        {
            rows.map((row, index)=>(
                <TableRow key={index} noHover>
                    <TableCell className="text-center border-r border-color">
                        <Button type="button" variant={"ghost"} onClick={()=>RemoveInvoiceRow(index)}>
                            <X className="text-red-600"/>
                        </Button>
                    </TableCell>
                    <TableCell className="text-end border-r border-color">
                        <Input name={"item_code_"+index}/>
                    </TableCell>
                    <TableCell className="text-end border-r border-color">
                        {row.itemCode}
                    </TableCell>
                    <TableCell className="text-end border-r border-color">{row.price}</TableCell>
                    <TableCell className="text-end border-r border-color">
                        <Input name={"item_qty_"+index}/>
                    </TableCell>
                    <TableCell className="text-end border-r border-color">{row.vat_amount}</TableCell>
                    <TableCell className="text-end border-r border-color">{row.total ?? 0.00}</TableCell>
                </TableRow>
            ))
        }      
        <TableRow noHover>
            <TableCell className="border-r border-color w-1/12"></TableCell>
            <TableCell colSpan={5} className="border-r border-color w-9/12">
                <div className="flex flex-row justify-between">
                    <Button variant={"outline"} type="button" onClick={AddInvoiceRow}>Add Row <Plus/></Button>
                    <span className="text-sm">Total (Excluding VAT)</span>
                </div>
            </TableCell>
            <TableCell className="w-2/12">
                <div className="flex flex-row justify-end">
                    <span className="test-sm">0.00</span>
                </div>
            </TableCell>
        </TableRow>
        <TableRow noHover>
            <TableCell className="border-r border-color w-1/12"></TableCell>
            <TableCell colSpan={5} className="border-r border-color w-9/12">
                <div className="flex flex-row justify-end">
                    <span className="text-sm">Discount</span>
                </div>
            </TableCell>
            <TableCell className="w-2/12">
                <div className="flex flex-row justify-end">
                    <Input
                        name="discount"
                        value={discount}
                        type="number"
                        onChange={(e)=> handleDiscountChange(e)}
                        className="w-1/2"/>
                </div>
            </TableCell>
        </TableRow>
        <TableRow noHover>
            <TableCell className="border-r border-color w-1/12"></TableCell>
            <TableCell colSpan={5} className="border-r border-color w-9/12">
                <div className="flex flex-row justify-end">
                    <span className="text-sm">Total VAT</span>
                </div>
            </TableCell>
            <TableCell className="w-2/12">
                <div className="flex flex-row justify-end">
                    <span className="test-sm">0.00</span>
                </div>
            </TableCell>
        </TableRow>
        <TableRow noHover>
            <TableCell className="border-r border-color w-1/12"></TableCell>
            <TableCell colSpan={5} className="border-r border-color w-9/12">
                <div className="flex flex-row justify-end">
                    <span className="text-sm">Invoice Total ZIG	</span>
                </div>
            </TableCell>
            <TableCell className="w-2/12">
                <div className="flex flex-row justify-end">
                    <span className="test-sm">0.00</span>
                </div>
            </TableCell>
        </TableRow>
        {
            isCashSales &&
            <>
                <TableRow>
                    <TableCell className="text-center border-r border-color w-1/12"></TableCell>
                    <TableCell className="text-center border-r border-color w-2/12">Payment Type</TableCell>
                    <TableCell className="text-center border-r border-color w-2/12">Cash book</TableCell>
                    <TableCell className="text-center border-r border-color w-2/12">Detail</TableCell>
                    <TableCell className="text-center border-r border-color w-1/12">Ref. </TableCell>
                    <TableCell className="text-center border-r border-color w-2/12">Amount Received</TableCell>
                    <TableCell className="text-center w-2/12"></TableCell>
                </TableRow>
                {
                    cashSalesRows.map((row, index)=>(
                    <TableRow key={index} noHover>
                        <TableCell className="border-r border-color text-center"> 
                            <Button type="button" variant={"ghost"} onClick={()=>RemoveCashSalesRows(index)}>
                                <X className="text-red-600"/>
                            </Button>
                        </TableCell>
                        <TableCell className="border-r border-color" > 
                            <Select  name="currency" value={row.paymentType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select ..." />
                                </SelectTrigger>
                                <SelectContent>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="border-r border-color"> 
                            <Select  name="currency" value={row.cashBook}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select ..." />
                                </SelectTrigger>
                                <SelectContent>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="border-r border-color"> 
                            <Input value={row.detail} name="detail"/>
                        </TableCell>
                        <TableCell className="border-r border-color"> 
                            <Input value={row.ref} name="detail"/>
                        </TableCell>
                        <TableCell className="border-r border-color">    
                            <Input value={row.amountReceived} name="detail"/>
                        </TableCell>
                        <TableCell> 
                        </TableCell>
                    </TableRow>
                    ))
                }     
                <TableRow>
                    <TableCell rowSpan={7}>
                        <Button variant={"outline"} onClick={AddCashSaleRow}>Add Row</Button>
                    </TableCell>
                </TableRow> 
               
            </>
            
        }
    </Table>
  )
})

export default InvoiceTotalsTable