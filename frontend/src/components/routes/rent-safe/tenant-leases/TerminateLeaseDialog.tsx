import Button from "@/components/general/Button"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import useTerminateLease from "@/hooks/apiHooks/useTerminateLease"
import useTerminateLeaseHook from "@/hooks/components/useTerminateLease"
import { XCircle } from "lucide-react"

interface props{
    refetch : ()=> void;
    tenantName: string,
    lease_id : string 
}
function TerminateLeaseDialog({tenantName, lease_id, refetch}:props) {
    const {
        terminateStatus,
        reason,
        setReason,
        open,
        setOpen,
        terminateLease,
    } = useTerminateLeaseHook(refetch)
    const terminate = useTerminateLease(lease_id)
   
    return (
        <AlertDialog open = {open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <div className="flex items-center justify-center py-2">
                    <span className="text-white">Terminate</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-white">
                    <p>
                        Are you sure you want to terminate lease for {tenantName}? This action cannot be undone.
                    </p>
                    <div className="form-group mt-5">
                        <Textarea placeholder="Reason of termination" value={reason} onChange={(e)=> setReason(e.target.value)}></Textarea>
                    </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex w-full flex-row justify-end gap-3">
                        <Button variant="outline" onClick={()=> setOpen(false)}>Cancel</Button>
                        <Button variant="danger" asChild onClick={()=> terminateLease(terminate)} disabled = {terminateStatus.loading}>
                            <XCircle/>
                            {
                                terminateStatus.loading ?
                                <ButtonSpinner/> :
                                "Terminate"
                            }
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
  )
}

export default TerminateLeaseDialog