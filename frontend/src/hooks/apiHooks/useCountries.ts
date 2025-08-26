import React from "react";
import type { Country } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";

export default function useCountries() {
   const { data, isLoading, error } = useQuery<Country[]>({
      queryKey: ["countries"],
      queryFn: async () => {
         const persistentData = getPersistentData();
         const cachedCountries = persistentData?.countries         

         if (cachedCountries) return cachedCountries;
         const response = await api.get<Country[]>("/api/common/locations/countries/");
         savePersistentData("countries", response.data)  
         return response.data
      }
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch countries");
      }
   }, [error]);

   return { countries: data, isLoading };
}
