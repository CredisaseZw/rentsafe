import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react"
import type { InvoiceMutationParams } from "../apiHooks/useInvoiceMutations";
import { toast } from "sonner";
import { INVOICE_MUTATION_STATUSES, } from "@/constants";
import { handleAxiosError } from "@/lib/utils";
import { getRefetchInvoices } from "@/store/invoiceStore";
import useClient from "../general/useClient";
import { useSearchParams } from "react-router";

export default function useMutateInvoiceStatus(id: number, mode: string, invoiceMode? : string, successCallBack? : ()=>void){
    const [open, setOpen] = useState(false);
    const queryClient = useClient();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const handleMarkInvoice = (
        mutateInvoice: UseMutationResult<any, Error, InvoiceMutationParams, unknown>
    )=>{
        setLoading(true);
        mutateInvoice.mutate({ id, mode }, {
            onSuccess : ()=>{
                getRefetchInvoices?.();
                const page = Number(searchParams.get("page") || 1);
                queryClient.invalidateQueries({queryKey : ["invoices",`${invoiceMode}`, page, `?invoice_type__in=${invoiceMode?.split("_")[0]}&page=${page}`]})
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