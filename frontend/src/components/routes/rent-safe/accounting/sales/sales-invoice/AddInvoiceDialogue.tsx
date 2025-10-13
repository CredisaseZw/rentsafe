import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import useAddInvoiceForm from "@/hooks/components/useAddInvoiceForm"
import InvoiceHeader from "@/components/general/InvoiceHeader"
import InvoiceTotalsTable from "@/components/general/InvoiceTotalsTable"

function AddInvoiceDialogue() {
    const {
        rowsRef,
        formData,
        searchItem,
        setFormData,
        setSearchItem,
        onSelectBiller,
        onSave
    } = useAddInvoiceForm()

    return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button >Add Invoice <Plus/></Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[1100px] h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Invoice</DialogTitle>
                </DialogHeader> 
                <div className="w-full">
                    <form onSubmit={(e)=> onSave(e)}>
                        <InvoiceHeader
                            formData={formData}
                            setFormData={setFormData}
                            setSearchItem={setSearchItem}
                            searchItem={searchItem}
                            onSelectBiller={onSelectBiller}    
                        />
                        <div className="mt-10">
                           <InvoiceTotalsTable ref = {rowsRef}/>
                        </div>
                        <div className="mt-5 flex flex-row justify-end gap-5">
                            <Button type="submit">Save</Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddInvoiceDialogue