import { Navigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router";
import { getCookie } from "typescript-cookie";

export default function ProtectRoute() {
   const userStr = getCookie("token");
   let user: null | { access_token?: string } = null;

   try {
      user = userStr ? JSON.parse(userStr) : null;
   } catch (error) {
      user = null;
      console.log(error);
   }

   const path = useLocation();
   return user?.access_token ? <Outlet /> : <Navigate to={`/login?next=${path.pathname}`} replace={true} />;
}
