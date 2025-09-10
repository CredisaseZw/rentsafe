import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useCreateLease() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/api/leases/", payload);
      return response.data;
    },
  });
}