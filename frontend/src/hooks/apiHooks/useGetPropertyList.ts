import type { PropertiesResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function getPropertyList(page: number, enabled?: boolean){
    const {data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
        queryKey :["property_lists", page],
        queryFn : () => api.get<PropertiesResponse>(`/api/properties/`).then(response=> response.data),
        enabled
    })
   return { error, data, isLoading, refetch };

}