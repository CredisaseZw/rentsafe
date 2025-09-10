import type { IndividualPayload } from "@/interfaces/form-payloads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { isAxiosError, type AxiosError } from "axios";
import useClient from "../general/useClient";
import type { IndividualFull, IndividualMinimal } from "@/interfaces";
//import { extractErrorMessage } from "@/lib/utils";

export default function useCreateIndividual(successCallback?: () => void) {
   const client = useClient();

   const { mutate, isPending } = useMutation({
      mutationFn: (individualPayload: IndividualPayload) =>
         api.post<IndividualFull>("/api/individuals/", individualPayload).then((res) => res.data),
      onError(error: AxiosError | Error | unknown) {
         if (isAxiosError(error)) {
            console.error("Full backend response:", error.response?.data);
            const errorDetails = error.response?.data.error;
            toast.error("Failed to create individual", { description: errorDetails });
            return;
         }
         toast.error("Failed to create individual. Please try again.");
         return;
      },
    onSuccess(individual) {
      try {
        client.setQueryData<IndividualFull>(["individual", individual.id], individual);
        client.invalidateQueries({
          queryKey: ["individuals-minimal"]
        });
        client.getQueryCache().findAll({
          predicate: (query) => query.queryKey[0] === "individuals-minimal"
        }).forEach((query) => {
          client.setQueryData(query.queryKey, (old: any) => {
            console.log("Current cache data structure:", old);
            
            const minimalIndividual: IndividualMinimal = {
              id: individual.id,
              first_name: individual.first_name,
              last_name: individual.last_name ?? "",
              identification_number: individual.identification_number ?? "",
              contact_details: individual.contact_details ? {
                id: individual.contact_details[0].id,
                individual_id: individual.id,
                mobile_phone: individual.contact_details[0].mobile_phone ?? [],
                email: individual.contact_details[0].email ?? "",
              } : undefined,
              is_active: true,
            };

            if (old && old.results && Array.isArray(old.results)) {
              const withoutDupes = old.results.filter((i: IndividualMinimal) => i.id !== individual.id);
              return {
                ...old,
                results: [...withoutDupes, minimalIndividual],
                count: old.count + 1 
              };
            } else {
              console.warn("Unexpected cache data structure, creating new:", old);
              return {
                count: 1,
                next: null,
                previous: null,
                results: [minimalIndividual]
              };
            }
          });
        });

    toast.success("Individual created successfully!");
    if (successCallback) successCallback();

  } catch (error) {
    console.error("Error in onSuccess callback:", error);
    toast.error("Individual created but cache update failed. Please reload the page");
  }
}
  });

   return { isPending, createIndividual: mutate };
}
