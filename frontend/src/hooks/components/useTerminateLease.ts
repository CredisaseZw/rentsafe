import type { UseMutationResult } from "@tanstack/react-query"
import { isAxiosError } from "axios";
import { useState } from "react"
import { toast } from "sonner";

export default function useTerminateLeaseHook(refetch : ()=>void){
    const [reason, setReason] =useState("");
    const [open , setOpen] = useState(false);
    const [terminateStatus, setTerminateStatus] = useState({
        loading :false,
        error :false
    })

    function terminateLease(terminate: UseMutationResult<any, Error, any, unknown>){
      const today = new Date();
      const formatted = today.toISOString().split("T")[0];
      setTerminateStatus((p)=> ({...p, loading: true}))
      terminate.mutate({
        "termination_date": formatted,
        "reason": reason.trim()
      }, {
      onSuccess : ()=> {
        toast.success("Lease termination successful")
        refetch()
        setOpen(false);  
      },
      onError : (error)=>{
        console.error(error)
        if(isAxiosError(error)){
          const message = error.response?.data.error
          toast.error("Failed to terminate lease", {description : message || "Something went wrong"} )
        }
      },
      onSettled :()=>{
        setTerminateStatus(()=> ({error: false, loading: false}))
      }
      }
    )
      
    }
    
    return {
        reason,
        open,
        terminateStatus,
        setOpen,
        setReason,
        terminateLease
    }
}