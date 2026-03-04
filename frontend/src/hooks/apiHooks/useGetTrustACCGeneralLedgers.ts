import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import useURLParamFilter from "../components/useURLParamFilter";
import type { Response, TrustGLAccount } from "@/interfaces";

interface GLResponse extends Response {
    results : TrustGLAccount[]
}
function useGetTrustACCGeneralLedgers(
    params?: Record<string, string>, 
    enabled = true) {
    const {
        getUrlParams
    }  =useURLParamFilter()
    
    if(params?.search) delete params.page;
    if(!params)params = getUrlParams();
    
    const {data, isLoading, isError, error} = useQuery({
        queryKey : ["trust-general-ledgers", params],
        queryFn : async() =>{
            const response = api.get<GLResponse>("/api/trust-accounting/general-ledgers/", {
                params 
            })
            return (await response).data;
         },
        enabled
    })
    return {
        isError,
        data,
        isLoading,
        error
  }
}

export default useGetTrustACCGeneralLedgers