import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout() {
   return (
      <SidebarProvider>
         <Sidebar />

         <div>
            <SidebarTrigger />
            <Outlet />
         </div>
      </SidebarProvider>
   );
}
