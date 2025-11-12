import { useQuery } from "@tanstack/react-query"
import { api }  from "@/api/axios"
import { MODES } from "@/constants";
import type { Response } from "@/interfaces";
import type { Invoice } from "@/interfaces";
interface InvoiceResponse extends Response {
    results : Invoice[]
}

function useGetInvoices(page:number, mode:string, search?: string | undefined, id?:number | undefined) {    
    const searchParam = search && search.trim().length > 0
    ? `&search=${encodeURIComponent(search)}`
    : "";

    const INVOICE_MODES = {
        [MODES.FISCAL]: `/api/accounting/invoices/fiscal-invoices/?page=${page}${searchParam}`,
        [MODES.RECURRING]: `/api/accounting/invoices/recurring-invoices/?page=${page}${searchParam}`,
        [MODES.PROFORMA]: `/api/accounting/invoices/proforma-invoices/?page=${page}${searchParam}`,
        [MODES.CANCELLED]: `/api/accounting/invoices/get-cancelled-invoices/?page=${page}${searchParam}`,
        [MODES.PAID]: `/api/accounting/invoices/get-paid/?page=${page}${searchParam}`,
        [MODES.PENDING]: `/api/accounting/invoices/get-unpaid/?page=${page}${searchParam}`,
        [MODES.WITH_PAYMENTS]: `/api/accounting/invoices/${id}/with-payments?page=${page}${searchParam}`,
    };
    const {data, isLoading, isError} = useQuery<InvoiceResponse>({
        queryKey : ["invoices", mode, page, search ?? ""],
        queryFn : async () =>{
            const response = await api.get<InvoiceResponse>(INVOICE_MODES[mode as keyof typeof INVOICE_MODES])
            return response.data;
        }
    })

    return {
        invoicesData : data,
        invoicesLoading : isLoading,
        invoicesError: isError
    }
}

export default useGetInvoices