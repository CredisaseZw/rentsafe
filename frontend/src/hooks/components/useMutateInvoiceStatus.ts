import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react"
import type { InvoiceMutationParams } from "../apiHooks/useInvoiceMutations";
import { toast } from "sonner";
import { INVOICE_MUTATION_STATUSES, MODES } from "@/constants";
import useClient from "../general/useClient";
import { handleAxiosError } from "@/lib/utils";

export default function useMutateInvoiceStatus(id: number, mode: string, invoiceMode : string){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const queryClient = useClient();

    const handleMarkInvoice = (
        mutateInvoice: UseMutationResult<any, Error, InvoiceMutationParams, unknown>
    )=>{
        setLoading(true);
        mutateInvoice.mutate({ id, mode }, {
            onSuccess : ()=>{
                queryClient.invalidateQueries({queryKey : ["invoices", MODES[invoiceMode as keyof typeof MODES]]});
                toast.success(INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES].successMessage)
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