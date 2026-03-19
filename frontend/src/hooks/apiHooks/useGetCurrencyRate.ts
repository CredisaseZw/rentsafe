import { api } from "@/api/axios";
import type { Response, TrustAccExchangeRate } from "@/interfaces";
import type { CurrencySetting } from "@/types";
import type { AxiosError } from "axios";

interface CurrencySettingResponse extends Response{
    results: CurrencySetting[];
}
interface TrustAccountCurrencySettingResponse extends Response{
    results: TrustAccExchangeRate[]
}
export const fetchRate = async (from:string, to:string, isTrustAcc:boolean = false) => {
   
    let data:  CurrencySettingResponse | TrustAccountCurrencySettingResponse | null = null;
    let error: AxiosError | unknown | null = null;
    try {
        const URL = isTrustAcc
        ?`/api/trust-accounting/exchange-rates?base_currency=${from}&target_currency=${to}&latest_rate=true`
        :`/api/accounting/currency-settings/?ordering=-date_created&target_currency=${to}&base_currency=${from}`;

        const res = isTrustAcc
        ? await api.get<TrustAccountCurrencySettingResponse>(URL)
        : await api.get<CurrencySettingResponse>(URL);
        
        data = res.data;
    } catch (err) {
        error = err;
} 
    return {data, error}
};

