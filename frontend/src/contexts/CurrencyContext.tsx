import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import type { Currency } from "@/types";
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies";
import { DEFAULT_CURRENCY_CODE } from "@/constants";

interface CurrencyContextType {
  currencies: Currency[];
  currency?: Currency;
  currencyLoading: boolean;
  onCurrencyRetch? : ()=> void
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrencyCode?: string;
}

export const CurrencyProvider = ({
  children,
  defaultCurrencyCode = DEFAULT_CURRENCY_CODE,
}: CurrencyProviderProps) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currency, setCurrency] = useState<Currency>();
  const { currencyData, currencyLoading, currencyError, currencyRefetch} = useGetCurrencies();

  useEffect(() => {
    if (isAxiosError(currencyError)) {
      const m =
        currencyError.response?.data.error ??
        currencyError.response?.data.details ??
        "Something went wrong";
        console.log(m)
     }

    if (currencyData) {
      const defaultCurrency = currencyData.results.find(
        (c) => c.currency_code === defaultCurrencyCode
      );
      setCurrencies(currencyData.results);
      setCurrency(defaultCurrency ?? currencyData.results[0]);
    }
  }, [currencyData, currencyError, defaultCurrencyCode]);

  const onCurrencyRetch = () => currencyRefetch();
  
  
  return (
    <CurrencyContext.Provider
      value={{ currencies, currency, setCurrency, currencyLoading, onCurrencyRetch }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = (defaultCurrencyCode = DEFAULT_CURRENCY_CODE): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within a CurrencyProvider");

  const { currencies, setCurrency } = context;

  useEffect(() => {
    if (currencies.length && defaultCurrencyCode !== DEFAULT_CURRENCY_CODE) {
      const newDefault = currencies.find(
        (c) => c.currency_code === defaultCurrencyCode
      );
      if (newDefault) setCurrency(newDefault);
    }
  }, [defaultCurrencyCode]);

  return context;
};