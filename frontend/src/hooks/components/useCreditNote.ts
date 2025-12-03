import { useNavigate, useParams } from "react-router";
import useGetCreditNote from "../apiHooks/useGetCreditNote";
import { useEffect, useState } from "react";
import { handleAxiosError } from "@/lib/utils";
import type { CreditNote } from "@/interfaces";

function useCreditNote() {
    const navigate = useNavigate();
    const handleGoBack = () =>navigate(-1);
    const {credit_note_id} = useParams<{credit_note_id:string}>()  
    const [creditNote, setCreditNote] = useState<CreditNote | null>(null)
    const {data, isLoading, error} = useGetCreditNote(credit_note_id)
   
    useEffect(()=>{
        if(handleAxiosError("Failed to fetch credit note", error)) return;
        if(data){
            setCreditNote(data)
        }
    }, [data, error])
    return {
        handleGoBack,
        creditNote,
        isLoading,
        error
    }
}

export default useCreditNote