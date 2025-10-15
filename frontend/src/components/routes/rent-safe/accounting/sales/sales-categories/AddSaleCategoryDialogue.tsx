import Button from "@/components/general/Button"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Dialog, DialogTrigger, DialogContent, DialogHeader} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

function AddSaleCategoryDialogue() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button asChild>Add Sale Category <Plus size={15}/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e)=> e.preventDefault()}>
                <DialogHeader>
                    <h3 className="text-lg font-medium">Add Sale Category</h3>
                </DialogHeader>    
                <form>
                    <ColumnsContainer numberOfCols={2} marginClass="mt-4">
                        <div className="form-group">
                            <Label>Code</Label>
                            <Input type="text" name="code" placeholder="Enter code" />
                        </div>  
                        <div className="form-group">
                            <Label>Category</Label>
                            <Input type="text" name="category" placeholder="Enter name" />
                        </div>  
                    </ColumnsContainer>
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddSaleCategoryDialogue