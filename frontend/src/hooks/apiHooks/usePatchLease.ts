import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

function usePatchLease() {
  return useMutation({
    mutationFn: async (payload: { leaseID: string; data: any }) => {
      const { leaseID, data } = payload;
      const response = await api.patch(`/api/leases/${leaseID}/`, data);
      return response.data;
    },
  });
}

export default usePatchLease
