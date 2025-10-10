import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { SetCurrencySettings } from "@/types";

export function useSetCurrencySettings(){
    return useMutation({
        mutationFn : async(payload:SetCurrencySettings)=>{
            const response = await api.post("/api/accounting/currency-settings/rate-setup/", payload)
            return response.data
        }
    })
}