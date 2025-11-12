import { useEffect, useState } from "react";
import useGetSalesCategories from "../apiHooks/useGetSalesCategories";
import type { Category } from "@/types";
import { handleAxiosError } from "@/lib/utils";
import type { PaginationData } from "@/interfaces";
import { useSearchParams } from "react-router";

export default function useSalesCategories(){
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1); 
    const {categories, categoriesError, categoriesLoading, refetch} = useGetSalesCategories(page);
    const [salesCategories, setSalesCategories] = useState<Category[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);

    useEffect(()=>{
        if(handleAxiosError("Error fetching sales categories", categoriesError)) return;
        if(categories) {
            setSalesCategories(categories.results)
            setPagination({
                count: categories.count,
                next: categories.next,
                previous: categories.previous
            });
        }
    }, [categories, categoriesError,page]);

    return {
        salesCategories,
        pagination,
        categoriesError,
        categoriesLoading,
        refetch
    }
}