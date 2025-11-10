import {Button} from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INVOICE_STATUSES, MONTHS, YEARS } from "@/constants"
import useInvoicesFilter from "@/hooks/components/useInvoicesFilter"


export default function InvoicesFilter(){
    const {
        open,
        filterPayload,
        handleOnFilterChange,
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
            <PopoverContent className="w-[350px]">
                <form className="mt-3 flex flex-col gap-5" onSubmit={(e)=>{e.preventDefault(); applyFilters()}}>
                    <div className="form-group">
                        <Label>Invoice Status</Label>
                        <Select
                            value={filterPayload.status}
                            name="status"
                            onValueChange={(val)=> handleOnFilterChange("status", val)}
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
                        <Label>Year</Label>
                        <Select
                            value={filterPayload.year}
                            name="accountType"
                            onValueChange={(val)=> handleOnFilterChange("year", val)}

                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    YEARS.map((y, idx)=>
                                        <SelectItem value={String(y.value)} key={idx} >{y.label}</SelectItem>   
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="form-group">
                        <Label>Month</Label>
                        <Select
                            value={filterPayload.month}
                            name="accountType"
                            onValueChange={(val)=> handleOnFilterChange("month", val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    MONTHS.map((y, idx)=>
                                        <SelectItem value={String(y.value)} key={idx} >{y.label}</SelectItem>   
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-row justify-end gap-3">
                        <Button className="" type="button" variant={"outline"} onClick={onClearFilter}>Clear</Button>
                        <Button className="mb-3" type="submit">Apply</Button>
                    </div>
                   
                </form>
            </PopoverContent>
        </Popover>
    )
}