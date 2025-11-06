import { getCurrentDate, handleAxiosError } from "@/lib/utils";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react"
import { toast } from "sonner";

export default function useRenewLease(
    lease_id: string,
    refetch:() => void,
    renew: UseMutationResult<any, Error, {
    leaseID: string;
    data: any;
}, unknown>
){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [date,setDate] = useState("")

    const patch =() =>{
        if (!date) return toast.error("Date error", {description : "Please provide a date"})
        if (new Date(date) < new Date(getCurrentDate())) return toast.error("Date error", {description : "Please provide a valid date"})
        
        setLoading(true);
        renew.mutate({
            leaseID : lease_id,
            data : { end_date : date }
            },{
            onSuccess : ()=>{
                refetch()
                toast.success("Lease renewed successfully");
                setOpen(false);
            },
            onError : (error)=>{handleAxiosError("Renewal Error", error);},
            onSettled : ()=> setLoading(false)
        })
    }
    renew
    return {
        date,
        open,
        loading,
        setDate,
        setOpen,
        patch,
    }
}