import { useEffect } from "react";
import type { IndividualMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { sampleIndividualRows } from "@/lib/sampleData";

export default function useMinimalIndividualsList() {
   const [searchParams] = useSearchParams();
   const q = searchParams.get("individual_q")?.trim();

   const { data, isLoading, error } = useQuery<IndividualMinimal[]>({
      queryKey: ["individuals-minimal", q],
      queryFn: () => (q ? [] : sampleIndividualRows),
   });

   useEffect(() => {
      if (error) {
         console.log(error);
         toast.error(q ? `Search failed for query "${q}"` : "Could not fetch individuals");
      }
   }, [error, q]);

   return { individuals: data, isLoading, searchQuery: q };
}
