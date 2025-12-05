import type { Address } from "@/interfaces";
import React from "react";

export default function useMultiAddressInput(addressesContainer? : Address[]) {
   const [addresses, setAddresses] = React.useState<(Address | undefined)[]>(addressesContainer ?? [undefined]);

   function addAddress() {
      setAddresses((prev) => [...prev, undefined]);
   }

   function removeAddress(index: number) {
      setAddresses((prev) => prev.filter((_, i) => i !== index));
   }

   return {
      addresses,
      addAddress,
      removeAddress,
   };
}
