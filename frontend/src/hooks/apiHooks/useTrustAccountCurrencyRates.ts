import { useCurrency } from "@/contexts/CurrencyContext"
import { getCurrentDate, handleAxiosError, round2 } from "@/lib/utils"
import { useEffect, useState, type FormEvent } from "react"
import useAddTrustAccountCurrencyRates from "./useAddTrustAccountCurrencyRates";
import { toast } from "sonner";
import useGetLatestTrustAccCurrencyRate from "./useGetLatestTrustAccCurrencyRate";

function useTrustAccountCurrencyRates() {
    const {currencies, currency, currencyLoading} = useCurrency()
    const [loading, setLoading] = useState(false);
    const {mutate} = useAddTrustAccountCurrencyRates()
    const [currencySetting, setCurrencySetting] = useState({
        base_currency_id: String(currency?.id), 
        target_currency_id: "",
        rate: "",
        base_date :  getCurrentDate()
    })
    const {data, error} = useGetLatestTrustAccCurrencyRate();

    useEffect(()=>{
        if(handleAxiosError("Failed to get latest trust acc rate.", error)) return;
        if(!data) return;
        
        const base_c= currencies.find(currency=> currency.currency_code === data.base_currency)?.id;
        const target_c = currencies.find(currency=> currency.currency_code === data.target_currency)?.id;
       
        setCurrencySetting((p)=>({
            ...p,
            base_currency_id : String(base_c),
            target_currency_id : String(target_c),
            rate : String(data.rate)
        }))

    }, [data, error])

    const onHandleChange = (key:string, value:string|number) =>{
        setCurrencySetting((p)=>({
            ...p,
            [key] : value
        }))
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if (!currencySetting.target_currency_id || !currencySetting.rate) {
            toast.error(
                !currencySetting.target_currency_id
                    ? "Target Currency required."
                    : "Rate is required"
            );
            return;
        }

        const payload = {
            base_currency_id: Number(currencySetting.base_currency_id), 
            target_currency_id: Number(currencySetting.target_currency_id),
            rate: round2(Number(currencySetting.rate)),
        }

        setLoading(true);
        mutate((payload), {
            onSuccess: ()=>{
                toast.success("New rate successfully added.")
            },
            onError: (error)=> handleAxiosError("Failed to add new rate", error),
            onSettled:()=> setLoading(false)
        })
    }
    return {
        currencyLoading,
        currencies,
        loading,
        currencySetting,
        onHandleChange,
        handleSubmit,
        setLoading
    }
}

export default useTrustAccountCurrencyRates