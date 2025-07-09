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
import useNavLinkItem from "@/hooks/components/general/useNavLinkItem";
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
        <SidebarMenuButton>{navLink.label}</SidebarMenuButton>
        <SidebarMenuSub>
          {navLink.subLinks.map((sub, index) =>
            sub.subLinks && sub.subLinks.length > 0 ? (
              <SidebarMenuSubItem key={index}>
                <SidebarMenuSubButton>{sub.label}</SidebarMenuSubButton>
                <SidebarMenuSub>
                  {sub.subLinks.map((child, childIndex) => (
                    <SidebarMenuSubItem key={childIndex}>
                      <SidebarMenuSubButton asChild>
                        <Link to={child.path || "#"}>{child.label}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuSubItem>
            ) : (
              <SidebarMenuSubItem key={index}>
                <SidebarMenuSubButton asChild>
                  <Link to={sub.path || "#"}>{sub.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          )}
        </SidebarMenuSub>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem className={cn("transition-[font_weight] duration-75", isActive ? "font-bold" : "")}>
      <SidebarMenuButton asChild>
        <Link to={navLink.path || "#"}>{navLink.label}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
