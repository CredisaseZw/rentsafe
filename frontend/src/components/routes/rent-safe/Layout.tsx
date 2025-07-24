import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Layout() {
   const { theme, setTheme } = useTheme();

   const switchTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
   };

   return (
      <div className = "bg-gray-200 dark:bg-black">
         <SidebarProvider>
            <Sidebar />
            <div className="main w-full">
               <div className="side-main bg-white dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-800 flex justify-end">
                  {theme === "dark" ? (
                     <Sun onClick={switchTheme} className="cursor-pointer" />
                  ) : (
                     <Moon onClick={switchTheme} className="cursor-pointer" />
                  )}
               </div>
               <div className="side-main">
                  <Outlet />
               </div>
            </div>
         </SidebarProvider>
      </div>
   );
}
