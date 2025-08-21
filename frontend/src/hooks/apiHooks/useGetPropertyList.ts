import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PropertiesResponse } from "@/types";
import { api } from "@/api/axios";

export default function getPropertyList(page: number, enabled?: boolean) {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: ["property_lists", page],
    queryFn: () =>
      api
        .get<PropertiesResponse>(`/api/properties/?page=${page}`)
        .then((response) => response.data),
    enabled,
    placeholderData: keepPreviousData, 
  });

  return { error, data, isLoading, refetch };
}
