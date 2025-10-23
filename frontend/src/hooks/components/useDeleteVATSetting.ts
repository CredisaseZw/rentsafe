import { api } from "@/api/axios"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import useClient from "../general/useClient"
import { handleAxiosError } from "@/lib/utils"

export default function useDeleteVATSetting() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const queryClient = useClient()

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/accounting/vat-settings/${id}/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VATSettings"] })
      toast.success("VAT setting deleted successfully")
      setOpen(false)
    },
    onError: (error) => handleAxiosError("Failed to delete VAT setting", error),
    onSettled: () => setLoading(false),
  })

  const onHandleDelete = (id: number) => {
    setLoading(true)
    mutate(id)
  }

  return {
    open,
    loading,
    setOpen,
    onHandleDelete,
  }
}
