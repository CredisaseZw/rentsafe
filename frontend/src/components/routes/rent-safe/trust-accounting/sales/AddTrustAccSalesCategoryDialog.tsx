import CustomDialogFooter from "@/components/general/CustomDialogFooter"
import EditTrigger from "@/components/general/EditTrigger"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DIALOG_DESCRIPTION } from "@/constants"
import useAddTrustAccSalesCategoryDialog from "@/hooks/components/useAddTrustAccSalesCategoryDialog"
import type { Category } from "@/types"
import { Plus } from "lucide-react"

interface props {
    category?: Category
}
function AddTrustAccSalesCategoryDialog({category}:props) { 
    const {
        form,
        open,
        loading,
        onHandleFormChange,
        onSubmit,
        setOpen
    } = useAddTrustAccSalesCategoryDialog(category)
    return (
        <Dialog 
            open = {open}
            onOpenChange={setOpen}
        >
            <DialogTrigger>
                {
                    category 
                    ?<EditTrigger/>
                    : <Button>
                        <Plus/>
                        Add Category
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "update" : "Create new "} category</DialogTitle>
                    <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-5" id="add-trust-acc-category" onSubmit={(p)=>{ p.preventDefault(); onSubmit()}}>
                    <div className="form-group">
                        <Label className="required">Name</Label>
                        <Input
                            required
                            value={form.name}
                            onChange={e => onHandleFormChange("name", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <Label className="required">Code</Label>
                        <Input
                            required
                            value={form.code}
                            onChange={e => onHandleFormChange("code", e.target.value)}
                        />
                    </div>
                </form>

                <CustomDialogFooter
                    loading = {loading}
                    form="add-trust-acc-category"
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddTrustAccSalesCategoryDialog