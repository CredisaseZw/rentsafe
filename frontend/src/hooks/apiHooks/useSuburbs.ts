import React from "react";
import type { CityWithSuburbs, SuburbMinimal } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useSuburbs(cityId?: string) {
   const { data, isLoading, error } = useQuery<SuburbMinimal[]>({
      queryKey: ["suburbs", cityId],
      queryFn: () =>
         api.get<CityWithSuburbs>(`/api/common/locations/cities/${cityId}/`).then((res) => res.data.suburbs),
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
