import type { cashSalesRow, Currency, InvoicePreview } from "@/types";
import { useEffect, useState, useImperativeHandle } from "react";
import { toast } from "sonner";
import useGetCurrencies from "../apiHooks/useGetCurrencies";
import { isAxiosError } from "axios";

function useInvoiceTotalsTables(ref:React.ForwardedRef<unknown>) {
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [currency, setCurrency] = useState<Currency>()
    const [discount, setDiscount] = useState(0.00)
    const [rows, setRows] = useState<InvoicePreview[]>([{} as InvoicePreview])
    const [cashSalesRows, setCashSalesRows] = useState<cashSalesRow[]>([{} as cashSalesRow])
    const {currencyData, currencyLoading, currencyError} = useGetCurrencies()

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 0) toast.info("Discount should be input as a negative value");
        setDiscount(value);
    };

    const AddInvoiceRow = () => setRows((prev) => [...prev, {} as InvoicePreview]);
    const AddCashSaleRow = () => setCashSalesRows((p) => [...p, {} as cashSalesRow]);

    const RemoveInvoiceRow = (index: number) => {
        if (rows.length === 1) return;
        setRows((prev) => prev.filter((_, i) => i !== index));
    };
     const RemoveCashSalesRows = (index: number) => {
        if (rows.length === 1) return;
        setCashSalesRows((prev) => prev.filter((_, i) => i !== index));
    };
    
    useEffect(()=>{
        if(isAxiosError(currencyError)){
            const m = currencyError.response?.data.error ?? currencyError.response?.data.details ?? "Something went wrong"
            toast.error("Error fetching currencies", {description : m})
        } 
        if(currencyData){
            const c = currencyData.find((c)=> c.currency_code === "USD")
            setCurrencies(currencyData)
            setCurrency(c)
            }
    },[currencyData, currencyError])

    useImperativeHandle(ref, ()=> ({
        getRows : ()=> rows
    }))
    return { 
        currency,
        currencies,
        discount,
        rows,
        currencyLoading,
        cashSalesRows,
        setCurrency,
        setCurrencies,
        handleDiscountChange,
        RemoveCashSalesRows,
        AddInvoiceRow,
        AddCashSaleRow,
        RemoveInvoiceRow
    
    }
}
export default useInvoiceTotalsTables