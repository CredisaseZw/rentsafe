import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";
import { handleAxiosError } from "@/lib/utils";

export default function useRequestBillerUpdate(){
    return useMutation({
        mutationFn : async(payload:Payload) =>{
            const URL  = payload.mode === "individual" 
            ? `/api/individuals/${payload.id}/`
            :  `/api/branches/${payload.id}/`

            const response = await api.patch(URL, payload.data)
            return response.data;
        },
        onError: (error) => handleAxiosError("Failed to update biller", error), 
    });
}