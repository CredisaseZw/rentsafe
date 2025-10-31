import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { CreateCashbookPayload } from "@/interfaces";

export default function useCreateCashbook(){
    return useMutation({
        mutationFn : async(payload: CreateCashbookPayload) =>{
            const response = payload.mode === "create"
            ? api.post("/api/accounting/cash-books/", payload.data)
            : api.patch(`/api/accounting/cash-books/${payload.id}/`, payload.data)
            return (await response).data
        }
    })
}