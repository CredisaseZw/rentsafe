import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useSearchClient(
  type: "individual" | "company" | "tenant",
  query: string,
  enabled: boolean
) {
  const url =
    type === "individual"
    ? "/api/individuals/search/?search="
    : type === "tenant"
    ? "/api/accounting/customers/?customer_type=tenant&search="
    : "/api/branches/?search=";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search_landlord", type, query],
    queryFn: async () => {
      const { data } = await api.get(`${url}${query}`);
      return type === "individual" ? data : data.results;
    },
    enabled: enabled && query.trim().length > 0
  });

  return { error, isLoading, data, refetch };
}
