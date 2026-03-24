import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TRUST_ACC_INVOICE_STATUSES } from "@/constants"
import { Input } from "@/components/ui/input"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import useURLParamFilter from "@/hooks/components/useURLParamFilter"

/*
Parameter	Value
lease_id	(empty)
start_date	(empty)
end_date	(empty)
min_amount	(empty)
max_amount	(empty)
is_overdue	(empty)
is_posted	(empty)
invoice_type	fiscal
status	(empty)
tenant_id	2
by_landlord	3
*/
const DEFAULT_PARAMS = {
    start_date: "",
    end_date: "",
    min_amount: "",
    max_amount: "",
    is_overdue: "false",
    is_posted: "false",
    status: "",
}

function TrustInvoicesFilter() {
    const [open,setOpen] =useState(false);
    const [filters, setFilters] = useState(DEFAULT_PARAMS);
    const { updateURLFilters, resetFilters } = useURLParamFilter()

    const handleChange = (key:string, value: string) =>{
        setFilters((p)=>({
            ...p,
            [key] : value
        }))
    }
    
    const OnReset = ()=> {
        setFilters(DEFAULT_PARAMS);
        resetFilters()
    }

    return (
        <Popover open = {open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <SlidersHorizontal /> Filter
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    updateURLFilters(filters);
                }} className="flex flex-col gap-5">
                    <div className="form-group">
                        <Label>Sort by</Label>
                        <Select
                            value={filters.status}
                            onValueChange={(val) =>
                                handleChange("status", val)
                            }
                            >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ..." />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                TRUST_ACC_INVOICE_STATUSES.map((i, idx)=>(
                                    <SelectItem value={i.value} key={idx}>{i.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                        </Select>
                    </div>
                    <ColumnsContainer numberOfCols={2} marginClass="">
                        <div className="form-group">
                            <Label>Start Date</Label>
                            <Input
                                name="start_date"
                                value={filters.start_date}
                                onChange={(e)=>handleChange("start_date", e.target.value)}
                                variant="sm"
                                type="date"
                            />
                        </div>
                        <div className="form-group">
                            <Label>End Date</Label>
                            <Input
                                name="end_date"
                                value={filters.end_date}
                                onChange={(e)=>handleChange("end_date", e.target.value)}
                                variant="sm"
                                type="date"

                            />
                        </div>
                    </ColumnsContainer>
                    <div className="form-group">
                        <Label>Min Amount</Label>
                        <Input
                            name="min_amount"
                            value={filters.min_amount}
                            onChange={(e)=>handleChange("min_amount", e.target.value)}
                            variant="sm"
                            type="number"
                            step={"0.01"}
                            min={0}
                        />
                    </div>
                    <div className="form-group">
                        <Label>Max Amount</Label>
                         <Input
                            name="max_amount"
                            value={filters.max_amount}
                            onChange={(e)=>handleChange("max_amount", e.target.value)}
                            variant="sm"
                            type="number"
                            step={"0.01"}
                            min={0}
                        />
                    </div>
                    <ColumnsContainer numberOfCols={2} marginClass="">
                        <div className="flex flex-row gap-2">
                            <Checkbox
                                id="is_overdue"
                                checked={filters.is_overdue === "true"}
                                onCheckedChange={(checked) =>handleChange("is_overdue", String(checked))}
                            />
                            <Label htmlFor="is_overdue">Is Overdue</Label>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Checkbox
                                id="is_posted"
                                checked={filters.is_posted === "true"}
                                onCheckedChange={(checked) =>handleChange("is_overdue", String(checked))}
                               
                            />
                            <Label htmlFor="is_posted">Is Posted</Label>
                            </div>
                    </ColumnsContainer>
                    <div className="flex flex-row gap-3 justify-end items-center">
                        <Button variant={"outline"} type="button" onClick={OnReset}>Reset</Button>
                        <Button>Apply</Button>
                    </div>
                </form>
               
            </PopoverContent>
        </Popover>
)
}

export default TrustInvoicesFilter