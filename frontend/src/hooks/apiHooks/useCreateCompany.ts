import type { CompanyPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";
import type { CompanyFull, CompanyMinimal } from "@/interfaces";
import { queryClient } from "@/providers/react-query-client";

export default function useCreateCompany(successCallback?: () => void) {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: (companyPayload: CompanyPayload) =>
         api.post<CompanyFull>("/api/companies/", companyPayload).then((res) => res.data),
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
      onSuccess(company) {
         client.setQueryData<CompanyMinimal[]>(["companies-minimal"], (old) => {
            const minimalCompany: CompanyMinimal = {
               id: company.id,
               registration_name: company.registration_name,
               registration_number: company.registration_number,
               industry: company.industry,
               is_verified: company.is_verified,
               legal_status: company.legal_status,
               legal_status_display: company.legal_status_display,
               primary_address: company.addresses
                  ? company.addresses.find((addr) => addr.is_primary) || company.addresses[0]
                  : undefined,
            };
            return old ? [...old, minimalCompany] : [minimalCompany];
         });

         queryClient.setQueryData<CompanyFull>(["company", company.id], company);
         toast.success("Company created successfully!");
         if (successCallback) successCallback();
      },
   });

   return { isPending, createCompany: mutate };
}
