import type { PaginationData } from "@/interfaces"
import type { VATRow } from "@/types"
import { useEffect, useState } from "react"
import { handleAxiosError } from "@/lib/utils";
import useQueryResults from "../apiHooks/useQueryResults";
import type { Response } from "@/interfaces";
import { TRUST_ACC_VAT_SETTINGS } from "@/constants/base-links";
interface VATResponse extends Response{
    results: VATRow[]
}
function useTrustAccVatSettings() {
    const [vatSettings, setVatSettings] = useState<VATRow[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>();
    const {data, isLoading, error, isError} = useQueryResults<VATResponse>({
        keyStoreValue : TRUST_ACC_VAT_SETTINGS.keyStoreValue,
        link:TRUST_ACC_VAT_SETTINGS.link
    })

    useEffect(()=>{
        if(handleAxiosError("Error occurred fetching Trust Acc VAT Settings", error)) return;
        if(!data) return

        const {results, ...paginationData} = data;
        setPagination(paginationData)
        setVatSettings(results)

    }, [data, isLoading, error])
    
    return {
        isError,
        isLoading,
        vatSettings,
        pagination
    }
}

export default useTrustAccVatSettings