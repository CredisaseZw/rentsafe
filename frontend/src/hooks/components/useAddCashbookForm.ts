import type { Currency } from '@/types'
import { useState } from 'react'

function useAddCashbookForm() {
    const [defaultCurrency, setDefaultCurrency] = useState("")
    const [currencies, setCurrencies] = useState<Currency[]>([])
    
    return {
        currencies,
        defaultCurrency,
        setDefaultCurrency,
        setCurrencies
    }
}

export default useAddCashbookForm