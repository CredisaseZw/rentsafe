import type { BranchComplete } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useBranch(companyId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<BranchComplete>({
      queryKey: ["branch", companyId],
      queryFn: () => api.get<BranchComplete>(`/api/branches/${companyId}/`).then((res) => res.data),
      enabled,
   });

   return { error, company: data, isLoading, refetch };
}
