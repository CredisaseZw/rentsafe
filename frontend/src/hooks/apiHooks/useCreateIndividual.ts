import type { IndividualPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";
import type { IndividualFull, IndividualMinimal } from "@/interfaces";

export default function useCreateIndividual(successCallback?: () => void) {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: (individualPayload: IndividualPayload) =>
         api.post<IndividualFull>("/api/individuals/", individualPayload).then((res) => res.data),
      onError(error: AxiosError | Error | unknown) {
         console.error("Error creating individual:", error);
         if (isAxiosError(error)) {
            toast.error("Failed to create individual", {
               description: JSON.stringify(error.response?.data.details),
            });
            return;
         }
         toast.error("Failed to create individual. Please try again.", { description: JSON.stringify(error) });
      },
      onSuccess(individual) {
         client.setQueryData<IndividualFull>(["individual", individual.id], individual);

         const matchingSearchQueries = client.getQueryCache().findAll({
            queryKey: ["individuals-minimal"],
            predicate(query) {
               const key = query.queryKey;
               return !!key.find((k) => {
                  const q = String(k).trim().toLowerCase();
                  const matchesFirstName = individual.first_name.trim().toLowerCase().includes(q);
                  const matchesLastName = individual.last_name?.trim().toLowerCase().includes(q);
                  const matchesIdNum = individual.identification_number.trim().toLowerCase().includes(q);
                  return matchesFirstName || matchesLastName || matchesIdNum;
               });
            },
         });
         const keys = matchingSearchQueries.map((q) => q.queryKey);
         keys.push(["individuals-minimal", null]);

         keys.forEach((key) => {
            client.setQueryData<IndividualMinimal[]>(key, (old) => {
               const minimalIndividual: IndividualMinimal = {
                  id: individual.id,
                  first_name: individual.first_name,
                  last_name: individual.last_name,
                  identification_number: individual.identification_number,
                  contact_details: [
                     {
                        id: individual.contact_details[0].id,
                        individual_id: individual.id,
                        mobile_phone: individual.contact_details[0].mobile_phone,
                        email: individual.contact_details[0].email,
                     },
                  ],
                  is_active: true,
               };
               return old ? [...old, minimalIndividual] : [minimalIndividual];
            });
         });

         toast.success("Individual created successfully!");
         if (successCallback) successCallback();
      },
   });

   return { isPending, createIndividual: mutate };
}
