import { getCurrentDate, handleAxiosError } from "@/lib/utils";
import type { UseMutationResult } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner";
import useClient from "../general/useClient";

export default function useTerminateLeaseHook(refetch : ()=>void){
  const [reason, setReason] =useState("");
  const [open , setOpen] = useState(false);
  const client = useClient();
  const [terminateStatus, setTerminateStatus] = useState({
      loading :false,
      error :false
  })

  function terminateLease(terminate: UseMutationResult<any, Error, any, unknown>){
    const formatted = getCurrentDate();
    if(reason.trim().length === 0) return toast.error("Failed to terminate lease", {description : "Reason for termination required"})
    
    setTerminateStatus((p)=> ({...p, loading: true}))
    terminate.mutate({
      "termination_date": formatted,
      "reason": reason.trim()
    }, {
    onSuccess : ()=> {
      toast.success("Lease termination successful")
      client.invalidateQueries({queryKey : ["leases",1,"TERMINATED"]})
      refetch()
      setOpen(false);  
    },
    onError : (error)=>{handleAxiosError("Failed to terminate lease", error)},
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