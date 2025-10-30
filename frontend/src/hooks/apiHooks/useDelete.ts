import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import useClient from "../general/useClient"
import { handleAxiosError } from "@/lib/utils"
import { useSearchParams } from "react-router"
import type { Delete } from "@/types"

export default function useDelete({mutationFunc, keyStore, page , value }: Delete) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useClient()
  const { mutate } = useMutation({
    mutationFn: () => mutationFunc(),
    onSuccess: () => {
        searchParams.set("page", String(page));
        setSearchParams(searchParams)
        queryClient.invalidateQueries({ queryKey: [keyStore, Number(page)] })
        toast.success(`${value} deleted successfully`)
        setOpen(false)
    },
    onError: (error) => handleAxiosError(`Failed to delete ${value.toLocaleLowerCase()}`, error),
    onSettled: () => setLoading(false),
  })

  const onHandleDelete = () => {
    setLoading(true)
    mutate()
  }

  return {
    open,
    loading,
    setOpen,
    onHandleDelete,
  }
}
