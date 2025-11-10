import { Button } from "@/components/ui/button"
import {
AlertDialog,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { INVOICE_MUTATION_STATUSES } from "@/constants"
import useMutateInvoiceStatus from "@/hooks/components/useMutateInvoiceStatus"
import useInvoiceMutations from "@/hooks/apiHooks/useInvoiceMutations"
import ButtonSpinner from "@/components/general/ButtonSpinner"

interface props {
    mode : string,
    invoiceID: number,
    invoiceMode : string
    documentNumber : string
}

function MutateInvoiceStatus({ invoiceID, documentNumber, mode, invoiceMode}: props) {
    const INFO = INVOICE_MUTATION_STATUSES[mode as keyof typeof INVOICE_MUTATION_STATUSES]
    const {
        open,
        loading,
        setOpen,
        handleMarkInvoice
    } = useMutateInvoiceStatus(invoiceID, mode, invoiceMode);
    const mutateInvoice = useInvoiceMutations();

    return (
        <AlertDialog open = {open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="flex flex-row gap-5 cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-white">{INFO.btnText}</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-700 dark:text-white">{INFO.heading} - ({documentNumber})</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-white">{INFO.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel disabled = {loading}>Cancel</AlertDialogCancel>
                    <Button disabled = {loading} onClick={()=> handleMarkInvoice(mutateInvoice)}>
                        {
                            loading 
                            ? <ButtonSpinner/>
                            : INFO.btnText
                        }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
)
}

export default MutateInvoiceStatus