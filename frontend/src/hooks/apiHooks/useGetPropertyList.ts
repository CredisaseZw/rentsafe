import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PropertiesResponse } from "@/types";
import { api } from "@/api/axios";
import { setPropertiesStore } from "@/store/propertiesStore";

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
  setPropertiesStore(refetch)
  return { 
    propertyRows : data,
    propertiesLoading: isLoading,
    propertiesError: error,
    onPropertiesRetch:  refetch
  };
}
