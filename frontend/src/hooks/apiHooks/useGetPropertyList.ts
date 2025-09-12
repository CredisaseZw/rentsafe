import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PropertiesResponse } from "@/types";
import { api } from "@/api/axios";

export default function getPropertyList(page: number, search: string = "", enabled?: boolean) {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: ["property_lists", page, search],
    queryFn: () =>
      api
        .get<PropertiesResponse>(`/api/properties/?page=${page}${search ? `&search=${search}` : ""}`)
        .then((res) => res.data),
    enabled,
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, error, refetch };
}
