import { useCurrency } from "@/contexts/CurrencyContext";
import type { Cashbook, CashSalesRow, Currency, InvoicePreview, PaymentMethod } from "@/types";
import { useState, useImperativeHandle, useEffect, useRef } from "react";
import type React from "react";
import { toast } from "sonner";
import { handleAxiosError, parseMoney, round2, computeRowTotal, computeTotals, getVatRate, } from "@/lib/utils";
import useGetPaymentMethods from "../apiHooks/useGetPaymentMethods";
import useGetCashbook from "../apiHooks/useGetCashbook";
import type { ConfirmRatePrompt, TrustAccSalesItem } from "@/interfaces";
import { fetchRate } from "../apiHooks/useGetCurrencyRate";
import useGetLatestTrustAccCurrencyRate from "../apiHooks/useGetLatestTrustAccCurrencyRate";



function useTrustAccInvoiceTotalsTables(ref: React.ForwardedRef<unknown>, isCashSale: boolean | undefined) {
    // VARIABLES 
    const rates = useRef<Record<string, number>>({});
    const [ promptIndex, setPromptIndex ] = useState(0);
    const [ prompts, setPrompts ] = useState<ConfirmRatePrompt[]>([])
    const [ reCalculateListTrigger, setReCalculateListTrigger] = useState(0);
    const [ billCurrencyCode, setBillCurrencyCode] = useState<string>();
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const { currencies:dataCurrencies, currencyLoading} = useCurrency();
    const [ billCurrencies, setBillCurrencies ] = useState<Currency[]>([]);
    const [ discount, setDiscount ] = useState("0");
    const [ rows, setRows ] = useState<InvoicePreview[]>([{ quantity: "1" } as InvoicePreview]);
    const [ defaultCurrency, setDefaultCurrency ] = useState<string>();
    const [ cashBookPage, setCashBookPage ] = useState(1);
    const [ paymentMethods, setPaymentMethods ] = useState<PaymentMethod[]>([]);
    const [ cashBooks, setCashBooks ] = useState<Cashbook[]>([]);
    const [ cashSalesRow, setCashSalesRow ] = useState<CashSalesRow>({
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

    // API HOOKS
    const {
        data: latestSetting,
        isLoading: latestSettingLoading,
        error: latestSettingError
    } = useGetLatestTrustAccCurrencyRate();

    const {        
        data : paymentMethodsData,
        isLoading : paymentMethodsLoading,
        error : paymentMethodsError
    } = useGetPaymentMethods(isCashSale);

    const {
        cashBooksData,
        isCashbookLoading,
        cashbookError} = useGetCashbook(cashBookPage);
   
    // FUNCTIONS
    const onFilterCurrencies = (arr: string[]) => {
        const filtered = dataCurrencies.filter((c)=> {
            if(arr.includes(c.currency_code)) return c;
        })
        
        setBillCurrencies(filtered)
    }

    const ResetPrompts = () =>{
        setOpenConfirmation(false);
        setPrompts([]);
        setPromptIndex(0);

        const code = billCurrencies.find(c => c.id === Number(defaultCurrency))?.currency_code;
        if(!code) return;
        if (code  === billCurrencyCode) setReCalculateListTrigger((prev) => prev + 1);

        setBillCurrencyCode(code);
    }

    const handleUpdateRate = (
        from: string,
        to: string,
        rate: number,
        mode: "multiple" | "single" = "multiple"
    ) => {
        const isMultiple = mode === "multiple";

        rates.current = {
            ...rates.current,
            ...(isMultiple
            ? {
                [`${to}_${to}`]: 1,
                [`${from}_${to}`]: rate,
                }
            : {
                [`${from}_${to}`]: rate
                }
            ),
        };
    };

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

    const handleOnSelectItem = async(item: TrustAccSalesItem, index: number) => {
        if (billCurrencies.length === 0 || !billCurrencies){
            toast.error("No currency setting created.",
            { description : "Please navigate to Setting > Currency to create a setting." });
            return;
        }   

        const isItemAlreadySelected = rows.some(
            (row, i) => i !== index && row.salesItem === item.id
        );

        if (isItemAlreadySelected) {
            toast.error("This item is already selected in another row");
            return;
        }

        if (!item.id || !item.price || !item.tax_type) {
            toast.error("Invalid item data");
            return;
        }

        const basePrice = parseMoney(item.price);
        const vatAmount = getVatRate(Number(item.price), Number(item.price_including_tax))
        const quantity = Number(rows[index]?.quantity) || 1;
        const itemCurrencyCode = item.currency;
        let convertedPrice = 0.00;
        
        if(itemCurrencyCode !== billCurrencyCode){
            const effectiveRate = rates.current[`${itemCurrencyCode}_${billCurrencyCode}`];
            if (!effectiveRate){
                const {data, error} = await fetchRate(itemCurrencyCode, billCurrencyCode ?? "USD", true);
                if(error){
                    handleAxiosError("An error occurred fetching rate",error);
                }
                const rate =
                data && data.results.length > 0
                    ? "current_rate" in data.results[0]
                    ? data.results[0].current_rate
                    : data.results[0].rate
                    : "1";
                                
                const prompt: ConfirmRatePrompt = {
                    itemName: item.name,
                    from : itemCurrencyCode,
                    to: billCurrencyCode ?? "USD",
                    rate : rate
                }
                setPrompts([prompt])
                convertedPrice = parseFloat("");
            } else {
                convertedPrice = round2(basePrice * effectiveRate);
            }
        } else{
            convertedPrice = basePrice;
            handleUpdateRate(itemCurrencyCode, itemCurrencyCode, 1, "single");
        }

        setRows((prev) =>
            prev.map((row, i) => {
                if (i !== index) return row;

                const price = convertedPrice;
                const total = computeRowTotal(basePrice, quantity, vatAmount);

                const ROW: InvoicePreview = {
                    ...row,
                    itemCurrency: itemCurrencyCode,
                    salesItem: item.id,
                    searchSalesItem: item.name,
                    itemCode: item.cost_of_sales_account ?? "-",
                    price,
                    basePrice: basePrice,
                    vat_amount: vatAmount,
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
    
    async function buildPrompts(billCode:string) {
        const prompts = await Promise.all(
            rows.map(async (row) => {
                    let effectiveRate = rates.current[`${row.itemCurrency}_${billCode}`]
                    ? String(rates.current[`${row.itemCurrency}_${billCode}`])
                    : undefined;
                    
                    if(!effectiveRate){
                        const { data, error } = await fetchRate(row.itemCurrency, billCode, true);
                        if (error) {
                            handleAxiosError("An error occurred fetching rate", error);
                        }
                        const first = data?.results?.[0];

                        effectiveRate = first && "current_rate" in first
                        ? first.current_rate
                        : "1";
                        
                        return {
                            itemName: row.searchSalesItem,
                            from: row.itemCurrency,
                            to: billCode,
                            rate :  effectiveRate
                        } as ConfirmRatePrompt;
            
                    } else{
                        return null;
                    }
                })
        );
        return prompts.filter(Boolean);
    }

    // USE-EFFECTS
    useEffect(()=>{            
        onFilterCurrencies([""]);
        return;
    }, [])
    
    useEffect(()=>{
        if(prompts?.length === 0) return;
        setOpenConfirmation(true);
    },[prompts])

    useEffect(()=>{
        if(handleAxiosError("Failed to load latest Setting", latestSettingError)) {
            onFilterCurrencies([""]);
            return;
        };
        if(!latestSetting && !latestSettingError && !latestSettingLoading) {
            toast.error("No currency setting created.",
            { description : "Please navigate to Setting > Currency to create a setting." });
            return;
        }
        if(latestSetting){
            const baseCurrency = latestSetting.base_currency;
            const defaultId = String(dataCurrencies.find((c)=> c.currency_code === baseCurrency)?.id )
            setDefaultCurrency(defaultId);
            setBillCurrencyCode(baseCurrency);
            onFilterCurrencies([baseCurrency, latestSetting.target_currency])
            return handleUpdateRate(baseCurrency, latestSetting.target_currency, parseMoney(latestSetting.rate))
        }
    }, [latestSetting, latestSettingError])

    useEffect(() => {
        calculateTotals();
    }, [rows, discount]);

    useEffect(() => {
        if (!defaultCurrency) return;
        if(!rows[0].salesItem) return;
        
        const run = async () => {
            const code = billCurrencies.find(c => c.id === Number(defaultCurrency))?.currency_code;
            if(!code) return;

            const prompts = await buildPrompts(code);

            if (prompts.length > 0 ) {
                setPrompts(prompts.filter((p): p is ConfirmRatePrompt => p !== null));
                setOpenConfirmation(true);
                return;
            } 
            setBillCurrencyCode(code)
        };

        run();
    }, [defaultCurrency]);


    useEffect(()=>{
        if(!rows[0].salesItem) return;
        if(promptIndex >= 1) return;
        if(openConfirmation) return;

        setRows((prev)=>
            prev.map((row)=>{
                const basePrice = parseMoney(row.basePrice);
                if (!basePrice) return row;

                const rate = rates.current[`${row.itemCurrency}_${billCurrencyCode}`];
                let price = 0.00;
                price = round2(basePrice * rate);

                const qty = Number(row.quantity) || 1;
                const vatRate = row.vat_amount || 0;

                return {
                ...row,
                    price,
                    total: computeRowTotal(price, qty, vatRate),
                };
            })
        )
    },[billCurrencyCode, reCalculateListTrigger]);

    useEffect(()=>{
        if(!isCashSale) return;
        if(handleAxiosError("Failed to fetch payment methods", paymentMethodsError)) return;

        if(paymentMethodsData){
            setPaymentMethods(paymentMethodsData.results);
        }
    }, [paymentMethodsData, paymentMethodsError])

    useEffect(()=>{
        if(!isCashSale) return;
        if(handleAxiosError("Failed to fetch Cashbooks", cashbookError)) return;

        if(cashBooksData){
            const data = cashBooksData.results.filter((cashbook)=> cashbook.currency.currency_code === billCurrencyCode)
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
    }, [cashBooksData, cashbookError, cashBookPage, billCurrencyCode])

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
        prompts,
        discount,
        cashBooks,
        cashSalesRow,
        currencyLoading,
        billCurrencyCode,
        paymentMethods,
        promptIndex,
        billCurrencies,
        defaultCurrency,
        openConfirmation,
        calculatedTotals,
        isCashbookLoading,
        paymentMethodsLoading,
        setBillCurrencyCode,
        setOpenConfirmation,
        handleOnSelectItem,
        setDefaultCurrency,
        handleOnRowChange,
        RemoveInvoiceRow,
        onCashSaleChange,
        handleUpdateRate,
        AddInvoiceRow,
        setDiscount,
        setPromptIndex,
        ResetPrompts,
  };
}

export default useTrustAccInvoiceTotalsTables;