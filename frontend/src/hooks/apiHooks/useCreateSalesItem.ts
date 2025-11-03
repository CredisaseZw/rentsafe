import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateSalesItem(){
    return useMutation({
        mutationFn : async(payload:Payload)=> {
            const response = payload.mode === "create"
            ? await api.post("/api/accounting/items/", payload.data)
            : await api.put(`/api/accounting/items/${payload.id}/`, payload.data)
            return response.data
        }
    })
}