import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateInvoice(){
    return useMutation({
        mutationFn : async(payload:Payload)=>{
            const response = payload.mode === "create"
            ? await api.post("/api/accounting/invoices/", payload.data)
            : await api.put(`/api/accounting/invoices/${payload.id}/`, payload.data)
            return response.data;
        }
    })
}