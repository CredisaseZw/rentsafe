import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import Button  from "@/components/general/Button"
import AddPropertyUnitForm from "@/components/forms/AddPropertyUnitForm"

interface CreateUnitDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateUnitDialog({open, setOpen}: CreateUnitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" className="self-center">Create Unit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]"  onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Unit</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-white/50">
            Add a new unit. Fill out the details below and click save when done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddPropertyUnitForm onSuccessCallback = {()=> setOpen(false)}/>
        </div>
      </DialogContent>
    </Dialog>
  )
}
