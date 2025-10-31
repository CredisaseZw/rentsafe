import { useMutation } from "@tanstack/react-query";    
import { api } from "@/api/axios";
import type { CreateGeneralLedgerPayload } from "@/interfaces";

export default function useCreateGeneralAccount(){
    return useMutation({
        mutationFn : async(payload:CreateGeneralLedgerPayload) =>{
            const response = payload.mode === "create"
            ? await api.post("/api/accounting/ledger-accounts/", payload.data)
            : await api.patch(`/api/accounting/ledger-accounts/${payload.id}/`, payload.data)
            return response.data
        }
    })
}