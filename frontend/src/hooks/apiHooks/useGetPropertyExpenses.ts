import { useQuery } from "@tanstack/react-query"
import useURLParamFilter from "../components/useURLParamFilter"
import { api } from "@/api/axios";
import type { PropertyExpense, Response } from "@/interfaces";

interface prop extends Response{
    results : PropertyExpense[]
}
function useGetPropertyExpenses(
    params? : Record<string, string> | undefined,
    enabled = true
) {
    const {getUrlParams} = useURLParamFilter();
    if(!params){
        params =  getUrlParams();
    }

    const {data, isLoading, isError, error} = useQuery({
        queryKey :["property-expenses", params],
        queryFn : async()=>{
            const response = await api.get<prop>("/api/trust-accounting/property-expenses", {
                params
            })
            return response.data;
        },
        enabled
    })

    return {
        data,
        isLoading,
        isError,
        error
    }
}

export default useGetPropertyExpenses