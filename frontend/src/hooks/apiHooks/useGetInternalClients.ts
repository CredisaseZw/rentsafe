import { useQuery } from "@tanstack/react-query";
import {api} from "@/api/axios";

export function useGetInternalUserClients(userID: number) {
   const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["clients", userID],
      queryFn: async () => {
         const response = await api.get(`/api/clients/users/?client_id=${userID}`);
         return response.data;
      },
      enabled: !!userID
   });

   return {
      data,
      isLoading,
      isError,
      refetch,
   };
}
