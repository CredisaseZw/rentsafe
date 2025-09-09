import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useSearchClient(
  type: "individual" | "company" |string,
  query: string,
  enabled: boolean
) {
  const url =
    type === "individual"
      ? "/api/individuals/search/?search="
      : "/api/branches/search/?q=";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search_landlord", type, query],
    queryFn: async () => {
      const { data } = await api.get(`${url}${query}`);
      return data.results;
    },
    enabled: enabled && query.trim().length > 0
  });

  return { error, isLoading, data, refetch };
}
