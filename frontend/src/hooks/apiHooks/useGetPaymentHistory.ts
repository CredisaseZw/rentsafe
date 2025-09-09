import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { PaymentHistoryResponse } from "@/types";

export default function useGetPaymentHistory(lease_id : string | undefined){
    const {data, isLoading, error, refetch} = useQuery<PaymentHistoryResponse>({
        queryKey : ["payment_history", lease_id],
        queryFn : async()=>{
            const response = api.get<PaymentHistoryResponse>(`/api/leases/${lease_id}/payment-history/`)
            return (await response).data
        },
    })

    return {data, isLoading, error, refetch}
}