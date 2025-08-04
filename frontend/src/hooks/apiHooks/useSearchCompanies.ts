import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import type { SearchCompanyApiRespionse } from "@/interfaces";

export function SearchCompany(companyQuery: string) {
   const { data, isLoading, error, refetch } = useQuery<SearchCompanyApiRespionse>({
      queryKey: ["searchCompany", companyQuery],
      queryFn: () =>
         api.get<SearchCompanyApiRespionse>(`/api/companies/search/?q=${companyQuery}`).then((res) => res.data),
   });

   return { error, companies: data, isLoading, refetch };
}
