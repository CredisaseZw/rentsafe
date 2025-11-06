import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { SalesItem } from "@/types";

interface Response  {
    count  :number;
    next: string | null,
    previous: string | null,
    results: SalesItem[]
}

export default function useGetSalesItems(page:Number, search?:string | null){
    const {data, isLoading, error, refetch } = useQuery<Response>({
        queryKey :!search 
        ? ["salesItems", page] 
        : ["salesItems", page, search],
        queryFn : async () =>{
            const URL  = search
            ? `/api/accounting/items/?page=${Number(page)}`
            : "/api/accounting/items/"
            const response = await api.get<Response>(URL)
            return response.data;
        }
    })

    return {data, isLoading, error, refetch };
}