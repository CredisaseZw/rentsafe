import { api } from "@/api/axios";
import type { Payload } from "@/types";
import { useMutation } from "@tanstack/react-query";

const useMutateResults = () =>{
    const {mutate} = useMutation({
        mutationFn: async(payload:Payload) =>{
            const response = payload.mode === "create"
            ? await api.post(payload?.link ?? "", payload.data)
            : await api.patch(`${payload?.link}${payload.id}/`, payload.data)

            return response.data;
        }
    })

    return {
        mutate
    }
}

export default useMutateResults