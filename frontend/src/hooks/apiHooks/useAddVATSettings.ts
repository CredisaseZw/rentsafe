import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { VATPayload, } from "@/types";

export default function useAddVATSettings(){
    return useMutation({
        mutationFn : async(payload: VATPayload)=>{
            const response = 
            payload.mode === "create"
            ? await api.post("/api/accounting/vat-settings/", [payload.data])
            : await api.patch(`/api/accounting/vat-settings/${Number(payload.id)}/`, [payload.data])
            return response.data
        }
    })
}