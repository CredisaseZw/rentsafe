import { useQuery } from "@tanstack/react-query";
import apis from "@/api/axios";
const { api } = apis;

export function useGetInternalUserClients(userID: number) {
   const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["clients_for", userID],
      queryFn: async () => {
         const response = await api.get(`${import.meta.env.VITE_API_URL}/api/clients/users/?client_id=${userID}`);
         return response.data;
      },
      enabled: !!userID,
      staleTime: 5 * 60 * 1000,
      retry: 2,
   });

   return {
      data,
      isLoading,
      isError,
      refetch,
   };
}
