import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSalesItemForm from "@/components/forms/AddSalesItemForm";
import type { SalesItem } from "@/types";
import EditIcon from "@/components/general/EditIcon";
import { useState } from "react";

interface props{
    initial? :  SalesItem | undefined
}
function AddSaleItemDialogue({initial}:props) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger>
                {
                    initial 
                    ? <EditIcon/>
                    : <Button>Add Sale Item <Plus/></Button> 
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Add Sale Item</DialogTitle>
                </DialogHeader>
                <div>
                    <AddSalesItemForm
                        successCallBack = {()=> setOpen(false)}    
                        initial={initial}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddSaleItemDialogue;