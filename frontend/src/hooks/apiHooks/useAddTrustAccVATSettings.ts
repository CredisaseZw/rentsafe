import { api } from "@/api/axios";
import type { Payload } from "@/types";
import { useMutation } from "@tanstack/react-query";

export default function useAddTrustAccVATSettings(){
    const {mutate} = useMutation({
        mutationFn: async(payload: Payload)=>{
            const response =payload.mode === "update"
            ? await api.patch(`/api/trust-accounting/tax-rates/${payload.id}/`, payload.data)
            : await api.post("/api/trust-accounting/tax-rates/", payload.data)

            return response.data
        }
    })

    return {
        mutate
    }
}
