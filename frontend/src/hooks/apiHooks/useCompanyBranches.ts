import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router";
import type { BranchApiResponse } from "@/interfaces";

export default function useCompanyBranches() {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("company_q")?.trim();
   const page = searchParams.get("page") || "1";

   const { data, isLoading, error } = useQuery<BranchApiResponse>({
      queryKey: ["company-branches", q, page],
      queryFn: () => {
         let query = q ? `search/?q=${encodeURIComponent(q)}` : "";
         if (page) {
            query += `&page=${page}`;
         }
         return api.get<BranchApiResponse>(`/api/branches/${query}`).then((res) => res.data);
      },
   });

   useEffect(() => {
      if (error) {
         console.log(error);
         toast.error(q ? `Search failed for query "${q}"` : "Could not fetch companies");
      }
   }, [error, q]);

   return { data, isLoading, searchQuery: q };
}
