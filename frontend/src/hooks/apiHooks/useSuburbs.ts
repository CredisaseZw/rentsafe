import React from "react";
import type { Suburb } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useSuburbs() {
   const { data, isLoading, error } = useQuery<Suburb[]>({
      queryKey: ["suburbs"],
      queryFn: () => api.get<Suburb[]>("/api/common/locations/suburbs/").then((res) => res.data),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch suburbs");
      }
   }, [error]);

   return { suburbs: data, isLoading };
}
