import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { LeaseResponse } from "@/types";

export default function useGetLeases(page:number, status: string, search: string | null){
    const {data, isLoading, error, refetch}= useQuery<LeaseResponse>({
        queryKey :["leases", page, status],
        queryFn: async ()=>{
             const URL = !search
            ? `/api/leases/?status=${status === "ACTIVE" || status === "RENEW" ? "ACTIVE" : "TERMINATED"}&&page=${page}`
            : `/api/leases/search/?q=${search}&&status=${status}`;
            console.log(URL)
            const response = await api.get<LeaseResponse>(URL) 
            console.log(response.data)
            return response.data
        }
    })    

    return {data, isLoading, error, refetch}
}
