import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import useGetInvoices from "../apiHooks/useGetInvoices";
import { handleAxiosError } from "@/lib/utils";
import { MODE_PAGES } from "@/constants";
import type { PaginationData } from "@/interfaces";
import type { Invoice } from "@/types";

function useInvoices(mode:string) {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [searchParams] = useSearchParams()
    const page =  Number(searchParams.get(MODE_PAGES[mode]) || 1);
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const {invoicesData, invoicesError, invoicesLoading} = useGetInvoices(page, mode);
    
    useEffect(()=>{
        if(handleAxiosError(`Failed to fetch ${mode.replace("_", " ")}`,invoicesError)) return;
        if (!invoicesData) return;

        setInvoices(invoicesData.results)
        setPagination({
            count : invoicesData.count,
            previous : invoicesData.previous,
            next : invoicesData.next,
        })
    }, [invoicesData, invoicesError])

    return {
        page,
        pagination,
        invoices,
        invoicesError,
        invoicesLoading
    }
}

export default useInvoices