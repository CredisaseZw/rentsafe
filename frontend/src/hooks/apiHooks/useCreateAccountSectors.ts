import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { AddAccountingSectorPayload } from "@/types";

export default function useCreateAccountSectors(){
    return useMutation({
        mutationFn : async(payload: AddAccountingSectorPayload)=>{
            const response = 
            payload.mode === "create"
            ? await api.post("/api/accounting/account-sectors/", payload.data)
            : await api.patch(`/api/accounting/account-sectors/${payload.id}/`, payload.data)
            
            return response.data
        }
    })
}