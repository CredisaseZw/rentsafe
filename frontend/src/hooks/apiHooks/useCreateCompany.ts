import type { CompanyPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";

export default function useCreateCompany() {
   const { mutate, isPending } = useMutation({
      mutationFn: async (companyPayload: CompanyPayload) => api.post("/api/companies/", companyPayload),
      onError(error: AxiosError | Error | unknown) {
         console.error("Error creating company:", error);
         if (isAxiosError(error)) {
            toast.error("Failed to create company. Please try again.", {
               description: JSON.stringify(error.response?.data),
            });
            return;
         }
         toast.error("Failed to create company. Please try again.", { description: JSON.stringify(error) });
      },
      onSuccess(data) {
         console.log("Company created successfully:", data);
         toast.success("Company created successfully!");
      },
   });

   return { isPending, createCompany: mutate };
}
