import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";

export default function NavBar({ sidebarTrigger }: { sidebarTrigger?: React.ReactNode }) {
   return (
      <header className="flex items-center justify-between rounded-md p-2 shadow-md">
         {sidebarTrigger}
         <nav>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                     Hault Solutions <User />
                  </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                     <Link to="">Logout</Link>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </nav>
      </header>
   );
}
