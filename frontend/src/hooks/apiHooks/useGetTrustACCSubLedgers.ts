import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import useURLParamFilter from "../components/useURLParamFilter";
import type { Response, TrustSubGLAccount } from "@/interfaces";

interface SubGLResponse extends Response {
    results : TrustSubGLAccount[]
}

function useGetTrustACCSubLedgers(
    params: Record<string, string> | undefined, 
    enabled = true) {
    const {
        getUrlParams
    }  =useURLParamFilter()
    
    if(!params) params = getUrlParams();
    if(params?.search) delete params.page;

    const {data, isLoading, error} = useQuery({
        queryKey : ["trust-sub-general-ledgers", params],
        queryFn : async() =>{
            const response = api.get<SubGLResponse>("/api/trust-accounting/general-ledger-accounts/", {
                params 
            })
            return (await response).data;
         },
        enabled
    })
    return {
        data,
        isLoading,
        error
  }
}

export default useGetTrustACCSubLedgers