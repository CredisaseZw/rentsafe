import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function useCreateLease() {
  return useMutation({
    mutationFn: async (payload: {leaseID: undefined | string, data: any}) => {
      const {leaseID, data }  = payload
      
      const response = 
      !leaseID ?
      await api.post("/api/leases/", data) :
      await api.put(`/api/leases/${leaseID}/`)
      
      return response.data;
    },
  });
}