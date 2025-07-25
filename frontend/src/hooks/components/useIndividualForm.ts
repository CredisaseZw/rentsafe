import React from "react";

export default function useIndividualForm() {
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      console.log("new individual data:", data);
   }

   return { handleSubmit };
}
