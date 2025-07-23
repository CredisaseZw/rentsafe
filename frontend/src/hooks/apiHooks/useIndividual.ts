import React from "react";
import type { IndividualFull } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useIndividual(individualId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<IndividualFull>({
      queryKey: ["individual", individualId],
      queryFn: () => api.get<IndividualFull>(`/api/individuals/${individualId}/`).then((res) => res.data),
      enabled,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch individual with id: " + individualId);
      }
   }, [error, individualId]);

   return { individual: data, isLoading, refetch };
}
