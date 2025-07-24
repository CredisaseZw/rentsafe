import {
   SidebarMenuItem,
   SidebarMenuButton,
   SidebarMenuSub,
   SidebarMenuSubItem,
   SidebarMenuSubButton,
} from "../ui/sidebar";
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

   if (navLink.subLinks && navLink.subLinks.length > 0) {
      return (
         <SidebarMenuItem>
            <SidebarMenuButton
               className={cn(
                  "text-md hover:bg-primary-dark data-[state=open]:bg-primary-dark py-4 font-medium text-white",
                  isActive && "bg-primary-dark",
               )}
            >
               {navLink.label}
            </SidebarMenuButton>

            <SidebarMenuSub className="ml-3 border-l border-white/40 pl-3">
               {navLink.subLinks.map((sub, index) => (
                  <SidebarMenuSubSub
                     key={index}
                     sub={sub}
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
         className={cn("transition-[font_weight] duration-75", isActive && "bg-primary-dark rounded-xl font-bold")}
      >
         <SidebarMenuButton asChild>
            <Link to={navLink.path || "#"}>{navLink.label}</Link>
         </SidebarMenuButton>
      </SidebarMenuItem>
   );
}

function SidebarMenuSubSub({
   sub,
   expandedSegment,
   expandThisSegment,
}: {
   sub: NavLink;
   expandedSegment: string;
   expandThisSegment: (id: string) => void;
}) {
   const { isActive: isSubActive } = useNavLinkItem(sub, expandedSegment, expandThisSegment);

   return sub.subLinks && sub.subLinks.length > 0 ? (
      <SidebarMenuSubItem>
         <SidebarMenuSubButton
            className={cn(
               "hover:bg-primary-dark py-4 font-bold text-white hover:text-white",
               isSubActive && "bg-primary-dark",
            )}
         >
            {sub.label}
         </SidebarMenuSubButton>

         <SidebarMenuSub className="ml-3 border-l border-white/40 pl-3">
            {sub.subLinks.map((child, childIndex) => (
               <SidebarMenuSubSubSub
                  key={childIndex}
                  child={child}
                  expandedSegment={expandedSegment}
                  expandThisSegment={expandThisSegment}
               />
            ))}
         </SidebarMenuSub>
      </SidebarMenuSubItem>
   ) : (
      <SidebarMenuSubItem>
         <SidebarMenuSubButton
            asChild
            className={cn(
               "text-md hover:bg-primary-dark py-4 font-medium text-white",
               isSubActive && "bg-primary-dark",
            )}
         >
            <Link to={sub.path || "#"}>{sub.label}</Link>
         </SidebarMenuSubButton>
      </SidebarMenuSubItem>
   );
}

function SidebarMenuSubSubSub({
   child,
   expandedSegment,
   expandThisSegment,
}: {
   child: NavLink;
   expandedSegment: string;
   expandThisSegment: (id: string) => void;
}) {
   const { isActive: isChildActive } = useNavLinkItem(child, expandedSegment, expandThisSegment);

   return (
      <SidebarMenuSubItem>
         <SidebarMenuSubButton
            asChild
            className={cn(
               "hover:bg-primary-dark py-4 font-normal text-white hover:text-white",
               isChildActive && "bg-primary-dark",
            )}
         >
            <Link to={child.path || "#"}>{child.label}</Link>
         </SidebarMenuSubButton>
      </SidebarMenuSubItem>
   );
}
