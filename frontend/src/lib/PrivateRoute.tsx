import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProtectRoute() {
  const location = useLocation();

  const { isLoading, isError, data: isAuthenticated } = useQuery({
    queryKey: ["isAuth"],
    queryFn: async () => {
      await axios.get("/api/check-csrf/", { withCredentials: true });
      return true;
    },
    retry: false, 
  });

  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex flex-col justify-center items-center">
        <img src="/loader.svg" alt="Loading..." className="w-25 h-25 bg-transparent" />
      </div>
    );
  }

  if (isError || !isAuthenticated) {
    return <Navigate to={`/login?next=${location.pathname}`} replace />;
  }

  return <Outlet />;
}
