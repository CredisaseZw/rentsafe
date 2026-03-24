import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateBillingDocument(type? : "invoice" | "creditNote" | "cashSale", isTrustAcc?: boolean){
    const { mutate } =  useMutation({
        mutationFn : async(payload:Payload)=>{
            const isInvoiceType = type === "invoice" || type === "cashSale";
            const BASE_LINK = isInvoiceType
            ? (isTrustAcc
                ? "/api/trust-accounting/invoices/"
                : "/api/accounting/invoices/")
            : "/api/accounting/credit-notes/";

            const response = payload.mode === "create"
            ? await api.post(BASE_LINK, payload.data)
            : type === "invoice" 
            ? await api.put(`${BASE_LINK}${payload.id}/`, payload.data)
            : await api.patch(`${BASE_LINK}${payload.id}/`, payload.data)
            return response.data;
        }
    })
    return { mutateBill : mutate }
}