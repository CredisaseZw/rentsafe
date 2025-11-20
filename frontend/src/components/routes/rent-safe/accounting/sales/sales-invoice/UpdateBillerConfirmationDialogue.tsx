import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useUpdateBillerDialog } from '@/hooks/components/useUpdateBillerConfirmation'

function UpdateBillerConfirmationDialogue() {
    const {
        dialogueStatus,
        updateStatus,
        openDialogue,
        onAccept,
        onDecline
    } = useUpdateBillerDialog()
    return (
    <Dialog
        open={dialogueStatus}
        onOpenChange={(open) => (open ? openDialogue() : onDecline())}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Biller Update</DialogTitle>
                <DialogDescription>
                    We detected changes to the biller information. Do you want to update it?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => onDecline()}>
                    Cancel
                </Button>
                <Button onClick={() => onAccept()} disabled = {Boolean(updateStatus)}>
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