import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import useMultiContactInput from "@/hooks/components/useMultiContactInput";
import ContactFormFields from "./ContactFormFields";

export default function MultiContactInput() {
   const { contacts, addContact, removeContact } = useMultiContactInput();

   return (
      <div>
         {contacts.map((_, index) => (
            <fieldset
               key={index}
               className="border-color relative mb-5 rounded-xl border  p-5 bg-transparent"
            >
               <legend className="px-4 font-bold">{`Contact ${index + 1}`}</legend>

               <ContactFormFields number={index + 1} />

               <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform">
                  <Button
                     className="rounded-full"
                     variant="DANGER"
                     size="icon"
                     type="button"
                     onClick={() => removeContact(index)}
                  >
                     <Trash2 />
                  </Button>
               </div>
            </fieldset>
         ))}

         <Button variant="outline" size="sm" type="button" onClick={addContact}>
            <Plus /> Add Contact
         </Button>
      </div>
   );
}
