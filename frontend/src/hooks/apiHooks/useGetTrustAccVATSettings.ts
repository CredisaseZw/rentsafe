import { useQuery } from "@tanstack/react-query";
import useURLParamFilter from "../components/useURLParamFilter";
import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { VATRow } from "@/types";

interface props extends Response{
    results: VATRow[]
}
function useGetTrustAccVATSettings(params?: Record<string, unknown> | undefined) {
    const { getUrlParams } = useURLParamFilter()
    if(!params){
        params = getUrlParams()
    }
    if(params.search) delete params.page;

    const {data, isLoading, error, isError} = useQuery({
        queryKey : ["trust-acc-vat-settings", params],
        queryFn: async()=>{
            const response = await api.get<props>(
                "/api/trust-accounting/tax-rates",
                {
                    ...(
                        params && { params : params }
                    )
                }
            )
            return response.data;
        }
    })
    
    return {
        isError,
        data, 
        isLoading,
        error
    }
}

export default useGetTrustAccVATSettings