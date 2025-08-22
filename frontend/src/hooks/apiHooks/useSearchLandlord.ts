import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useSearchLandlord(
  type: "individual" | "company",
  query: string,
  enabled: boolean
) {
  const url =
    type === "individual"
      ? "/api/individuals/search/?q="
      : "/api/companies/search/?q=";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search_landlord", type, query],
    queryFn: async () => {
      const { data } = await api.get(`${url}${query}`);
      if(type === "company"){
        return data.results
      }
      return data;
    },
    enabled: enabled && query.trim().length > 0
  });

  return { error, isLoading, data, refetch };
}
