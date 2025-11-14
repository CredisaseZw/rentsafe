import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export interface InvoiceMutationParams {
    id: number;
    mode: string;
}

export default function useInvoiceMutations(){
    return useMutation({
        mutationFn : async({ id, mode }: InvoiceMutationParams)=>{
            const URLS = {
                MARK: `/api/accounting/invoices/${id}/mark-paid/`,
                CANCEL : `/api/accounting/invoices/${id}/cancel-invoice/`,
                CONVERT : `/api/accounting/invoices/${id}/convert-to-fiscal/`
            }
            const response = await api.post(URLS[mode as keyof typeof URLS]);
            return response.data;
        }
    })
}