import React from "react";
import type { CompanyMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useMinimalCompaniesList() {
   const { data, isLoading, error } = useQuery<{
      data: { count: number; next?: string; previous?: string; results: CompanyMinimal[] };
   }>({
      queryKey: ["minimal-companies-list"],
      queryFn: async () => await api.get("/api/companies/"),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch companies");
      }
   }, [error]);
   return { companies: data?.data.results, isLoading };
}
