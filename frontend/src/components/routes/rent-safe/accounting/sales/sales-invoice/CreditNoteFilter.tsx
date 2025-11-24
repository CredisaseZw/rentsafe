import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MONTHS, YEARS } from "@/constants"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useFilter from "@/hooks/components/useFilter"

export default function CreditNotesFilter() {
  const [filter, setFilter] = useState({
    year : "",
    customer: "",
    month: "",
  })

  const {
    open,
    setOpen,
    handleChange,
    applyFilters,
    onClearFilter,
  } = useFilter(filter, setFilter)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <SlidersHorizontal /> Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[500px] h-fit mr-7 pb-7">
        <form
          className="mt-3 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            applyFilters(e)
          }}
        >
          <div className="form-group">
            <Label >Customer Name</Label>
            <Input
              name="customer"
              value={filter.customer}
              onChange={handleChange}
              variant="sm"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="form-group">
            <Label>Year</Label>
            <Select
              value={filter.year}
              onValueChange={(val) =>
                handleChange({ target: { name: "year", value: val } } as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((Y, idx) => (
                  <SelectItem key={idx} value={Y.value}>{Y.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           <div className="form-group">
            <Label>Month</Label>
            <Select
              value={filter.month}
              onValueChange={(val) =>
                handleChange({ target: { name: "month", value: val } } as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                {
                  MONTHS.map((m, idx)=> <SelectItem value={m.value} key={idx}>{m.label}</SelectItem>)
                }
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClearFilter}>
              Clear
            </Button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
