import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSalesItemForm from "@/components/forms/AddSalesItemForm";

function AddSaleItemDialogue() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Sale Item <Plus/></Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Add Sale Item</DialogTitle>
                </DialogHeader>
                <div>
                    <AddSalesItemForm/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddSaleItemDialogue;