import type { BranchPayload } from "@/interfaces/form-payloads";
import React from "react";
import { extractAddresses, extractContacts, getFormDataObject } from "@/lib/utils";
import useCreateBranch from "../apiHooks/useCreateBranch";

export default function useBranchForm() {
   const [showForm, setShowForm] = React.useState(false);
   const { isPending, createBranch } = useCreateBranch(() => setShowForm(false));

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data = getFormDataObject(event);

      const branchPayload: BranchPayload = {
         company: parseInt(data.companyId as string),
         branch_name: data.branch_name as string,
         email : (data.branch_email as string),
         phone: (data.branch_phone as string),
         addresses: extractAddresses(data),
         contacts: extractContacts(data),
      };
      
      createBranch(branchPayload);
   }

   return { showForm, isPending, handleSubmit, setShowForm };
}
