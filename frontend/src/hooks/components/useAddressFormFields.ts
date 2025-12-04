import type { Address } from "@/interfaces";
import type { SuburbPayload } from "@/types";
import { useEffect, useState } from "react";

export default function useAddressFormFields(address: Address | undefined) {
   const [searchValue, setSearchValue] = useState("")
   const [suburb, setSuburb] = useState<SuburbPayload | null>(null)
   const onSelectSuburb =  (item: SuburbPayload) => {
      setSuburb(item)
   }

   useEffect(()=>{
      if(!address) return;
      setSearchValue(address.suburb?.name ?? "");
      setSuburb({
         id: Number(address.suburb?.id),
         name: String(address.suburb?.name),
         city: String(address.city?.name),
         province: String(address.province?.name),
         country: String(address.country?.name)
      })
   }, [address])

   return {
      suburb,
      searchValue,
      setSearchValue,
      onSelectSuburb
   };
}
