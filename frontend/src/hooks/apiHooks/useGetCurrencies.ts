import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";
import type { CurrencyResponse } from "@/types";

export default function useGetCurrencies(){
    const {data, isLoading, error, } = useQuery<CurrencyResponse>({
        queryKey : ["currencies"],
        queryFn :async ()=>{
            const persistentData = getPersistentData();
            const cachedCurrencies = persistentData?.currencies;

            if (cachedCurrencies) return cachedCurrencies;
            const response = await api.get<CurrencyResponse>("/api/accounting/currency/")
            savePersistentData("currencies", response.data);
            return response.data
        }
    })

    return {
        currencyData : data,
        currencyLoading : isLoading,
        currencyError : error
    }
}