import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useLogOut() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/auth/logout/");
      return response.data;
    },
  });
}