import Button from "@/components/general/Button"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import ColumnsContainer from "@/components/general/ColumnsContainer"
import { Dialog, DialogTrigger, DialogContent, DialogHeader} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAddCategory from "@/hooks/apiHooks/useAddCategory"
import useAddSalesCategory from "@/hooks/components/useAddSalesCategory"
import type { Category } from "@/types"
import { Edit, Plus, Send } from "lucide-react"

interface props {
    initial? :Category;
    refetch : () => void;
}

function AddSaleCategoryDialogue({refetch, initial}:props) {
    const {
        open,
        loading,
        categoryPayload,
        setOpen,
        handleChange,
        handleSubmit,
    } = useAddSalesCategory({refetch, initial});
    const addCategory = useAddCategory()
    return (
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    initial 
                    ? <Button variant="ghost"><Edit size={15} className="text-gray-600 dark:text-white"/></Button>
                    : <Button asChild>Add Sale Category <Plus size={15}/></Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e)=> e.preventDefault()}>
                <DialogHeader>
                    <h3 className="text-lg font-medium">Add Sale Category</h3>
                </DialogHeader>    
                <form onSubmit={(e)=> {
                    e.preventDefault();
                    handleSubmit(addCategory)
                }}>
                    <ColumnsContainer numberOfCols={2} marginClass="mt-4">
                        <div className="form-group">
                            <Label className="required">Code</Label>
                            <Input 
                                value={categoryPayload.code}
                                onChange={(e)=> handleChange("code", e.target.value)}
                                required
                                type="text"
                                name="code"
                                placeholder="Enter code" />
                        </div>  
                        <div className="form-group">
                            <Label className="required">Category</Label>
                            <Input
                                value={categoryPayload.name}
                                onChange={(e)=> handleChange("name", e.target.value)}
                                required
                                type="text"
                                name="category"
                                placeholder="Enter name" />
                        </div>  
                    </ColumnsContainer>
                    <div className="flex flex-row justify-end gap-3 mt-4">
                        <Button onClick={()=>setOpen(false)} type="button" variant="outline">Close</Button>
                        <Button type="submit" asChild disabled = {loading}>
                            {
                                loading
                                ? <ButtonSpinner/>
                                : <Send size={15}/>
                            }
                            Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddSaleCategoryDialogue