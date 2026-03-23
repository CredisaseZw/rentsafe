import type { TrustAccInvoice } from "@/interfaces"
import useQueryResults from "../apiHooks/useQueryResults"
import { useNavigate, useParams } from "react-router"
import { TRUST_ACC_INVOICES } from "@/constants/base-links"
import { useEffect} from "react"
import { handleAxiosError } from "@/lib/utils"

function useTrustAccSingleInvoice() {
    const { invoice_id } = useParams()
    const navigate = useNavigate();

    const {data, isError, isLoading, error} = useQueryResults<TrustAccInvoice>({
        link : `${TRUST_ACC_INVOICES.link}${invoice_id}/`,
        keyStoreValue : `trust_invoice_${invoice_id}`
    })
    const handleGoBack = () =>navigate(-1);
    
    useEffect(()=>{
        if(handleAxiosError("Error occurred fetching invoice", error)) return
        if(!data) return;
    },  
    [data, isError, error])

    return {
        data,
        isError,
        isLoading,
        handleGoBack
    }
}

export default useTrustAccSingleInvoice