import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { api } from "@/api/axios";

export default function useMinimalIndividualsList(individualQuery?: string) {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("individual_q")?.trim() || individualQuery?.trim();
   const page = searchParams.get("individual_page") || "1";

   const { data, isLoading, error } = useQuery({
      queryKey: ["individuals-minimal", q],
      queryFn: () => {
         const query = q ? `search/?q=${encodeURIComponent(q)}` : "";
         return api
            .get(`/api/individuals/${query ? query + (page ? "&page=" + page : "") : page ? "?page=" + page : ""}`)
            .then((res) => res.data);
      },

      // (q ? api.get<IndividualMinimal[]>(`/api/individuals/search/?q=${q}`).then((res) => res.data) : []),
   });

   useEffect(() => {
      if (error) {
         console.log(error);
         toast.error(q ? `Search failed for query "${q}"` : "Could not fetch individuals");
      }
   }, [error, q]);

   return { data, isLoading, searchQuery: q };
}
