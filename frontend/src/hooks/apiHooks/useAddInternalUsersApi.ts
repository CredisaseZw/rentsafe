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
      mutationFn: async ({ firstName, lastName, email, accessLevel }: AddInternalUserProps) => {
         const response = await api.post(`${import.meta.env.VITE_API_URL}/api/clients/clients/${userID}/create-user/`, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            access_level: accessLevel,
         });
         console.log(response);
         return {
            response: response.data,
         };
      },
   });
}
