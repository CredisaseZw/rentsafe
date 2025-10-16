import { useCurrency } from '@/contexts/CurrencyContext'

function useAddCashbookForm() {
    const {currencies, currencyLoading, currency} = useCurrency()
    return {
        currencies,
        currency,
        currencyLoading
    }
}

export default useAddCashbookForm