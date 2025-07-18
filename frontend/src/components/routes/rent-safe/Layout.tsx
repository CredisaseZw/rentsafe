import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
   return (
      <div>
         <SidebarProvider>
            <Sidebar />
            <div className="main w-full">
               <div className="p-5">
                  <Outlet />
               </div>
            </div>
         </SidebarProvider>
      </div>
   );
}
