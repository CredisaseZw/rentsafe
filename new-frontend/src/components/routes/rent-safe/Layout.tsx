import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
   return (
      <div className="grid grid-cols-[1fr_3fr] gap-4">
         <Sidebar />
         <Outlet />
      </div>
   );
}
