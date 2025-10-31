import type { PaymentMethod } from "@/types";
import { useEffect, useState } from "react";
import useGetPaymentMethods from "../apiHooks/useGetPaymentMethods";
import { handleAxiosError } from "@/lib/utils";

export default function usePaymentTypes(){
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const {data, isLoading, error} = useGetPaymentMethods();

    useEffect(()=>{
        if(handleAxiosError("Failed to fetch payment methods",error)) return;
        if(data) setPaymentMethods(data);
    }, [data, error])

    return {
        paymentMethods,
        isLoading,
        error
    }
}