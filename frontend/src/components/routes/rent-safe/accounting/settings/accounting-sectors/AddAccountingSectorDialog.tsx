import  Button  from "@/components/general/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
Dialog,
DialogTrigger,
DialogContent,
DialogHeader,
DialogTitle,
DialogDescription,
} from "@/components/ui/dialog";
import ColumnsContainer from "@/components/general/ColumnsContainer";
import { Plus } from "lucide-react";
import useAddAccountingSectorDialog from "@/hooks/components/useAddAccountingSectorDialog";
import type { AccountSector } from "@/types";
import EditIcon from "@/components/general/EditIcon";
import CustomDialogFooter from "@/components/general/CustomDialogFooter";
interface props{
    initial?: AccountSector
}

export default function AddAccountingSectorDialog({initial}:props) {
    const{
        loading,
        open,
        setOpen,
        handleSubmit
    } = useAddAccountingSectorDialog(initial)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                {
                    initial 
                    ? <EditIcon />
                    : <Button asChild className="self-center">
                        Add Accounting Sector
                        <Plus size={15}/>    
                    </Button>
                }
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=>e.preventDefault()}  className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>{initial ? "Update" : "Create"} accounting sector</DialogTitle>
                    <DialogDescription>
                       {
                            initial 
                            ? "Update the details for this accounting sector." 
                            : "Create a new accounting sector."
                       }
                    </DialogDescription>
                </DialogHeader>

                <form id="add-sector-form" onSubmit={(e)=>handleSubmit(e)} >
                    <ColumnsContainer numberOfCols={2} marginClass="mt-5" gapClass="gap-5">
                        <div className="form-group">
                            <Label htmlFor="name" className="required">Name</Label>
                            <Input 
                                name="name"
                                required
                                defaultValue={initial?.name ?? ""} 
                                placeholder="e.g., Maintenance" />
                        </div>

                        <div className="form-group">
                            <Label htmlFor="code" className="required">Code</Label>
                            <Input 
                                defaultValue={initial?.code ?? ""}
                                name="code"
                                required/>
                        </div>
                    </ColumnsContainer>
                </form>
                
                <CustomDialogFooter
                    loading = {loading}
                    form="add-sector-form"
                />
            </DialogContent>
        </Dialog>
    )
}
