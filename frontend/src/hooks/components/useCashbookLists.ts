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
    const {cashBooksData, isCashbookLoading, cashbookError} = useGetCashbook(page);

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch cash books",cashbookError)) return;
        if(cashBooksData) {
            const {results, ...paginationMeta} = cashBooksData;
            setCashBooks(cashBooksData.results)
            setPagination(paginationMeta as PaginationData)
        }
    }, [cashBooksData, cashbookError])

    return {
        pagination,
        cashBooks,
        isLoading : isCashbookLoading,
        error : cashbookError
    }
}