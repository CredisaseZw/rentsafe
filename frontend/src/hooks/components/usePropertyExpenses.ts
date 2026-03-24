import { useEffect, useState } from "react";
import type { PaginationData, PropertyExpense } from "@/interfaces";
import { handleAxiosError } from "@/lib/utils";
import useClient from "../general/useClient";
import useURLParamFilter from "./useURLParamFilter";
import useQueryResults from "../apiHooks/useQueryResults";
import { TRUST_ACC_PROPERTY_EXPENSES } from "@/constants/base-links";

interface PropertyExpensesResponse extends PaginationData{
    results: PropertyExpense[]
}

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
    } = useQueryResults<PropertyExpensesResponse>({
        link : TRUST_ACC_PROPERTY_EXPENSES.link,
        keyStoreValue : TRUST_ACC_PROPERTY_EXPENSES.keyStoreValue
    });
    
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