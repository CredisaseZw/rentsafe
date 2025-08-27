import { api } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export default function useTerminateLease(id: number){
    return useMutation({
        mutationKey: ["terminate_lease", id],
        mutationFn : async (payload:any)=>{
            const response = api.post(`/api/leases/${id}/terminate/`, payload);
            return (await response).data
        }
    })
}