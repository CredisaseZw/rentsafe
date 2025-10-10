import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import Button  from "@/components/general/Button"
import { Plus } from "lucide-react"
import useCashbooks from "@/hooks/components/useCashbooks"
import AddCashbookForm from "@/components/forms/AddCashbookForm"

function AddCashbookDialog() {
    const {
        open,
        setOpen
    } = useCashbooks()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button asChild className="self-center">Create cashbook <Plus size={15}/></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]"  onInteractOutside={(event) => event.preventDefault()}>
            <DialogHeader>
            <DialogTitle>Create Cashbook</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-white/50">
                Add a cashbook. Fill out the details below and click submit when done.
            </DialogDescription>
            </DialogHeader>
            <div>
                <AddCashbookForm/>
            </div>
        </DialogContent>
        </Dialog>
  )
}

export default AddCashbookDialog