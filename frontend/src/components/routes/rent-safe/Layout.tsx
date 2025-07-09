import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import NavBar from "@/components/general/NavBar";
import Container from "@/components/general/Container";

export default function Layout() {
   return (
      <div>
         <SidebarProvider>
            <Sidebar />
            <div className="w-full main">
               <div className="py-3">
                  <Outlet />
               </div>
            </div>
         </SidebarProvider>
      </div>
   );
}
