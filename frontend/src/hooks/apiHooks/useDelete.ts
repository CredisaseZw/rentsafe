import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import useClient from "../general/useClient"
import { handleAxiosError } from "@/lib/utils"
import { useSearchParams } from "react-router"
import type { Delete } from "@/types"

export default function useDelete({mutationFunc, keyStore, value, successCallBack }: Delete) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams();
  const queryClient = useClient()
  const { mutate } = useMutation({
    mutationFn: () => mutationFunc(),
    onSuccess: () => {  
        if(typeof(keyStore) !== "function"){
          const PAGE = Number(searchParams.get("page") || 1)
          queryClient.refetchQueries({ queryKey: typeof(keyStore) === "string" ? [keyStore, PAGE] : keyStore })
        } else {
          keyStore?.() 
        }
        toast.success(`${value} deleted successfully`)
        successCallBack?.();
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
