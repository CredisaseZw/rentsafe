import { Store } from "@tanstack/store"

interface InvoiceStore {
  refetchInvoices: (() => void) | null
}

export const invoiceStore = new Store<InvoiceStore>({
  refetchInvoices: null,
})

export const setRefetchInvoices = (fn: () => void) => {
  invoiceStore.setState({ refetchInvoices: fn })
}

export const getRefetchInvoices = () => invoiceStore.state.refetchInvoices?.()

