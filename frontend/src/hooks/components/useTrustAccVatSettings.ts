import type { PaginationData } from "@/interfaces"
import type { VATRow } from "@/types"
import { useEffect, useState } from "react"
import useGetTrustAccVATSettings from "../apiHooks/useGetTrustAccVATSettings";
import { handleAxiosError } from "@/lib/utils";

function useTrustAccVatSettings() {
    const [vatSettings, setVatSettings] = useState<VATRow[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>();
    const {data, isLoading, error, isError} = useGetTrustAccVATSettings()

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