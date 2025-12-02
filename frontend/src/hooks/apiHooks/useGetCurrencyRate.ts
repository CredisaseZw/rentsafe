import { api } from "@/api/axios";
import type { Response } from "@/interfaces";
import type { CurrencySetting } from "@/types";
import type { AxiosError } from "axios";

 interface CurrencySettingResponse extends Response{
        results: CurrencySetting[];
    }
export const fetchRate = async (from:string, to:string) => {
   
    let data:  CurrencySettingResponse | null = null;
    let error: AxiosError | unknown | null = null;
    try {
        const query = `ordering=-date_created&target_currency=${to}&base_currency=${from}`;
        const res = await api.get<CurrencySettingResponse>(
          `/api/accounting/currency-settings/?${query}`
        );
        data = res.data;
    } catch (err) {
        error = err;
    } 
    return {data, error}
};

