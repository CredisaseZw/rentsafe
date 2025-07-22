import React from "react";
import type { Province } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/axios";

export default function useProvinces() {
   const { data, isLoading, error } = useQuery<Province[]>({
      queryKey: ["provinces"],
      queryFn: () => api.get<Province[]>("/api/common/locations/provinces/").then((res) => res.data),
   });

   React.useEffect(() => {
      if (error) {
         console.log(error);
         toast.error("Could not fetch provinces");
      }
   }, [error]);

   return { provinces: data, isLoading };
}
