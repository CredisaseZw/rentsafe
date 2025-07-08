import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "../ui/sidebar";
import type { NavLink } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import SidebarItem from "./SidebarItem";

type SidebarProps = {
   title: string;
   navLinks: NavLink[];
};

export default function ServiceSidebar({ title, navLinks }: SidebarProps) {
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
                        <SidebarItem key={index} navLink={navLink} />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
