import CustomDialogFooter from "@/components/general/CustomDialogFooter"
import EditTrigger from "@/components/general/EditTrigger"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DIALOG_DESCRIPTION } from "@/constants"
import type { Category } from "@/types"
import { Plus } from "lucide-react"

interface props {
    category?: Category
}
function AddTrustAccSalesCategoryDialog({category}:props) { 
    return (
        <Dialog>
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
            <DialogContent className="md:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{category ? "update" : "Create new "} category</DialogTitle>
                    <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
                </DialogHeader>

                <form id="add-trust-acc-category">

                </form>

                <CustomDialogFooter
                    form="add-trust-acc-category"
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddTrustAccSalesCategoryDialog