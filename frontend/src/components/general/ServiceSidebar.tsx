import {
  Sidebar,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarFooter,
} from "../ui/sidebar";
import { HomeIcon, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import NavLinkItem from "./NavLinkItem";
import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // ShadCN
import type { NavLink } from "@/types";

type SidebarProps = {
  title?: string;
  rentsafeAppNavlinks: NavLink[];
  rentsafeAccountingNavlinks: NavLink[];
  rentsafeAdminPanelNavlinks: NavLink[];
};

export default function ServiceSidebar({
  title,
  rentsafeAppNavlinks,
  rentsafeAccountingNavlinks,
  rentsafeAdminPanelNavlinks,
}: SidebarProps) {
  const [expandedSegment, expandThisSegment] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [openApp, setOpenApp] = useState(true);
  const [openAccounting, setOpenAccounting] = useState(true);
  const [openAdmin, setOpenAdmin] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      try {
        let parsedToken = JSON.parse(token);
        setUsername(parsedToken.username);
      } catch {
        console.log("Error parsing token");
      }
    }
  }, []);

  return (
    <Sidebar className="bg-PRIMARY text-white border-r border-white/10 w-[300px]">
      <SidebarContent>
        <div className="px-5 pt-5">
          <div className="bg-primary-dark rounded-xl p-5 flex items-center gap-2">
            <div className="bg-white text-[#0d475c] p-2 rounded-[7.5px]">
              <HomeIcon size={22} />
            </div>
            <span className="text-xl font-bold">Rentsafe</span>
          </div>
        </div>

        {/* APPLICATION */}
        <SidebarGroup>
          <Collapsible open={openApp} onOpenChange={setOpenApp}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex justify-between items-center cursor-pointer text-blue-100 sidebar-labels">
                APPLICATION
                <ChevronDown className={`transition-transform ${openApp ? "rotate-180" : ""}`} size={16} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {rentsafeAppNavlinks.map((navLink, index) => (
                    <NavLinkItem
                      key={index}
                      navLink={navLink}
                      expandedSegment={expandedSegment}
                      expandThisSegment={expandThisSegment}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* ACCOUNTING */}
        <SidebarGroup>
          <Collapsible open={openAccounting} onOpenChange={setOpenAccounting}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex justify-between items-center cursor-pointer text-blue-100 sidebar-labels">
                Accounting
                <ChevronDown className={`transition-transform ${openAccounting ? "rotate-180" : ""}`} size={16} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {rentsafeAccountingNavlinks.map((navLink, index) => (
                    <NavLinkItem
                      key={index}
                      navLink={navLink}
                      expandedSegment={expandedSegment}
                      expandThisSegment={expandThisSegment}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* ADMIN */}
        <SidebarGroup>
          <Collapsible open={openAdmin} onOpenChange={setOpenAdmin}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex justify-between items-center cursor-pointer text-blue-100 sidebar-labels">
                Admin
                <ChevronDown className={`transition-transform ${openAdmin ? "rotate-180" : ""}`} size={16} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {rentsafeAdminPanelNavlinks.map((navLink, index) => (
                    <NavLinkItem
                      key={index}
                      navLink={navLink}
                      expandedSegment={expandedSegment}
                      expandThisSegment={expandThisSegment}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <div className="p-2">
          <div className="flex p-3 flex-row justify-center align-center bg-primary-dark rounded-xl text-white gap-3">
            <User className="self-center" size={18} />
            <h6>{username}</h6>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
