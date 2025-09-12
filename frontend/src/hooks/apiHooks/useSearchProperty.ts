
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/axios"
import type { PropertiesResponse } from "@/types"

function useSearchProperty(search: string, enabled: boolean) {
    const {data, isLoading, error} = useQuery<PropertiesResponse>({
        queryKey : ["search_property", search],
        queryFn: async() =>{
            const response = await api.get<PropertiesResponse>(`/api/properties/?search=${encodeURI(search.trim())}`);
            return response.data
        },
        enabled :  enabled
    })
    return {data, isLoading, error}
}

export default useSearchProperty