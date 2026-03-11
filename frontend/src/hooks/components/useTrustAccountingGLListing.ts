import { useEffect, useState } from "react";
import type { PaginationData, TrustGLAccount } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";
import type { Response } from "@/interfaces";
import useQueryResults from "../apiHooks/useQueryResults";
import { BASE_TRUST_ACC_GENERAL_LEDGER } from "@/constants/base-links";
interface GLResponse extends Response {
    results : TrustGLAccount[]
}
function useTrustAccountingGLListing() {
    const [generalLedgers, setGeneralLedgers] = useState<TrustGLAccount[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>();
    const {
        isError,
        data,
        isLoading,
        error
    } = useQueryResults<GLResponse>({
        keyStoreValue : BASE_TRUST_ACC_GENERAL_LEDGER.link,
        link : BASE_TRUST_ACC_GENERAL_LEDGER.keyStoreValue
    });

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