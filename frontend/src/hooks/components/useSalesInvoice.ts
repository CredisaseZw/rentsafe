import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useGetInvoice from "../apiHooks/useGetInvoice";
import { handleAxiosError } from "@/lib/utils";
import type { Invoice } from "@/interfaces";

export default function useSalesInvoice(){
    const navigate = useNavigate();
    const handleGoBack = () =>navigate(-1);
    const [invoice, setInvoice] = useState<Invoice| undefined>(undefined);
    const {invoice_id} = useParams<{invoice_id:string}>()

    const {data, isLoading, error} = useGetInvoice(Number(invoice_id));
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch invoice", error)) return;
        if(data) setInvoice(data)
    }, [data, error])

    const markStatus = (mark:string) => setInvoice((p)=> p ? {...p, status : mark} : undefined)

    return {
        invoice, 
        isLoading,
        error,
        markStatus,
        handleGoBack
    }
}
