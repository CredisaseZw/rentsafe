import { useQuery } from "@tanstack/react-query"
import useURLParamFilter from "../components/useURLParamFilter"
import { api } from "@/api/axios"

interface props {
    link: string,
    keyStoreValue: string
    enabled?: boolean
    params? : Record<string, unknown>
}

function useQueryResults<T>({ link, keyStoreValue, params, enabled = true }: props) {
    const { getUrlParams } = useURLParamFilter()
    
    const resolvedParams = { ...(params ?? getUrlParams()) }
    if (resolvedParams.search && resolvedParams.page) delete resolvedParams.page

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: [keyStoreValue, resolvedParams],
        queryFn: async () => {
            const response = await api.get<T>(link, {
                params : resolvedParams
            })
            return response.data
        },
        enabled
    })

    return { data, isLoading, isError, error, refetch }
}

export default useQueryResults