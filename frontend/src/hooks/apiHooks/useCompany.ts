import React from "react";
import type { CompanyFull } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useCompany(companyId: number, enabled?: boolean) {
   const { data, isLoading, error, refetch } = useQuery<CompanyFull>({
      queryKey: ["company", companyId],
      queryFn: () => api.get(`/api/companies/${companyId}/`).then((res) => res.data),
      enabled,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch company with id: " + companyId);
      }
   }, [error, companyId]);

   return { company: data, isLoading, refetch };
}
