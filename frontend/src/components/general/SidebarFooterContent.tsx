import { EllipsisVertical, LogOut, User } from "lucide-react";
import Button from "./Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "react-router";
import { removeCookie } from "typescript-cookie";
import useLogOut from "@/hooks/apiHooks/useLogOut";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import ButtonSpinner from "./ButtonSpinner";

interface SDFooter {
   username: string;
}

function SidebarFooterContent({ username }: SDFooter) {
   const navigate = useNavigate();
   const logout = useLogOut();
   const [onLogout, setOnLogout ] = useState(false)

   function logOut() {
      setOnLogout(true)
      logout.mutate(undefined, {
         onSuccess : ()=>{
            localStorage.clear();
            removeCookie("token");
            navigate("/");
         },
         onError : (error)=> {
            if(isAxiosError(error)){
               const message = error.response?.data.error ?? error.response?.data.error ?? "Something Went Wrong";
               toast.error("Error logging out", {description :message})
            }
         },
         onSettled : ()=> setOnLogout(false)
      })
     
   } 
   return (
      <HoverCard openDelay={0} closeDelay={100}>
         <HoverCardTrigger>
            <div className="p-2">
               <div className="flex cursor-pointer flex-row justify-between gap-3 border-t border-gray-300 pt-5 pb-2.5 text-gray-900 dark:border-zinc-900 dark:text-white">
                  <div className="flex flex-row gap-4">
                     <User className="self-center" size={18} />
                     <h6 className="">{username}</h6>
                  </div>
                  <div className="self-center">
                     <EllipsisVertical size={15} />
                  </div>
               </div>
            </div>
         </HoverCardTrigger>
         <HoverCardContent className="flex w-64 flex-col gap-2 border border-gray-300 bg-white p-2 text-gray-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100">
            <Button onClick={logOut} disabled = {onLogout} variant="danger" asChild>
               {
                  onLogout ?
                  <ButtonSpinner/> :
                  <LogOut size={18} />
               }
               Log out
            </Button>
         </HoverCardContent>
      </HoverCard>
   );
}

export default SidebarFooterContent;
