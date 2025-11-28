import { useCurrency } from "@/contexts/CurrencyContext"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import type { ChangeEvent } from "react"

export default function useFilter(filter:any, setFilter:any) {
  const [open, setOpen] = useState(false)
  const { currencies } = useCurrency()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const newFilter = { ...filter }
    for (const key in newFilter) {
      newFilter[key as keyof typeof newFilter] = searchParams.get(key) || ""
    }
    setFilter(newFilter)
  }, [searchParams])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement 
    | HTMLSelectElement> 
    | { target:
      { name: string; type?: string; checked?: boolean; value?: string } }
  ) => {
    const { name, type, checked, value } = e.target as unknown as { name: string; type?: string; checked?: boolean; value?: string }
    setFilter((prev:any) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "true" : "") : value,
    }))
  }


  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("page") 
    Object.entries(filter).forEach(([key, value]) => {
      if (value && value !== "false") newParams.set(key, String(value))
      else newParams.delete(key)
    })
    setSearchParams(newParams)
  }

  const onClearFilter = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      const keys = Array.from(params.keys())
      keys.forEach((key) => {
        if (key === "invoice_type__in") return
        params.delete(key)
      })
      return params
    })
  }

  return {
    open,
    filter,
    currencies,
    onClearFilter,
    handleChange,
    applyFilters,
    setOpen,

  }
}
