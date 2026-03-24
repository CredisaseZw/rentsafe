import { api } from "@/api/axios"
import { useMutation } from "@tanstack/react-query"

interface Payload {
    base_currency_id: number, 
    target_currency_id: number,
    rate: number
}

function useAddTrustAccountCurrencyRates() {
    const {mutate} = useMutation({
        mutationFn : async(payload:Payload)=>{
            const response = await api.post("/api/trust-accounting/exchange-rates/", payload);
            return response.data;
        }
    })
    return {
        mutate
  }
}

export default useAddTrustAccountCurrencyRates