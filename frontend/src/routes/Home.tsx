import Logo from "@/components/general/Logo";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
   
   return (
      <div className="text-center">
         <div className="mb-5 pt-30">
            <Logo />
         </div>

         <Button asChild size="sm">
            <Link to="/login">
               Login
               <LogIn />
            </Link>
         </Button>
      </div>
   );
}
