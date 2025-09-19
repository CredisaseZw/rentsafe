import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type {Option} from "@/types"
import { Label } from "@/components/ui/label"

interface props {
    options : Option[],
    label?: string,
    name?: string,
    required? : string,
    firstIsDefault? :boolean
    disabled? : boolean,
    onValChange? : (val: string) => void
}

function SelectElement({options, onValChange, label, firstIsDefault}: props) {
  return (
    <div className="form-group">
        {
            label &&
            <Label>{label}</Label> 
        }
        <Select
            name="type"
            onValueChange={(val) => {
                if (onValChange) onValChange(val)
            }}
            defaultValue={firstIsDefault && options.length > 0 ? options[0].value : undefined}
            >
            <SelectTrigger className="border-color w-full bg-white">
                <SelectValue placeholder="Select ..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((p: Option, index: number) => (
                    <SelectItem key={index} value={p.value}>
                    {p.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
    
  )
}

export default SelectElement