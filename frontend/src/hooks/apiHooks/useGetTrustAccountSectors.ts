import { useQuery } from "@tanstack/react-query"
import useURLParamFilter from "../components/useURLParamFilter";
import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { AccountSector } from "@/types";

interface TrustAccountSectorsResponse extends Response {
  results : AccountSector[]
}

function useGetTrustAccountSectors(params?:Record<string, string>, enabled=true) {
    const {getUrlParams} = useURLParamFilter()
    if(!params) params = getUrlParams(); 
    if(params?.search) delete params.page;
    
    const {data, isLoading, error, isError} = useQuery({
      queryKey : ["trust-account-account-sectors", params],
      queryFn : async()=>{
        const response = await api.get<TrustAccountSectorsResponse>("/api/trust-accounting/account-types/", {
          params
        })
        return response.data;
      },
      enabled
    })
    return {
      data,
      isLoading,
      error,
      isError
  }
}

export default useGetTrustAccountSectors