import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from "../ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useNavLinkItem from "@/hooks/components/useNavLinkItem";
import type { NavLink } from "@/types";

type NavLinkItemProps = {
   navLink: NavLink;
   expandedSegment: string;
   expandThisSegment: (id: string) => void;
};

export default function NavLinkItem({ navLink, expandedSegment, expandThisSegment }: NavLinkItemProps) {
   const { isActive } = useNavLinkItem(navLink, expandedSegment, expandThisSegment);
   const hasSubLinks = navLink.subLinks && navLink.subLinks.length > 0;
   const [open, setOpen] = useState(false);

   const activeClasses = "bg-gray-800 dark:bg-zinc-800";
   const inactiveTextClasses = "text-gray-800 dark:text-white";
   const activeTextClasses = "text-white hover:text-gray-800 hover:dark:text-white";
   const hoverClasses = "hover:bg-gray-200/90 hover:dark:bg-zinc-900";

   if (hasSubLinks) {
      return (
         <Collapsible defaultOpen={false} className="group/collapsible" onOpenChange={setOpen}>
            <SidebarMenuItem>
               <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                     className={cn(
                        "text-md flex w-full items-center justify-between px-4 py-3 font-medium",
                        hoverClasses,
                        isActive && activeClasses,
                        isActive ? activeTextClasses : inactiveTextClasses,
                     )}
                  >
                     <span>{navLink.label}</span>
                     <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                  </SidebarMenuButton>
               </CollapsibleTrigger>

               <CollapsibleContent>
                  <SidebarMenuSub className="ml-3 border-l border-gray-300 pl-2 dark:border-white/30">
                     {navLink.subLinks!.map((subLink, index) => (
                        <SidebarMenuSubItem key={index}>
                           <Link
                              to={subLink.path || "#"}
                              className={cn(
                                 "block rounded px-3 py-2 text-sm",
                                 hoverClasses,
                                 subLink.path === location.pathname
                                    ? `${activeClasses} ${activeTextClasses}`
                                    : inactiveTextClasses,
                              )}
                           >
                              {subLink.label}
                           </Link>
                        </SidebarMenuSubItem>
                     ))}
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
               hoverClasses,
               isActive && activeClasses,
               isActive ? activeTextClasses : inactiveTextClasses,
            )}
         >
            <Link to={navLink.path || "#"}>{navLink.label}</Link>
         </SidebarMenuButton>
      </SidebarMenuItem>
   );
}
