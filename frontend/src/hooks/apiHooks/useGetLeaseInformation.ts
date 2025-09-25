import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { LeaseResponse } from "@/interfaces";

export default function useGetLeaseInformation(leaseID: string | undefined) {
    if(leaseID){
        const {data, isLoading, error} = useQuery<LeaseResponse>({
            queryKey : ["lease", leaseID],
            queryFn : async()=>{
                const response = await api.get<LeaseResponse>(`/api/leases/${leaseID}/`)
                return response.data;
            }
        })
        return {
            leaseResponseObject:data,
            leaseError: error,
            leaseLoading:isLoading, error
        }
    } 
    return {
        leaseResponseObject : null,
        leaseError : null,
        leaseLoading : false
    }

}