import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"
import useAddInvoiceForm from "@/hooks/components/useAddInvoiceForm"
import InvoiceHeader from "@/components/general/InvoiceHeader"
import InvoiceTotalsTable from "@/components/general/InvoiceTotalsTable"
import useCreateInvoice from "@/hooks/apiHooks/useCreateInvoice"
import ButtonSpinner from "@/components/general/ButtonSpinner"
import useRequestBillerUpdate from "@/hooks/apiHooks/useRequestBillerUpdate"
import type { Invoice } from "@/interfaces"

interface props {
    invoice?:  Invoice
    title?: string | "Add Invoice"
    defaultInvoiceType?: "proforma" | "fiscal" | "recurring" | undefined
}

function AddInvoiceDialogue({invoice, defaultInvoiceType, title = "Add Invoice"}: props) {
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
    } = useAddInvoiceForm(defaultInvoiceType, invoice)
    const updateBiller = useRequestBillerUpdate();
    const createInvoice = useCreateInvoice();

    return (
    <div>
        <Dialog open = {open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    invoice
                    ? <span className="text-sm text-gray-700 dark:text-white cursor-pointer">Edit Invoice</span>
                    : <Button >{title} <Plus/></Button>
                }
            </DialogTrigger>
            <DialogContent onInteractOutside={(e)=> e.preventDefault()} className="sm:max-w-[1100px] h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader> 
                <div className="w-full">
                    <form onSubmit={(e)=> onSave(e, createInvoice, updateBiller)}>
                        <InvoiceHeader
                            formData={formData}
                            searchItem={searchItem}
                            handleOnChangeFormData={handleOnChangeFormData}
                            onSelectBiller={onSelectBiller}   
                            setSearchItem={setSearchItem}
                            setFormData={setFormData}
                            isType
                        />
                        <div className="mt-5">
                           <InvoiceTotalsTable
                                ref = {rowsRef}
                                invoice = {invoice}
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

export default AddInvoiceDialogue