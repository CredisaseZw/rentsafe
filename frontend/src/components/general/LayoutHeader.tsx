import { useTheme } from "next-themes";
import { Moon, PanelLeftClose, Sun } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

function LayoutHeader() {
   const { theme, setTheme } = useTheme();
   const { open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();

   const switchTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
   };

   const toggleSidebar = () => {
      if (isMobile) {
         setOpenMobile(!openMobile);
      } else {
         setOpen(!open);
      }
   };

   return (
      <div className="side-main flex justify-between border-b border-gray-300 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300">
         <PanelLeftClose onClick={toggleSidebar} className="cursor-pointer" />
         {theme === "dark" ? (
            <Sun onClick={switchTheme} className="cursor-pointer text-gray-500 dark:text-gray-300" />
         ) : (
            <Moon onClick={switchTheme} className="cursor-pointer text-gray-500 dark:text-gray-300" />
         )}
      </div>
   );
}

export default LayoutHeader;
