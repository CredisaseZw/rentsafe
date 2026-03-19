import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import BillingDocumentTotalsTable from "@/components/general/BillingDocumentTotalsTable"
import BillingDocumentHeader from "@/components/general/BillingDocumentHeader"
import useBillingDocumentForm from "@/hooks/components/useBillingDocumentForm"
import TrustAccBillingDocumentTotalsTable from "@/components/general/TrustAccBillingDocumentTotalsTable"

interface props {
    title?: string | "Add Invoice"
    defaultInvoiceType?: "proforma" | "fiscal" | "recurring" | undefined
    type? : "invoice" | "creditNote"
    isTrustAcc?: boolean
}

function AddBillingInformationDialogue({defaultInvoiceType, title = "Add Invoice", type = "invoice", isTrustAcc = false}: props) {
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
        defaultInvoiceType,
        type,
        isTrustAcc,
    })
    
    return (
    <div>
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button >{title} <Plus/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1100px] h-[90vh] overflow-y-auto">
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
                            isTrustAcc = {isTrustAcc}
                            isType = {type === "invoice"}
                            isDescription = {type === "creditNote"}
                        />
                        <div className="mt-5">
                        {
                            !isTrustAcc 
                            ? <BillingDocumentTotalsTable ref = {rowsRef} />
                            : <TrustAccBillingDocumentTotalsTable ref={rowsRef}/>
                        }
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