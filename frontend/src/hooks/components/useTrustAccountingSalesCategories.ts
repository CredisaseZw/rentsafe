import type { PaginationData } from "@/interfaces"
import type { Category } from "@/types"
import { useEffect, useState } from "react"
import useQueryResults from "../apiHooks/useQueryResults"
import { handleAxiosError } from "@/lib/utils"
import {  BASE_TRUST_ACC_SALES_CATEGORIES } from "@/constants/base-links"
import type { Response } from "@/interfaces"

interface CategoriesResponse extends Response{
    results :Category[]
}

function useTrustAccountingSalesCategories() {
    const [pagination, setPagination] = useState<PaginationData | undefined>()
    const [categories, setCategories] = useState<Category[]>([])
    const {data, isLoading, isError, error} = useQueryResults<CategoriesResponse>({
        link : BASE_TRUST_ACC_SALES_CATEGORIES.link,
        keyStoreValue :BASE_TRUST_ACC_SALES_CATEGORIES.keyStoreValue
    })

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch trust account's sales categories.", error)) return;
        if(!data) return;

        const {results, ...paginationData} = data;
        setCategories(results)
        setPagination(paginationData)
    }, [data, isLoading, isError, error])
    return {
        isError,
        isLoading,
        pagination,
        categories
    }
}

export default useTrustAccountingSalesCategories