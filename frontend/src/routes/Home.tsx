import Button from "@/components/general/Button";
import Logo from "@/components/general/Logo";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Home() {
   let navigate = useNavigate();

   let checkAuth = () => {
      let token = localStorage.getItem("token");

      try {
         let parsed_token = token ? JSON.parse(token) as { access_token?: string } : null;

         if (parsed_token?.access_token) {
            navigate("/services/rent-safe");
         } else {
            navigate("/login");
         }
      } catch (error) {
         navigate("/login");
      }
   };


   return (
      <div className="text-center">
      <div className="mb-5 pt-30">
        <Logo />
      </div>
      <div className="flex justify-center w-full">
        <Button onClick={checkAuth} className="flex flex-row gap-3">
          Login
          <LogIn />
        </Button>
      </div>
    </div>
   );
}
