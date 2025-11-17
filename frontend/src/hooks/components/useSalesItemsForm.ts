import { useCurrency } from "@/contexts/CurrencyContext";
import useGetVATSettings from "../apiHooks/useGetVATSettings";
import { useEffect, useState } from "react";
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import type { Category, GeneralLedgerAccount, Payload, SalesItem, VATRow } from "@/types";
import useGetSalesCategories from "../apiHooks/useGetSalesCategories";
import {useGetGeneralLedgerAccounts} from "../apiHooks/useGetGeneralLedgerAccounts";
import type { UseMutationResult } from "@tanstack/react-query";
import useClient from "../general/useClient";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export default function useSalesItemsForm(initial : SalesItem | undefined, successCallBack?: ()=>void) {
    const [categoriesPage, setCategoriesPage] = useState(1);
    const [vatPage, setVatPage] = useState(1);
    const [generalLedgerPage, setGeneralLedgerPage]= useState(1);
    const {currencies, currencyLoading, currency} = useCurrency()
    const {categories, categoriesError, categoriesLoading} = useGetSalesCategories(categoriesPage)
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(generalLedgerPage);
    const {data, isLoading, error} = useGetVATSettings(vatPage); 
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
    const [vatSettings, setVatSettings] = useState<VATRow[]>([])
    const [salesCategories, setSalesCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [configurations, setConfigurations] = useState({
        currency_id : String(currency?.id),
        tax_id: "",
        sales_account_id : "",
        category_id : ""
    })
    const queryClient = useClient();
    const [searchParams] = useSearchParams()
    
    useEffect(() => {
        if (handleAxiosError("Error fetching sales categories", categoriesError)) return;
        if (!categories) return;

        setSalesCategories(prev =>
            categoriesPage === 1
            ? categories.results
            : [...prev, ...categories.results]
        );

        if(categories.next){
            const NEXT_PAGE = new URL(categories.next).searchParams.get("page");
            setCategoriesPage(Number(NEXT_PAGE));
        }    
    }, [categories, categoriesError, categoriesPage]);

    useEffect(()=> {
        if(handleAxiosError("Error fetching VAT settings", error)) return;
        if(data){
            setVatSettings((p)=>
                vatPage === 1 
                ? data.results
                : [...p, ...data.results]);

            if(data.next){
                const NEXT_PAGE = new URL(data.next).searchParams.get("page");
                setVatPage(Number(NEXT_PAGE));
            }
         
        }   
    }, [data, error])

     useEffect(()=>{
        if(handleAxiosError("Failed to fetch general ledger accounts", generalLedgersError)) return;
        if(generalLedgers){
            setGeneralLedgerAccounts((p)=>
            generalLedgerPage === 1
            ? generalLedgers.results
            : [...p, ...generalLedgers.results]
            )
            
            if(generalLedgers.next){
                const NEXT_PAGE = new URL(generalLedgers.next).searchParams.get("page");
                setGeneralLedgerPage(Number(NEXT_PAGE));
            }
        }

    },[generalLedgers, generalLedgersError])

    useEffect(()=>{
        if(initial){
            setConfigurations((p)=>({
                ...p,
                currency_id : String(initial.currency_object.id),
                tax_id : String(initial.tax_configuration_object.id),
                sales_account_id : String(initial.sales_account_object.id),
                category_id : String(initial.category_object.id)
            }));
        }
    },[initial])

    const handleOnSelectConfig = ( key:string, value: string) => {
        setConfigurations(prev => ({
            ...prev,
            [key]: value,
        }));
    };
  
    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        mutate : UseMutationResult<any, Error, Payload, unknown> 
    ) =>{
        e.preventDefault()
        let changedData;
        const mode = initial ? "update" : "create";
        const data = getFormDataObject(e);
        const payloadData = {
            category : Number(configurations.category_id),
            name : data.itemName,
            unit_price_currency : Number(configurations.currency_id),
            price : Number(data.unitPrice.toString().replace(/[^0-9.-]+/g, "")),
            unit_name : data.unitName,
            tax_configuration : Number(configurations.tax_id),
            sales_account : Number(configurations.sales_account_id)
        }
        
        if(mode === "update" && initial){   
            const initialData = {
                category : Number(initial.category_object.id),
                name : initial.name,
                unit_price_currency : Number(initial.currency_object.id),
                price : Number(initial.price.toString().replace(/[^0-9.-]+/g, "")),
                unit_name : initial.unit_name,
                tax_configuration : initial.tax_configuration_object.id,
                sales_account : initial.sales_account_object.id
            }
            changedData = handleTrackChangedFields(initialData, payloadData);
            if(!changedData) return;
            
        }
        setLoading(true);
        const payload: Payload = {
            ...(
                mode === "update" &&
                {
                    id : initial?.id,
                }
            ),
            data : payloadData,
            mode
        }

        mutate.mutate(payload, {
            onSuccess : ()=>{
                const page = Number(searchParams.get("page") || 1)
                queryClient.invalidateQueries({queryKey : ["salesItems", page]})
                toast.success(`Sales items ${mode}d successfully`);
                successCallBack?.();      
            },
            onError : (error)=> handleAxiosError("Failed to create sales item", error),
            onSettled: ()=>setLoading(false)
        })
       }
    return{
        loading,
        salesCategories,
        categoriesLoading,
        currencies,
        currencyLoading,
        currency,
        configurations,
        vatSettings,
        isLoading,
        generalLedgersLoading,
        generalLedgerAccounts,
        handleSubmit,
        handleOnSelectConfig
    }
}
