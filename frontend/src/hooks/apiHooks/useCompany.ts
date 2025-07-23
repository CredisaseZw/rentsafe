import React from "react";
import type { CompanyFull } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useCompany(companyId: number, enabled?: boolean, errorCb?: () => void) {
   const { data, isLoading, error, refetch } = useQuery<CompanyFull>({
      queryKey: ["company", companyId],
      queryFn: () => api.get<CompanyFull>(`/api/companies/${companyId}/`).then((res) => res.data),
      enabled,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch company with id: " + companyId);
         errorCb?.();
      }
   }, [error, companyId, errorCb]);

   return { company: data, isLoading, refetch };
}
