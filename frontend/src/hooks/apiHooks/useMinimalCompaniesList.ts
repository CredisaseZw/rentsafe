import { useEffect } from "react";
import type { CompanyMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router";

export default function useMinimalCompaniesList() {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("q")?.trim() || "all";

   const { data, isLoading, error } = useQuery<CompanyMinimal[]>({
      queryKey: ["companies-minimal", q],
      queryFn: () =>
         api
            // .get<{ results: CompanyMinimal[] }>(`/api/companies/${q ? `search/?q=${encodeURIComponent(q)}` : ""}`)
            // .then((res) => res.data.results),
            .get<{ results: { company: CompanyMinimal }[] }>(
               `/api/companies/${q ? `search/?q=${encodeURIComponent(q)}` : ""}`,
            )
            .then((res) => res.data.results.map((item) => item.company)),
   });

   useEffect(() => {
      if (error) {
         console.log(error);
         toast.error(q ? `Search failed for query "${q}"` : "Could not fetch companies");
      }
   }, [error, q]);

   console.log(data);

   return { companies: data, isLoading };
}
