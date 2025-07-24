import type { CompanyFull } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useCompany(companyId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<CompanyFull>({
      queryKey: ["company", companyId],
      queryFn: () => api.get<CompanyFull>(`/api/companies/${companyId}/`).then((res) => res.data),
      enabled,
   });

   return { error, company: data, isLoading, refetch };
}
