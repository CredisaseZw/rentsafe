import type { CompanyPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";

export default function useCreateCompany() {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: async (companyPayload: CompanyPayload) => api.post("/api/companies/", companyPayload),
      onError(error: AxiosError | Error | unknown) {
         console.error("Error creating company:", error);
         if (isAxiosError(error)) {
            toast.error("Failed to create company", {
               description: JSON.stringify(error.response?.data.details),
            });
            return;
         }
         toast.error("Failed to create company. Please try again.", { description: JSON.stringify(error) });
      },
      onSuccess(data) {
         client.invalidateQueries({ queryKey: ["minimal-companies-list"] });
         console.log("Company created successfully:", data);
         toast.success("Company created successfully!");
      },
   });

   return { isPending, createCompany: mutate };
}
