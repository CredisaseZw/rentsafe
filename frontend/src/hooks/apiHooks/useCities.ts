import React from "react";
import type { CityMinimal, ProvinceWithCities } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useCities(provinceId?: string) {
   const { data, isLoading, error } = useQuery<CityMinimal[]>({
      queryKey: ["cities", provinceId],
      queryFn: () =>
         api.get<ProvinceWithCities>(`/api/common/locations/provinces/${provinceId}/`).then((res) => res.data.cities),
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
