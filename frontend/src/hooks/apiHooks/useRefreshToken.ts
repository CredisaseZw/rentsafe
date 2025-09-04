import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useRefreshToken(){
    return useMutation({
        mutationFn : async ()=> {
            const response = await api.post("/api/auth/refresh/")
            return response.data;
        }
    })
}