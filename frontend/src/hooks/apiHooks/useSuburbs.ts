import React from "react";
import type { CityWithSuburbs, SuburbMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";

export default function useSuburbs(cityId?: string) {
   const { data, isLoading, error } = useQuery<SuburbMinimal[]>({
      queryKey: ["suburbs", cityId],
      queryFn: async () =>{
         const persistentData = getPersistentData();
         const cachedSuburbs = persistentData[`suburb_${cityId}`]

         if(cachedSuburbs) return cachedSuburbs
         const response =await  api.get<CityWithSuburbs>(`/api/common/locations/cities/${cityId}/`)
         savePersistentData(`suburb_${cityId}`, response.data.suburbs);
         return response.data.suburbs
      },
      enabled: !!cityId,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch suburbs");
      }
   }, [error]);

   return { suburbs: data, isLoading };
}
