import { useMutation } from "@tanstack/react-query";
import apis from "@/api/axios";
const { api } = apis;
interface AddInternalUserProps {
   firstName: string;
   lastName: string;
   email: string;
   accessLevel: string;
}

export default function useAddInternalUsersApi(userID: number) {
   return useMutation({
      mutationFn: async ({ firstName, lastName, email ,accessLevel }: AddInternalUserProps) => {
         const response = await api.post(`/api/clients/${userID}/create-user/`,   {
          email,
          password : "1234",       
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
