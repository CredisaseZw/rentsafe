import React from "react";
import type { Country } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useCountries() {
   const { data, isLoading, error } = useQuery<Country[]>({
      queryKey: ["countries"],
      queryFn: () => api.get<Country[]>("/api/common/locations/countries/").then((res) => res.data),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch countries");
      }
   }, [error]);

   return { countries: data, isLoading };
}
