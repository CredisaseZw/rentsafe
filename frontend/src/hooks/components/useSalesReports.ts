import { useEffect, useState } from "react"
import useGetCurrencies from "../apiHooks/useGetCurrencies"
import type { Currency } from "@/types"
import { toast } from "sonner"
import { isAxiosError } from "axios"

export default function useSalesReports(){
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [currency, setCurrency] = useState<Currency>() 
    const {currencyData, currencyLoading, currencyError} = useGetCurrencies()
    
    useEffect(()=>{
        if(isAxiosError(currencyError)){
            const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
            toast.error("Error fetching currencies", {description : m})
        } 
        if(currencyData){
            const c = currencyData.find((c)=> c.currency_code === "USD")
            setCurrencies(currencyData)
            setCurrency(c)
        }
    },[currencyData, currencyError])

    return {
        currencyLoading,
        currencies,
        currency
    }
}