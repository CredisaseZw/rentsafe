import { useCurrency } from "@/contexts/CurrencyContext";
import { handleAxiosError } from "@/lib/utils";
import type { SetCurrencySettings } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function useCurrencySettings(){
    const {currencies, currencyLoading, currency} = useCurrency("ZWL")
    const [loading, setLoading] = useState(false);
    const [rate, setRate] = useState<string>("");
    const [currencyId, setCurrencyId] = useState<string>("");

    const handleSubmit =(
        setCurrencySettings : UseMutationResult<any, Error, SetCurrencySettings, unknown>,
        e : React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data  = Object.fromEntries(formData.entries())

        const payload: SetCurrencySettings = {
            "currency_id": Number(data.current),
            "current_rate": String(data.rate),
            "base_currency_id": Number(data.baseCurrency)
        }

        setCurrencySettings.mutate(payload, {
            onSuccess : ()=>{
                setRate("") 
                setCurrencyId("")
                toast.success("Rate saved successfully")
            },
            onError : (error)=>{handleAxiosError("Error saving rate settings", error)},   
            onSettled : ()=> setLoading(false)
        })
    }
    return {
        loading,
        currencies,
        currencyLoading,
        currency,
        rate,
        currencyId,
        setRate,
        setCurrencyId,
        handleSubmit,
    }
}