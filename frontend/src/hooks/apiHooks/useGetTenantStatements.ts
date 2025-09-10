import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useGetTenantStatements(page : number, search : string | null){
    const {data, isLoading, error} = useQuery({
        queryKey : ["tenant_statements", page],
        queryFn : async() =>{
            console.log(search); // CHECK IF SEARCH WORKS
            const response = await api.get("/api/leases/tenant-statements-summary/")
            return response.data
        }
    })

    return {
        data,
        isLoading, error
    }
}