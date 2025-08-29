import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useCreateProperty() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/api/properties/", payload);
      return response.data;
    },
  });
}
