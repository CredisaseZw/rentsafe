import { useMutation } from "@tanstack/react-query";
import apis from "@/api/axios";
const { api } = apis;
interface AddInternalUserProps {
   firstName: string;
   lastName: string;
   email: string;
   accessLevel: string;
   password :string;
}

export default function useAddInternalUsersApi(userID: number) {
   return useMutation({
      mutationFn: async ({ firstName, lastName, email, password ,accessLevel }: AddInternalUserProps) => {
         const response = await api.post(`${import.meta.env.VITE_API_URL}/api/clients/${userID}/create-user/`,   {
          email,
          password,       
          first_name: firstName,
          last_name: lastName,
          role_id: parseInt(accessLevel)

        });
         return {
            response: response.data,
         };
      },
   });
}
