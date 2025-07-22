import {
  SidebarMenu,
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

export default function NavLinkItem({
  navLink,
  expandedSegment,
  expandThisSegment,
}: NavLinkItemProps) {
  const { isActive } = useNavLinkItem(navLink, expandedSegment, expandThisSegment);

  if (navLink.subLinks && navLink.subLinks.length > 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn(
            "py-4 font-medium text-md text-white hover:bg-primary-dark data-[state=open]:bg-primary-dark",
            isActive && "bg-primary-dark"
          )}
        >
          {navLink.label}
        </SidebarMenuButton>

        <SidebarMenuSub className="border-l border-white/40 ml-3 pl-3">
          {navLink.subLinks.map((sub, index) => {
            const { isActive: isSubActive } = useNavLinkItem(sub, expandedSegment, expandThisSegment);

            return sub.subLinks && sub.subLinks.length > 0 ? (
              <SidebarMenuSubItem key={index}>
                <SidebarMenuSubButton
                  className={cn(
                    "py-4 font-bold text-white hover:text-white hover:bg-primary-dark",
                    isSubActive && "bg-primary-dark"
                  )}
                >
                  {sub.label}
                </SidebarMenuSubButton>

                <SidebarMenuSub className="border-l border-white/40 ml-3 pl-3">
                  {sub.subLinks.map((child, childIndex) => {
                    const { isActive: isChildActive } = useNavLinkItem(child, expandedSegment, expandThisSegment);

                    return (
                      <SidebarMenuSubItem key={childIndex}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "py-4 font-normal text-white hover:text-white hover:bg-primary-dark",
                            isChildActive && "bg-primary-dark"
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
                    "py-4 font-medium text-md text-white hover:bg-primary-dark",
                    isSubActive && "bg-primary-dark"
                  )}
                >
                  <Link to={sub.path || "#"}>{sub.label}</Link>
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
        "transition-[font_weight] duration-75",
        isActive && "font-bold bg-primary-dark rounded-xl"
      )}
    >
      <SidebarMenuButton asChild>
        <Link to={navLink.path || "#"}>{navLink.label}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
