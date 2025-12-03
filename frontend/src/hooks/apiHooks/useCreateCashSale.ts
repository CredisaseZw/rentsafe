import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

export default function useCreateCashSale(){
    return useMutation({
        mutationFn : async(payload:Payload)=>{
            const response = await api.post("/api/accounting/cash-sales/", payload.data);
            return response.data
        }
    })
}