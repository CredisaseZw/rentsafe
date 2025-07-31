import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router";
import type { BranchComplete } from "@/interfaces";

export default function useCompanyBranches() {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("company_q")?.trim();

   const { data, isLoading, error } = useQuery<BranchComplete[]>({
      queryKey: ["company-branches", q],
      queryFn: () => {
         const query = q ? `search/?q=${encodeURIComponent(q)}` : "";
         return api
            .get<{
               count: number;
               next?: string;
               previous?: string;
               results: BranchComplete[];
            }>(`/api/branches/${query}`)
            .then((res) => res.data.results);
      },
   });

   useEffect(() => {
      if (error) {
         console.log(error);
         toast.error(q ? `Search failed for query "${q}"` : "Could not fetch companies");
      }
   }, [error, q]);

   return { branches: data, isLoading, searchQuery: q };
}
