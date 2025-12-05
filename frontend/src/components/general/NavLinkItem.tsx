import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from "../ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useNavLinkItem from "@/hooks/components/useNavLinkItem";
import type { NavLink } from "@/types";
import { COLOR_THEMES } from "@/constants";

type NavLinkItemProps = {
   navLink: NavLink;
   expandedSegment: string;
   expandThisSegment: (id: string) => void;
   level?: number;
};

export default function NavLinkItem({ navLink, expandedSegment, expandThisSegment, level = 0 }: NavLinkItemProps) {
   const { isActive } = useNavLinkItem(navLink, expandedSegment, expandThisSegment);
   const hasSubLinks = navLink.subLinks && navLink.subLinks.length > 0;
   const [open, setOpen] = useState(false);
   const baseColor = COLOR_THEMES[navLink.baseColor as keyof typeof COLOR_THEMES] || COLOR_THEMES.default;
   if (hasSubLinks) {
      return (
         <Collapsible defaultOpen={false} className="group/collapsible" onOpenChange={setOpen}>
            <SidebarMenuItem>
               <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                     className={cn(
                        "text-md flex w-full items-center justify-between px-4 py-3 font-semibold",
                        baseColor?.hover ,
                        isActive && baseColor.active,
                        isActive ? baseColor.activeText : baseColor?.inactiveText,
                     )}
                  >
                     <span>{navLink.label}</span>
                     <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                  </SidebarMenuButton>
               </CollapsibleTrigger>

               <CollapsibleContent>
                  <SidebarMenuSub className="ml-3 border-l border-gray-300 pl-2 dark:border-white/30">
                     {navLink.subLinks!.map((subLink, index) => {
                        const hasNestedSubLinks = subLink.subLinks && subLink.subLinks.length > 0;
                        if (hasNestedSubLinks) {
                           return (
                              <NavLinkItem
                                 key={index}
                                 navLink={subLink}
                                 expandedSegment={expandedSegment}
                                 expandThisSegment={expandThisSegment}
                                 level={level + 1}
                              />
                           );
                        }
                        
                        return (
                           <SidebarMenuSubItem key={index}>
                              <Link
                                 to={subLink.path || "#"}
                                 className={cn(
                                    "block rounded px-3 py-2 text-sm",
                                    baseColor?.hover,
                                    subLink.path === location.pathname
                                       ? `${baseColor.active} ${baseColor.activeText}`
                                       : baseColor.inactiveText,
                                 )}
                              >
                                 {subLink.label}
                              </Link>
                           </SidebarMenuSubItem>
                        );
                     })}
                  </SidebarMenuSub>
               </CollapsibleContent>
            </SidebarMenuItem>
         </Collapsible>
      );
   }
   
   return (
      <SidebarMenuItem>
         <SidebarMenuButton
            asChild
            className={cn(
               "text-md px-4 py-3 font-medium",
               baseColor?.hover,
               isActive && baseColor.active,
               isActive ? baseColor.activeText : baseColor.inactiveText,
            )}
         >
            <Link to={navLink.path || "#"}>{navLink.label}</Link>
         </SidebarMenuButton>
      </SidebarMenuItem>
   );
}