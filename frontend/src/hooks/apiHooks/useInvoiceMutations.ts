import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export interface InvoiceMutationParams {
    id: number;
    mode: string;
    isTrustAcc?: boolean;
    data?: Record<string, unknown>; 
}

export default function useInvoiceMutations(){
    const { mutate } = useMutation({
        mutationFn: async ({ id, mode, isTrustAcc, data }: InvoiceMutationParams) => {
            const TRUST_ACC_INVOICE_URLS = {
                MARK: `/api/trust-accounting/invoices/${id}/apply_payment/`,
                CANCEL: `/api/trust-accounting/invoices/${id}/cancel/`,
                CONVERT: `/api/trust-accounting/invoices/${id}/fiscalize/`,
                POST_TO_LEDGER: `/api/trust-accounting/invoices/${id}/post_to_ledger/`
            };

            const STANDARD_INVOICE_URLS = {
                MARK: `/api/accounting/invoices/${id}/mark-paid/`,
                CANCEL: `/api/accounting/invoices/${id}/cancel-invoice/`,
                CONVERT: `/api/accounting/invoices/${id}/convert-to-fiscal/`
            };

            const URLS = isTrustAcc ? TRUST_ACC_INVOICE_URLS : STANDARD_INVOICE_URLS;
            const url = URLS[mode as keyof typeof URLS];

            const response = data
                ? await api.post(url, data)
                : await api.post(url);

            return response.data;
        }
    });

    return { mutate };
}