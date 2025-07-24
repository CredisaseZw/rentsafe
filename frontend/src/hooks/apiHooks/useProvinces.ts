import React from "react";
import type { CountryWithProvinces, ProvinceMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useProvinces(countryId?: string) {
   const { data, isLoading, error } = useQuery<ProvinceMinimal[]>({
      queryKey: ["provinces", countryId],
      queryFn: () =>
         api
            .get<CountryWithProvinces>(`/api/common/locations/countries/${countryId}/`)
            .then((res) => res.data.provinces),
      enabled: !!countryId,
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch provinces");
      }
   }, [error]);

   return { provinces: data, isLoading };
}
