import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { CurrencySetting } from "@/types";

interface CurrencyResponse extends Response{
  results : CurrencySetting[]
}
export function useGetCurrencyRate(from: string, to:string | undefined) {
  let enabled = Boolean(from && to)
  if (from === to) enabled = false;
  
  const query = `ordering=-date_created&target_currency=${to}&base_currency=${from}`
  const { data, error, isLoading, isFetching } = useQuery<CurrencyResponse>({
    queryKey: ["currencyRate", from, to],
    queryFn: async () => {
      const response = await api.get<CurrencyResponse>(
        `/api/accounting/currency-settings/?${query}`
      );
      return response.data;
    },
    enabled
  });


  return {
    data,
    error,
    isLoading,
    isFetching,
  };
}
