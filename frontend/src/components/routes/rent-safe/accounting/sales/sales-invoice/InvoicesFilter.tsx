import {Button} from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INVOICE_STATUSES} from "@/constants"
import useInvoicesFilter from "@/hooks/components/useInvoicesFilter"
import { Input } from "@/components/ui/input"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import Fieldset from "@/components/general/Fieldset"
import { Checkbox } from "@/components/ui/checkbox"


export default function InvoicesFilter(){
    const {
        open,
        currencies,
        applyFilters,
        setOpen,
        onClearFilter
    } = useInvoicesFilter()
    return (
        <Popover open = {open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" onClick={()=>setOpen(true)}> 
                    <SlidersHorizontal /> Filter
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] h-[62vh] mr-7 overflow-y-scroll mt-1">
                <form className="mt-3 flex flex-col gap-5" onSubmit={(e)=>{e.preventDefault(); applyFilters(e)}}>
                    <div className="form-group">
                        <Label>Customer Name</Label>
                        <Input name = "customerName" variant={"sm"} placeholder="e.g John Doe"/>
                    </div>
                    <div className="form-group">
                        <Label>Invoice Status</Label>
                        <Select
                            name="status"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    INVOICE_STATUSES.map((y, idx)=>
                                        <SelectItem value={String(y.value)} key={idx} >{y.label}</SelectItem>   
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="form-group">
                        <Label>Currency Code</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder = "Select ..."></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    currencies.map((c)=>(
                                        <SelectItem value={c.currency_code}>{`${c.currency_code} - ${c.currency_name}`}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                    </div>
                    <Fieldset 
                        marginClass=""
                        legendTitle="Sort By Date"
                        legendTitleVariant="sm"
                        className="flex flex-col gap-5">
                        <div className="form-group">
                            <Label>Due Date</Label>
                            <Input name="dueDateLess" variant="sm" type={"date"}/>
                        </div>
                        <ColumnsContainer marginClass="mt-0" numberOfCols={2} gapClass="gap-5">
                            <div className="form-group">
                                <Label>Minimum Sales Date</Label>
                                <Input name="salesDateLess" variant="sm" type={"date"}/>
                            </div>
                            <div className="form-group">
                                <Label>Maximum Sales Date</Label>
                                <Input name="salesDateGreater" variant="sm" type={"date"}/>
                            </div>
                            <div className="form-group">
                                <Label>Minimum Date Created</Label>
                                <Input name="dateCreatedLess" variant="sm" type={"date"}/>
                            </div>
                            <div className="form-group">
                                <Label>Maximum Date Created</Label>
                                <Input name="dateCreatedMax" variant="sm" type={"date"}/>
                            </div>
                        </ColumnsContainer>
                    </Fieldset>
                    <Fieldset
                        legendTitle="Sort By Totals"
                        legendTitleVariant="sm"
                        marginClass=""
                        className="flex flex-col gap-5"
                        >
                        <div className="form-group">
                            <Label>Minimum Total Inclusive</Label>
                            <Input name="miniTotalInclusive" variant="sm" type={"number"}/>
                        </div>
                        <div className="form-group">
                            <Label>Maximum Total Inclusive</Label>
                            <Input name="maxTotalInclusive" variant="sm" type={"number"}/>
                        </div>
                    </Fieldset>
                    <ColumnsContainer numberOfCols={2} marginClass="">
                        <div className="flex flex-row gap-2">
                            <Checkbox name="isRecurring" value={"true"} />
                            <Label>Is Recurring</Label>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Checkbox name="isInvoiced" value={"true"}/>
                            <Label>Is Invoiced</Label>
                        </div>
                    </ColumnsContainer>
                    <div className="flex flex-row justify-end gap-3">
                        <Button className="" type="button" variant={"outline"} onClick={onClearFilter}>Clear</Button>
                        <Button className="mb-3" type="submit">Apply</Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}