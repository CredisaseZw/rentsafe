
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/axios"
import type { SuburbPayload } from "@/types"

function useSearchSuburb(search: string, enabled: boolean) {
    const {data, isLoading, error} = useQuery<SuburbPayload[]>({
        queryKey : ["search_suburb", search],
        queryFn: async() =>{
            const response = await api.get<SuburbPayload[]>(`/api/common/suburbs/?search=${encodeURI(search.trim())}`);
            return response.data
        },
        enabled :  enabled
    })
    return {data, isLoading, error}
}

export default useSearchSuburb