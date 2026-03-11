import { useCurrency } from "@/contexts/CurrencyContext";
import type { TrustAccSalesItem } from "@/interfaces"
import { getFormDataObject, handleAxiosError, handleTrackChangedFields } from "@/lib/utils";
import React, { useEffect, useState } from "react"
import useGetTrustAccVATSettings from "../apiHooks/useGetTrustAccVATSettings";
import type { Payload, VATRow } from "@/types";
import { toast } from "sonner";
import useAddTrustAccSalesItem from "../apiHooks/useAddTrustAccSalesItem";
import useOptimisticCacheUpdate from "./useOptimisticCacheUpdate";

function useAddTrustAccSaleItemDialog(sales_item?:TrustAccSalesItem) {
    const {currencies, currency, currencyLoading } = useCurrency()
    const [vatAccounts, setVatAccounts] = useState<VATRow[]>([])
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vatPage, setVatPage] = useState(1);
    const {updateCache} = useOptimisticCacheUpdate();
    const { mutate } = useAddTrustAccSalesItem()
    const [formData, setFormData] = useState({
        category_id: String(sales_item?.category ?? ""),
        currency_id : String(sales_item?.currency ?? currency?.id),
        vat_id:  String(sales_item?.tax_type ?? "")
    });
    const {data, error} = useGetTrustAccVATSettings({
        page :vatPage
    })

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
    }, [data, error, vatPage])

    const onHandleChange = (key:string, value: string) =>{
        setFormData((p)=> ({
            ...p,
            [key] : value
        }))
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
            tax_type_id: Number(formData.vat_id)
        }

        if(mode === "update"){
            const initialData = {
                name: sales_item?.name,
                unit_name: sales_item?.unit_name,
                category_id: Number(sales_item?.category),
                unit_price: Number(sales_item?.price),
                currency_id: Number(sales_item?.currency),
                tax_type_id: Number(sales_item?.tax_type)
            }
            const changes = handleTrackChangedFields(initialData, payloadData)
            if(!changes) return
            payloadData = changes
        }

        const payload:Payload = {
            mode,
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
        onHandleChange

    }
}

export default useAddTrustAccSaleItemDialog