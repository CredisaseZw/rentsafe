import type { SuburbPayload } from "@/types";
import { useState } from "react";

export default function useAddressFormFields() {
   const [searchValue, setSearchValue] = useState("")
   const [suburb, setSuburb] = useState<SuburbPayload | null>(null)
   const onSelectSuburb =  (item: SuburbPayload) => {
      setSuburb(item)
   }

   return {
      suburb,
      searchValue,
      setSearchValue,
      onSelectSuburb
   };
}
