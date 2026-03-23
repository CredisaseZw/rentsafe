import type { PaginationData,  TrustAccInvoiceList } from "@/interfaces"
import { useEffect, useState } from "react"
import useQueryResults from "../apiHooks/useQueryResults"
import { TRUST_ACC_INVOICES } from "@/constants/base-links"
import { handleAxiosError } from "@/lib/utils"
import useURLParamFilter from "./useURLParamFilter"

interface TrustAccInvoicesResponse  extends PaginationData{
  results : TrustAccInvoiceList[]
}

function useTrustAccountInvoices() {
  const {resetFilters, setSingleURLParam} = useURLParamFilter()
  const [invoices, setInvoices] = useState<TrustAccInvoiceList[]>([])
  const [pagination, setPagination] = useState<PaginationData | undefined>();
  const {data, isError, isLoading, error } = useQueryResults<TrustAccInvoicesResponse>({
    link : TRUST_ACC_INVOICES.link,
    keyStoreValue : TRUST_ACC_INVOICES.keyStoreValue
  })

  useEffect(()=>{
    if(handleAxiosError("Failed to fetch invoices.", error)) return;
    if(!data) return;

    const {results, ...pagination_data} = data;
    setInvoices(results)
    setPagination(pagination_data)

  }, [data, error])

  const onSwitchTabs = (param_value:string) => {
    if(param_value === "invoices") return resetFilters();
    setSingleURLParam("invoice_type", param_value, true)
  };


  return {
    isError,
    invoices,
    isLoading,
    pagination,
    onSwitchTabs
  }
}

export default useTrustAccountInvoices