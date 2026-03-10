import { api } from "@/api/axios"
import type { Response, TrustAccExchangeRate } from "@/interfaces"
import { useQuery } from "@tanstack/react-query"

interface Response_ extends Response{
    results: TrustAccExchangeRate[]
}

function useGetLatestTrustAccCurrencyRate() {
    const {data, isLoading, error}  =useQuery({
        queryKey : ["trust-account-latest-rate"],
        queryFn : async()=>{
            const response =await api.get<Response_>("/api/trust-accounting/exchange-rates?latest_rate=true")
            const latest_rate = response.data.results.length > 0 ?  response.data.results.at(0) : undefined
            return latest_rate
        }
    })
    return {
        data,
        isLoading,
        error
    }
}

export default useGetLatestTrustAccCurrencyRate