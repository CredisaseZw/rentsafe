import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { VATRow } from "@/types";
import type { Response } from "@/interfaces";

interface VATSettingsResponse extends Response{
    results: VATRow[];
}

export default function useGetVATSettings(page:Number){
    const {data, isLoading, error} = useQuery<VATSettingsResponse>({
        queryKey : ["VATSettings", page],
        queryFn : async()=>{
            const response = await api.get<VATSettingsResponse>(`/api/accounting/vat-settings/?page=${page}`)
            return response.data
        }
    })
    return {
        data,
        isLoading,
        error
    }
}