import { Sidebar, SidebarHeader, SidebarGroupLabel,SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarFooter } from "../ui/sidebar";
import type { NavLink } from "@/types";
import { HomeIcon } from "lucide-react";
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
      <Sidebar variant="sidebar" className="sidebar">
         <div>
  <SidebarHeader className="p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold">
               <Button variant="outline" className="border-foreground/50" size="sm" asChild>
                  <Link to="/services">
                     <HomeIcon />
                  </Link>
               </Button>
               {title}
            </h2>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Application</SidebarGroupLabel>
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
               <SidebarGroupLabel>Accounting</SidebarGroupLabel>
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
               <SidebarGroupLabel>Admin</SidebarGroupLabel>
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
            <div>
               hello FOotger
            </div>
         </SidebarFooter>
         </div>       
      </Sidebar>
   );
}
