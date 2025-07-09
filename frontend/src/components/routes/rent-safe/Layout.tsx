import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import NavBar from "@/components/general/NavBar";
import Container from "@/components/general/Container";

export default function Layout() {
   return (
      <Container>
         <SidebarProvider>
            <Sidebar />
            <div className="w-full bg-primary">
               <div className="py-3">
                  <Outlet />
               </div>
            </div>
         </SidebarProvider>
      </Container>
   );
}
