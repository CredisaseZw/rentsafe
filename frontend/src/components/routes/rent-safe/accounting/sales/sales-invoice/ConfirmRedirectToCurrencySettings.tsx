import { Button } from "@/components/ui/button"
import { Dialog, DialogTitle,DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { RENTSAFE_PRE_SEG } from "@/constants/navlinks"
import type { Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router"

interface props {
    to : string | undefined
    open : boolean
    from : string
    setOpen: Dispatch<SetStateAction<boolean>>
}

function ConfirmRedirectToCurrencySettings({from, to, open, setOpen} : props) {
    const navigate = useNavigate();
    const onConfirm = () => navigate(`${RENTSAFE_PRE_SEG}/settings/currency`);

    return (
    <Dialog open = {open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>No currency setting found</DialogTitle>
                <DialogDescription>No currency setting found for converting from {from} to {to ?? "-"}. Do you wish to add one?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose>
                    <Button variant={"outline"}>No</Button>
                </DialogClose>
                <Button onClick={onConfirm}>Yes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ConfirmRedirectToCurrencySettings