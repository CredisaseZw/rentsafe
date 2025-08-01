import type { BranchPayload } from "@/interfaces/form-payloads";
import React from "react";
import { extractAddresses, extractContacts } from "@/lib/utils";
import useCreateBranch from "../apiHooks/useCreateBranch";

export default function useBranchForm(companyId: number) {
   const [showForm, setShowForm] = React.useState(false);
   const { isPending, createBranch } = useCreateBranch(() => setShowForm(false));

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const branchPayload: BranchPayload = {
         company: companyId,
         branch_name: data.branch_name as string,
         addresses: extractAddresses(data),
         contacts: extractContacts(data),
      };
      console.log(branchPayload);
      //      createBranch(branchPayload);
   }

   return { showForm, isPending, handleSubmit, setShowForm };
}
