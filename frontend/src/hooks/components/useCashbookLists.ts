import type { PaginationData } from "@/interfaces";
import type { Cashbook } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useGetCashbook from "../apiHooks/useGetCashbook";
import { handleAxiosError } from "@/lib/utils";

export default function useCashbookLists(){
    const [cashBooks, setCashBooks] = useState<Cashbook[]>([])
    const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);
    const {data, isLoading, error} = useGetCashbook(page);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch cash books",error)) return;
        if(data) {
            const {results, ...paginationMeta} = data;
            setCashBooks(data.results)
            setPagination(paginationMeta as PaginationData)
        }
    }, [data, error])

    return {
        pagination,
        cashBooks,
        isLoading,
        error
    }
}