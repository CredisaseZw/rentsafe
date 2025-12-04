import AddPropertyForm from "@/components/forms/AddPropertyForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription,DialogTitle, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import type { Property } from "@/types"
import { Plus } from "lucide-react"
import React, { useState } from "react"

interface props {
    trigger? : React.ReactNode
    property? : Property | null
}

function CreatePropertyDialogue({property, trigger}: props) {
    const [open, setOpen] = useState(false);
    return (
    <Dialog
        open = {open}
        onOpenChange={setOpen}
    >
        <DialogTrigger>
            {
                property
                ? trigger
            : <Button  className="flex flex-row gap-3">
                <Plus className="self-center" />
                <span className="self-center">Add Property</span>    
            </Button> 
            }
        </DialogTrigger>
        <DialogContent 
            onInteractOutside={(e)=> e.preventDefault()}
            className="sm:max-w-[900px] sm:max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Create property</DialogTitle>
                <DialogDescription>Provide the required details below, then select Save to continue.</DialogDescription>
            </DialogHeader>
            <AddPropertyForm
                property={property}
                successCallback={()=>setOpen(false)}
            />
        </DialogContent>
    </Dialog>
    )
}

export default CreatePropertyDialogue