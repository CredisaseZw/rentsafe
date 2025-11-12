import { api } from "@/api/axios";
import type { Invoice } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";

export default function useGetInvoice(id:number){
    const {data, isLoading, error} = useQuery<Invoice>({
        queryKey : ["invoice", id],
        queryFn : async() =>{
            const response = await api.get<Invoice>(`/api/accounting/invoices/${id}/`)
            return response.data
        }
    })

    return {
        data,
        isLoading,
        error
    }
}