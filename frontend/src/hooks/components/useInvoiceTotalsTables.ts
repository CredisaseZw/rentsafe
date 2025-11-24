import { useCurrency } from "@/contexts/CurrencyContext";
import type { cashSalesRow, InvoicePreview, SalesItem } from "@/types";
import { useState, useImperativeHandle, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import useGetCurrencyRate from "../apiHooks/useGetCurrencyRate";
import { parseMoney, round2 } from "@/lib/utils";

const computeRowTotal = (price: number, quantity: number, vatRate: number) => {
  const qty = quantity > 0 ? quantity : 1;
  const subtotal = price * qty;
  const vatAmount = subtotal * (vatRate / 100);
  return round2(subtotal + vatAmount);
};

const computeTotals = (rows: InvoicePreview[], discount: string) => {
  if (!rows.length || rows.every((r) => !r.itemCode)) {
    return { subtotal: 0, vat: 0, total: 0 };
  }

  let subtotal = 0;
  let vat = 0;
  let total = 0;

  for (const row of rows) {
    const price = parseMoney(row.price);
    const qty = Number(row.quantity) || 1;
    const vatRate = row.vat_amount || 0;

    const rowSubtotal = price * qty;
    const rowVat = rowSubtotal * (vatRate / 100);
    const rowTotal = computeRowTotal(price, qty, vatRate);

    subtotal += rowSubtotal;
    vat += rowVat;
    total += rowTotal;
  }

  const discountNum = Number(discount);
  const effectiveDiscount =
    isNaN(discountNum) || discountNum <= 0 ? 0 : discountNum;

  const totalAfterDiscount = Math.max(0, total - effectiveDiscount);

  return {
    subtotal: round2(subtotal),
    vat: round2(vat),
    total: round2(totalAfterDiscount),
  };
};


function useInvoiceTotalsTables(ref: React.ForwardedRef<unknown>) {
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const { currencies, currencyLoading, currency } = useCurrency();
    const [discount, setDiscount] = useState("0");
    const [rows, setRows] = useState<InvoicePreview[]>([
        { quantity: "1" } as InvoicePreview,
    ]);
    const [cashSalesRows, setCashSalesRows] = useState<cashSalesRow[]>([
        {} as cashSalesRow,
    ]);

    const [defaultCurrency, setDefaultCurrency] = useState(currency?.id
        ? String(currency.id) 
        : "");
    const [currencyCode, setCurrencyCode] = useState(currency?.currency_code);
    const [prevCurrencyCode, setPrevCurrencyCode] = useState("")
    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0.0,
        vat: 0.0,
        total: 0.0,
    });
    const {
        rate: currencyRate,
        error: currencyError,
        isLoading: currencyRateLoading,
    } = useGetCurrencyRate(Number(defaultCurrency));
    
    const [baseRate, setBaseRate] = useState<number>();

    useEffect(()=>{
        if(currencyRate) {
            setBaseRate(currencyRate)
        }
    }, [currencyRate, currencyRateLoading, currencyError])

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
            const quantity = Number(updated.quantity) || 1;
            const price = parseMoney(updated.price);
            const vatRate = updated.vat_amount || 0;

            if (quantity > 0 && price > 0) {
                updated.total = computeRowTotal(price, quantity, vatRate);
            } else if (value === "") {
                toast.info("Quantity value required");
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

        const basePrice = parseMoney(item.price);
        const effectiveRate = currencyRate && currencyRate > 0 ? currencyRate : 1;
        const convertedPrice = round2(basePrice / effectiveRate);
        const vatRate = Number(item.tax_configuration_object?.rate) || 0;
        const quantity = Number(rows[index]?.quantity) || 1;

        setRows((prev) =>
        prev.map((row, i) => {
            if (i !== index) return row;

            const price = convertedPrice;
            const total = computeRowTotal(price, quantity, vatRate);

            const ROW: InvoicePreview = {
            ...row,
            salesItem: item.id,
            searchSalesItem: item.name,
            itemCode: item.sales_account_object?.account_number || "",
            price,
            basePrice: basePrice,
            vat_amount: vatRate,
            total,
            };

            return ROW;
        })
        );
    };

    const calculateTotals = () => {
        setCalculatedTotals(computeTotals(rows, discount));
    };

    const AddInvoiceRow = () =>
        setRows((prev) => [...prev, { quantity: "1" } as InvoicePreview]);

    const AddCashSaleRow = () =>
        setCashSalesRows((prev) => [...prev, {} as cashSalesRow]);

    const RemoveInvoiceRow = (index: number) => {
        if (rows.length === 1) return;
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const RemoveCashSalesRows = (index: number) => {
        if (cashSalesRows.length === 1) return;
        setCashSalesRows((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        calculateTotals();
    }, [rows, discount]);

    useEffect(() => {
        if (!rows.length || rows.every((r) => !r.itemCode)) return;
        if (currencyRateLoading) return;

        const effectiveRate =
        baseRate && baseRate > 0 ? baseRate : 1;
        console.log({baseRate})
        console.log(effectiveRate)
        
        setRows((prev) =>
        prev.map((row) => {
            if (row.basePrice == null) return row;

            const basePrice = parseMoney(row.basePrice);
            if (!basePrice) return row;

            const price = round2(basePrice / effectiveRate);
            const qty = Number(row.quantity) || 1;
            const vatRate = row.vat_amount || 0;

            return {
            ...row,
            price,
            total: computeRowTotal(price, qty, vatRate),
            };
        })
        );
    }, [baseRate, rows.length]);


    useImperativeHandle(
        ref,
        () => ({
        getRows: () => rows,
        getTotals: () => ({
            currency_id: Number(defaultCurrency),
            subtotal: calculatedTotals.subtotal,
            vat: calculatedTotals.vat,
            total: calculatedTotals.total,
            discount: Number(discount),
        }),
        }),
        [rows, calculatedTotals, defaultCurrency, discount]
    );


    return {
        rows,
        discount,
        baseRate,
        currencies,
        currencyCode,
        cashSalesRows,
        currencyLoading,
        defaultCurrency,
        calculatedTotals,
        openConfirmation,
        prevCurrencyCode, 
        currencyRateLoading,
        setPrevCurrencyCode,
        setOpenConfirmation,
        RemoveCashSalesRows,
        handleOnSelectItem,
        setDefaultCurrency,
        handleOnRowChange,
        RemoveInvoiceRow,
        setCurrencyCode,
        AddCashSaleRow,
        AddInvoiceRow,
        setDiscount,
        setBaseRate

  };
}

export default useInvoiceTotalsTables;
