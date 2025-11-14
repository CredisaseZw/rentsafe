import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INVOICE_STATUSES } from "@/constants"
import useInvoicesFilter from "@/hooks/components/useInvoicesFilter"
import { Input } from "@/components/ui/input"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import Fieldset from "@/components/general/Fieldset"
import { Checkbox } from "@/components/ui/checkbox"

export default function InvoicesFilter() {
  const {
    open,
    setOpen,
    currencies,
    filter,
    handleChange,
    applyFilters,
    onClearFilter,
  } = useInvoicesFilter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <SlidersHorizontal /> Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[500px] h-[62vh] mr-7 overflow-y-scroll mt-1">
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
              name="customer_name"
              value={filter.customer_name}
              onChange={handleChange}
              variant="sm"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group">
            <Label>Invoice Status</Label>
            <Select
              value={filter.status_in}
              onValueChange={(val) => handleChange({ target: { name: "status_in", value: val } } as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                {INVOICE_STATUSES.map((y, idx) => (
                  <SelectItem value={String(y.value)} key={idx}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label>Currency Code</Label>
            <Select
              value={filter.currency__currency_code}
              onValueChange={(val) =>
                handleChange({ target: { name: "currency__currency_code", value: val } } as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.id} value={c.currency_code}>
                    {`${c.currency_code} - ${c.currency_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           <div className="form-group">
            <Label>Sort by</Label>
            <Select
              value={filter.ordering}
              onValueChange={(val) =>
                handleChange({ target: { name: "ordering", value: val } } as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-date_created">Date Created</SelectItem>
                <SelectItem value="total_inclusive">Total Inclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Fieldset legendTitle="Sort By Date" legendTitleVariant="sm" className="flex flex-col gap-5">
            <div className="form-group">
              <Label>Due Date</Label>
              <Input
                name="due_date__lte"
                value={filter.due_date__lte}
                onChange={handleChange}
                variant="sm"
                type="date"
              />
            </div>

            <ColumnsContainer marginClass="mt-0" numberOfCols={2} gapClass="gap-5">
              <div className="form-group">
                <Label>Minimum Sales Date</Label>
                <Input
                  name="sale_date__lte"
                  value={filter.sale_date__lte}
                  onChange={handleChange}
                  variant="sm"
                  type="date"
                />
              </div>
              <div className="form-group">
                <Label>Maximum Sales Date</Label>
                <Input
                  name="sale_date__gte"
                  value={filter.sale_date__gte}
                  onChange={handleChange}
                  variant="sm"
                  type="date"
                />
              </div>
              <div className="form-group">
                <Label>Minimum Date Created</Label>
                <Input
                  name="date_created__lte"
                  value={filter.date_created__lte}
                  onChange={handleChange}
                  variant="sm"
                  type="date"
                />
              </div>
              <div className="form-group">
                <Label>Maximum Date Created</Label>
                <Input
                  name="date_created__gte"
                  value={filter.date_created__gte}
                  onChange={handleChange}
                  variant="sm"
                  type="date"
                />
              </div>
            </ColumnsContainer>
          </Fieldset>

          <Fieldset legendTitle="Sort By Totals" legendTitleVariant="sm" className="flex flex-col gap-5">
            <div className="form-group">
              <Label>Minimum Total Inclusive</Label>
              <Input
                name="total_inclusive__gte"
                value={filter.total_inclusive__gte}
                onChange={handleChange}
                variant="sm"
                type="number"
              />
            </div>
            <div className="form-group">
              <Label>Maximum Total Inclusive</Label>
              <Input
                name="total_inclusive__lte"
                value={filter.total_inclusive__lte}
                onChange={handleChange}
                variant="sm"
                type="number"
              />
            </div>
          </Fieldset>

          <ColumnsContainer numberOfCols={2} marginClass="">
            <div className="flex flex-row gap-2">
              <Checkbox
                id="is_recurring"
                checked={filter.is_recurring === "true"}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: { name: "is_recurring", type: "checkbox", checked },
                  } as any)
                }
              />
              <Label htmlFor="is_recurring">Is Recurring</Label>
            </div>
            <div className="flex flex-row gap-2">
              <Checkbox
                id="is_invoiced"
                checked={filter.is_invoiced === "true"}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: { name: "is_invoiced", type: "checkbox", checked },
                  } as any)
                }
              />
              <Label htmlFor="is_invoiced">Is Invoiced</Label>
            </div>
          </ColumnsContainer>

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
