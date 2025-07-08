import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "../ui/sidebar";
import type { NavLink } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import NavLinkItem from "./NavLinkItem";
import React from "react";

type SidebarProps = {
   title: string;
   navLinks: NavLink[];
};

export default function ServiceSidebar({ title, navLinks }: SidebarProps) {
   const [expandedSegment, expandThisSegment] = React.useState<string>("");

   return (
      <Sidebar variant="floating">
         <SidebarHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
               <Button variant="outline" size="icon_sm" asChild>
                  <Link to="/services">
                     <ArrowLeft />
                  </Link>
               </Button>
               {title}
            </h2>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {navLinks.map((navLink, index) => (
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
      </Sidebar>
   );
}
