import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { Cashbook } from "@/types";

interface CBResponse extends Response{
    results: Cashbook[]
}

export default function useGetCashbook(page:Number){
    const {data, isLoading, error} = useQuery<CBResponse>({
        queryKey : ["cashBooks", page],
        queryFn : async()=>{
            const response = await api.get<CBResponse>(`/api/accounting/cash-books/?page=${page}`);
            return response.data;
        }
    })
    return {cashBooksData : data, isCashbookLoading : isLoading, cashbookError : error};
}