import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/axios"
import type { Category } from "@/types";

interface Response {
    count : number;
    next : string  | undefined ;
    previous : string | undefined ;
    results: Category[]
}

export default function useGetSalesCategories(page:Number){
    const {data, isLoading, error, refetch} = useQuery<Response>({
        queryKey : ["salesCategories", page],
        queryFn : async()=>{
            const response = await api.get<Response>(`/api/accounting/sales-categories/?page=${page}`)
            return response.data
        }
    })
    return {
        categories : data,
        categoriesLoading: isLoading,
        categoriesError : error,
        refetch
    }
}