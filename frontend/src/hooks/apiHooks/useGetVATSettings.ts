import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { VATRow } from "@/types";

export default function useGetVATSettings(){
    const {data, isLoading, error} = useQuery<VATRow[]>({
        queryKey : ["VATSettings"],
        queryFn : async()=>{
            const response = await api.get<VATRow[]>("/api/accounting/vat-settings/")
            return response.data
        }
    })
    return {
        data,
        isLoading,
        error
    }
}