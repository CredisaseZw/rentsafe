import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { LeaseResponse } from "@/interfaces";

export default function useGetLeaseInformation(leaseID: string | undefined) {
    const {data, isLoading, error} = useQuery<LeaseResponse>({
        queryKey : ["lease", leaseID],
        queryFn : async()=>{
            const response = await api.get<LeaseResponse>(`/api/leases/${leaseID}/`)
            return response.data;
        },
        enabled : !!leaseID

    })

    return {
        leaseResponseObject: leaseID ? data : null,
        leaseError:leaseID ? error : null,
        leaseLoading:leaseID ? isLoading : false,
        error
    }    

}