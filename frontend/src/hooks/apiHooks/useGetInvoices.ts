import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/axios"
import { useSearchParams } from "react-router"
import type { Response, Invoice } from "@/interfaces"
import { setRefetchInvoices } from "@/store/invoiceStore"

interface InvoiceResponse extends Response {
  results: Invoice[]
}

function useGetInvoices(mode: string, page: number, search?: string) {
  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(searchParams)
  params.set("invoice_type__in", mode.split("_")[0])
  params.set("page", String(page))
  if (search) params.set("search", search)

  const queryString = params.toString() ? `?${params.toString()}` : ""

  const { data, isLoading, isError, refetch } = useQuery<InvoiceResponse>({
    queryKey: ["invoices", mode, page, queryString],
    queryFn: async () => {
      const response = await api.get<InvoiceResponse>(
        `/api/accounting/invoices/${queryString}`
      )
      return response.data
    },
  })

  setRefetchInvoices(refetch)

  return {
    invoicesData: data,
    invoicesLoading: isLoading,
    invoicesError: isError,
  }
}

export default useGetInvoices
