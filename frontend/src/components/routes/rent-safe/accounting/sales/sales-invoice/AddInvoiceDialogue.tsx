import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IN_LEASE_CLIENT_TYPES } from "@/constants"
import type{ Option } from "@/types"
import AutoCompleteClient from "@/components/general/AutoCompleteClient"
import useAddInvoiceForm from "@/hooks/components/useAddInvoiceForm"
import { getCurrentDate } from "@/lib/utils"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies"
import { useEffect } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import LoadingIndicator from "@/components/general/LoadingIndicator"

function AddInvoiceDialogue() {
    const {
        currencies,
        currency,
        formData,
        searchItem,
        discount,
        handleDiscountChange,
        setCurrencies,
        setFormData,
        setSearchItem,
        onSelectBiller,
        setCurrency
    } = useAddInvoiceForm()

  const {currencyData, currencyLoading, currencyError} = useGetCurrencies()

  useEffect(()=>{
    if(isAxiosError(currencyError)){
      const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
      toast.error("Error fetching currencies", {description : m})
    } 
    if(currencyData){
      const c = currencyData.find((c)=> c.currency_code === "USD")
      setCurrencies(currencyData)
      setCurrency(c)
    }
  },[currencyData, currencyError])

    return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button >Add Invoice <Plus/></Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle>Add Invoice</DialogTitle>
                </DialogHeader> 
                <div className="w-full">
                    <form>
                        <ColumnsContainer numberOfCols={2} gapClass="gap-5">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-row justify-between">
                                    <Label className="">Document Number</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="documentNumber"
                                    />
                                </div>
                                <div className=" flex flex-row justify-between">
                                    <Label>Bill To</Label>
                                    <div className="flex flex-row gap-5">
                                        <Select
                                            onValueChange={(val: "individual" | "company") => {
                                            setSearchItem("")
                                            setFormData((prev) => ({
                                                ...prev,
                                                landlord_id : "",
                                                landlord_name : "",
                                                landlord_type: val,
                                            }));
                                           
                                            }}
                                        >
                                            <SelectTrigger className="w-fit self-center">
                                                <SelectValue placeholder="Select ..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                IN_LEASE_CLIENT_TYPES.map((option:Option, index : number)=>
                                                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                                )
                                                }
                                            </SelectContent>
                                        </Select>
        
                                        <AutoCompleteClient
                                            isRequired = {false}
                                            searchItem = {searchItem}
                                            setSearchItem = {setSearchItem}
                                            clientType = {formData.biller_type}
                                            onSelectValue = {onSelectBiller}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">Address</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="address"
                                    />
                                </div>
                                 <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">Phone</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="phone"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">Email</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="email"
                                    />
                                </div>
                                <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">VAT No</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="vatNo"
                                    />
                                </div>
                                <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">Tin Number</Label>
                                    <Input
                                        className="w-[400px]"
                                        name="tinNumber"
                                    />
                                </div>
                                <div className="flex flex-row gap-5 justify-between">
                                    <Label className="">Date</Label>
                                    <Input
                                        defaultValue={getCurrentDate()}
                                        className="w-[400px]"
                                        name="date"
                                    />
                                </div>
                            </div>
                        </ColumnsContainer>
                        <div className="mt-10">
                            <Table className="border-color rounded border w-full">
                                <TableRow noHover>
                                    <TableCell className="w-1/12"></TableCell>
                                    <TableCell className="w-2/12"></TableCell>
                                    <TableCell className="w-2/12"></TableCell>
                                    <TableCell colSpan={2} className="text-center w-2/12">Currency</TableCell>
                                    <TableCell colSpan={2} className="text-center w-3/12">
                                        <Select name="currency" required defaultValue={String(currency?.id)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select ..." />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                <TableRow noHover>
                                    <TableCell className="border-r border-color w-1/12"></TableCell>
                                    <TableCell colSpan={5} className="border-r border-color w-9/12">
                                        <div className="flex flex-row justify-between">
                                            <Button variant={"outline"}>Add Row <Plus/></Button>
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
                            </Table>
                        </div>
                        <div className="mt-5 flex flex-row justify-end gap-5">
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </div>
                    </form>
                </div>
                <DialogFooter>
                  
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddInvoiceDialogue