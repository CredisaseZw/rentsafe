import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { CurrencySetting } from "@/types";

function useGetCurrencyRate(id: number) {
  const { data, error, isLoading, isFetching } = useQuery<CurrencySetting>({
    queryKey: ["currencyRate", id],
    queryFn: async () => {
      const response = await api.get<CurrencySetting>(
        `/api/accounting/currency-settings/${id}/`
      );
      return response.data;
    },
  });


  return {
    data,
    error,
    isLoading,
    isFetching,
  };
}

export default useGetCurrencyRate;
