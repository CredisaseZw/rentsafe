import { useMutation } from "@tanstack/react-query";
import apis from "@/api/axios";

interface AuthProps{
    username  :string,
    password : string,
}
export default function useLoginAuth(){
    return useMutation({
        mutationFn : async({ username, password}: AuthProps)=>{
            let response = await apis.api.post("/api/auth/login/", {username, password});
            return {
                id :  response.data.user.id,
                username : response.data.user.username,
                access_token : response.data.access,
                refresh_token : response.data.refresh,
                user_type : response.data.user.user_type
            };
        }
    })
}