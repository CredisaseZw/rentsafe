import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react"
import type { InvoiceMutationParams } from "../apiHooks/useInvoiceMutations";
import { toast } from "sonner";
import { INVOICE_MUTATION_STATUSES, MODE_PAGES} from "@/constants";
import useClient from "../general/useClient";
import { handleAxiosError } from "@/lib/utils";
import { useSearchParams } from "react-router";

export default function useMutateInvoiceStatus(id: number, mode: string, invoiceMode : string, successCallBack? : ()=>void){
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get(MODE_PAGES[mode]) || 1);
    const [loading, setLoading] = useState(false);
    const queryClient = useClient();

    const handleMarkInvoice = (
        mutateInvoice: UseMutationResult<any, Error, InvoiceMutationParams, unknown>
    )=>{
        setLoading(true);
        
        mutateInvoice.mutate({ id, mode }, {
            onSuccess : ()=>{
                queryClient.refetchQueries({queryKey : ["invoices", invoiceMode, page,""]});
                toast.success(INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES].successMessage)
                successCallBack?.()
                setOpen(false);
            },
            onError: (error) => handleAxiosError("Failed to update invoice", error),
            onSettled : ()=> setLoading(false)
        })
    }
    return {
        loading,
        open,
        setOpen,
        handleMarkInvoice
    }
}