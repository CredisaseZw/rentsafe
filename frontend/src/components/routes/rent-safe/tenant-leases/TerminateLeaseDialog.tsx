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
    id : number 
}
function TerminateLeaseDialog({tenantName, id, refetch}:props) {
    const {
        terminateStatus,
        open,
        setOpen,
        terminateLease,
    } = useTerminateLeaseHook(refetch)
    const terminate = useTerminateLease(id)
   
    return (
        <AlertDialog open = {open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <div className="flex items-center justify-center">
                    <Button variant={"ghost"} className="text-white">Terminate</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to terminate lease for {tenantName}? This action cannot be undone.
                    <div className="form-group mt-1">
                        <Textarea placeholder="Reason of termination"></Textarea>
                    </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex w-full flex-row justify-end gap-3">
                        <Button variant="outline" onClick={()=> setOpen(false)}>Cancel</Button>
                        <Button variant="danger" asChild onClick={()=> terminateLease(terminate)}>
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