import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router";
import type { BranchApiResponse } from "@/interfaces";

export default function useCompanyBranches() {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("company_q")?.trim() || "";
   const page = searchParams.get("company_page") || "1";
   const hasQuery = q.length > 0;

   const { data, isLoading, error } = useQuery<BranchApiResponse>({
      queryKey: ["company-branches", q, page],
      queryFn: async () => {
         const params = new URLSearchParams();
         if (q) params.append("q", q);
         if (page) params.append("page", page === "null" ? "1" : page);

         const url = q ? `/api/branches/search/?${params}` : `/api/branches/?${params}`;
         const res = await api.get<BranchApiResponse>(url);
         return res.data;
      },
      enabled: hasQuery,
   });

   useEffect(() => {
      if (error) {
         console.error(error);
         toast.error(q ? `Search failed for "${q}"` : "Could not fetch company branches");
      }
   }, [error, q]);

   return {
      data : hasQuery ? data : [],
      isLoading,
      searchQuery: q };
}
