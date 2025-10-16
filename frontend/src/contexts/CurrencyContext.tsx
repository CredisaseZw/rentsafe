import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { Currency } from "@/types";
import useGetCurrencies from "@/hooks/apiHooks/useGetCurrencies";

interface CurrencyContextType {
  currencies: Currency[];
  currency?: Currency;
  setCurrency: (c: Currency) => void;
  currencyLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrencyCode?: string;
}

export const CurrencyProvider = ({
  children,
  defaultCurrencyCode = "USD",
}: CurrencyProviderProps) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currency, setCurrency] = useState<Currency>();
  const { currencyData, currencyLoading, currencyError } = useGetCurrencies();

  useEffect(() => {
    if (isAxiosError(currencyError)) {
      const m =
        currencyError.response?.data.error ??
        currencyError.response?.data.details ??
        "Something went wrong";
      toast.error("Error fetching currencies", { description: m });
    }

    if (currencyData) {
      const defaultCurrency = currencyData.find(
        (c) => c.currency_code === defaultCurrencyCode
      );
      setCurrencies(currencyData);
      setCurrency(defaultCurrency ?? currencyData[0]);
    }
  }, [currencyData, currencyError, defaultCurrencyCode]);

  return (
    <CurrencyContext.Provider
      value={{ currencies, currency, setCurrency, currencyLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (defaultCurrencyCode = "USD"): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within a CurrencyProvider");
    const { currencies, setCurrency } = context;
    if (currencies.length && defaultCurrencyCode) {
      const newDefault = currencies.find(
        (c) => c.currency_code === defaultCurrencyCode
      );
      if (newDefault) setCurrency(newDefault);
    }

  return context;
};
