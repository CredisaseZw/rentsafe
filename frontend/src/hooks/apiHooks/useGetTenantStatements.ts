import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useGetTenantStatements(page : number, search : string | null){
    const {data, isLoading, error} = useQuery({
        queryKey : !search ? ["tenant_statements", page] : ["tenant_statements", page, search],
        queryFn : async() =>{
            const URL =  search ?
            `/api/leases/search/?search=${search}&&status=ACTIVE` :
            "/api/leases/tenant-statements-summary/"
            const response = await api.get(URL)
            return response.data
        }
    })

    return {
        data,
        isLoading, error
    }
}