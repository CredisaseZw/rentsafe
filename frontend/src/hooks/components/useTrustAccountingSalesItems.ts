import type { PaginationData, TrustAccSalesItem } from "@/interfaces"
import { useEffect, useState } from "react"
import { handleAxiosError } from "@/lib/utils"
import type { Response } from "@/interfaces";
import useQueryResults from "../apiHooks/useQueryResults";
import { BASE_TRUST_ACC_SALES_ITEMS } from "@/constants/base-links";

interface TrustAccountSalesItemsResponse extends Response {
  results : TrustAccSalesItem[]
}

function useTrustAccountingSalesItems() {
    const [salesItems, setSalesItems] = useState<TrustAccSalesItem[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>()
    const {data, error, isLoading, isError} = useQueryResults<TrustAccountSalesItemsResponse>({
        link: BASE_TRUST_ACC_SALES_ITEMS.link,
        keyStoreValue : BASE_TRUST_ACC_SALES_ITEMS.keyStoreValue
    })
    
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch sales items", error)) return;
        if(!data) return;
        
        const {results, ...paginationData} = data
        setSalesItems(results)
        setPagination(paginationData)
    }, [data, error, isError])
        
    return {
        salesItems,
        pagination,
        isLoading,
        isError
  }
}

export default useTrustAccountingSalesItems