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
                  "text-md data-[state=open]:bg-primary-dark p-5 py-4 font-medium hover:bg-gray-200/90 hover:dark:bg-zinc-900",
                  isActive && "bg-gray-800 dark:bg-zinc-800",
                  !isActive ? "text-gray-800 dark:text-white" : "text-white hover:text-gray-800 hover:dark:text-white",
               )}
            >
               {navLink.label}
            </SidebarMenuButton>

            <SidebarMenuSub className="ml-3 border-l border-gray-800 pl-3 dark:border-white/40">
               {navLink.subLinks.map((sub, index) => {
                  const { isActive: isSubActive } = useNavLinkItem(sub, expandedSegment, expandThisSegment);

                  return sub.subLinks && sub.subLinks.length > 0 ? (
                     <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton
                           className={cn(
                              "hover:bg-gray-200/90 hover:dark:bg-zinc-900",
                              "py-4 font-bold",
                              isSubActive && "bg-gray-900 dark:bg-zinc-900",
                              !isSubActive
                                 ? "text-gray-800 dark:text-white"
                                 : "text-white hover:text-gray-800 hover:dark:text-white",
                           )}
                        >
                           {sub.label}
                        </SidebarMenuSubButton>

                        <SidebarMenuSub className="ml-3 border-l border-gray-800 pl-3 dark:border-white/40">
                           {sub.subLinks.map((child, childIndex) => {
                              const { isActive: isChildActive } = useNavLinkItem(
                                 child,
                                 expandedSegment,
                                 expandThisSegment,
                              );

                              return (
                                 <SidebarMenuSubItem key={childIndex}>
                                    <SidebarMenuSubButton
                                       asChild
                                       className={cn(
                                          "hover:bg-gray-200/90 hover:dark:bg-zinc-900",
                                          "py-4 font-normal text-white hover:text-white",
                                          isChildActive && "bg-gray-900 dark:bg-zinc-900",
                                          !isChildActive
                                             ? "text-gray-800 dark:text-white"
                                             : "text-white hover:text-gray-800 hover:dark:text-white",
                                       )}
                                    >
                                       <Link to={child.path || "#"}>{child.label}</Link>
                                    </SidebarMenuSubButton>
                                 </SidebarMenuSubItem>
                              );
                           })}
                        </SidebarMenuSub>
                     </SidebarMenuSubItem>
                  ) : (
                     <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton
                           asChild
                           className={cn(
                              "text-md py-4 font-medium hover:bg-gray-200/90 hover:dark:bg-zinc-900",
                              isSubActive && "bg-gray-900 dark:bg-zinc-900",
                              !isSubActive
                                 ? "text-gray-800 dark:text-white"
                                 : "text-white hover:text-gray-800 hover:dark:text-white",
                           )}
                        >
                           <Link className="" to={sub.path || "#"}>
                              {sub.label}
                           </Link>
                        </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                  );
               })}
            </SidebarMenuSub>
         </SidebarMenuItem>
      );
   }

   return (
      <SidebarMenuItem
         className={cn(
            "hover:bg-gray-200/90 hover:dark:bg-zinc-900",
            "transition-[font_weight] duration-75",
            isActive && "rounded-xl bg-gray-800 font-bold dark:bg-zinc-800",
            !isActive ? "text-gray-800 dark:text-white" : "text-white hover:text-gray-800 hover:dark:text-white",
         )}
      >
         <SidebarMenuButton asChild>
            <Link to={navLink.path || "#"}>{navLink.label}</Link>
         </SidebarMenuButton>
      </SidebarMenuItem>
   );
}
