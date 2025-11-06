import { useQuery } from "@tanstack/react-query"
import { api }  from "@/api/axios"
import { MODES } from "@/constants";
import type { Response } from "@/interfaces";
import type { Invoice } from "@/types";

interface InvoiceResponse extends Response {
    results : Invoice[]
}

function useGetInvoices(page:number, mode:string, id?:number | undefined) {    
    const INVOICE_MODES ={
        [MODES.FISCAL]: `/api/accounting/invoices/fiscal-invoices/?page=${page}`,
        [MODES.RECURRING]: `/api/accounting/invoices/recurring-invoices/?page=${page}`,
        [MODES.PROFORMA]: `/api/accounting/invoices/proforma-invoices/?page=${page}`,
        [MODES.CANCELLED]: `/api/accounting/invoices/get-cancelled-invoices/?page=${page}`,
        [MODES.PAID]: `/api/accounting/invoices/get-paid/?page=${page}`,
        [MODES.PENDING]: `/api/accounting/invoices/get-unpaid/?page=${page}`,
        [MODES.WITH_PAYMENTS]: `/api/accounting/invoices/${id}/with-payments?page=${page}`
    };


    const {data, isLoading, isError} = useQuery<InvoiceResponse>({
        queryKey : ["invoices", mode, page],
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