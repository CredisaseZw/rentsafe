import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import * as sidebar from "@/components/ui/sidebar";
import { RENTSAFE_NAVLINKS } from "@/constants/routes";
import type { NavLink } from "@/types";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router";

export default function Sidebar() {
   return (
      <sidebar.Sidebar variant="floating">
         <sidebar.SidebarHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
               <Button variant="outline" size="icon_sm" asChild>
                  <Link to="/services">
                     <ArrowLeft />
                  </Link>
               </Button>
               Rentsafe
            </h2>
         </sidebar.SidebarHeader>

         <sidebar.SidebarContent>
            <sidebar.SidebarGroup>
               <sidebar.SidebarGroupContent>
                  <sidebar.SidebarMenu>
                     {RENTSAFE_NAVLINKS.map((navLink, index) => (
                        <SidebarItem key={index} navLink={navLink} />
                     ))}
                  </sidebar.SidebarMenu>
               </sidebar.SidebarGroupContent>
            </sidebar.SidebarGroup>
         </sidebar.SidebarContent>
      </sidebar.Sidebar>
   );
}

export function SidebarItem({ navLink }: { navLink: NavLink }) {
   if (navLink.subLinks)
      return (
         <Collapsible className="group/collapsible" translate="yes">
            <sidebar.SidebarGroup className="py-0 pl-0">
               <sidebar.SidebarMenuItem>
                  <sidebar.SidebarMenuButton asChild>
                     <CollapsibleTrigger className="ounded-sm">
                        {navLink.label}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                     </CollapsibleTrigger>
                  </sidebar.SidebarMenuButton>
               </sidebar.SidebarMenuItem>

               <CollapsibleContent>
                  <sidebar.SidebarGroupContent className="border-PRIMARY mt-2 ml-2 border-l pl-2">
                     {navLink.subLinks.map((subLink, subIndex) => (
                        <SidebarItem key={subIndex} navLink={subLink} />
                     ))}
                  </sidebar.SidebarGroupContent>
               </CollapsibleContent>
            </sidebar.SidebarGroup>
         </Collapsible>
      );

   return (
      <sidebar.SidebarMenuItem className="rounded-sm">
         <sidebar.SidebarMenuButton asChild>
            <Link to={"/services/rent-safe/" + navLink.path}>
               {/* <navLink.icon /> */}
               <span>{navLink.label}</span>
            </Link>
         </sidebar.SidebarMenuButton>
      </sidebar.SidebarMenuItem>
   );
}
