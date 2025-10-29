import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { VATRow } from "@/types";

interface VATSettingsResponse {
    count : number
    next : string | null
    previous : string | null
    results: VATRow[];
}

export default function useGetVATSettings(page:string){
    const {data, isLoading, error} = useQuery<VATSettingsResponse>({
        queryKey : ["VATSettings", page],
        queryFn : async()=>{
            const response = await api.get<VATSettingsResponse>(`/api/accounting/vat-settings/?page=${Number(page)}`)
            return response.data
        }
    })
    return {
        data,
        isLoading,
        error
    }
}