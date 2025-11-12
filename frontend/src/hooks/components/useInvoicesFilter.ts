import { useState } from "react"
import { useSearchParams } from "react-router"

export default function useInvoicesFilter() {
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterPayload, setFilterPayload] = useState({
    status: "",
    year: "",
    month: "",
  })

  const handleOnFilterChange = (
    filterKey: "status" | "year" | "month",
    value: string
  ) => {
    setFilterPayload((p) => ({ ...p, [filterKey]: value }))
  }

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams)

    Object.keys(filterPayload).forEach((objectKey) => {
      const key = objectKey as keyof typeof filterPayload
      const value = filterPayload[key]

      if (typeof value === "string" && value.trim()) {
        newParams.set(key, value.trim())
      } else {
        newParams.delete(key)
      }
    })

    setSearchParams(newParams)
  }

  return {
    filterPayload,
    open,
    setOpen,
    applyFilters,
    handleOnFilterChange,
  }
}
