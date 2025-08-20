import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Property } from "@/types";

interface AddPropertyResponse {
  response: any;
}

export default function useAddProperty() {
  return useMutation<AddPropertyResponse, Error, Property>({
    mutationFn: async (property_payload: Property) => {
      const { data } = await api.post("/api/properties/", property_payload);
      return { response: data };
    },
  });
}
