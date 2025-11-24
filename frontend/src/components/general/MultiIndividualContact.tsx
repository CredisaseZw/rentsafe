import { PHONE_TYPES } from "@/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import ColumnsContainer from "./ColumnsContainer"
import Fieldset from "./Fieldset"
import type { Option } from "@/types"
import useMultiIndividualContact from "@/hooks/components/useMultiIndividualContact"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import Button from "./Button"
import { Trash } from "lucide-react"

function MultiIndividualContact() {
    const {
        counts, setCounts, handleRemove
    } = useMultiIndividualContact()

    return (
       
        <Fieldset legendTitle="Contact Numbers">
            {
                counts.map((_, index:number)=>(
                    <div key={index}>
                        <ColumnsContainer numberOfCols={2} marginClass={ index === 0 ? "mt-0" : "mt-5" }>
                            <div className="form-group">
                                <Label className="required">Phone Type</Label>
                                <Select name={"type" + index} required defaultValue="mobile">
                                    <SelectTrigger id={"address_type" + index} className="border-color w-full bg-white">
                                        <SelectValue placeholder="Select ..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PHONE_TYPES.map((p: Option, index: number) => (
                                            <SelectItem key={index} value={p.value}>
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-row">
                                <div className="form-group">
                                    <Label className="required">Contact Number</Label>
                                    <Input
                                        placeholder="e.g 0781234567"
                                        required 
                                        name={`number${index}`}
                                        id={`number${index}`}
                                    />
                                </div> 
                                {
                                    index !== 0 &&
                                    <Button onClick={()=>handleRemove(index)} variant="ghost" className="h-fit self-center mt-[15px] text-red-600">
                                        <Trash size={18}/>
                                    </Button>
                                }
                              
                            </div>
                        </ColumnsContainer>
                    </div>
                 ))
            }
        <Button variant="outline" className="mt-2" onClick={()=> setCounts((p)=>[...p, undefined])}>
            Add another
        </Button>
        </Fieldset>
  )
}

export default MultiIndividualContact