import { useEffect, useState } from "react";
import useGetPropertyExpenses from "../apiHooks/useGetPropertyExpenses"
import type { PaginationData, PropertyExpense } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";
import useClient from "../general/useClient";
import useURLParamFilter from "./useURLParamFilter";

function usePropertyExpenses() {
    const [propertyExpenses, setPropertyExpenses] = useState<PropertyExpense[]>([]);
    const [pagination, setPagination] = useState<PaginationData>();
    const queryClient =useClient();
    const {getUrlParams} = useURLParamFilter()
    const {
        data,
        isLoading,
        isError,
        error
    } = useGetPropertyExpenses();
    
    useEffect(()=>{
        if(handleAxiosError("An error occurred fetching property expenses.", error)) return;
        if(!data) return;

        const {results, ...paginationData} = data;
        setPagination(paginationData)
        setPropertyExpenses(results);
    }, [error, isLoading, data])

    const onDelete = (id: number)=>{
        const params = getUrlParams();
        queryClient.setQueryData(["property-expenses", params], (prev: any) => {
            if (!prev) return prev;
            return {
            ...prev,
            results: prev.results.filter((item: any) => item.id !== id)
        }
    })
    }
    return {
        onDelete,
        isError,
        pagination,
        isLoading,
        propertyExpenses
    }
}

export default usePropertyExpenses