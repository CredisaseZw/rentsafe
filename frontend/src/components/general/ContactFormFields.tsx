import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import AutoCompleteIndividualSearchInput from "./AutoCompleteIndividualSearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function ContactFormFields({ number }: { number: number }) {
   const [selectedPosition, setSelectedPosition] = useState("primary");
   return (
      <div className="mt-5 grid grid-cols-4 items-center gap-5">
         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"individual" + number}>
               Individual
            </Label>
            <AutoCompleteIndividualSearchInput number={number} />
         </div>
         <div className="flex flex-col gap-2">
            <input
               type="hidden"
               id={"contact_type" + number}
               name={"contact_type" + number}
               value={selectedPosition}
               readOnly
            />

            <Label className="px-2 font-normal" htmlFor={"contact_type" + number}>
               Contact Type
            </Label>

            <Select onValueChange={(value) => setSelectedPosition(value)}>
               <SelectTrigger
                  id={"contact_type" + number}
                  name={"contact_type" + number}
                  className="border-foreground/40 w-[180px] bg-white"
               >
                  <SelectValue placeholder="Select contact type" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"position" + number}>
               Position
            </Label>
            <Input
               id={"position" + number}
               name={"position" + number}
               className="border-foreground/40 bg-white"
               placeholder="e.g. Administrator"
            />
         </div>

         <div className="flex items-center justify-center gap-2">
            <Checkbox
               id={"is_primary" + number}
               name={"is_primary" + number}
               value="true"
               className="border-foreground/40 bg-white"
            />
            <Label className="px-2 font-normal" htmlFor={"is_primary" + number}>
               Is Primary
            </Label>
         </div>
      </div>
   );
}
