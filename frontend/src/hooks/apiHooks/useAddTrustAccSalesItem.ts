import { api } from "@/api/axios"
import type { Payload } from "@/types"
import { useMutation } from "@tanstack/react-query"

function useAddTrustAccSalesItem() {
    const { mutate } = useMutation({
        mutationFn : async(payload:Payload)=>{
            const response = payload.mode === "create"
            ? await api.post("/api/trust-accounting/sales-items/", payload.data)
            : await api.patch(`/api/trust-accounting/sales-items/${payload.id}/`, payload.data)

            return response.data
        }
    })
    return {
        mutate
    }
}

export default useAddTrustAccSalesItem