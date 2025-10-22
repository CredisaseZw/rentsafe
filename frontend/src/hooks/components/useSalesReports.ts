import { useCurrency } from "@/contexts/CurrencyContext"


export default function useSalesReports(){
    const {currencies, currencyLoading, currency}  = useCurrency()
    return {
        currencyLoading,
        currencies,
        currency
    }
}