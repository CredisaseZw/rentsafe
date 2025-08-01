import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import AutoCompleteIndividualSearchInput from "./AutoCompleteIndividualSearchInput";

export default function ContactFormFields({ number }: { number: number }) {
   return (
      <div className="mt-5 grid grid-cols-4 items-center gap-5">
         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"individual" + number}>
               Individual
            </Label>
            <AutoCompleteIndividualSearchInput number={number} />
         </div>

         <div className="flex flex-col gap-2">
            <Label className="px-2 font-normal" htmlFor={"contact_type" + number}>
               Contact Type
            </Label>
            <Input
               id={"contact_type" + number}
               name={"contact_type" + number}
               placeholder="e.g. Admin"
               className="border-foreground/40 bg-white"
            />
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
