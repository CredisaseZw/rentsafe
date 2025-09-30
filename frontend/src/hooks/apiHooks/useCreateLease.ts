import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useCreateLease() {
  return useMutation({
    mutationFn: async (payload: {leaseID: undefined | string, data: any}) => {
      const {leaseID, data }  = payload
      
      const response = 
      !leaseID ?
      await api.post("/api/leases/", data) :
      await api.patch(`/api/leases/${leaseID}/`, data)
      
      return response.data;
    },
  });
}