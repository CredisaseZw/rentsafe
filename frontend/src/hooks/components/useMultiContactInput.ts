import React from "react";

export default function useMultiContactInput() {
   const [contacts, setContacts] = React.useState<undefined[]>([undefined]);

   function addContact() {
      setContacts((prev) => [...prev, undefined]);
   }

   function removeContact(index: number) {
      setContacts((prev) => prev.filter((_, i) => i !== index));
   }

   return {
      contacts,
      addContact,
      removeContact,
   };
}
