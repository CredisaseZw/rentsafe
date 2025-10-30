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
import type { Cashbook } from "@/types"
import EditIcon from "@/components/general/EditIcon"

interface props{
    initial? : Cashbook
}

function AddCashbookDialog({initial}:props) {
    const {
        open,
        setOpen
    } = useCashbooks()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            {
                initial 
                ?<EditIcon/>
                :<Button asChild className="self-center">Create cashbook <Plus size={15}/></Button>
            }
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]"  onInteractOutside={(event) => event.preventDefault()}>
            <DialogHeader>
            <DialogTitle>Create Cashbook</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-white/50">
                {initial ? "Update" : "Add"} a cashbook. {initial ? "MOdify" : "Fill"} out the details below and click submit when done.
            </DialogDescription>
            </DialogHeader>
            <div>
                <AddCashbookForm initial={initial}/>
            </div>
        </DialogContent>
        </Dialog>
  )
}

export default AddCashbookDialog