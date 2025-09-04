import { api } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export default function useTerminateLease(lease_id: string){
    return useMutation({
        mutationKey: ["terminate_lease", lease_id],
        mutationFn : async (payload:any)=>{
            const response = api.post(`/api/leases/${lease_id}/terminate/`, payload);
            return (await response).data
        }
    })
}