import { useCurrency } from "@/contexts/CurrencyContext";
import type { cashSalesRow, InvoicePreview, SalesItem } from "@/types";
import {  useState, useImperativeHandle, useEffect } from "react";
import { toast } from "sonner";

function useInvoiceTotalsTables(ref:React.ForwardedRef<unknown>) {
    const {currencies, currencyLoading, currency} = useCurrency()
    const [discount, setDiscount] = useState("0")
    const [rows, setRows] = useState<InvoicePreview[]>([{quantity : "1"} as InvoicePreview])
    const [cashSalesRows, setCashSalesRows] = useState<cashSalesRow[]>([{} as cashSalesRow])
    const [defaultCurrency, setDefaultCurrency] = useState(String(currency?.id));
    const [currencyCode, setCurrencyCode] = useState(currency?.currency_code);
    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0.00,
        vat: 0.00,
        total: 0.00,
    });

    const handleOnRowChange = (
        index: number,
        key: string,
        value: string,
        updateTotal = false
    ) => {
        setRows((prev) =>
            prev.map((row, i) => {
            if (i !== index) return row;

            const updated: InvoicePreview = {
                ...row,
                [key]: value,
            } as InvoicePreview;

            if (updateTotal) {
                const quantity = Number((updated as InvoicePreview).quantity) || 1;
                const price = Number((updated as InvoicePreview).price) ;

                if (quantity > 0 && price > 0) {
                updated.total = Math.round(quantity * price * 100) / 100;
                } else if (value === "") {
                    toast.info("Quantity Value required")
                    updated.total = row.total;
                } 
            }

            return updated;
            })
        );
    };

    const handleOnSelectItem = (item: SalesItem, index: number) => {
        const isItemAlreadySelected = rows.some(
            (row, i) => i !== index && row.salesItem === item.id
        );

        if (isItemAlreadySelected) {
            toast.error("This item is already selected in another row");
            return;
        }

        if (!item.id || !item.price || !item.tax_configuration_object) {
            toast.error("Invalid item data");
            return;
        }

        setRows((prev) =>
            prev.map((row, i) =>
            i === index
                ? {
                    ...row,
                    salesItem: item.id,
                    searchSalesItem: item.name,
                    itemCode: item.sales_account_object?.account_number || '',
                    price: Number(item.price.replace("$", "")) || 0,
                    vat_amount: Number(item.tax_configuration_object?.rate) || 0,
                    total: Math.round(
                    ((Number(item.tax_configuration_object?.rate || 0) / 100) *
                        Number(item.price.replace("$", "") || 0) +
                        Number(item.price.replace("$", "") || 0)) * 100
                    ) / 100, 
                }
                : row
            )
        );
    };


    useEffect(() => {
        const subtotal = rows.reduce((acc, row) => {
            const price = Number((row as InvoicePreview).price) || 0;
            const qty = Number((row as InvoicePreview).quantity) || 1;
            return acc + price * qty;
        }, 0);

        const vat = rows.reduce((acc, row) => {
            const rowVAT = row.vat_amount || 0;
            return acc + rowVAT;
        }, 0);

        const total = rows.reduce((acc, row) => {
            const rowTotal = Number(row.total) || 0;
            return acc + rowTotal;
        }, 0);

        const getTotalAfterDiscount = (totalAmount: number, discountValue: string) => {
            const discountNum = Number(discountValue);
            if (isNaN(discountNum) || discountNum <= 0) return totalAmount;
            if (discountNum >= 100) return 0;
            return totalAmount - discountNum
            //return totalAmount - (totalAmount * discountNum) / 100;
        }
        setCalculatedTotals({
            subtotal: Math.round(subtotal * 100) / 100,
            vat: Math.round(vat * 100) / 100,
            total: Math.round(getTotalAfterDiscount(total, discount) * 100) / 100,
        });
    }, [rows, discount]);
    
    const AddInvoiceRow = () => setRows((prev) => [...prev, {quantity : "1"} as InvoicePreview]);
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
        getRows : ()=> rows,
        getTotals : ()=> ({
            currency_id : Number(defaultCurrency),
            subtotal: calculatedTotals.subtotal,
            vat: calculatedTotals.vat,
            total: calculatedTotals.total,
            discount : Number(discount) 
        })
    }))

    return { 
        rows,
        discount,
        currencies,
        currencyCode,
        cashSalesRows,
        currencyLoading,
        defaultCurrency,
        calculatedTotals,
        RemoveCashSalesRows,
        handleOnSelectItem,
        setDefaultCurrency,
        handleOnRowChange,
        RemoveInvoiceRow,
        setCurrencyCode,
        AddCashSaleRow,
        AddInvoiceRow,
        setDiscount,    
    }
}
export default useInvoiceTotalsTables