import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { CreditNote } from "@/interfaces";

export default function useGetCreditNote(id: string | undefined){
    const {data, isLoading, error} = useQuery<CreditNote>({
        queryKey : ["creditNote", id],
        queryFn: async()=>{
            const response = await api.get<CreditNote>(`/api/accounting/credit-notes/${id}/`)
            return response.data;
        },
        enabled : Boolean(id)
    })
    return {
        data,
        isLoading,
        error
    }
}   