import { api } from "@/api/axios";
import type { Payload } from "@/types";
import { useMutation } from "@tanstack/react-query";

export default function useAddPropertyExpense(){
    return useMutation({
        mutationFn : async(data: Payload)=>{
            const response = data.mode === "create"
            ? await api.post("/api/trust-accounting/property-expenses/", data.data)
            : await api.patch(`/api/trust-accounting/property-expenses/${data.id}/`, data.data)
            
            return response.data;
        }
    })
}