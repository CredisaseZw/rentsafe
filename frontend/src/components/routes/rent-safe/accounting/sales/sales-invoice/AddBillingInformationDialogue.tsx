import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import useRequestBillerUpdate from "@/hooks/apiHooks/useRequestBillerUpdate"
import BillingDocumentTotalsTable from "@/components/general/BillingDocumentTotalsTable"
import BillingDocumentHeader from "@/components/general/BillingDocumentHeader"
import useBillingDocumentForm from "@/hooks/components/useBillingDocumentForm"
import useCreateBillingDocument from "@/hooks/apiHooks/useCreateBillingDocument"

interface props {
    title?: string | "Add Invoice"
    defaultInvoiceType?: "proforma" | "fiscal" | "recurring" | undefined
    type? : "invoice" | "creditNote"
}

function AddBillingInformationDialogue({defaultInvoiceType, title = "Add Invoice", type = "invoice"}: props) {
    const updateBiller = useRequestBillerUpdate();
    const createInvoice = useCreateBillingDocument(type);
    const {
        handleOnChangeFormData,
        onSelectBiller,
        setSearchItem,
        setFormData,
        searchItem,
        formData,
        rowsRef,
        loading,
        setOpen,
        onSave,
        open,
    } = useBillingDocumentForm({
        createBillMutation:createInvoice,
        defaultInvoiceType,
        type,
        updateBiller
    })
    
    return (
    <div>
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button >{title} <Plus/></Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[1100px] h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader> 
                <div className="w-full">
                    <form onSubmit={(e)=> onSave(e)}>
                        <BillingDocumentHeader
                            formData={formData}
                            searchItem={searchItem}
                            handleOnChangeFormData={handleOnChangeFormData}
                            onSelectBiller={onSelectBiller}   
                            setSearchItem={setSearchItem}
                            setFormData={setFormData}
                            isType = {type === "invoice"}
                            isDescription = {type === "creditNote"}
                        />
                        <div className="mt-5">
                           <BillingDocumentTotalsTable
                                ref = {rowsRef}
                            />
                        </div>
                        <div className="mt-5 flex flex-row justify-end gap-5">
                            <DialogClose asChild>
                                <Button
                                    disabled = {loading} 
                                    variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button 
                                disabled = {loading}
                                type="submit">
                                {
                                    loading 
                                    ? <ButtonSpinner/>
                                    : <Send/>
                                }
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddBillingInformationDialogue