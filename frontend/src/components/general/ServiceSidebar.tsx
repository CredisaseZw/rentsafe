import {
   Sidebar,
   SidebarGroupLabel,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarFooter,
   SidebarMenu,
} from "../ui/sidebar";
import { HomeIcon } from "lucide-react";
import NavLinkItem from "./NavLinkItem";
import { useEffect, useState } from "react";
import type { NavLink } from "@/types";
import SidebarFooterContent from "./SidebarFooterContent";

type SidebarProps = {
   title?: string;
   rentsafeAppNavlinks: NavLink[];
   rentsafeAccountingNavlinks: NavLink[];
   rentsafeAdminPanelNavlinks: NavLink[];
};

export default function ServiceSidebar({
   rentsafeAppNavlinks,
   rentsafeAccountingNavlinks,
   rentsafeAdminPanelNavlinks,
}: SidebarProps) {
   const [expandedSegment, expandThisSegment] = useState<string>("");
   const [username, setUsername] = useState<string>("");

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
         try {
            const parsedToken = JSON.parse(token);
            setUsername(parsedToken.username);
         } catch {
            console.log("Error parsing token");
         }
      }
   }, []);

   return (
      <Sidebar className="w-[300px] border-r border-white/10 bg-white text-gray-800 shadow-md dark:bg-zinc-950 dark:text-white">
         <SidebarContent>
            <div className="px-5 pt-5">
               <div className="flex items-center gap-2 rounded-xl bg-gray-800 p-5 dark:bg-zinc-900">
                  <div className="rounded-[7.5px] bg-white p-2">
                     <HomeIcon size={22} className="text-gray-800" />
                  </div>
                  <span className="text-xl font-bold text-white">Rentsafe</span>
               </div>
            </div>

            {/* APPLICATION */}
            <SidebarGroup>
               <SidebarGroupLabel className="sidebar-labels text-gray-800 dark:text-white/50">
                  APPLICATION
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {rentsafeAppNavlinks.map((navLink, index) => (
                        <NavLinkItem
                           key={index}
                           navLink={navLink}
                           expandedSegment={expandedSegment}
                           expandThisSegment={expandThisSegment}
                        />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            {/* ACCOUNTING */}
            <SidebarGroup>
               <SidebarGroupLabel className="sidebar-labels text-gray-800 dark:text-white/50">
                  ACCOUNTING
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {rentsafeAccountingNavlinks.map((navLink, index) => (
                        <NavLinkItem
                           key={index}
                           navLink={navLink}
                           expandedSegment={expandedSegment}
                           expandThisSegment={expandThisSegment}
                        />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            {/* ADMIN */}
            <SidebarGroup>
               <SidebarGroupLabel className="sidebar-labels text-gray-800 dark:text-white/50">ADMIN</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {rentsafeAdminPanelNavlinks.map((navLink, index) => (
                        <NavLinkItem
                           key={index}
                           navLink={navLink}
                           expandedSegment={expandedSegment}
                           expandThisSegment={expandThisSegment}
                        />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         {/* FOOTER */}
         <SidebarFooter>
            <SidebarFooterContent username={username} />
         </SidebarFooter>
      </Sidebar>
   );
}
