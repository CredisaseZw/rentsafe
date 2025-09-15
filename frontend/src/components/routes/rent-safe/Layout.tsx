import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import LayoutHeader from "@/components/general/LayoutHeader";
export default function Layout() {
   return (
      <div className="bg-background flex h-fit w-full" data-sidebar="open">
         <SidebarProvider>
            <Sidebar />
            <main className="flex-1 transition-[margin] duration-300 data-[sidebar=closed]:ml-0 data-[sidebar=open]:ml-[var(--sidebar-width)]">
               <LayoutHeader />
               <div className="side-main">
                  <Outlet />
               </div>
            </main>
         </SidebarProvider>
      </div>
   );
}
