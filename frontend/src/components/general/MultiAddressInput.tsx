import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import useMultiAddressInput from "@/hooks/components/useMultiAddressInput";
import AddressFormFields from "./AddressFormFields";

interface props {
   isMultiple?: boolean;
}

export default function MultiAddressInput({ isMultiple = true }: props) {
   const { addresses, addAddress, removeAddress } = useMultiAddressInput();

   return (
      <div>
         {addresses.map((_, index) => (
            <fieldset
               key={index}
               className="border-color relative w-full mb-5 rounded-xl border bg-white/50 p-5 dark:bg-transparent"
            >
               <legend className="px-4 font-semibold text-zinc-800 dark:text-gray-50">
                  {index === 0 ? "Primary Address" : `Address ${index + 1}`}
               </legend>

               <AddressFormFields number={index + 1} />
               {isMultiple && (
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
               )}
            </fieldset>
         ))}
         {
            isMultiple &&
            <Button variant="outline" size="sm" type="button" onClick={addAddress}>
               <Plus /> Add Address
            </Button>
         }
      </div>
   );
}
