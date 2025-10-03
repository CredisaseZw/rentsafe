import type { Currency, SetCurrencySettings } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function useCurrencySettings(){
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [defaultCurrency, setDefaultCurrency] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit =(
        setCurrencySettings : UseMutationResult<any, Error, SetCurrencySettings, unknown>,
        e : React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data  = Object.fromEntries(formData.entries())

        const payload: SetCurrencySettings = {
            "currency": Number(data.current),
            "current_rate": String(data.rate),
            "base_currency": Number(data.baseCurrency)
        }
        setCurrencySettings.mutate(payload, {
            onSuccess : ()=>{
                toast.success("Rate saved successfully")
            },
            onError : (error)=>{
                if (isAxiosError(error)){
                    const m = error.response?.data.error ?? error.response?.data.details ?? "Something went wrong";
                    toast.error("Error saving rate settings", {description : m})
                }
            },   
            onSettled : ()=> setLoading(false)
        })
    }
    return {
        loading,
        currencies,
        defaultCurrency,
        setDefaultCurrency,
        setCurrencies,
        handleSubmit,
    }
}