import { useCurrency } from "@/contexts/CurrencyContext";

export default function useSalesItemsForm() {
    const {currencies, currencyLoading, currency} = useCurrency()
    return{
       currencies,
       currencyLoading,
       currency
    }
}
