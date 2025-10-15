import type { Currency } from "@/types";
import { useEffect, useState } from "react"
import useGetCurrencies from "../apiHooks/useGetCurrencies";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function useSalesItemsForm() {
    const [defaultCurrency, setDefaultCurrency] = useState("");
    const [currencies,setCurrencies] = useState<Currency[]>([])
    const {currencyData, currencyError, currencyLoading} = useGetCurrencies()
    
    useEffect(()=>{
        if(isAxiosError(currencyError)){
            const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
            toast.error("Error fetching currencies", {description : m})
        } 
        if(currencyData){
            const c = currencyData.find((c)=> c.currency_code === "USD")
            setCurrencies(currencyData)
            setDefaultCurrency(String(c?.id))
            }
    },[currencyData, currencyError])
    
    return{
        defaultCurrency,
        currencies,
        currencyLoading
    }
}
