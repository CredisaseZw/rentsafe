import { api } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateIndividual(){
    return useMutation({
        mutationFn : async (payload: any)=>{
            const response = api.patch(`/api/individuals/${payload.USER_ID}/`, payload.PAYLOAD);
            return (await response).data
        }
    })
}