import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateBillingDocument(type : "invoice" | "creditNote"){
    return useMutation({
        mutationFn : async(payload:Payload)=>{
            const BASE_LINK = type === "invoice"
            ? "/api/accounting/invoices/"
            : "/api/accounting/credit-notes/";

            const response = payload.mode === "create"
            ? await api.post(BASE_LINK, payload.data)
            : type === "invoice" 
            ? await api.put(`${BASE_LINK}${payload.id}/`, payload.data)
            : await api.patch(`${BASE_LINK}${payload.id}/`, payload.data)
            return response.data;
        }
    })
}