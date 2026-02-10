import { useCurrency } from "@/contexts/CurrencyContext";
import { getCurrentDate, handleAxiosError } from "@/lib/utils";
import type { SetCurrencySettings } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetLatestCurrentSetting from "../apiHooks/useGetLatestCurrentSetting";

export default function useCurrencySettings(){
    const { currencies, currencyLoading, currency } = useCurrency("ZiG");
    const [currencySetting, setCurrencySetting] = useState({
        currentRate: "",
        currentID: "",
        baseCurrencyID: "",
        baseDate: getCurrentDate(),
    });

    useEffect(() => {
    if (currency) {
        setCurrencySetting(prev => ({
        ...prev,
        baseCurrencyID: String(currency.id),
        }));
    }
    }, [currency]);

    const [loading, setLoading] = useState(false);
    const {latestSetting, error} = useGetLatestCurrentSetting();
    
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch the latest setting", error)) return;
        if(latestSetting) {
            const currentID = currencies.find(currency=> currency.currency_code === latestSetting.currency)?.id;
            const baseCurrentID = currencies.find(currency=> currency.currency_code === latestSetting.base_currency)?.id;
            setCurrencySetting({
            baseDate : latestSetting.date_updated,
            currentRate : latestSetting.current_rate,
            currentID : String(currentID),
            baseCurrencyID : String(baseCurrentID)
        })
    }
    }, [latestSetting, error])

    const handleOnChange = (key: "currentRate" | "currentID" | "baseCurrencyID", value: string | number) => {
        setCurrencySetting((p)=> ({...p, [key] : value}))
    }
    
    const handleSubmit =(   
        // eslint-disable-next-line
        setCurrencySettings : UseMutationResult<any, Error, SetCurrencySettings, unknown>,
        e : React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        const payload: SetCurrencySettings = {
            "currency_id": Number(currencySetting.currentID),
            "current_rate": String(currencySetting.currentRate),
            "base_currency_id": Number(currencySetting.baseCurrencyID)
        }

        setCurrencySettings.mutate(payload, {
            onSuccess : ()=>{
                toast.success("Rate saved successfully")
            },
            onError : (error)=>{handleAxiosError("Error saving rate settings", error)},   
            onSettled : ()=> setLoading(false)
        })
    }

    return {
        loading,
        currencies,
        currencySetting,
        currencyLoading,      
        handleOnChange,
        handleSubmit,
    }
}