import useClient from "../general/useClient"
import useURLParamFilter from "./useURLParamFilter"
import type{ QueryKey } from "@tanstack/react-query"

interface Props {
    key: QueryKey,
    mode: "update" | "create" | "deletion",
    response?: any
    id?: number
}

function useOptimisticCacheUpdate() {
    const queryClient = useClient()
    const { getUrlParams } = useURLParamFilter()

    const updateCache = async ({ key, mode, response, id }: Props) => {
        const params = getUrlParams()
        const fullKey = [...(key as any[]), params]

        await queryClient.cancelQueries({ queryKey: fullKey })

        if (mode === "create") {
            queryClient.setQueryData(fullKey, (prev: any) => {
                if (!prev) return prev
                return {
                    ...prev,
                    count: prev.count + 1,
                    results: [...prev.results, response]
                }
            })
        } else if (mode === "update") {
            queryClient.setQueryData(fullKey, (prev: any) => {
                if (!prev) return prev
                return {
                    ...prev,
                    results: prev.results.map((item: any) =>
                        item.id === response.id ? response : item
                    )
                }
            })
        } else if (mode === "deletion") {
            queryClient.setQueryData(fullKey, (prev: any) => {
                if (!prev) return prev
                return {
                    ...prev,
                    count: prev.count - 1,
                    results: prev.results.filter((item: any) => item.id !== id)
                }
            })
        }
    }

    return { updateCache }
}

export default useOptimisticCacheUpdate