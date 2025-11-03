import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateCashbook(){
    return useMutation({
        mutationFn : async(payload: Payload) =>{
            const response = payload.mode === "create"
            ? api.post("/api/accounting/cash-books/", payload.data)
            : api.patch(`/api/accounting/cash-books/${payload.id}/`, payload.data)
            return (await response).data
        }
    })
}