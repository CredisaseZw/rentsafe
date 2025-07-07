import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import * as sidebar from "@/components/ui/sidebar";
import { RENTSAFE_NAVLINKS } from "@/constants/routes";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router";

export default function Sidebar() {
   return (
      <sidebar.Sidebar variant="floating" className="">
         <sidebar.SidebarHeader>
            <h2 className="flex items-center gap-2 text-xl font-bold">
               <Button variant="outline" size="icon_sm" asChild>
                  <Link to="/services">
                     <ArrowLeft />
                  </Link>
               </Button>
               Rentsafe
            </h2>
         </sidebar.SidebarHeader>

         <sidebar.SidebarContent>
            <sidebar.SidebarGroup>
               <sidebar.SidebarGroupContent>
                  <sidebar.SidebarMenu>
                     {RENTSAFE_NAVLINKS.map((navLink, index) =>
                        navLink.subLinks ? (
                           <Collapsible key={index} className="group/collapsible" translate="yes">
                              <sidebar.SidebarGroup className="p-0">
                                 <sidebar.SidebarMenuItem>
                                    <sidebar.SidebarMenuButton asChild>
                                       <CollapsibleTrigger className="rounded-sm">
                                          {navLink.label}
                                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                       </CollapsibleTrigger>
                                    </sidebar.SidebarMenuButton>
                                 </sidebar.SidebarMenuItem>

                                 <CollapsibleContent>
                                    <sidebar.SidebarGroupContent className="bg-foreground/5 border-foreground/20 mt-2 rounded-sm border">
                                       {navLink.subLinks.map((subLink, subIndex) => (
                                          <sidebar.SidebarMenuItem key={subIndex}>
                                             <sidebar.SidebarMenuButton asChild>
                                                <Link to={"/services/rent-safe/" + subLink.path}>
                                                   {/* <subLink.icon /> */}
                                                   <span>{subLink.label}</span>
                                                </Link>
                                             </sidebar.SidebarMenuButton>
                                          </sidebar.SidebarMenuItem>
                                       ))}
                                    </sidebar.SidebarGroupContent>
                                 </CollapsibleContent>
                              </sidebar.SidebarGroup>
                           </Collapsible>
                        ) : (
                           <sidebar.SidebarMenuItem key={index} className="rounded-sm">
                              <sidebar.SidebarMenuButton asChild>
                                 <Link to={"/services/rent-safe/" + navLink.path}>
                                    {/* <navLink.icon /> */}
                                    <span>{navLink.label}</span>
                                 </Link>
                              </sidebar.SidebarMenuButton>
                           </sidebar.SidebarMenuItem>
                        ),
                     )}
                  </sidebar.SidebarMenu>
               </sidebar.SidebarGroupContent>
            </sidebar.SidebarGroup>
         </sidebar.SidebarContent>
      </sidebar.Sidebar>
   );
}
