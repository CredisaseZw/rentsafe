import React from "react";
import type { CityMinimal, ProvinceWithCities } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";

export default function useCities(provinceId?: string) {
   const { data, isLoading, error } = useQuery<CityMinimal[]>({
      queryKey: ["cities", provinceId],
      queryFn: async() =>{
         const persistentData = getPersistentData();
         const cachedCities = persistentData[`city_${provinceId}`]

         if (cachedCities) return cachedCities;
         const response = await api.get<ProvinceWithCities>(`/api/common/locations/provinces/${provinceId}/`)
         
         savePersistentData(`city_${provinceId}`, response.data.cities)
         return response.data.cities;
      },
      enabled: !!provinceId,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch cities");
      }
   }, [error]);

   return { cities: data, isLoading };
}
