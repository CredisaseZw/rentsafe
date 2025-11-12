import { useMutation } from "@tanstack/react-query";    
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateGeneralAccount(){
    return useMutation({
        mutationFn : async(payload:Payload) =>{
            const response = payload.mode === "create"
            ? await api.post("/api/accounting/ledger-accounts/", payload.data)
            : await api.patch(`/api/accounting/ledger-accounts/${payload.id}/`, payload.data)
            return response.data
        }
    })
}