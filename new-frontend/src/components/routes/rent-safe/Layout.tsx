import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import NavBar from "@/components/general/NavBar";

export default function Layout() {
   return (
      <SidebarProvider>
         <Sidebar />

         <div className="w-full">
            <NavBar sidebarTrigger={<SidebarTrigger />} />

            <div className="py-3">
               <Outlet />
            </div>
         </div>
      </SidebarProvider>
   );
}
