import { Navigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router";
import { getCookie } from "typescript-cookie";
import useRefreshToken from "@/hooks/apiHooks/useRefreshToken";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export default function ProtectRoute() {
   const refreshToken = useRefreshToken();
   const [isValid, setIsValid] = useState<boolean>(true); 
   const location = useLocation();

   useEffect(() => {
      const accessToken = getCookie("access_token");
      console.log("Access Token:", accessToken);
      /* if (!accessToken) {
         refreshToken.mutate(undefined, {
            onSuccess: () => {
               setIsValid(true);
            },
            onError: (error) => {
               if (isAxiosError(error) && error.response?.status === 401) {
                  setIsValid(false);
               }
            },
         });
      }       */
   }, []);

   return isValid ? <Outlet /> : <Navigate to={`/login?next=${location.pathname}`} replace={true} />;
}