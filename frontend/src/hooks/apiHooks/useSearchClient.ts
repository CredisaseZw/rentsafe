import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useSearchClient(
  type: "individual" | "company" | "tenant" | string,
  query: string,
  enabled: boolean,
  sector : "norm" | "customer"
) {
  
  let url:string;
  if(sector === "norm"){
    url = type === "individual"
    ? "/api/individuals/?search="
    : "/api/branches/?search=";
  } else if (sector === "customer"){
      url = `/api/accounting/customers/?customer_type=${type}&search=`
  }
   
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
