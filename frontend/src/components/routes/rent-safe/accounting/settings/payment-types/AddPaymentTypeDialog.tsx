import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import usePaymentTypesDialogue from "@/hooks/components/usePaymentTypesDialogue"

export default function AddPaymentTypeDialog() {
    const {
        open, 
        setOpen,
        type,
        setType
    } = usePaymentTypesDialogue()
    return (
        <Dialog
            open = {open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus size={15} />
                    Add payment type
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-md">
                <DialogHeader>
                   <DialogTitle>Add payment type</DialogTitle>
                    <DialogDescription>Add a new payment type.</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                    <Input
                        type="text"
                        value={type}
                        onChange={(e)=> setType(e.target.value)}
                        placeholder="e.g Swipe"
                    />
                    <Button className="w-full">Add type <Plus/></Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
