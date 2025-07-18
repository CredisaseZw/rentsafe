import type React from "react";

export default function useCompanyForm() {
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      console.log("new company data:", data);
   }

   return { handleSubmit };
}
