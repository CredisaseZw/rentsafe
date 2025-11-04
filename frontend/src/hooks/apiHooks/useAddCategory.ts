import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { AddCategoryPayload } from "@/types";

export default function useAddCategory(){
    return useMutation({
        mutationFn : async(payload: AddCategoryPayload) =>{
            const response = 
            payload.type === "create"
            ? await api.post("/api/accounting/sales-categories/", payload.data)
            : await api.put(`/api/accounting/sales-categories/${payload.id}/`, payload.data)
            
            return response.data
        }
    })
}