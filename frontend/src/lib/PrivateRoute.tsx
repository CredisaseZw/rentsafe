import { Navigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectRoute() {
   const location = useLocation();
   const [isChecking, setIsChecking] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      axios
         .get("/api/check-csrf/", { withCredentials: true })
         .then(() => setIsAuthenticated(true))
         .catch((error) => {
            if (
               axios.isAxiosError(error) &&
               (error.response?.status === 401 || error.response?.status === 403)
            ) {
               setIsAuthenticated(false);
            } else {
               console.error("Unexpected error checking auth status:", error);
               setIsAuthenticated(false);
            }
         })
         .finally(() => {
            setIsChecking(false);
         });
   }, []); 

   if (isChecking) {
      return (
         <div className="w-full h-[100vh] flex flex-col justify-center items-center">
            <img src="/loader.svg" alt="Loading..." className="w-25 h-25 bg-transparent" />
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to={`/login?next=${location.pathname}`} replace />;
   } 

   return <Outlet />;
}
