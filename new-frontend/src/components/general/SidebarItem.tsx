import { SidebarGroup, SidebarGroupContent, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { NavLink } from "@/types";
import { Link } from "react-router";

export default function SidebarItem({ navLink }: { navLink: NavLink }) {
   if (navLink.subLinks) {
      return (
         <Collapsible className="group/collapsible" translate="yes">
            <SidebarGroup className="py-0 pl-0">
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <CollapsibleTrigger className="ounded-sm">
                        {navLink.label}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                     </CollapsibleTrigger>
                  </SidebarMenuButton>
               </SidebarMenuItem>

               <CollapsibleContent>
                  <SidebarGroupContent className="border-PRIMARY mt-2 ml-2 border-l pl-2">
                     {navLink.subLinks.map((subLink, subIndex) => (
                        <SidebarItem key={subIndex} navLink={subLink} />
                     ))}
                  </SidebarGroupContent>
               </CollapsibleContent>
            </SidebarGroup>
         </Collapsible>
      );
   } else {
      return (
         <SidebarMenuItem className="rounded-sm">
            <SidebarMenuButton asChild>
               <Link to={("/services/rent-safe/" + navLink.path).replace("//", "/")}>
                  {/* <navLink.icon /> */}
                  <span>{navLink.label}</span>
               </Link>
            </SidebarMenuButton>
         </SidebarMenuItem>
      );
   }
}
