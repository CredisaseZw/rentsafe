import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";


export default function useGetSubscriptions(){
    const {data, isLoading, isError} = useQuery({
        queryKey : ["subscriptions"],
        queryFn : async() => {
            const response = await api.get("/api/subscriptions/client/")
            return response.data
        }
    })
    return {
        data,
        isLoading,
        isError
    }
}