import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAddPropertyExpense from "@/hooks/components/useAddPropertyExpense"
import { Plus } from "lucide-react"

function AddPropertyListingDialogue() {
    const {open, setOpen, generalLedgerAccounts} = useAddPropertyExpense();
  return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
            <Button>
              <Plus/>
              Add Expense
            </Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Add Property expense</DialogTitle>
                <DialogDescription>Click submit when done filling the required fields.</DialogDescription>
            </DialogHeader>
            <form action=""  id="addExpense" className="mt-5 space-y-5">
                <div className="form-group">
                    <Label>Expense Name</Label>
                    <Input 
                        placeholder="Levy"
                        name="name" 
                    />
                </div>
                <div className="form-group">
                    <Label>General Ledger Account</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder= "Select ..." ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                generalLedgerAccounts.map((g, idx) => (
                                    <SelectItem key={idx} value={String(g.id)}>{g.account_sector.code } - {g.account_name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button form="addExpense">Submit</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddPropertyListingDialogue