import { useEffect, useState } from "react";
import useGetSalesItems from "../apiHooks/useGetSalesItems"
import type { SalesItem } from "@/types";
import { handleAxiosError } from "@/lib/utils";
import type { PaginationData } from "@/interfaces";
import { useSearchParams } from "react-router";

export default function useSalesItems(){
    const [searchParams] = useSearchParams()
    const page = parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || null
    
    const {data, isLoading, error, refetch } = useGetSalesItems(page, search);
    const [saleItems, setSaleItems] = useState<SalesItem[]>([]);
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined)
    
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch sales items",error)) return;
        if(data){
            setSaleItems(data.results)
            setPagination(data as PaginationData)
        }
    }, [data, error, page, search])    

    
    return {
        error,
        saleItems,
        isLoading,
        pagination,
        refetch,
    }
}