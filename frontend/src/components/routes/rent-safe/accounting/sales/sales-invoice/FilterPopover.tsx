import {Button} from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MONTHS, YEARS } from "@/constants"


export default function FilterPopover(){
    const [open, setOpen] = useState(false)
    return (
        <Popover open = {open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" onClick={()=>setOpen(true)}> 
                    <SlidersHorizontal /> Filter
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px]">
                <form className="mt-3 flex flex-col gap-5">
                    <div className="form-group">
                        <Label>Year</Label>
                        <Select
                            name="accountType"
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
                            name="accountType"
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
                    <Button className="w-full mb-5">Apply</Button>
                </form>
            </PopoverContent>
        </Popover>
    )
}