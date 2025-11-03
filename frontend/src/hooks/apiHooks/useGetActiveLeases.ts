import { useQuery} from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { LeaseResponse } from "@/types";

export function useGetLeases(page:number, status: string, search: string | null){
    const {data, isLoading, error, refetch}= useQuery<LeaseResponse>({
        queryKey :!search ? ["leases", page, status] :["leases", page, status, search],
        queryFn: async ()=>{
            const URL = !search
            ? `/api/leases/?status=${status === "ACTIVE" || status === "RENEW" ? "ACTIVE" : "TERMINATED"}&&page=${page}`
            : `/api/leases/search/?search=${search}&&status=${status}`;
            const response = await api.get<LeaseResponse>(URL) 
            return response.data
        }
    })    
    return {data, isLoading, error, refetch}
}
