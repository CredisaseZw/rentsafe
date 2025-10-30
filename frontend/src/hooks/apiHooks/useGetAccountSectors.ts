import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { AccountSector } from "@/types";

interface ASResponse extends Response{
    results : AccountSector[]
}

export default function useGetAccountSectors(page: Number, search : string | null){
    const {data, isLoading, error,refetch } = useQuery<ASResponse>({
        queryKey : !search 
        ? ["accountSectors", page]
        : ["accountSectors", search],
        queryFn : async()=>{
            const URL =  !search 
            ? `/api/accounting/account-sectors/?page=${page}`
            : `/api/accounting/account-sectors/?search=${search}`

            const response = await api.get<ASResponse>(URL)
            return response.data;
        }
    });

    return {data, isLoading, error,refetch }
}