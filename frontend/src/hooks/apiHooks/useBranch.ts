import type { Branch } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useBranch(companyId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<Branch>({
      queryKey: ["branch", companyId],
      queryFn: () => api.get<Branch>(`/api/branches/${companyId}/`).then((res) => res.data),
      enabled,
   });

   return { error, branch: data, isLoading, refetch };
}
