import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { PropertTypeResponse } from "@/types";

export default function getPropertyTypes() {
  const { data, isLoading, error, refetch } = useQuery<PropertTypeResponse>({
    queryKey: ["property_types"],
    queryFn: () =>
      api
        .get<PropertTypeResponse>("/api/properties/property-types/")
        .then((response) => response.data),
    staleTime: 10 * 60 * 1000,
  });

  return { data, isLoading, error, refetch };
}
