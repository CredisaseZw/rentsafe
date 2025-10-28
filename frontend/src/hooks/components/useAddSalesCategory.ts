import { handleAxiosError } from "@/lib/utils"
import type { AddCategoryPayload, Category } from "@/types"
import type { UseMutationResult } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  initial?: Category
  refetch: () => void
}

export default function useAddSalesCategory({ refetch, initial }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryPayload, setCategoryPayload] = useState<Category>({
    code: initial?.code || "",
    name: initial?.name || "",
  })

  const handleChange = (key: "code" | "name", value: string) => {
    setCategoryPayload((p) => ({ ...p, [key]: value }))
  }

  const handleSubmit = (
    mutation: UseMutationResult<any, Error, AddCategoryPayload, unknown>
  ) => {
    const mode = initial ? "update" : "create"

    if (
      mode === "update" &&
      categoryPayload.code === initial?.code &&
      categoryPayload.name === initial?.name
    ) {
      return toast.info("No changes made.")
    }

    setLoading(true)
    const payload: AddCategoryPayload = {
      id: Number(initial?.id),
      type: mode,
      data: categoryPayload,
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(
          mode === "create"
            ? "New category added successfully."
            : "Category updated successfully."
        )
        refetch()
        setOpen(false)
      },
      onError: (error) =>
        handleAxiosError(
          mode === "create"
            ? "Failed to create new category."
            : "Failed to update category.",
          error
        ),
      onSettled: () => setLoading(false),
    })
  }

  return {
    open,
    loading,
    categoryPayload,
    setOpen,
    handleChange,
    handleSubmit,
  }
}
