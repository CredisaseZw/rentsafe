import { useState } from "react"
import { toast } from "sonner";
import { INVOICE_MUTATION_STATUSES, } from "@/constants";
import { handleAxiosError } from "@/lib/utils";
import { getRefetchInvoices } from "@/store/invoiceStore";
import useClient from "../general/useClient";
import { useSearchParams } from "react-router";
import useInvoiceMutations from "../apiHooks/useInvoiceMutations";
import useURLParamFilter from "./useURLParamFilter";

export default function useMutateInvoiceStatus(
    id: number, 
    mode: string, 
    invoiceMode? : string, 
    successCallBack? : ()=>void,
    isTrustAcc?: boolean,
    defaultAmount?: number
){

    const [open, setOpen] = useState(false);
    const queryClient = useClient();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [mutationData, setMutationData] = useState({
        amount : String(defaultAmount ?? ""),
        reason : ""
    });
    const {getUrlParams} = useURLParamFilter();
    const {mutate} = useInvoiceMutations();

    const onHandleChange =(key:string, value: string)=> {
        setMutationData((p)=>({
            ...p,
            [key] :value
        }))
    }
    const handleMarkInvoice = ()=>{
        const markTrustAcc = mode === "MARK" && isTrustAcc 
        
        if(markTrustAcc && !mutationData.amount){
            toast.error("Amount is required")
            return;
        }   

        setLoading(true);
        const payload = {
            id,
            mode,
            isTrustAcc,
            ...(
                markTrustAcc &&
                {data : {
                    amount : Number(mutationData.amount)
                }}
            ),
            ...(
                mode  === "CANCEL" && isTrustAcc &&
                {data : {
                    reason : mutationData.reason
                }}
            )
        }


        mutate(payload, {
            onSuccess : ()=>{
                if(!isTrustAcc){
                    getRefetchInvoices?.();
                    const page = Number(searchParams.get("page") || 1);
                    queryClient.invalidateQueries({queryKey : ["invoices",`${invoiceMode}`, page, `?invoice_type__in=${invoiceMode?.split("_")[0]}&page=${page}`]})
                    toast.success(INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES].successMessage)  
                } else{
                    const params = getUrlParams();
                    const LIST_KEY = ["trust-acc-invoices", params];
                    const SINGLE_KEY = [`trust_invoice_${id}`, params]
                    queryClient.invalidateQueries({queryKey : SINGLE_KEY})
                    queryClient.invalidateQueries({queryKey : LIST_KEY})
                }
                successCallBack?.()
                setOpen(false);
            },
            onError: (error) => handleAxiosError("Failed to update invoice", error),
            onSettled : ()=> setLoading(false)
        })
    }
    return {
        mutationData,
        invoiceMode,
        loading,
        open,
        setOpen,
        onHandleChange,
        handleMarkInvoice
    }
}