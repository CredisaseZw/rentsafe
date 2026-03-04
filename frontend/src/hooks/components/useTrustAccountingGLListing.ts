import { useEffect, useState } from "react";
import useGetTrustACCGeneralLedgers from "../apiHooks/useGetTrustACCGeneralLedgers"
import type { PaginationData, TrustGLAccount } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";

function useTrustAccountingGLListing() {
    const [generalLedgers, setGeneralLedgers] = useState<TrustGLAccount[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>();
    const {
        isError,
        data,
        isLoading,
        error
    } = useGetTrustACCGeneralLedgers();

    useEffect(()=>{ 
        if(handleAxiosError("An error occurred fetching general ledger accounts", error)) return;
        if (!data) return;

        const {results, ...paginationData} = data;
        setGeneralLedgers(results)
        setPagination(paginationData)

    }, [data, isLoading, isError, error])
    return {
        generalLedgers,
        pagination,
        isError,
        data,
        isLoading,       
    }
}

export default useTrustAccountingGLListing