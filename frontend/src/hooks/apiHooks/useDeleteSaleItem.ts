import { api } from "@/api/axios"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import useClient from "../general/useClient"
import { handleAxiosError } from "@/lib/utils"
import { useSearchParams } from "react-router"

export default function useDeleteSaleItem() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useClient()

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/accounting/items/${id}/`)
      return response.data
    },
    onSuccess: () => {
      searchParams.set("page", "1");
      setSearchParams(searchParams)
      
      queryClient.invalidateQueries({ queryKey: ["salesItems", 1] })
      toast.success("Sale item deleted successfully")
      setOpen(false)
    },
    onError: (error) => handleAxiosError(`Failed to delete sale item`, error),
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
