import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react"
import type { InvoiceMutationParams } from "../apiHooks/useInvoiceMutations";
import { toast } from "sonner";
import { INVOICE_MUTATION_STATUSES, } from "@/constants";
import { handleAxiosError } from "@/lib/utils";
import { getRefetchInvoices } from "@/store/invoiceStore";

export default function useMutateInvoiceStatus(id: number, mode: string, invoiceMode? : string, successCallBack? : ()=>void){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleMarkInvoice = (
        mutateInvoice: UseMutationResult<any, Error, InvoiceMutationParams, unknown>
    )=>{
        setLoading(true);
        mutateInvoice.mutate({ id, mode }, {
            onSuccess : ()=>{
                getRefetchInvoices?.();
                toast.success(INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES].successMessage)
                successCallBack?.()
                setOpen(false);
            },
            onError: (error) => handleAxiosError("Failed to update invoice", error),
            onSettled : ()=> setLoading(false)
        })
    }
    return {
        invoiceMode,
        loading,
        open,
        setOpen,
        handleMarkInvoice
    }
}