import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from "../ui/sidebar";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
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
   const activeClasses = "bg-gray-800 dark:bg-zinc-800";
   const inactiveTextClasses = "text-gray-800 dark:text-white";
   const activeTextClasses = "text-white hover:text-gray-800 hover:dark:text-white";
   const hoverClasses = "hover:bg-gray-200/90 hover:dark:bg-zinc-900 rounded";

   if (hasSubLinks) {
      return (
         <SidebarMenuItem>
            <SidebarMenuButton
               className={cn(
                  "text-md p-5 py-4 font-medium",
                  hoverClasses,
                  isActive && activeClasses,
                  isActive ? activeTextClasses : inactiveTextClasses,
               )}
            >
               {navLink.label}
            </SidebarMenuButton>

            <SidebarMenuSub className="ml-3 border-l border-gray-800 pl-3 dark:border-white/40">
               {navLink.subLinks!.map((subLink, index) => (
                  <NavLinkItem
                     key={index}
                     navLink={subLink}
                     expandedSegment={expandedSegment}
                     expandThisSegment={expandThisSegment}
                  />
               ))}
            </SidebarMenuSub>
         </SidebarMenuItem>
      );
   }
   return (
      <SidebarMenuItem
         className={cn(
            hoverClasses,
            "transition-[font_weight] duration-75",
            isActive && "rounded-xl font-bold",
            isActive ? activeClasses : "",
            isActive ? activeTextClasses : inactiveTextClasses,
         )}
      >
         <SidebarMenuButton asChild className={cn(hoverClasses)}>
            <Link to={navLink.path || "#"}>{navLink.label}</Link>
         </SidebarMenuButton>
      </SidebarMenuItem>
   );
}
