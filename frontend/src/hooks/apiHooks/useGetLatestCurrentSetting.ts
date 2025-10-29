import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { CurrencySetting } from "@/types";

export default function useGetLatestCurrentSetting(){
    const {data, isLoading, error} = useQuery<CurrencySetting>({
        queryKey : ["latestCurrencySetting"],
        queryFn : async()=>{
            return (await api.get<CurrencySetting>("/api/accounting/currency-settings/latest-rate/")).data;
        }
    })

    return {latestSetting:data, isLoading, error}
}