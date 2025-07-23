import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import useMultiAddressInput from "@/hooks/components/useMultiAddressInput";
import AddressFormFields from "./AddressFormFields";

export default function MultiAddressInput() {
   const { addresses, addAddress, removeAddress } = useMultiAddressInput();

   return (
      <div>
         {addresses.map((_, index) => (
            <fieldset
               key={index}
               className="border-foreground/30 relative mb-5 rounded-xl border bg-white p-5 shadow-md"
            >
               <legend className="px-2 font-bold">{index === 0 ? "Primary Address" : `Address ${index + 1}`}</legend>

               <AddressFormFields number={index + 1} />

               <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform">
                  <Button
                     className="rounded-full"
                     variant="DANGER"
                     size="icon"
                     type="button"
                     onClick={() => removeAddress(index)}
                  >
                     <Trash2 />
                  </Button>
               </div>
            </fieldset>
         ))}

         <Button size="sm" type="button" onClick={addAddress}>
            Add Address <Plus />
         </Button>
      </div>
   );
}
