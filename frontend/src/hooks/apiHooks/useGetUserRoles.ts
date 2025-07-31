import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserRoles() {
   const { data, isLoading, isError } = useQuery({
      queryKey: [],
      queryFn: () =>
         api.get(`${import.meta.env.VITE_API_URL}/api/auth/roles/minimal/`).then((response) => response.data),
   });

   return {
      data,
      isLoading,
      isError,
   };
}
