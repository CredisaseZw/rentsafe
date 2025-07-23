import React from "react";
import type { City } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useCities() {
   const { data, isLoading, error } = useQuery<City[]>({
      queryKey: ["cities"],
      queryFn: () => api.get<City[]>("/api/common/locations/cities/").then((res) => res.data),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch cities");
      }
   }, [error]);

   return { cities: data, isLoading };
}
