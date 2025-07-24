import React from "react";

export default function useMultiAddressInput() {
   const [addresses, setAddresses] = React.useState<undefined[]>([]);

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
