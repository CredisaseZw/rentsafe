import type { IndividualFull } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useIndividual(individualId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<IndividualFull>({
      queryKey: ["individual", individualId],
      queryFn: () => api.get<IndividualFull>(`/api/individuals/${individualId}/`).then((res) => res.data),
      enabled,
   });

   return { error, individual: data, isLoading, refetch };
}
