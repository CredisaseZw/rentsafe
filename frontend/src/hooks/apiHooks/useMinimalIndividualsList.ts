import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { api } from "@/api/axios";

export default function useMinimalIndividualsList(individualQuery?: string) {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("individual_q")?.trim() || individualQuery?.trim() || "";
  const page = searchParams.get("individual_page") || "1";

  const hasQuery = q.length > 0;

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["individuals-minimal", q, page],
    queryFn: async () => {
      const query = q ? `?search=${encodeURIComponent(q)}` : "";
      const pageQuery = page ? `${query ? "&" : "?"}page=${page}` : "";
      const url = `/api/individuals/${query}${pageQuery}`;

      const res = await api.get(url);
      return res.data;
    },

    enabled: hasQuery,
  });

  useEffect(() => {
    if (error && hasQuery) {
      toast.error(`Search failed for "${q}"`);
    }
  }, [error, hasQuery, q]);

  return {
    data: hasQuery ? data : [], 
    isLoading: hasQuery ? isLoading : false,
    searchQuery: q,
    currentPage: page,
  };
}
