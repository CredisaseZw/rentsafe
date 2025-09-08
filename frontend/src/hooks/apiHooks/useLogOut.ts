import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useLogOut() {
  return useMutation({
    mutationKey : ["logout"], 
    mutationFn: async () => {
      const response = await api.post("/api/auth/logout/");
      return response.data;
    },
  });
}