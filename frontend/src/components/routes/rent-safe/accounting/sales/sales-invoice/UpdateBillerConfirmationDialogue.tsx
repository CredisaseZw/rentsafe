import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useUpdateBillerDialog } from '@/hooks/components/useUpdateBillerConfirmation'

function UpdateBillerConfirmationDialogue() {
    const {
        dialogueStatus,
        updateStatus,
        onAccept,
        closeDialogue,
        onDecline
    } = useUpdateBillerDialog()
    return (
    <Dialog
        open={dialogueStatus}
    >
        <DialogContent
            onInteractOutside={(e)=>e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
        >
            <DialogHeader>
                <DialogTitle>Confirm Biller Update</DialogTitle>
                <DialogDescription className='mt-5'>
                    We detected changes to the biller information. Do you want to update it?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" type='button' onClick={() => onDecline()} disabled = {Boolean(updateStatus)}> Cancel </Button>
                <Button onClick={()=> closeDialogue()} variant={"outline"}>Edit Changes</Button>
                <Button onClick={() => onAccept()}  disabled = {Boolean(updateStatus)}>
                    {
                        Boolean(updateStatus) 
                        ? "Updating ..."
                        : "Confirm"
                    }
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}

export default UpdateBillerConfirmationDialogue