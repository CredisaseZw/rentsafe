import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { ReceiptLease } from "@/types";

export default function useCreateReceipt(){
    return useMutation({
        mutationFn : async (payments:{ payments: ReceiptLease[] }) =>{
            const response = await api.post("/api/leases/bulk-payments/", payments);
            return response.data
        }
    })
}