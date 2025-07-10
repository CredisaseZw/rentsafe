import { Sidebar, SidebarHeader, SidebarGroupLabel,SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarFooter } from "../ui/sidebar";
import type { NavLink } from "@/types";
import { HomeIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import NavLinkItem from "./NavLinkItem";
import React from "react";

type SidebarProps = {
   title: string;
   rentsafeAppNavlinks: NavLink[];
   rentsafeAccountingNavlinks: NavLink[];
   rentsafeAdminPanelNavlinks: NavLink[];
};

export default function ServiceSidebar({ title, rentsafeAppNavlinks, rentsafeAccountingNavlinks, rentsafeAdminPanelNavlinks }: SidebarProps) {
   const [expandedSegment, expandThisSegment] = React.useState<string>("");

   return (
       <Sidebar className="bg-PRIMARY text-white border-r border-white/10 w-[300px]">
         <SidebarContent>
            <div className="px-5 pt-5">
               <div className="bg-primary-dark rounded-xl p-5 flex items-center gap-2">
                  <div className="bg-white text-[#0d475c] p-2 rounded-[7.5px]">
                     <HomeIcon size={22} />
                  </div>
                  <span className="text-xl font-bold">Rentsafe</span>
               </div>
            </div>
            <SidebarGroup>
               <SidebarGroupLabel className="text-blue-100 sidebar-labels">APPLICATION</SidebarGroupLabel>
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
            
            {/* ACCOUNTING NAVS */}
            <SidebarGroup>
               <SidebarGroupLabel className="text-blue-100 sidebar-labels">Accounting</SidebarGroupLabel>
               <SidebarContent>
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
               </SidebarContent>
            </SidebarGroup>

            {/* ADMIN LINKS */}
            <SidebarGroup>
               <SidebarGroupLabel className="text-blue-100 sidebar-labels">Admin</SidebarGroupLabel>
               <SidebarContent>
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
               </SidebarContent>
            </SidebarGroup>
         </SidebarContent> 


         {/* SIDE BAR FOOTER */}
         <SidebarFooter>
            <div className="p-2">
               <div className="flex p-3 flex-row justify-center align-center bg-primary-dark rounded-xl text-white gap-3">
                     <User size={18}/>
                     <h6>Hilton Somebody</h6>
               </div>
            </div>
         </SidebarFooter>
         
      </Sidebar>
   );
}
