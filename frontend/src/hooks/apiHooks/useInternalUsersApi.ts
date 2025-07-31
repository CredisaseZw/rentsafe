import { useMutation } from "@tanstack/react-query";
import apis from "@/api/axios";

interface AddInternalUserProps {
   firstName: string;
   lastName: string;
   email: string;
   accessLevel: string;
}
export default function AddInternalUsersApi() {
   return useMutation({
      mutationFn: async ({ firstName, lastName, email, accessLevel }: AddInternalUserProps) => {
         const response = await apis.api.post(`${import.meta.env.VITE_API_URL}/api/clients/clients/1/create-user/`, {
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
