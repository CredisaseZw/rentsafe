import { useCurrency } from "@/contexts/CurrencyContext";
import type { Cashbook, CashSalesRow, CurrencySetting, InvoicePreview, PaymentMethod, SalesItem } from "@/types";
import { useState, useImperativeHandle, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import { convertCurrency, handleAxiosError, parseMoney, round2 } from "@/lib/utils";
import useGetPaymentMethods from "../apiHooks/useGetPaymentMethods";
import useGetCashbook from "../apiHooks/useGetCashbook";
import { useGetCurrencyRate } from "../apiHooks/useGetCurrencyRate";

const checkCurrency = (currencyCode : string | undefined) => {
    if (!currencyCode) {
        toast.error("Default bill currency is not set");
        return false;
    }
    return true;
}

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


function useInvoiceTotalsTables(ref: React.ForwardedRef<unknown>, isCashSale: boolean | undefined) {
    // VARIABLES 
    const [baseRate, setBaseRate] = useState<number>(1);
    const [ openConfirmationRedirect, setOpenConfirmationRedirect] = useState(false)
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const { currencies, currencyLoading, currency } = useCurrency();
    const [discount, setDiscount] = useState("0");
    const [rows, setRows] = useState<InvoicePreview[]>([{ quantity: "1" } as InvoicePreview]);
    const [defaultCurrency, setDefaultCurrency] = useState(currency?.id ? String(currency.id) : "");
    const [currencySetting, setCurrencySetting] = useState<CurrencySetting | undefined>(undefined);
    const [currencyCode, setCurrencyCode] = useState(currency?.currency_code);
    const [prevCurrencyCode, setPrevCurrencyCode] = useState(currency?.currency_code ?? "USD")
    const [cashBookPage, setCashBookPage] = useState(1);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const [cashBooks, setCashBooks] = useState<Cashbook[]>([])
    const [cashSalesRow, setCashSalesRow] = useState<CashSalesRow>({
        paymentType: "",
        cashBook: "",
        detail: "",
        ref: "",
        amountReceived: "",
    });
    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0.0,
        vat: 0.0,
        total: 0.0,
    });

    const {
        data: currencyRate,
        error: currencyError,
        isLoading: currencyRateLoading,
    } = useGetCurrencyRate(prevCurrencyCode, currencyCode);

    const {        
        data : paymentMethodsData,
        isLoading : paymentMethodsLoading,
        error : paymentMethodsError
    } = useGetPaymentMethods(isCashSale);

    const {
        cashBooksData,
        isCashbookLoading,
        cashbookError} = useGetCashbook(cashBookPage, isCashSale);
   
    // FUNCTIONS
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

    const onCashSaleChange = (key:string, value: string)=>{
        setCashSalesRow((p)=>({
            ...p,
            [key] : value
        }))
    }

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
        if(!checkCurrency(currencyCode)) return;

        const basePrice = parseMoney(item.price);
        const effectiveRate = baseRate && baseRate > 0 ? baseRate : 1;
        const vatRate = Number(item.tax_configuration_object?.rate) || 0;
        const quantity = Number(rows[index]?.quantity) || 1;
        const itemCurrencyCode = item.currency_object.currency_code;
      
        let convertedPrice = 0.00;
        if(itemCurrencyCode !== currencyCode){
            setPrevCurrencyCode(itemCurrencyCode);
            const settingObj =  {
                base_currency: currencySetting?.base_currency ?? itemCurrencyCode,
                currency: currencyCode,
                current_rate: currencySetting?.current_rate ??  String(effectiveRate) 
            } as CurrencySetting
        
            const convertedCurrency = convertCurrency(
                basePrice,
                itemCurrencyCode,
                currencyCode,
                settingObj
            )
            convertedPrice = convertedCurrency;
        } else {
            convertedPrice = basePrice
        }

        setRows((prev) =>
        prev.map((row, i) => {
            if (i !== index) return row;

            const price = convertedPrice;
            const total = computeRowTotal(price, quantity, vatRate);

            const ROW: InvoicePreview = {
                ...row,
                itemCurrency: itemCurrencyCode,
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

    const RemoveInvoiceRow = (index: number) => {
        if (rows.length === 1) return;
        setRows((prev) => prev.filter((_, i) => i !== index));
    };
   
    // USE-EFFECTS

    useEffect(() => {
        checkCurrency(currencyCode);
    }, [currencyCode]);
    
    useEffect(() => {
        if (prevCurrencyCode === currencyCode) return;
        if(currencyRateLoading) return;

        setCurrencySetting(undefined);
        if (currencyError) return setOpenConfirmation(true);        
        if(!currencyRate) return setOpenConfirmation(true);
        if (currencyRate.results.length  === 0) return setOpenConfirmation(true);
 
        if(currencyRate){ 
            const setting = currencyRate?.results?.[0];
            setCurrencySetting(setting);
            setBaseRate(parseMoney(setting?.current_rate));
            setOpenConfirmation(true)
        }
    }, [currencyRate, currencyError, prevCurrencyCode, currencyCode]);

    useEffect(() => {
        calculateTotals();
    }, [rows, discount]);

    useEffect(() => {
        if (!rows.length || rows.every((r) => !r.itemCode)) return;
        if (currencyRateLoading) return;

        const effectiveRate =
        baseRate && baseRate > 0 ? baseRate : 1;
        
        setRows((prev) =>
            prev.map((row) => {
                if (row.basePrice === null) return row;
                
                const basePrice = parseMoney(row.basePrice);
                if (!basePrice) return row;

                let price = 0.00 
                if (row.itemCurrency === currencyCode ){ price = basePrice }
                else{
                    const settingObj = {
                        base_currency: currencySetting?.base_currency ?? prevCurrencyCode,
                        currency: currencyCode,
                        current_rate: currencySetting?.current_rate ??  String(effectiveRate) 
                    } as CurrencySetting 

                    const convertedCurrency = convertCurrency(
                        row.basePrice,
                        row.itemCurrency,
                        currencyCode,
                        settingObj
                    )
                    if (typeof(convertedCurrency) === "number"){
                        price = convertedCurrency;
                    } 
                    else {
                        toast.error(convertedCurrency);
                    }
                }
                round2(basePrice * effectiveRate);
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
    
    useEffect(()=>{
        if(!isCashSale) return;
        if(handleAxiosError("Failed to fetch payment methods", paymentMethodsError)) return;

        if(paymentMethodsData){
            setPaymentMethods(paymentMethodsData);
        }
    }, [paymentMethodsData, paymentMethodsError])

    useEffect(()=>{
        if(!isCashSale) return;
        if(handleAxiosError("Failed to fetch Cashbooks", cashbookError)) return;

        if(cashBooksData){
            const data = cashBooksData.results.filter((cashbook)=> cashbook.currency.currency_code === currencyCode)
            setCashBooks((p)=>
                cashBookPage === 1 
                ? data
                : [...p, ...data]
            ) 
            if(cashBooksData.next){
                const nextPage = new URL(cashBooksData?.next).searchParams.get("page")
                setCashBookPage(Number(nextPage))
            }
        }
    }, [cashBooksData, cashbookError, cashBookPage, currencyCode])

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
            getCashSale : () => cashSalesRow
        }),
        [rows, calculatedTotals, defaultCurrency, discount, cashSalesRow]
    );

    return {
        rows,
        discount,
        baseRate,
        cashBooks,
        currencies,
        cashSalesRow,
        currencyCode,
        paymentMethods,
        currencyLoading,
        defaultCurrency,
        calculatedTotals,
        isCashbookLoading,
        openConfirmation,
        prevCurrencyCode, 
        currencyRateLoading,
        paymentMethodsLoading,
        openConfirmationRedirect,
        setOpenConfirmationRedirect,
        setPrevCurrencyCode,
        setOpenConfirmation,
        handleOnSelectItem,
        setDefaultCurrency,
        handleOnRowChange,
        RemoveInvoiceRow,
        onCashSaleChange,
        setCurrencyCode,
        AddInvoiceRow,
        setDiscount,
        setBaseRate

  };
}

export default useInvoiceTotalsTables;
