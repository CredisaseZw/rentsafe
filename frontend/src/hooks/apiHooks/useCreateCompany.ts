import type { CompanyPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";
import type { CompanyCreationResponse } from "@/interfaces";
import { stringifyAndFmt } from "@/lib/utils";

export default function useCreateCompany(successCallback?: () => void) {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: (companyPayload: CompanyPayload) =>
         api.post<CompanyCreationResponse>("/api/companies/", companyPayload).then((res) => res.data),
      onError(error: AxiosError | Error | unknown) {
         console.error("Error creating company:", error);
         if (isAxiosError(error)) {
            toast.error("Failed to create company", {
               description: stringifyAndFmt(error.response?.data.details || error.response?.data.error),
            });
            return;
         }
         toast.error("Failed to create company. Please try again.", { description: stringifyAndFmt(error) });
      },
      onSuccess(company) {
         client.setQueryData<CompanyCreationResponse>(["company", company.id], company);

         const matchingSearchQueries = client.getQueryCache().findAll({
            queryKey: ["companies-minimal"],
            predicate(query) {
               const key = query.queryKey;
               return !!key.find((k) => {
                  const q = String(k).trim().toLowerCase();
                  const matchesRegName = company.company.registration_name.trim().toLowerCase().includes(q);
                  const matchesTradeName = company.company.trading_name?.trim().toLowerCase().includes(q);
                  const matchesRegNum = company.company.registration_number.trim().toLowerCase().includes(q);
                  return matchesRegName || matchesTradeName || matchesRegNum;
               });
            },
         });
         const keys = matchingSearchQueries.map((q) => q.queryKey);
         keys.push(["companies-minimal", null]);

         keys.forEach((key) => client.invalidateQueries({ queryKey: key }));

         toast.success("Company created successfully!");
         if (successCallback) successCallback();
      },
   });

   return { isPending, createCompany: mutate };
}
