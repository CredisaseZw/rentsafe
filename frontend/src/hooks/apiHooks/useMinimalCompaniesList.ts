import React from "react";
import type { CompanyMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useMinimalCompaniesList() {
   const { data, isLoading, error } = useQuery<CompanyMinimal[]>({
      queryKey: ["companies-minimal"],
      queryFn: async () =>
         await api.get<{ results: CompanyMinimal[] }>("/api/companies/").then((res) => res.data.results),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch companies");
      }
   }, [error]);
   return { companies: data, isLoading };
}
