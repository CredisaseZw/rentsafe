import {
   Sidebar,
   SidebarGroupLabel,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarFooter,
   SidebarMenu,
} from "../ui/sidebar";
import { HomeIcon, ChevronDown } from "lucide-react";
import NavLinkItem from "./NavLinkItem";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // ShadCN
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
   const [openApp, setOpenApp] = useState(true);
   const [openAccounting, setOpenAccounting] = useState(true);
   const [openAdmin, setOpenAdmin] = useState(true);

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
      <Sidebar className="bg-PRIMARY w-[300px] border-r border-white/10 text-white">
         <SidebarContent>
            <div className="px-5 pt-5">
               <div className="bg-primary-dark flex items-center gap-2 rounded-xl p-5">
                  <div className="rounded-[7.5px] bg-white p-2 text-[#0d475c]">
                     <HomeIcon size={22} />
                  </div>
                  <span className="text-xl font-bold">Rentsafe</span>
               </div>
            </div>

            {/* APPLICATION */}
            <SidebarGroup>
               <Collapsible open={openApp} onOpenChange={setOpenApp}>
                  <CollapsibleTrigger asChild>
                     <SidebarGroupLabel className="sidebar-labels flex cursor-pointer items-center justify-between text-blue-100">
                        APPLICATION
                        <ChevronDown className={`transition-transform ${openApp ? "rotate-180" : ""}`} size={16} />
                     </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
               </Collapsible>
            </SidebarGroup>

            {/* ACCOUNTING */}
            <SidebarGroup>
               <Collapsible open={openAccounting} onOpenChange={setOpenAccounting}>
                  <CollapsibleTrigger asChild>
                     <SidebarGroupLabel className="sidebar-labels flex cursor-pointer items-center justify-between text-blue-100">
                        Accounting
                        <ChevronDown
                           className={`transition-transform ${openAccounting ? "rotate-180" : ""}`}
                           size={16}
                        />
                     </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
               </Collapsible>
            </SidebarGroup>

            {/* ADMIN */}
            <SidebarGroup>
               <Collapsible open={openAdmin} onOpenChange={setOpenAdmin}>
                  <CollapsibleTrigger asChild>
                     <SidebarGroupLabel className="sidebar-labels flex cursor-pointer items-center justify-between text-blue-100">
                        Admin
                        <ChevronDown className={`transition-transform ${openAdmin ? "rotate-180" : ""}`} size={16} />
                     </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
               </Collapsible>
            </SidebarGroup>
         </SidebarContent>

         {/* FOOTER */}
         <SidebarFooter>
            <SidebarFooterContent username={username} />
         </SidebarFooter>
      </Sidebar>
   );
}
