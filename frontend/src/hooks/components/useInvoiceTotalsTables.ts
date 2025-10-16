import { useCurrency } from "@/contexts/CurrencyContext";
import type { cashSalesRow, InvoicePreview } from "@/types";
import {  useState, useImperativeHandle } from "react";
import { toast } from "sonner";

function useInvoiceTotalsTables(ref:React.ForwardedRef<unknown>) {
    const {currencies, currencyLoading, currency} = useCurrency()
    const [discount, setDiscount] = useState(0.00)
    const [rows, setRows] = useState<InvoicePreview[]>([{} as InvoicePreview])
    const [cashSalesRows, setCashSalesRows] = useState<cashSalesRow[]>([{} as cashSalesRow])
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
        if (cashSalesRows.length === 1) return;
        setCashSalesRows((prev) => prev.filter((_, i) => i !== index));
    };


    useImperativeHandle(ref, ()=> ({
        getRows : ()=> rows
    }))
    return { 
        currencies,
        currencyLoading,
        currency,
        discount,
        rows,
        cashSalesRows,
        handleDiscountChange,
        RemoveCashSalesRows,
        AddInvoiceRow,
        AddCashSaleRow,
        RemoveInvoiceRow
    
    }
}
export default useInvoiceTotalsTables