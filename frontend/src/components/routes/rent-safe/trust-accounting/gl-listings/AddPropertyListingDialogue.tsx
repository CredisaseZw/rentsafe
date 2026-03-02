import ButtonSpinner from "@/components/general/ButtonSpinner"
import SearchSubTrustGeneralLedger from "@/components/general/SearchSubTrustGeneralLedger"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAddPropertyExpense from "@/hooks/apiHooks/useAddPropertyExpense"
import useAddPropertyExpenseDialogue from "@/hooks/components/useAddPropertyExpenseDialogue"
import type { PropertyExpense } from "@/interfaces"
import { Edit, Plus } from "lucide-react"

function AddPropertyListingDialogue({propertyExpense}: {propertyExpense?:PropertyExpense}) {
    const {
        open, 
        loading,
        defaultValue,
        setOpen,
        onSubmit,
        onSelectAccount,
    } = useAddPropertyExpenseDialogue(propertyExpense);
    const {mutate} = useAddPropertyExpense();
    return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
            {
                propertyExpense 
                ? <Button>
                    <Edit/>
                    Edit
                </Button>
                : <Button>
                    <Plus/>
                    Add Expense
                </Button>
            }
        </DialogTrigger>

        <DialogContent onInteractOutside={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Add Property expense</DialogTitle>
                <DialogDescription>Click submit when done filling the required fields.</DialogDescription>
            </DialogHeader>
            <form id="addExpense" className="mt-5 space-y-5"
                onSubmit={(e)=>{
                    e.preventDefault()
                    onSubmit(e, mutate)
                }}
            >
                <div className="form-group">
                    <Label className="required">Expense Name</Label>
                    <Input 
                        defaultValue={propertyExpense?.expense ?? ""}
                        required
                        placeholder="Levy"
                        name="expense_name" 
                    />
                </div>
                <SearchSubTrustGeneralLedger
                    defaultValue = {defaultValue}
                    onSelectAccount={onSelectAccount}
                />
            </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button form="addExpense" disabled = {loading}>
                    {
                        loading 
                        ?  <ButtonSpinner/>
                        : "Submit"
                    }
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddPropertyListingDialogue