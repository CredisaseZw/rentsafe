import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { AddAccountingSectorPayload } from "@/types";
import { BASE_ACCOUNT_SECTORS } from "@/constants/base-links";

export default function useCreateAccountSectors(){
    const {mutate} = useMutation({
        mutationFn : async(payload: AddAccountingSectorPayload)=>{
            const response = 
            payload.mode === "create"
            ? await api.post(BASE_ACCOUNT_SECTORS.link, payload.data)
            : await api.patch(`${BASE_ACCOUNT_SECTORS.link}${payload.id}/`, payload.data)
            
            return response.data
        }
    })

    return {
        mutate
    }
}