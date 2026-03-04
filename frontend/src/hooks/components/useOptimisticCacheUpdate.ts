import useClient from "../general/useClient"
import useURLParamFilter from "./useURLParamFilter"

interface props {
    key? : any,
    mode? : "update" | "create" | "deletion",
    response?: any
    id? : number
}
function useOptimisticCacheUpdate() {
    const queryClient = useClient()
        const {getUrlParams} = useURLParamFilter()

    const updateCache = async({key, mode, response, id}: props) =>{
        await queryClient.cancelQueries({ queryKey: ['property-expenses'] })
        const params = getUrlParams()
                
        if (mode === "create") {
            queryClient.setQueryData(key[0], (prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    count : prev.count + 1,
                    results: [...prev.results, response]
                }
            })
        } else if(mode === "update"){
            queryClient.setQueryData(key, (prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    results: prev.results.map((item: any) => 
                        item.id === response.id ? response : item
                    )
                }
            })
        } else if (mode === "deletion"){
            queryClient.setQueryData([...key, params], (prev: any) => {
            if (!prev) return prev;
            return {
            ...prev,
            count : prev.count - 1,
            results: prev.results.filter((item: any) => item.id !== id)
        }
    })
        
}
    }
    
    return {
        updateCache
  }
}

export default useOptimisticCacheUpdate

