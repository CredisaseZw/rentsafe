import { getCookie } from "typescript-cookie";

export default function useGetUserId() {
   const token = getCookie("token");
   if (token) {
      const parsed_token = JSON.parse(token);
      return parsed_token?.id;
   } else {
      location.href = "/login";
   }
}
