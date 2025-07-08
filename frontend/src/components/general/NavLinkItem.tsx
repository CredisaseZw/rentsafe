import { SidebarGroup, SidebarGroupContent, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import useNavLinkItem from "@/hooks/components/general/useNavLinkItem";
import type { NavLink } from "@/types";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

type NavLinkItemProps = {
   navLink: NavLink;
   expandedSegment: string;
   expandThisSegment: (id: string) => void;
};

export default function NavLinkItem({ navLink, expandedSegment, expandThisSegment }: NavLinkItemProps) {
   const { isActive, isOpen, handleOpenChange } = useNavLinkItem(navLink, expandedSegment, expandThisSegment);

   if (navLink.subLinks) {
      return (
         <Collapsible open={isOpen} onOpenChange={handleOpenChange} className="group/collapsible" translate="yes">
            <SidebarGroup className="py-0 pl-0">
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <CollapsibleTrigger className="ounded-sm">
                        {navLink.label}
                        <ChevronDown
                           className={cn("ml-auto transition-transform", isOpen ? "rotate-180" : "rotate-0")}
                        />
                     </CollapsibleTrigger>
                  </SidebarMenuButton>
               </SidebarMenuItem>

               <CollapsibleContent>
                  <SidebarGroupContent className={"c_border_markers border-foreground/50 mt-2 ml-2 border-l pl-2"}>
                     {navLink.subLinks.map((subLink, subIndex) => (
                        <NavLinkItem
                           key={subIndex}
                           navLink={subLink}
                           expandedSegment={expandedSegment}
                           expandThisSegment={expandThisSegment}
                        />
                     ))}
                  </SidebarGroupContent>
               </CollapsibleContent>
            </SidebarGroup>
         </Collapsible>
      );
   } else {
      return (
         <SidebarMenuItem className={cn("transition-[font_weight] duration-75", isActive ? "font-bold" : "")}>
            <SidebarMenuButton asChild>
               <Link to={navLink.path || ""}>
                  {/* <navLink.icon /> */}
                  <span>{navLink.label}</span>
               </Link>
            </SidebarMenuButton>
         </SidebarMenuItem>
      );
   }
}
