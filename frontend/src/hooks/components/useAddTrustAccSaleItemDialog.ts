import { useCurrency } from "@/contexts/CurrencyContext";
import type { PaginationData, TrustAccSalesItem, TrustGLAccount } from "@/interfaces"
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import React, { useEffect, useState } from "react"
import type { Payload, VATRow } from "@/types";
import { toast } from "sonner";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";
import { BASE_TRUST_ACC_SALES_ITEMS, TRUST_ACC_VAT_SETTINGS } from "@/constants/base-links";
import useQueryResults from "../apiHooks/useQueryResults";
import useMutateResults from "../apiHooks/useMutateResults";
import {useDebouncedCallback} from "use-debounce"
interface VATResponse extends PaginationData{
    results: VATRow[]
}

function useAddTrustAccSaleItemDialog(sales_item?:TrustAccSalesItem) {
    const {currencies, currency, currencyLoading } = useCurrency()
    const [vatAccounts, setVatAccounts] = useState<VATRow[]>([])
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vatPage, setVatPage] = useState(1);
    const {updateCache} = useOptimisticCacheUpdate();
    const { mutate } = useMutateResults()
    const [formData, setFormData] = useState({
        category_id: String(sales_item?.category ?? ""),
        currency_id : String(currency?.id),
        vat_id: "",
        cost_of_sales_account_id : null
    });
     const {data, error} = useQueryResults<VATResponse>({
        keyStoreValue : TRUST_ACC_VAT_SETTINGS.keyStoreValue,
        link:TRUST_ACC_VAT_SETTINGS.link,
        params : {
            page : vatPage
        }
    })

    useEffect(()=>{
        if(!sales_item) return;
        const itemCurrency = currencies.find((c)=> c.currency_code === sales_item.currency)?.id
        onHandleChange("currency_id", String(itemCurrency))
    }, [sales_item])
    
    const getItemVatAcc  = useDebouncedCallback(()=>{
        if(!sales_item) return;
        const itemVat = vatAccounts.find(v=> v.name === sales_item.tax_type)?.id
        onHandleChange("vat_id", String(itemVat))
    }, 500)

    useEffect(()=>{
        if(handleAxiosError("An error occurred fetching VAT accounts",error)) return;
        if(!data) return;

        const { results, ...pagination } = data
        setVatAccounts((p) =>{
            if(vatPage === 1){
                return results
            }
            return [...p, ...results];
        })

        if(pagination.next) setVatPage(p=> p + 1)
        if(sales_item) getItemVatAcc();
    }, [data, error, vatPage])


    const onHandleChange = (key:string, value: unknown) =>{
        setFormData((p)=> ({
            ...p,
            [key] : value
        }))
    }

    const onSelectCostOfSalesAccount = (acc: TrustGLAccount) =>{
        onHandleChange("cost_of_sales_account_id", acc.id)
    }

    const onSubmit = ( e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()
        const mode = !sales_item ? "create" : "update";
        const data = getFormDataObject(e);

        if(!formData.category_id || !formData.vat_id){
            toast.error(
                !formData.category_id
                ? "Category account is required"
                : "Vat account is required."
            )
            return;
        }        

        let payloadData = {
            name: data.name,
            unit_name: data.unit_name,
            category_id: Number(formData.category_id),
            unit_price: Number(data.unit_price),
            currency_id: Number(formData.currency_id),
            tax_type_id: Number(formData.vat_id),
            ...(
                formData.cost_of_sales_account_id ?
                { cost_of_sales_account_id : formData.cost_of_sales_account_id} : {}
            )
        }

        if(mode === "update"){
            const initialData = {
                name: sales_item?.name,
                unit_name: sales_item?.unit_name,
                category_id: Number(sales_item?.category),
                unit_price: Number(sales_item?.price),
                currency_id: Number(sales_item?.currency),
                tax_type_id: Number(sales_item?.tax_type),
                ...(
                    sales_item?.cost_of_sales_account &&
                    { cost_of_sales_account_id : sales_item.cost_of_sales_account}
                )
            }
            const changes = handleTrackChangedFields(initialData, payloadData)
            if(!changes) return
            payloadData = changes
        }

        const payload:Payload = {
            mode,
            link : BASE_TRUST_ACC_SALES_ITEMS.link, 
            data : payloadData,
            ...(
                mode === "update" &&
                {id : sales_item?.id} 
            )
        };
        setLoading(true);
        mutate(payload, {
            onSuccess: (response: TrustAccSalesItem)=>{
                console.log({response, mode})
                updateCache({
                    key : ["trust-account-sales-items"],
                    response,
                    mode,
                })
                toast.success(`Sales item successfully ${mode}d.`)
                setOpen(false)
            },
            onError: (error)=> handleAxiosError(`Failed to ${mode} sales item`, error),
            onSettled : ()=> setLoading(false)
        })

    }

    return {

        currencyLoading,
        vatAccounts,
        currencies,
        formData,
        loading,
        open,
        setOpen,
        onSubmit,
        onHandleChange,
        onSelectCostOfSalesAccount

    }
}

export default useAddTrustAccSaleItemDialog
