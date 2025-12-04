import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Payload } from "@/types";

interface AddPropertyResponse {
  response: any;
}

export default function useAddProperty() {
  return useMutation<AddPropertyResponse, Error, Payload>({
    mutationFn: async (payload: Payload) => {     
      const { data } = payload.mode === "create"
      ? await api.post("/api/properties/", payload.data)
      : await api.patch( `/api/properties/${payload.id}/`, payload.data)
      return { response: data };
    },
  });
}
