import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { getPersistentData, savePersistentData } from "@/lib/utils";
import type { Currency } from "@/types";
import type { Response } from "@/interfaces";

interface CurrencyResponse extends Response{
    results: Currency[]
}

export default function useGetCurrencies(){
    const {data, isLoading, error, refetch} = useQuery<CurrencyResponse>({
        queryKey : ["currencies"],
        queryFn :async ()=>{
            const persistentData = getPersistentData();
            const cachedCurrencies = persistentData?.currencies;

            if (cachedCurrencies) return cachedCurrencies;
            const response = await api.get<CurrencyResponse>("/api/accounting/currencies/")
            savePersistentData("currencies", response.data);
            return response.data
        }
    })

    return {
        currencyData : data,
        currencyLoading : isLoading,
        currencyError : error,
        currencyRefetch : refetch
    }
}