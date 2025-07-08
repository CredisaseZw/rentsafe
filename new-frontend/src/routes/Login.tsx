import Logo from "@/components/general/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router";

export default function Login() {
   return (
      <div className="from-PRIMARY to-SECONDARY flex min-h-screen items-center justify-center bg-gradient-to-br">
         <div className="border-foreground/50 flex min-h-[500px] w-full max-w-[500px] flex-col items-center justify-center gap-3 rounded-3xl border bg-white/90 p-5 shadow-lg backdrop-blur-3xl">
            <Logo />
            <h2 className="mb-4 text-center text-lg">Login to proceed</h2>

            <Input
               className="border-foreground/50 max-w-[300px] bg-white"
               placeholder="Email"
               type="email"
               autoComplete="email"
               required
               name="email"
            />

            <Input
               className="border-foreground/50 max-w-[300px] bg-white"
               placeholder="Password"
               type="password"
               required
               name="password"
            />

            <div className="mt-5 flex w-full max-w-[300px] items-end justify-between">
               <Link to="" className="text-PRIMARY text-sm font-semibold">
                  Forgot Password?
               </Link>

               <Button variant="secondary" asChild>
                  <Link to="/services">
                     Login <LogInIcon />
                  </Link>
               </Button>
            </div>
         </div>
      </div>
   );
}
